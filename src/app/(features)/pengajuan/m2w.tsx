import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const RED = "#E8311A";

type Values = {
  ktp: string;
  nama: string;
  noHp: string;
  alamat: string;
  rt: string;
  rw: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  sumberPk: string;
  pilihanSumber: string;
};

const INITIAL: Values = {
  ktp: "",
  nama: "",
  noHp: "",
  alamat: "",
  rt: "",
  rw: "",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  sumberPk: "",
  pilihanSumber: "",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  multiline,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "number-pad" | "phone-pad";
  maxLength?: number;
  multiline?: boolean;
  autoCapitalize?: "none" | "characters";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType ?? "default"}
        maxLength={maxLength}
        multiline={multiline}
        autoCapitalize={autoCapitalize ?? "characters"}
      />
    </View>
  );
}

function SelectRow({
  label,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [styles.select, pressed && { opacity: 0.85 }]}
        onPress={onPress}
      >
        <Text style={value ? styles.selectValue : styles.selectPlaceholder}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#666" />
      </Pressable>
    </View>
  );
}

export default function M2wScreen() {
  const [v, setV] = useState<Values>(INITIAL);
  const set = (key: keyof Values) => (val: string) =>
    setV((prev) => ({ ...prev, [key]: val }));

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </Pressable>
          <Text style={styles.headerTitle}>Pengajuan M2W</Text>
        </View>

        <Section title="Data KTP">
          <Field
            label="Nomor KTP"
            value={v.ktp}
            onChangeText={set("ktp")}
            placeholder="16 digit"
            keyboardType="number-pad"
            maxLength={16}
          />
          <Field
            label="Nama lengkap"
            value={v.nama}
            onChangeText={set("nama")}
            placeholder="Sesuai KTP"
          />
          <Field
            label="Nomor HP"
            value={v.noHp}
            onChangeText={set("noHp")}
            placeholder="08xxxxxxxxxx"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </Section>

        <Section title="Alamat">
          <Field
            label="Alamat"
            value={v.alamat}
            onChangeText={set("alamat")}
            placeholder="Nama jalan, nomor rumah"
            multiline
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field
                label="RT"
                value={v.rt}
                onChangeText={set("rt")}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="RW"
                value={v.rw}
                onChangeText={set("rw")}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>
          <SelectRow
            label="Provinsi"
            value={v.provinsi}
            placeholder="Pilih provinsi"
          />
          <SelectRow
            label="Kota / Kabupaten"
            value={v.kota}
            placeholder="Pilih kota"
          />
          <SelectRow
            label="Kecamatan"
            value={v.kecamatan}
            placeholder="Pilih kecamatan"
          />
          <SelectRow
            label="Kelurahan"
            value={v.kelurahan}
            placeholder="Pilih kelurahan"
          />
        </Section>

        <Section title="Sumber">
          <SelectRow
            label="Sumber PK"
            value={v.sumberPk}
            placeholder="Pilih sumber"
          />
          <SelectRow
            label="Pilihan sumber"
            value={v.pilihanSumber}
            placeholder="Pilih pilihan"
          />
        </Section>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={18} color="#333" />
          <Text style={styles.noteText}>
            Pastikan data sesuai KTP. Data yang sudah disimpan tidak bisa diubah
            dari aplikasi.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={styles.primaryBtnText}>Simpan</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F2F2" },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  productBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  productTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  productMeta: { fontSize: 12, color: "#666", marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 16, gap: 14 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600", color: "#111" },
  input: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectValue: { fontSize: 15, color: "#111" },
  selectPlaceholder: { fontSize: 15, color: "#999" },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 14,
    marginBottom: 20,
  },
  noteText: { flex: 1, fontSize: 13, color: "#333", lineHeight: 19 },
  primaryBtn: {
    backgroundColor: RED,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
