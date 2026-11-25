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
import {
  RemoteSelectField,
  SelectField,
} from "../../../components/ui/FormControls";
import { kirimPengajuanM2w } from "../../../services/pengajuan";

const RED = "#E8311A";

type Option = { value: string; label: string };

type Values = {
  ktp: string;
  nama: string;
  noHp: string;
  alamat: string;
  rt: string;
  rw: string;
  provinsi: string;
  provinsiKode: string;
  kota: string;
  kotaKode: string;
  kecamatan: string;
  kecamatanKode: string;
  kelurahan: string;
  kelurahanKode: string;
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
  provinsiKode: "",
  kota: "",
  kotaKode: "",
  kecamatan: "",
  kecamatanKode: "",
  kelurahan: "",
  kelurahanKode: "",
  sumberPk: "",
  pilihanSumber: "",
};

const SUMBER_OPTIONS = ["OFFLINE", "ONLINE"];

const PILIHAN_SUMBER: Record<string, string[]> = {
  OFFLINE: ["PENAWARAN LANGSUNG KE KONSUMEN", "REFERENSI KELUARGA/ TEMAN"],
  ONLINE: [
    "IKLAN BERBAYAR DI FB/IG",
    "IKLAN MARKETPLACE DI FB",
    "GROUP FACEBOOK JUAL-BELI",
    "STORY/ BROADCAST WA",
    "POST ATAU STORY FB",
    "POST ATAU STORY IG",
    "POST ATAU STORY TIKTOK",
  ],
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

  // Simpan nama (untuk tampilan dan payload) dan kode (untuk query API).
  // Wilayah di bawah field yang dipilih ikut dikosongkan.
  function pilih(
    field: "provinsi" | "kota" | "kecamatan" | "kelurahan",
    o: Option,
  ) {
    setV((prev) => {
      const next: any = {
        ...prev,
        [field]: o.label,
        [`${field}Kode`]: o.value,
      };
      const urutan = ["provinsi", "kota", "kecamatan", "kelurahan"];
      for (const f of urutan.slice(urutan.indexOf(field) + 1)) {
        next[f] = "";
        next[`${f}Kode`] = "";
      }
      return next as Values;
    });
  }

  // Ganti sumber: pilihan sumber ikut dikosongkan
  function pilihSumber(val: string) {
    setV((prev) => ({ ...prev, sumberPk: val, pilihanSumber: "" }));
  }

  function pilihPilihanSumber(val: string) {
    setV((prev) => ({ ...prev, pilihanSumber: val }));
  }

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

          <View style={styles.field}>
            <Text style={styles.label}>Provinsi</Text>
            <RemoteSelectField
              value={v.provinsi}
              path="/wilayah/provinsi"
              query={{}}
              onPick={(o) => pilih("provinsi", o)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Kota / Kabupaten</Text>
            <RemoteSelectField
              value={v.kota}
              path="/wilayah/kota"
              query={{ provinsi: v.provinsiKode }}
              onPick={(o) => pilih("kota", o)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Kecamatan</Text>
            <RemoteSelectField
              value={v.kecamatan}
              path="/wilayah/kecamatan"
              query={{ provinsi: v.provinsiKode, kota: v.kotaKode }}
              onPick={(o) => pilih("kecamatan", o)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Kelurahan</Text>
            <RemoteSelectField
              value={v.kelurahan}
              path="/wilayah/kelurahan"
              query={{
                provinsi: v.provinsiKode,
                kota: v.kotaKode,
                kecamatan: v.kecamatanKode,
              }}
              onPick={(o) => pilih("kelurahan", o)}
            />
          </View>
        </Section>

        <Section title="Sumber">
          <View style={styles.field}>
            <Text style={styles.label}>Sumber PK</Text>
            <SelectField
              value={v.sumberPk}
              options={SUMBER_OPTIONS}
              placeholder="Pilih sumber"
              onChange={pilihSumber}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Pilihan sumber</Text>
            <SelectField
              value={v.pilihanSumber}
              options={PILIHAN_SUMBER[v.sumberPk] ?? []}
              placeholder={v.sumberPk ? "Pilih pilihan" : "Pilih sumber dulu"}
              onChange={pilihPilihanSumber}
            />
          </View>
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
