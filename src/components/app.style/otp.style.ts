import { StyleSheet } from "react-native";
import { Brand } from "@/constants/theme";

export const RED = "#C41E0A";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
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
  otpRow: { flexDirection: "row", justifyContent: "space-between" },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#fff",
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  otpBoxFilled: { borderColor: RED },
  countdown: { marginTop: 24, fontSize: 14, color: "#555" },
  resend: { color: RED, fontWeight: "700", fontSize: 14 },
  changeBtn: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  changeBtnText: { color: "#111", fontSize: 15, fontWeight: "700" },
});
