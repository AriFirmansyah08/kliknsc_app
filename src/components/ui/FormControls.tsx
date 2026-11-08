import type { FieldDef, FormValues } from "@/constants/daftarAgen";
import { API_URL } from "@/services/auth";
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
  param,
  parentKode,
  onPick,
}: {
  value: string;
  path: string;
  param?: string;
  parentKode?: string;
  onPick: (o: Option) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const disabled = !!param && !parentKode;

  useEffect(() => {
    if (!open || disabled) return;
    const qs = param ? `?${param}=${encodeURIComponent(parentKode ?? "")}` : "";
    setLoading(true);
    fetch(`${API_URL}${path}${qs}`)
      .then((r) => r.json())
      .then((data: Option[]) => setOptions(data))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [open, path, param, parentKode, disabled]);

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

/* ---------- Satu field dari config ---------- */

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
}) {
  if (field.type === "remote" && field.source) {
    const parentKode = field.source.parentKey
      ? values[field.source.parentKey]
      : undefined;
    return (
      <Labeled label={field.label} hint={field.hint}>
        <RemoteSelectField
          value={value}
          path={field.source.path}
          param={field.source.param}
          parentKode={parentKode}
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
});
