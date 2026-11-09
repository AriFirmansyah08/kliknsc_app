import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const RED = "#E8311A";

const PRODUK = [
  {
    kode: "H1",
    kodeLayar: "HMC",
    judul: "Motor Baru",
    deskripsi: "Untuk pembelian motor baru.",
    icon: "motorbike" as const,
    route: "/pengajuan/hmc",
  },
  {
    kode: "M2W",
    kodeLayar: "M2W",
    judul: "Kredit Multiguna Motor",
    deskripsi: "Motor sebagai jaminan atau untuk kebutuhan dana.",
    icon: "hand-coin-outline" as const,
    route: "/pengajuan/m2w",
  },
];

export default function Pengajuan() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pengajuan</Text>
      <Text style={styles.subtitle}>
        Pilih jenis pengajuan yang sesuai dengan kebutuhanmu.
      </Text>

      {PRODUK.map((p) => (
        <Pressable
          key={p.kodeLayar}
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
          onPress={() => router.push(p.route as any)}
        >
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name={p.icon} size={28} color={RED} />
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.rowTop}>
              <Text style={styles.cardTitle}>{p.judul}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{p.kodeLayar}</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>{p.deskripsi}</Text>
            <Text style={styles.cardMeta}>Kode {p.kode}</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#999" />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F2F2" },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: "800", color: "#111" },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FDECEA",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  badge: {
    backgroundColor: RED,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  cardDesc: { fontSize: 13, color: "#555", marginTop: 4, lineHeight: 18 },
  cardMeta: { fontSize: 12, color: "#888", marginTop: 6 },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 14,
    marginTop: 6,
  },
  noteText: { flex: 1, fontSize: 13, color: "#333", lineHeight: 19 },
});
