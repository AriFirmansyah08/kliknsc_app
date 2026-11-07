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
  subtitle: { fontSize: 14, color: "#555", marginBottom: 24, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 8 },
  hint: { fontSize: 12, color: "#666", marginTop: 8 },
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 16, fontSize: 16, color: "#111" },
  checks: { marginTop: 10, gap: 6 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkText: { fontSize: 13, color: "#555" },
  primaryBtn: {
    backgroundColor: RED,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#111", fontSize: 15, fontWeight: "700" },
});
