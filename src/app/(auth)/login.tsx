import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { DARK_RED, styles } from "../../components/app.style/login.style";
import { login } from "../../services/auth";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setPhoneError(null);
    setPasswordError(null);
    setLoginError(null);

    let valid = true;

    if (!/^08\d{8,11}$/.test(phone)) {
      setPhoneError("Nomor HP tidak valid. Gunakan format 08xxxxxxxxxx");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("Password minimal 6 karakter");
      valid = false;
    }
    if (!valid) return;

    try {
      setLoading(true);
      await login(phone, password);
      router.replace("/(features)/(tabs)/home");
    } catch (err: any) {
      setLoginError(err.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../../assets/images/logo-klik-nsc.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Selamat datang kembali</Text>
        <Text style={styles.subtitle}>
          Masuk dengan nomor HP dan password akunmu.
        </Text>

        <Text style={styles.label}>Nomor HP</Text>
        <TextInput
          style={[styles.input, phoneError && styles.inputError]}
          placeholder="08xx xxxx xxxx"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            setPhoneError(null);
          }}
          autoCapitalize="none"
        />
        {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}

        <Text style={styles.label}>Password</Text>
        <View
          style={[styles.passwordWrapper, passwordError && styles.inputError]}
        >
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setPasswordError(null);
            }}
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
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <Link href="/forget-password" asChild>
          <Pressable>
            <Text style={styles.link}>Lupa password?</Text>
          </Pressable>
        </Link>
        <Link href="/lupa-nomor" style={[styles.link, { marginTop: 10 }]}>
          Lupa nomor / nomor tidak aktif?
        </Link>

        <View style={{ flex: 1, minHeight: 40 }} />

        {loginError && (
          <Text style={[styles.errorText, styles.centerText]}>
            {loginError}
          </Text>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { backgroundColor: DARK_RED },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Masuk</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.secondaryBtnText}>Belum punya akun? Daftar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
