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
import { AgentStatusResponse, getAgentStatus } from "../../../services/agent";
import { DARK_RED, styles, RED, CS_WA } from "../../../components/app.style/profile.style";
import { logout } from "../../../services/auth";

const openWhatsApp = (phone: string, text?: string) => {
  const msg = text ? `?text=${encodeURIComponent(text)}` : "";
  Linking.openURL(`https://wa.me/${phone}${msg}`).catch(() =>
    Alert.alert("Gagal", "Tidak bisa membuka WhatsApp"),
  );
};

const STATUS_LABEL: Record<string, string> = {
  none: "Belum terdaftar agen",
  none_draft: "Pendaftaran belum selesai",
  pending: "Sedang diverifikasi",
  active: "Agen aktif",
  inactive_closing: "Proses penutupan",
  inactive: "Tidak aktif",
  rejected: "Ditolak",
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function Profil() {
  const [data, setData] = useState<AgentStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await getAgentStatus());
    } catch (e: any) {
      setError(e.message ?? "Gagal memuat profil");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = () => {
    Alert.alert("Keluar", "Yakin mau keluar dari akun ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  if (!data) {
    return (
      <View style={styles.center}>
        {error ? (
          <>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={load}>
              <Text style={styles.retry}>Coba lagi</Text>
            </Pressable>
          </>
        ) : (
          <ActivityIndicator color={RED} />
        )}
      </View>
    );
  }

  const { user, agent, status } = data;
  const name = agent?.nama_lengkap || user.name || user.phone;
  const isActive = status === "active";

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
      <Text style={styles.title}>Profil</Text>

      {/* Kartu identitas */}
      <View style={styles.card}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{STATUS_LABEL[status] ?? status}</Text>
        </View>

        {agent && (
          <View style={styles.infoBox}>
            <InfoRow label="Kode agen" value={agent.kode_agen ?? "-"} />
            <InfoRow label="Jenis agen" value={agent.jenis_agen} />
            {agent.kba_nama && <InfoRow label="KBA" value={agent.kba_nama} />}
          </View>
        )}
      </View>

      {/* Menu */}
      <View style={styles.card}>
        <MenuRow
          icon="call-outline"
          title="Ganti nomor HP"
          sub={user.phone}
          onPress={() => Alert.alert("Segera hadir")}
        />
        <View style={styles.divider} />
        <MenuRow
          icon="lock-closed-outline"
          title="Keamanan"
          sub="Ganti password"
          onPress={() => Alert.alert("Segera hadir")}
        />
        <View style={styles.divider} />
        <MenuRow
          icon="information-circle-outline"
          title="Pusat bantuan"
          sub="Hubungi Customer Service"
          onPress={() =>
            openWhatsApp(CS_WA, "Halo CS KlikNSC, saya butuh bantuan.")
          }
        />
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={DARK_RED} />
        <Text style={styles.logoutText}>Keluar</Text>
      </Pressable>

      <Text style={styles.version}>KlikNSC v1.0 · Mitra Terbaik Anda</Text>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  title,
  sub,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={20} color={RED} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#111" />
    </Pressable>
  );
}
