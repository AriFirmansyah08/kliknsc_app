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
  Text,
  TextInput,
  View,
} from "react-native";
import { DARK_RED, styles } from "../../components/app.style/forget-password";
import { requestOtp } from "../../services/auth";

export default function ForgotPasswordScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!/^08\d{8,11}$/.test(phone)) {
      Alert.alert("Nomor HP tidak valid", "Gunakan format 08xxxxxxxxxx");
      return;
    }
    try {
      setLoading(true);
      await requestOtp(phone, "reset");
      router.push({ pathname: "/otp", params: { phone, mode: "reset" } });
    } catch (err: any) {
      Alert.alert("Gagal mengirim kode", err.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
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
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </Pressable>
          <Text style={styles.headerTitle}>Lupa password</Text>
        </View>

        <Text style={styles.title}>Atur ulang password</Text>
        <Text style={styles.subtitle}>
          Masukkan nomor HP akunmu. Kami kirim kode OTP lewat WhatsApp.
        </Text>

        <Text style={styles.label}>Nomor HP</Text>
        <TextInput
          style={styles.input}
          placeholder="08xx xxxx xxxx"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#333" />
          <Text style={styles.infoText}>
            Reset password bisa dilakukan maksimal 3 kali per bulan.
          </Text>
        </View>

        <View style={{ flex: 1, minHeight: 40 }} />

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { backgroundColor: DARK_RED },
          ]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Kirim kode</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
