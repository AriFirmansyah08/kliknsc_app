import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { verifikasiAgen } from "../../services/auth";

const RED = "#E8311A";
const DARK_RED = "#C41E0A";

export default function VerifikasiAgen() {
  const { phone, password } = useLocalSearchParams<{
    phone: string;
    password: string;
  }>();
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const nikValid = nik.length === 16;

  const verifikasi = async () => {
    if (!nikValid) return;
    try {
      setLoading(true);
      await verifikasiAgen(phone, nik, password);
      Alert.alert("Berhasil", "Akun agen kamu sudah aktif.", [
        {
          text: "OK",
          onPress: () => router.replace("/(features)/(tabs)/home"),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Verifikasi gagal", err.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const hubungiCs = () => {
    Alert.alert("Hubungi CS", "Fitur ini akan segera tersedia.");
  };

  const keluar = () => {
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F2F2F2" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerTitle}>Verifikasi akun agen</Text>

        <View style={styles.iconBox}>
          <Ionicons name="shield-outline" size={30} color={DARK_RED} />
        </View>

        <Text style={styles.title}>Pastikan ini akun agen kamu</Text>
        <Text style={styles.desc}>
          Nomor HP ini terhubung ke akun agen KlikNSC. Untuk keamanan, masukkan
          NIK pemilik akun agen tersebut.
        </Text>

        <Text style={styles.label}>NIK (16 digit)</Text>
        <TextInput
          style={styles.input}
          placeholder="16 digit angka sesuai KTP"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={16}
          value={nik}
          onChangeText={(v) => setNik(v.replace(/\D/g, ""))}
        />

        <Pressable onPress={hubungiCs} style={styles.center}>
          <Text style={styles.link}>Bukan akun agen saya? Hubungi CS</Text>
        </Pressable>

        <Pressable onPress={keluar} style={styles.center}>
          <Text style={styles.link}>Keluar dari akun</Text>
        </Pressable>

        <View style={{ flex: 1, minHeight: 40 }} />

        <Pressable
          style={[
            styles.primaryBtn,
            (!nikValid || loading) && { opacity: 0.5 },
          ]}
          disabled={!nikValid || loading}
          onPress={verifikasi}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Verifikasi</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  devBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#999",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 16,
  },
  devText: { fontSize: 11, color: "#555", fontFamily: "monospace" },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#FDEDEA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    marginTop: 20,
    lineHeight: 34,
  },
  desc: { fontSize: 14, color: "#555", marginTop: 8, lineHeight: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginTop: 24,
    marginBottom: 8,
  },
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
  center: { alignItems: "center", marginTop: 24 },
  link: { color: DARK_RED, fontWeight: "700", fontSize: 14 },
  primaryBtn: {
    backgroundColor: RED,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
