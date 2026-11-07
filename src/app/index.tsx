import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { getSession } from "../services/session";

export default function Splash() {
  useEffect(() => {
    const t = setTimeout(async () => {
      const token = await getSession();
      if (token) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo-klik-nsc.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color="#E8311A"
        style={{ marginTop: 40 }}
      />
      <Text style={styles.footer}>
        Nusantara Sakti Group · Terdaftar dan diawasi OJK
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 220, height: 120 },
  footer: { position: "absolute", bottom: 40, color: "#666", fontSize: 12 },
});
