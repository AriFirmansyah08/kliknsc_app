import type { FormValues } from "@/constants/daftarAgen";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

const RED = "#E8311A";
const DARK_RED = "#C41E0A";

type Props = {
  stage: 0 | 1;
  values: FormValues;
  setField: (key: string, value: string) => void;
  onNext: () => void;
};

const BULLETS = [
  "Foto disimpan terenkripsi dan hanya dibuka petugas yang berwenang.",
  "Foto hanya dipakai untuk verifikasi agen dan pemulihan akun.",
  "Kamu bisa minta data dihapus lewat Customer Service.",
];

export function DokumenStep({ stage, values, setField, onNext }: Props) {
  if (stage === 0) {
    const setuju = values.consent === "true";
    return (
      <>
        <View style={styles.shield}>
          <Ionicons name="shield-outline" size={32} color={DARK_RED} />
        </View>
        <Text style={styles.title}>Persetujuan data pribadi</Text>
        <Text style={styles.desc}>
          Kami perlu foto KTP dan selfie kamu untuk memastikan pendaftaran ini
          benar milikmu.
        </Text>

        <View style={styles.bulletBox}>
          {BULLETS.map((b) => (
            <View key={b} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.checkRow}
          onPress={() => setField("consent", setuju ? "" : "true")}
        >
          <Ionicons
            name={setuju ? "checkbox" : "square-outline"}
            size={24}
            color={setuju ? RED : "#999"}
          />
          <Text style={styles.checkText}>
            Saya setuju KlikNSC memproses foto KTP dan selfie saya sesuai
            Kebijakan Privasi.
          </Text>
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, !setuju && styles.disabled]}
          onPress={onNext}
          disabled={!setuju}
        >
          <Text style={styles.primaryBtnText}>Setuju dan lanjut</Text>
        </Pressable>
      </>
    );
  }

  return (
    <>
      <Text style={styles.title}>Foto KTP & selfie</Text>
      <Text style={styles.desc}>Pastikan foto jelas dan tidak buram.</Text>

      <View style={styles.photoRow}>
        <PhotoCard
          label="Foto KTP"
          uri={values.fotoKtp}
          front={false}
          onPick={(u) => setField("fotoKtp", u)}
        />
        <PhotoCard
          label="Selfie"
          uri={values.selfie}
          front
          onPick={(u) => setField("selfie", u)}
        />
      </View>

      <View style={styles.tips}>
        <Ionicons name="information-circle-outline" size={20} color="#111" />
        <Text style={styles.tipsText}>
          <Text style={{ fontWeight: "800" }}>Tips: </Text>
          pakai KTP asli, foto di tempat terang, dan pastikan semua sisi KTP
          terlihat. Selfie diambil langsung dari kamera depan.
        </Text>
      </View>

      <Pressable style={styles.primaryBtn} onPress={onNext}>
        <Text style={styles.primaryBtnText}>Lanjut ke Review</Text>
      </Pressable>
    </>
  );
}

function PhotoCard({
  label,
  uri,
  front,
  onPick,
}: {
  label: string;
  uri?: string;
  front: boolean;
  onPick: (uri: string) => void;
}) {
  const ambil = async () => {
    const izin = await ImagePicker.requestCameraPermissionsAsync();
    if (!izin.granted) {
      Alert.alert("Izin kamera", "Izinkan akses kamera untuk mengambil foto.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      cameraType: front
        ? ImagePicker.CameraType.front
        : ImagePicker.CameraType.back,
      quality: 0.7,
      allowsEditing: false,
    });
    if (!res.canceled && res.assets[0]) onPick(res.assets[0].uri);
  };

  return (
    <Pressable style={styles.photoCard} onPress={ambil}>
      <View style={styles.photoBox}>
        {uri ? (
          <Image source={{ uri }} style={styles.preview} />
        ) : (
          <Ionicons name="checkmark" size={28} color="#999" />
        )}
      </View>
      <Text style={styles.photoLabel}>{label}</Text>
      <Text style={styles.photoSub}>
        {uri ? "Ketuk untuk foto ulang" : "Ketuk untuk ambil foto"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "800", color: "#111" },
  desc: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },

  shield: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#FFF1EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  bulletBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  bulletRow: { flexDirection: "row", gap: 8 },
  bullet: { fontSize: 14, color: "#111" },
  bulletText: { flex: 1, fontSize: 14, color: "#111", lineHeight: 20 },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 24,
  },
  checkText: { flex: 1, fontSize: 14, color: "#111", lineHeight: 20 },

  photoRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  photoCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#111",
    padding: 12,
  },
  photoBox: {
    height: 90,
    borderRadius: 10,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  preview: { width: "100%", height: "100%" },
  photoLabel: { fontSize: 15, fontWeight: "800", color: "#111", marginTop: 10 },
  photoSub: { fontSize: 12, color: "#666", marginTop: 2 },

  tips: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  tipsText: { flex: 1, fontSize: 13, color: "#111", lineHeight: 18 },

  primaryBtn: {
    backgroundColor: RED,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  disabled: { opacity: 0.4 },
});
