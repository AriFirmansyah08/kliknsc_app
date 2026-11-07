import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../components/app.style/success.style";

export default function SuccessScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name="checkmark" size={40} color="#C41E0A" />
      </View>

      <Text style={styles.title}>Password berhasil diganti</Text>
      <Text style={styles.subtitle}>
        Silakan masuk dengan password baru. Akunmu sudah keluar dari semua
        perangkat lain.
      </Text>

      <View style={{ flex: 1 }} />

      <Pressable
        style={styles.primaryBtn}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.primaryBtnText}>Masuk</Text>
      </Pressable>
    </View>
  );
}
