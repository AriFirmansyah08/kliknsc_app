import { StyleSheet } from "react-native";

export const RED = "#E8311A";
export const DARK_RED = "#C41E0A";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  title: { fontSize: 28, fontWeight: "800", color: "#111" },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 8 },
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
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  infoText: { flex: 1, fontSize: 13, color: "#333", lineHeight: 18 },
  primaryBtn: {
    backgroundColor: RED,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
