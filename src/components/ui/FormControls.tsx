import type { FieldDef } from "@/constants/daftarAgen";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const RED = "#E8311A";

/* ---------- Dropdown ---------- */

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

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalWrap}>
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(o) => o}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === value && { color: RED, fontWeight: "800" },
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <Ionicons name="checkmark" size={20} color={RED} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
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

export function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const date = value ? new Date(value) : new Date(1990, 0, 1);

  return (
    <>
      <Pressable style={styles.box} onPress={() => setShow(true)}>
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? toDisplay(value) : "Pilih tanggal"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#333" />
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(_, selected) => {
            if (Platform.OS === "android") setShow(false);
            if (selected) onChange(toIso(selected));
          }}
        />
      )}
      {show && Platform.OS === "ios" && (
        <Pressable onPress={() => setShow(false)} style={styles.doneBtn}>
          <Text style={styles.doneText}>Selesai</Text>
        </Pressable>
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
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  switch (field.type) {
    case "checkbox":
      return (
        <Pressable
          style={styles.checkRow}
          onPress={() => onChange(value === "true" ? "" : "true")}
        >
          <Ionicons
            name={value === "true" ? "checkbox" : "square-outline"}
            size={22}
            color={value === "true" ? RED : "#999"}
          />
          <Text style={styles.checkText}>{field.label}</Text>
        </Pressable>
      );

    case "photo":
      return (
        <Labeled label={field.label}>
          <Pressable
            style={styles.photo}
            onPress={async () => {
              const perm = await ImagePicker.requestCameraPermissionsAsync();
              if (!perm.granted) {
                Alert.alert(
                  "Izin kamera",
                  "Izinkan akses kamera untuk mengambil foto.",
                );
                return;
              }
              const res = await ImagePicker.launchCameraAsync({
                cameraType:
                  field.key === "selfie"
                    ? ImagePicker.CameraType.front
                    : ImagePicker.CameraType.back,
                quality: 0.7,
                allowsEditing: false,
              });
              if (!res.canceled && res.assets[0]) {
                onChange(res.assets[0].uri);
              }
            }}
          >
            {value ? (
              <Image source={{ uri: value }} style={styles.preview} />
            ) : (
              <Ionicons name="camera-outline" size={28} color="#999" />
            )}
            <Text style={styles.hint}>
              {value ? "Ketuk untuk foto ulang" : "Ketuk untuk ambil foto"}
            </Text>
          </Pressable>
        </Labeled>
      );

    case "select":
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

    case "date":
      return (
        <Labeled label={field.label} hint={field.hint}>
          <DateField value={value} onChange={onChange} />
        </Labeled>
      );

    case "choice":
      return (
        <Labeled label={field.label} hint={field.hint}>
          <ChoiceField
            value={value}
            options={field.options ?? []}
            onChange={onChange}
          />
        </Labeled>
      );

    default:
      return (
        <Labeled label={field.label} hint={field.hint}>
          <TextInput
            style={[styles.input, field.type === "textarea" && styles.textarea]}
            value={value}
            onChangeText={onChange}
            placeholder={field.placeholder}
            placeholderTextColor="#999"
            keyboardType={field.type === "number" ? "number-pad" : "default"}
            multiline={field.type === "textarea"}
            autoCapitalize="none"
          />
        </Labeled>
      );
  }
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

  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingVertical: 8,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionText: { fontSize: 16, color: "#111" },

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

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  checkText: { flex: 1, fontSize: 14, color: "#111", lineHeight: 20 },

  photo: {
    height: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  preview: { width: "100%", height: 80, borderRadius: 10 },
});
