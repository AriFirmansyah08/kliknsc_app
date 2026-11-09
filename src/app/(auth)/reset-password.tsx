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
    Text,
    TextInput,
    View,
} from "react-native";
import { DARK_RED, styles } from "../../components/app.style/register.style";
import { resetPassword } from "../../services/auth";

export default function ResetPasswordScreen() {
  const { phone, otp } = useLocalSearchParams<{ phone: string; otp: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const checks = {
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
  };
  const passwordValid = checks.length && checks.letter && checks.number;

  const handleSave = async () => {
    if (!passwordValid) {
      Alert.alert(
        "Password belum memenuhi syarat",
        "Minimal 8 karakter, ada huruf dan angka",
      );
      return;
    }
    if (password !== confirm) {
      Alert.alert("Konfirmasi tidak sama", "Periksa kembali password kamu");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(phone, otp, password);
      Alert.alert("Berhasil", "Password kamu sudah diubah, silakan masuk");
      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Gagal", err.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const Check = ({ ok, label }: { ok: boolean; label: string }) => (
    <View style={styles.checkRow}>
      <Ionicons
        name={ok ? "checkmark-circle" : "ellipse-outline"}
        size={18}
        color={ok ? "#2E9E4F" : "#999"}
      />
      <Text style={styles.checkText}>{label}</Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>Atur ulang password</Text>
        </View>

        <Text style={styles.subtitle}>Buat password baru untuk akun kamu.</Text>

        <Text style={styles.label}>Password baru</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#333"
            />
          </Pressable>
        </View>
        <View style={styles.checks}>
          <Check ok={checks.length} label="Minimal 8 karakter" />
          <Check ok={checks.letter} label="Ada huruf" />
          <Check ok={checks.number} label="Ada angka" />
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>
          Konfirmasi password
        </Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={10}>
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#333"
            />
          </Pressable>
        </View>

        <View style={{ flex: 1, minHeight: 40 }} />

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { backgroundColor: DARK_RED },
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Simpan password</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.secondaryBtnText}>Batal</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
