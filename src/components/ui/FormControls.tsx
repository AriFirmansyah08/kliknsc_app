import type { FieldDef, FormValues } from "@/constants/daftarAgen";
import { API_URL, getNipReferensi, type NipReferensi } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Option, PickerSheet } from "./PickerSheet";

const RED = "#E8311A";

/* ---------- Dropdown statis ---------- */

export function SelectField({
  value,
  options,
  placeholder = "Pilih",
  onChange,
}: {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.box} onPress={() => setOpen(true)}>
        <Text style={value ? styles.value : styles.placeholder}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#333" />
      </Pressable>
      <PickerSheet
        visible={open}
        options={options.map((o) => ({ value: o, label: o }))}
        loading={false}
        selected={value}
        onClose={() => setOpen(false)}
        onPick={(o) => {
          onChange(o.value);
          setOpen(false);
        }}
      />
    </>
  );
}

/* ---------- Dropdown dari API ---------- */

export function RemoteSelectField({
  value,
  path,
  query,
  onPick,
}: {
  value: string;
  path: string;
  query: Record<string, string>;
  onPick: (o: Option) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  // disabled jika ada induk yang belum dipilih; provinsi tidak punya query, jadi tetap aktif
  const disabled = Object.values(query).some((v) => !v);
  const qsString = new URLSearchParams(query).toString();
  const queryKey = JSON.stringify(query);

  useEffect(() => {
    if (!open || disabled) return;
    const url = `${API_URL}${path}${qsString ? `?${qsString}` : ""}`;
    setLoading(true);
    fetch(url, { headers: { Accept: "application/json" } })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok || !Array.isArray(data)) {
          throw new Error(data?.message ?? "Gagal memuat data");
        }
        return data as Option[];
      })
      .then(setOptions)
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
    // queryKey dipakai agar effect tidak jalan ulang setiap render
  }, [open, path, queryKey, disabled]);

  return (
    <>
      <Pressable
        style={[styles.box, disabled && styles.disabled]}
        onPress={() => !disabled && setOpen(true)}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value || (disabled ? "Pilih wilayah induk dulu" : "Pilih")}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#333" />
      </Pressable>
      <PickerSheet
        visible={open}
        options={options}
        loading={loading}
        selected={value}
        onClose={() => setOpen(false)}
        onPick={(o) => {
          setOpen(false);
          onPick(o);
        }}
      />
    </>
  );
}

/* ---------- Kalender ---------- */

const toIso = (d: Date) => {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const toDisplay = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
};

// parse "YYYY-MM-DD" sebagai tanggal lokal
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [showIos, setShowIos] = useState(false);
  const date = useMemo(
    () => (value ? fromIso(value) : new Date(1990, 0, 1)),
    [value],
  );

  const open = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: "date",
        maximumDate: new Date(),
        onChange: (event, selected) => {
          if (event.type === "set" && selected) onChange(toIso(selected));
        },
      });
    } else {
      setShowIos(true);
    }
  };

  return (
    <>
      <Pressable style={styles.box} onPress={open}>
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? toDisplay(value) : "Pilih tanggal"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#333" />
      </Pressable>

      {showIos && Platform.OS === "ios" && (
        <>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onValueChange={(_, selected) => {
              if (selected) onChange(toIso(selected));
            }}
          />
          <Pressable onPress={() => setShowIos(false)} style={styles.doneBtn}>
            <Text style={styles.doneText}>Selesai</Text>
          </Pressable>
        </>
      )}
    </>
  );
}

/* ---------- Pilihan dua tombol ---------- */

