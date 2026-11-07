import { StyleSheet, Text, View } from "react-native";

export default function Pengajuan() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pengajuan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#111" },
});
