import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { RED, styles } from "../../components/app.style/otp.style";
import { registerUser, requestOtp, verifyOtp } from "../../services/auth";
const OTP_LENGTH = 6;

export default function OtpScreen() {
  const { phone, mode, password } = useLocalSearchParams<{
    phone: string;
    mode: "register" | "reset";
    password?: string;
  }>();

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<any[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const submit = async (otp: string) => {
    try {
      setLoading(true);
      if (mode === "register") {
        await registerUser(phone, password ?? "", otp);
        router.replace("/(features)/(tabs)/home");
      } else {
        await verifyOtp(phone, otp, mode);
        router.push({
          pathname: "/reset-password",
          params: { phone, otp },
        });
      }
    } catch (err: any) {
      Alert.alert("Kode salah", err.message ?? "Kode OTP tidak valid");
      setCode(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
    if (next.every((d) => d !== "")) {
      submit(next.join(""));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async (channel: "whatsapp" | "sms" = "whatsapp") => {
    try {
      await requestOtp(phone, mode, channel);
      setCountdown(60);
      setCode(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } catch (err: any) {
      Alert.alert("Gagal mengirim ulang", err.message ?? "Terjadi kesalahan");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {mode === "register" ? "Verifikasi nomor" : "Lupa password"}
        </Text>
      </View>

      <Text style={styles.title}>Masukkan kode OTP</Text>
      <Text style={styles.subtitle}>
        Kode 6 digit dikirim lewat WhatsApp ke{"\n"}
        <Text style={{ fontWeight: "700" }}>{phone}</Text>.
      </Text>

      <View style={styles.otpRow}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={i === 0}
            editable={!loading}
            textAlign="center"
          />
        ))}
      </View>

      {loading && <ActivityIndicator color={RED} style={{ marginTop: 16 }} />}

      <Text style={styles.countdown}>
        {countdown > 0
          ? `Kirim ulang dalam 0:${String(countdown).padStart(2, "0")}`
          : ""}
      </Text>

      {countdown === 0 && (
        <Pressable onPress={() => handleResend("whatsapp")}>
          <Text style={styles.resend}>Kirim ulang kode</Text>
        </Pressable>
      )}

      <Pressable onPress={() => handleResend("sms")} style={{ marginTop: 20 }}>
        <Text style={styles.resend}>Tidak dapat WhatsApp? Kirim lewat SMS</Text>
      </Pressable>

      <View style={{ flex: 1 }} />

      <Pressable style={styles.changeBtn} onPress={() => router.back()}>
        <Text style={styles.changeBtnText}>Ubah nomor HP</Text>
      </Pressable>
    </View>
  );
}