export function ChoiceField({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.choiceRow}>
      {options.map((o) => {
        const active = value === o;
        return (
          <Pressable
            key={o}
            style={[styles.choice, active && styles.choiceActive]}
            onPress={() => onChange(o)}
          >
            <Text
              style={[styles.choiceText, active && styles.choiceTextActive]}
            >
              {o}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- NIP referensi (dari API) ---------- */

let nipCache: NipReferensi[] | null = null;

const labelNip = (n: NipReferensi) => `${n.nip} - ${n.nama}`;

// Ambil daftar NIP sekali, lalu dipakai ulang oleh semua field NIP/nama
function useNipList() {
  const [list, setList] = useState<NipReferensi[]>(nipCache ?? []);
  const [loading, setLoading] = useState(!nipCache);

  useEffect(() => {
    if (nipCache) return;
    getNipReferensi()
      .then((res) => {
        nipCache = res.data;
        setList(res.data);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return { list, loading };
}

export function NipField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { list, loading } = useNipList();

  const options = useMemo(
    () => list.map((n) => ({ value: n.nip, label: labelNip(n) })),
    [list],
  );
  const selectedItem = list.find((n) => n.nip === value);

  return (
    <>
      <Pressable style={styles.box} onPress={() => setOpen(true)}>
        <Text style={value ? styles.value : styles.placeholder}>
          {selectedItem ? labelNip(selectedItem) : value || "Pilih NIP"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#333" />
      </Pressable>
      <PickerSheet
        visible={open}
        options={options}
        loading={loading}
        selected={value}
        onClose={() => setOpen(false)}
        onPick={(o) => {
          setOpen(false);
          onChange(o.value);
        }}
      />
    </>
  );
}

function ReadonlyField({
  value,
  placeholder,
}: {
  value: string;
  placeholder?: string;
}) {
  return (
    <View style={[styles.box, styles.readonly]}>
      <Text style={value ? styles.value : styles.placeholder}>
        {value || placeholder}
      </Text>
    </View>
  );
}

function NamaKbaField({
  nip,
  placeholder,
}: {
  nip: string;
  placeholder?: string;
}) {
  const { list } = useNipList();
  const nama = list.find((n) => n.nip === nip)?.nama ?? "";
  return <ReadonlyField value={nama} placeholder={placeholder} />;
}

export function FormField({
  field,
  value,
  values,
  onChange,
  onPick,
}: {
  field: FieldDef;
  value: string;
  values: FormValues;
  onChange: (v: string) => void;
  onPick: (o: Option) => void;
  onNipPick?: (item: NipReferensi) => void;
}) {
  if (field.type === "nip") {
    return (
      <Labeled label={field.label} hint={field.hint}>
        <NipField value={value} onChange={onChange} />
      </Labeled>
    );
  }

  if (field.type === "readonly") {
    return (
      <Labeled label={field.label} hint={field.hint}>
        {field.key === "namaKba" ? (
          <NamaKbaField
            nip={values.nip ?? ""}
            placeholder={field.placeholder}
          />
        ) : (
          <ReadonlyField value={value} placeholder={field.placeholder} />
        )}
      </Labeled>
    );
  }

  if (field.type === "remote" && field.source) {
    const query: Record<string, string> = Object.fromEntries(
      Object.entries(field.source.query ?? {}).map(([param, key]) => [
        param,
        values[key] ?? "",
      ]),
    );
    return (
      <Labeled label={field.label} hint={field.hint}>
        <RemoteSelectField
          value={value}
          path={field.source.path}
          query={query}
          onPick={onPick}
        />
      </Labeled>
    );
  }

  if (field.type === "select") {
    return (
      <Labeled label={field.label} hint={field.hint}>
        <SelectField
          value={value}
          options={field.options ?? []}
          placeholder={field.placeholder}
          onChange={onChange}
        />
      </Labeled>
    );
  }

  if (field.type === "date") {
    return (
      <Labeled label={field.label} hint={field.hint}>
        <DateField value={value} onChange={onChange} />
      </Labeled>
    );
  }

  if (field.type === "choice") {
    return (
      <Labeled label={field.label} hint={field.hint}>
        <ChoiceField
          value={value}
          options={field.options ?? []}
          onChange={onChange}
        />
      </Labeled>
    );
  }

  return (
    <Labeled label={field.label} hint={field.hint}>
      <TextInput
        style={[styles.input, field.type === "textarea" && styles.textarea]}
        value={value}
        onChangeText={(t) => onChange(field.lowercase ? t.toLowerCase() : t)}
        placeholder={field.placeholder}
        placeholderTextColor="#999"
        keyboardType={
          field.type === "number"
            ? "number-pad"
            : field.key === "email"
              ? "email-address"
              : "default"
        }
        multiline={field.type === "textarea"}
        maxLength={field.maxLength}
        autoCapitalize={field.lowercase ? "none" : "sentences"}
        autoCorrect={false}
      />
    </Labeled>
  );
}

function Labeled({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 8 },
  hint: { fontSize: 12, color: "#666", marginTop: 6 },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111",
  },
  textarea: { minHeight: 90, textAlignVertical: "top" },

  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  value: { fontSize: 16, color: "#111" },
  placeholder: { fontSize: 16, color: "#999" },
  disabled: { opacity: 0.5 },

  doneBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  doneText: { color: RED, fontWeight: "800" },

  choiceRow: { flexDirection: "row", gap: 10 },
  choice: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 16,
    alignItems: "center",
  },
  choiceActive: { backgroundColor: "#1F1F1F", borderColor: "#1F1F1F" },
  choiceText: { fontSize: 15, fontWeight: "700", color: "#111" },
  choiceTextActive: { color: "#fff" },
  readonly: { backgroundColor: "#F2F2F2" },
});
