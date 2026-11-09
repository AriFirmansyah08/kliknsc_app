import { StyleSheet } from "react-native";

export const RED = "#E8311A";
export const DARK_RED = "#C41E0A";
export const CS_WA = "6283805873755";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F2F2" },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 100 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
    backgroundColor: "#F2F2F2",
  },
  errorText: { textAlign: "center", color: "#111" },
  retry: { color: RED, fontWeight: "800" },

  title: { fontSize: 28, fontWeight: "800", color: "#111", marginBottom: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  identity: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF1EE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: DARK_RED, fontWeight: "800", fontSize: 18 },
  name: { fontSize: 18, fontWeight: "800", color: "#111" },
  phone: { fontSize: 14, color: "#666", marginTop: 2 },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 14,
  },
  badgeText: { fontSize: 12, fontWeight: "800", color: "#333" },

  infoBox: {
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    gap: 10,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { color: "#666", fontSize: 14 },
  infoValue: { color: "#111", fontSize: 14, fontWeight: "700" },

  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 4 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF1EE",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: { fontSize: 15, fontWeight: "800", color: "#111" },
  menuSub: { fontSize: 13, color: "#666", marginTop: 2 },

  logoutBtn: {
    backgroundColor: "#FFF1EE",
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  logoutText: { color: DARK_RED, fontWeight: "800", fontSize: 15 },
  version: { textAlign: "center", color: "#888", fontSize: 12, marginTop: 20 },
});
