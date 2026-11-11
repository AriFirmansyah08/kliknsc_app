import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    AgentInfo,
    AgentStatusResponse,
    getAgentStatus,
} from "../../../services/agent";

const RED = "#E8311A";
const DARK_RED = "#C41E0A";
const DARK = "#1F1F1F";
const CS_PHONE = "081200000000";

const call = (num?: string | null) => {
  if (!num) return Alert.alert("Nomor belum tersedia");
  Linking.openURL(`tel:${num}`);
};

const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

export default function Home() {
  const [data, setData] = useState<AgentStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await getAgentStatus());
    } catch (e: any) {
      setError(e.message ?? "Gagal memuat data");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!data && !error) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={RED} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={load}>
          <Text style={styles.retry}>Coba lagi</Text>
        </Pressable>
      </View>
    );
  }

  const { status, agent, user } = data;
  const name = agent?.nama_lengkap || user.name || user.phone;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleDaftar = () => router.push("/agent/daftar");

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
          tintColor={RED}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          {agent ? (
            <Text style={styles.avatarText}>{initials}</Text>
          ) : (
            <Ionicons name="person-outline" size={22} color={RED} />
          )}
        </View>
        <View>
          <Text style={styles.greet}>Selamat datang,</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      {status === "none" && <NoneView onDaftar={handleDaftar} />}
      {status === "pending" && <PendingView agent={agent} />}
      {status === "active" && <ActiveView agent={agent} name={name} />}
      {status === "inactive_closing" && (
        <StatusCard
          icon="time-outline"
          badge="Proses penutupan"
          title="Akun agen sedang ditutup"
          desc="Akun agen kamu sedang dalam proses penutupan. Hubungi KBA atau Customer Service."
          kbaPhone={agent?.kba_phone}
        />
      )}
      {status === "inactive" && (
        <StatusCard
          icon="lock-closed-outline"
          badge="Tidak aktif"
          title="Akun agen tidak aktif"
          desc="Akun agen kamu sudah tidak aktif. Silakan hubungi KBA atau Customer Service untuk mengaktifkannya kembali."
          kbaPhone={agent?.kba_phone}
        />
      )}
      {status === "rejected" && (
        <StatusCard
          icon="alert-circle-outline"
          badge="Tidak aktif atau ditolak"
          title="Akun agen tidak aktif"
          desc="Akun sudah tidak aktif atau ditolak, silakan hubungi KBA atau Customer Service."
          kbaPhone={agent?.kba_phone}
        />
      )}
    </ScrollView>
  );
}

/* ---------- Status: none ---------- */

