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
import { DARK_RED, styles } from "../../components/app.style/register.style";
import { changePassword } from "../../services/auth";

function PasswordField({
  label,
  value,
  onChange,
  marginTop,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  marginTop?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Text style={[styles.label, marginTop ? { marginTop } : null]}>
        {label}
      </Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!show}
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
        />
        <Pressable onPress={() => setShow((v) => !v)} hitSlop={10}>
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#333"
          />
        </Pressable>
      </View>
    </>
  );
}

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

export default function GantiPasswordScreen() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const checks = {
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
  };
  const passwordValid = checks.length && checks.letter && checks.number;

  const handleSave = async () => {
    if (!current) {
      Alert.alert("Password lama kosong", "Isi password lama kamu");
      return;
    }
    if (!passwordValid) {
      Alert.alert(
        "Password belum memenuhi syarat",
        "Minimal 8 karakter, ada huruf dan angka",
      );
      return;
    }
    if (password === current) {
      Alert.alert(
        "Password sama",
        "Password baru harus berbeda dengan password lama",
      );
      return;
    }
    if (password !== confirm) {
      Alert.alert("Konfirmasi tidak sama", "Periksa kembali password kamu");
      return;
    }

    try {
      setLoading(true);
      await changePassword(current, password);
      Alert.alert("Berhasil", "Password kamu sudah diganti");
      router.back();
    } catch (err: any) {
      Alert.alert("Gagal", err.message ?? "Terjadi kesalahan");
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
          <Text style={styles.headerTitle}>Ganti password</Text>
        </View>

        <Text style={styles.subtitle}>
          Masukkan password lama, lalu buat password baru.
        </Text>

        <PasswordField
          label="Password lama"
          value={current}
          onChange={setCurrent}
        />

        <PasswordField
          label="Password baru"
          value={password}
          onChange={setPassword}
          marginTop={20}
        />
        <View style={styles.checks}>
          <Check ok={checks.length} label="Minimal 8 karakter" />
          <Check ok={checks.letter} label="Ada huruf" />
          <Check ok={checks.number} label="Ada angka" />
        </View>

        <PasswordField
          label="Konfirmasi password baru"
          value={confirm}
          onChange={setConfirm}
          marginTop={20}
        />

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

        <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryBtnText}>Batal</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
