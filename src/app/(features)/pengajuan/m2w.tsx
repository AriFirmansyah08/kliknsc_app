import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { kirimPengajuanM2w } from "../../../services/pengajuan";

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

export default function M2wScreen() {
  const [v, setV] = useState<Values>(INITIAL);
  const [kirim, setKirim] = useState(false);
  const set = (key: keyof Values) => (val: string) =>
    setV((prev) => ({ ...prev, [key]: val }));

  async function simpan() {
    if (kirim) return;

    setKirim(true);
    try {
      await kirimPengajuanM2w({
        nik: v.ktp,
        namaLengkap: v.nama,
        noHp: v.noHp,
        alamat: v.alamat,
        rt: v.rt,
        rw: v.rw,
        provinsi: v.provinsi,
        kota: v.kota,
        kecamatan: v.kecamatan,
        kelurahan: v.kelurahan,
        sumberPk: v.sumberPk,
        pilSumber: v.pilihanSumber,
      });

      Alert.alert("Berhasil", "Pengajuan M2W terkirim.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Gagal", e?.message ?? "Terjadi kesalahan");
    } finally {
      setKirim(false);
    }
  }

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
          <Field
            label="Provinsi"
            value={v.provinsi}
            onChangeText={set("provinsi")}
            placeholder="Contoh: JAWA BARAT"
          />
          <Field
            label="Kota / Kabupaten"
            value={v.kota}
            onChangeText={set("kota")}
            placeholder="Contoh: BANDA ACEH"
          />
          <Field
            label="Kecamatan"
            value={v.kecamatan}
            onChangeText={set("kecamatan")}
            placeholder="Contoh: KUTA ALAM"
          />
          <Field
            label="Kelurahan"
            value={v.kelurahan}
            onChangeText={set("kelurahan")}
            placeholder="Contoh: LAMPINEUNG"
          />
        </Section>

        <Section title="Sumber">
          <Field
            label="Sumber PK"
            value={v.sumberPk}
            onChangeText={set("sumberPk")}
            placeholder="Contoh: OFFLINE"
          />
          <Field
            label="Pilihan sumber"
            value={v.pilihanSumber}
            onChangeText={set("pilihanSumber")}
            placeholder="Contoh: REFERENSI KELUARGA/TEMAN"
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
          onPress={simpan}
          disabled={kirim}
          style={({ pressed }) => [
            styles.primaryBtn,
            (pressed || kirim) && { opacity: 0.9 },
          ]}
        >
          {kirim ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Simpan</Text>
          )}
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
