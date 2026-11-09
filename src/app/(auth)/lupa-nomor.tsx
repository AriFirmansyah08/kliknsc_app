import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { CS_WA, RED } from "../../components/app.style/profile.style";

const openWhatsApp = (phone: string, text?: string) => {
  const msg = text ? `?text=${encodeURIComponent(text)}` : "";
  Linking.openURL(`https://wa.me/${phone}${msg}`).catch(() =>
    Alert.alert("Gagal", "Tidak bisa membuka WhatsApp"),
  );
};

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </View>
    </View>
  );
}

export default function LupaNomorScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color="#111" />
      </Pressable>

      <Text style={styles.title}>Nomor lama sudah tidak aktif?</Text>
      <Text style={styles.subtitle}>
        Pemulihan akun dibantu langsung oleh Customer Service. Siapkan KTP kamu,
        lalu hubungi CS.
      </Text>

      <View style={styles.card}>
        <Step n={1} title="Hubungi CS" desc="Lewat WhatsApp atau telepon." />
        <View style={styles.divider} />
        <Step
          n={2}
          title="Verifikasi lewat telepon"
          desc="CS memastikan kamu pemilik akun agen."
        />
        <View style={styles.divider} />
        <Step
          n={3}
          title="Buat akun dengan nomor baru"
          desc="Akun agen otomatis terhubung ke nomor baru."
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#111" />
        <Text style={styles.infoText}>
          <Text style={styles.infoBold}>Nomor lama masih aktif?</Text> Masuk
          dulu, lalu ganti nomor dari menu Profil. Lebih cepat, tanpa perlu CS.
        </Text>
      </View>

      <View style={{ flex: 1, minHeight: 32 }} />

      <Pressable
        style={({ pressed }) => [
          styles.primaryBtn,
          pressed && { opacity: 0.9 },
        ]}
        onPress={() =>
          openWhatsApp(
            CS_WA,
            "Halo CS KlikNSC, nomor lama saya sudah tidak aktif. Saya butuh bantuan.",
          )
        }
      >
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
        <Text style={styles.primaryBtnText}>Hubungi CS</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryBtn}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.secondaryBtnText}>Kembali ke Masuk</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F2F2" },
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    flexGrow: 1,
  },
  back: { alignSelf: "flex-start", marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "800", color: "#111", lineHeight: 34 },
  subtitle: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 16 },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: 12,
  },
  stepBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FDECEA",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: { color: RED, fontWeight: "800", fontSize: 16 },
  stepTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  stepDesc: { fontSize: 13, color: "#555", marginTop: 2, lineHeight: 18 },
  divider: { height: 1, backgroundColor: "#EEE", marginLeft: 54 },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 16,
    marginTop: 16,
  },
  infoText: { flex: 1, fontSize: 13, color: "#333", lineHeight: 19 },
  infoBold: { fontWeight: "700", color: "#111" },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: RED,
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 12,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryBtnText: { color: "#111", fontSize: 15, fontWeight: "700" },
});