function NoneView({ onDaftar }: { onDaftar: () => void }) {
  const benefits = [
    {
      t: "Komisi tiap kredit cair",
      d: "Komisi ditransfer ke rekening kamu setiap hari.",
    },
    { t: "Gratis, tanpa modal", d: "Tidak ada biaya pendaftaran." },
    {
      t: "Kerja dari mana saja",
      d: "Ajukan kredit konsumen langsung dari aplikasi.",
    },
    { t: "Didampingi KBA", d: "KBA kamu siap membantu dari awal." },
  ];
  const steps = [
    "Daftar dan diverifikasi",
    "Cari konsumen, ajukan kredit",
    "Kredit cair, komisi masuk",
  ];

  return (
    <>
      <View style={styles.promo}>
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeText}>PROGRAM AGEN</Text>
        </View>
        <Text style={styles.promoTitle}>
          Penghasilan tambahan dari setiap kredit yang cair.
        </Text>
        <Pressable style={styles.promoBtn} onPress={onDaftar}>
          <Text style={styles.promoBtnText}>Daftar jadi agen</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Keuntungan jadi agen</Text>
      <View style={styles.card}>
        {benefits.map((b, i) => (
          <View key={b.t}>
            <View style={styles.benefitRow}>
              <View style={styles.numBox}>
                <Text style={styles.numText}>
                  {String(i + 1).padStart(2, "0")}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>{b.t}</Text>
                <Text style={styles.benefitDesc}>{b.d}</Text>
              </View>
            </View>
            {i < benefits.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Cara kerjanya</Text>
      <View style={styles.stepRow}>
        {steps.map((s, i) => (
          <View key={s} style={styles.stepBox}>
            <Text style={styles.stepNum}>{i + 1}</Text>
            <Text style={styles.stepText}>{s}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.primaryBtn} onPress={onDaftar}>
        <Text style={styles.primaryBtnText}>Daftar jadi agen sekarang</Text>
      </Pressable>
    </>
  );
}

/* ---------- Status: pending ---------- */

function PendingView({ agent }: { agent: AgentInfo | null }) {
  const steps: {
    label: string;
    sub: string;
    state: "done" | "current" | "todo";
  }[] = [
    {
      label: "Pendaftaran dikirim",
      sub: formatDate(agent?.submitted_at),
      state: "done",
    },
    {
      label: "Verifikasi oleh SPV KBA",
      sub: "Sedang berjalan",
      state: "current",
    },
    {
      label: "Akun agen aktif",
      sub: "Kamu bisa mulai mengajukan kredit",
      state: "todo",
    },
  ];

  return (
    <>
      <View style={styles.darkCard}>
        <View style={styles.darkBadge}>
          <Text style={styles.darkBadgeText}>SEDANG DIVERIFIKASI</Text>
        </View>
        <Text style={styles.darkTitle}>
          Pendaftaran agen kamu sedang diperiksa
        </Text>
        <Text style={styles.darkDesc}>
          SPV KBA sedang memeriksa data kamu. Cek halaman ini lagi nanti untuk
          melihat hasilnya.
        </Text>
      </View>

      <View style={styles.card}>
        {steps.map((s, i) => (
          <View key={s.label} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.dot,
                  s.state === "done" && styles.dotDone,
                  s.state === "current" && styles.dotCurrent,
                ]}
              >
                {s.state === "done" && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
                {s.state === "current" && <View style={styles.dotInner} />}
              </View>
              {i < steps.length - 1 && <View style={styles.line} />}
            </View>
            <View style={{ flex: 1, paddingBottom: 18 }}>
              <Text style={styles.timelineLabel}>{s.label}</Text>
              <Text style={styles.timelineSub}>{s.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      <KbaCard kbaNama={agent?.kba_nama} kbaPhone={agent?.kba_phone} />
      <OutlineBtn
        label="Hubungi CS"
        icon="chatbubble-outline"
        onPress={() => call(CS_PHONE)}
      />
    </>
  );
}

/* ---------- Status: active ---------- */

function ActiveView({
  agent,
  name,
}: {
  agent: AgentInfo | null;
  name: string;
}) {
  return (
    <>
      <View style={styles.darkCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.darkLabel}>Akun agen</Text>
          <View style={styles.darkBadge}>
            <Text style={styles.darkBadgeText}>AKTIF</Text>
          </View>
        </View>
        <Text style={styles.darkTitleLg}>{name}</Text>
        <View style={styles.infoInner}>
          <View>
            <Text style={styles.infoLabel}>Kode agen</Text>
            <Text style={styles.infoValue}>{agent?.kode_agen ?? "-"}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Jenis agen</Text>
            <Text style={styles.infoValue}>{agent?.jenis_agen ?? "-"}</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.redCard}
        onPress={() => router.push("/pengajuan")}
      >
        <View style={styles.plusCircle}>
          <Ionicons name="add" size={26} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.redCardTitle}>Ajukan kredit konsumen</Text>
          <Text style={styles.redCardSub}>Ketuk untuk mulai</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </Pressable>

      <KbaCard kbaNama={agent?.kba_nama} kbaPhone={agent?.kba_phone} />

      <View style={styles.noticeBox}>
        <Ionicons name="call-outline" size={22} color="#111" />
        <View style={{ flex: 1 }}>
          <Text style={styles.noticeTitle}>
            Ganti nomor sebelum nomor lama mati.
          </Text>
          <Text style={styles.noticeDesc}>
            Supaya akun agen tetap aman, ganti nomor dari menu Profil selagi
            nomor lama masih aktif.
          </Text>
        </View>
      </View>
      <OutlineBtn
        label="Ganti nomor HP"
        onPress={() => Alert.alert("Segera hadir")}
      />
    </>
  );
}

/* ---------- Status: inactive / closing / rejected ---------- */

function StatusCard({
  icon,
  badge,
  title,
  desc,
  kbaPhone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  badge: string;
  title: string;
  desc: string;
  kbaPhone?: string | null;
}) {
  return (
    <>
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={30} color="#111" />
        </View>
        <View style={styles.smallBadge}>
          <Text style={styles.smallBadgeText}>{badge}</Text>
        </View>
        <Text style={styles.statusTitle}>{title}</Text>
        <Text style={styles.statusDesc}>{desc}</Text>
      </View>

      <Pressable style={styles.primaryBtn} onPress={() => call(kbaPhone)}>
        <Ionicons name="call-outline" size={18} color="#fff" />
        <Text style={styles.primaryBtnText}>Hubungi KBA</Text>
      </Pressable>
      <OutlineBtn
        label="Hubungi CS"
        icon="chatbubble-outline"
        onPress={() => call(CS_PHONE)}
      />
    </>
  );
}

/* ---------- Shared pieces ---------- */

function KbaCard({
  kbaNama,
  kbaPhone,
}: {
  kbaNama?: string | null;
  kbaPhone?: string | null;
}) {
  if (!kbaNama) return null;
  const initials = kbaNama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <View style={styles.kbaCard}>
      <View style={styles.kbaAvatar}>
        <Text style={styles.kbaAvatarText}>{initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabelDark}>KBA kamu</Text>
        <Text style={styles.kbaName}>{kbaNama}</Text>
      </View>
      <Pressable style={styles.callCircle} onPress={() => call(kbaPhone)}>
        <Ionicons name="call-outline" size={20} color={RED} />
      </Pressable>
    </View>
  );
}

function OutlineBtn({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.outlineBtn} onPress={onPress}>
      {icon && <Ionicons name={icon} size={18} color="#111" />}
      <Text style={styles.outlineBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F2F2" },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#F2F2F2",
  },
  errorText: { textAlign: "center", color: "#111" },
  retry: { color: RED, fontWeight: "800", marginTop: 8 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF1EE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#111", fontWeight: "800", fontSize: 16 },
  greet: { fontSize: 13, color: "#666" },
  name: { fontSize: 18, fontWeight: "800", color: "#111" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
    marginTop: 4,
  },

  promo: {
    backgroundColor: RED,
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },
  promoBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  promoBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  promoTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  promoBtn: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  promoBtnText: { color: DARK_RED, fontWeight: "800", fontSize: 15 },

  benefitRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  numBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF1EE",
    alignItems: "center",
    justifyContent: "center",
  },
  numText: { color: DARK_RED, fontWeight: "800" },
  benefitTitle: { fontSize: 15, fontWeight: "800", color: "#111" },
  benefitDesc: { fontSize: 13, color: "#666", marginTop: 2, lineHeight: 18 },

  stepRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  stepBox: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 12 },
  stepNum: { color: DARK_RED, fontWeight: "800", marginBottom: 6 },
  stepText: { fontSize: 13, fontWeight: "700", color: "#111" },

  primaryBtn: {
    backgroundColor: RED,
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  outlineBtn: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  outlineBtnText: { color: "#111", fontWeight: "800", fontSize: 15 },

  darkCard: {
    backgroundColor: DARK,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  darkBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  darkBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  darkTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
    lineHeight: 28,
  },
  darkTitleLg: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 12,
  },
  darkDesc: { color: "#CCC", fontSize: 14, marginTop: 10, lineHeight: 20 },
  darkLabel: { color: "#BBB", fontSize: 14 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#333",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  infoLabel: { color: "#BBB", fontSize: 12 },
  infoLabelDark: { color: "#666", fontSize: 12 },
  infoValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 4 },

  timelineRow: { flexDirection: "row", gap: 12 },
  timelineLeft: { alignItems: "center" },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  dotDone: { backgroundColor: DARK, borderColor: DARK },
  dotCurrent: { borderColor: RED },
  dotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: RED },
  line: { width: 2, flex: 1, backgroundColor: "#DDD", marginVertical: 2 },
  timelineLabel: { fontSize: 15, fontWeight: "800", color: "#111" },
  timelineSub: { fontSize: 13, color: "#666", marginTop: 2 },

  kbaCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  kbaAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1EE",
    alignItems: "center",
    justifyContent: "center",
  },
  kbaAvatarText: { color: DARK_RED, fontWeight: "800" },
  kbaName: { fontSize: 16, fontWeight: "800", color: "#111", marginTop: 2 },
  callCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF1EE",
    alignItems: "center",
    justifyContent: "center",
  },

  redCard: {
    backgroundColor: RED,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    opacity: 0.9,
  },
  plusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  redCardTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  redCardSub: { color: "#FFD9D2", fontSize: 13, marginTop: 2 },

  noticeBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  noticeTitle: { fontWeight: "800", color: "#111", fontSize: 14 },
  noticeDesc: { color: "#555", fontSize: 13, marginTop: 4, lineHeight: 18 },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  smallBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  smallBadgeText: { color: DARK_RED, fontSize: 12, fontWeight: "800" },
  statusTitle: { fontSize: 22, fontWeight: "800", color: "#111" },
  statusDesc: { fontSize: 14, color: "#555", marginTop: 8, lineHeight: 20 },
});
