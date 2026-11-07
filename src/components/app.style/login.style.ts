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
  logo: {
    width: 190,
    height: 89,
    alignSelf: "center",
  },
  title: { fontSize: 26, fontWeight: "800", color: "#111", marginTop: 32 },
  subtitle: { fontSize: 14, color: "#555", marginTop: 6, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 8 },
  input: {
    backgroundColor: "#EBEBEB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111",
    marginBottom: 8,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBEBEB",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111",
  },
  inputError: {
    borderWidth: 1,
    borderColor: RED,
  },
  errorText: {
    color: RED,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 12,
  },
  centerText: {
    textAlign: "center",
    marginBottom: 12,
  },
  link: { color: RED, fontWeight: "700", fontSize: 14 },
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
