import { DokumenStep } from "@/components/ui/DokumenStep";
import { FormField } from "@/components/ui/FormControls";
import { DAFTAR_STEPS, DOC_STEP, REVIEW_STEP } from "@/constants/daftarAgen";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDaftarAgen } from "../../../hooks/useDaftarAgent";

const RED = "#E8311A";

export default function DaftarAgen() {
  const {
    step,
    docStage,
    values,
    setField,
    next,
    back,
    goTo,
    submit,
    loading,
  } = useDaftarAgen();

  const isReview = step === REVIEW_STEP;
  const isDoc = step === DOC_STEP;
  const current = DAFTAR_STEPS[step];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isReview ? "Review pendaftaran" : "Daftar agen"}
        </Text>
      </View>

      {!isReview && (
        <>
          <View style={styles.progress}>
            {DAFTAR_STEPS.map((_, i) => (
              <View
                key={i}
                style={[styles.bar, i <= step && styles.barActive]}
              />
            ))}
          </View>
          <Text style={styles.stepLabel}>
            Langkah {step + 1} dari {DAFTAR_STEPS.length} · {current.title}
          </Text>
        </>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {isReview ? (
          DAFTAR_STEPS.map((s, i) => (
            <View key={s.title} style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>{s.title}</Text>
                <Pressable onPress={() => goTo(i)} hitSlop={8}>
                  <Text style={styles.ubah}>Ubah</Text>
                </Pressable>
              </View>
              {s.fields
                .filter((f) => f.type !== "photo" && f.type !== "checkbox")
                .map((f) => (
                  <View key={f.key} style={styles.row}>
                    <Text style={styles.rowLabel}>{f.label}</Text>
                    <Text style={styles.rowValue}>{values[f.key] || "-"}</Text>
                  </View>
                ))}
            </View>
          ))
        ) : isDoc ? (
          <DokumenStep
            stage={docStage}
            values={values}
            setField={setField}
            onNext={next}
          />
        ) : (
          <>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.desc}>{current.desc}</Text>
            {current.fields.map((f) => (
              <FormField
                key={f.key}
                field={f}
                value={values[f.key] ?? ""}
                onChange={(v) => setField(f.key, v)}
              />
            ))}
          </>
        )}

        {!isDoc && (
          <Pressable
            style={styles.primaryBtn}
            onPress={isReview ? submit : next}
            disabled={loading}
          >
            <Text style={styles.primaryBtnText}>
              {isReview ? "Kirim pendaftaran" : "Lanjut"}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F2F2", paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  progress: { flexDirection: "row", gap: 6, paddingHorizontal: 20 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#D0D0D0" },
  barActive: { backgroundColor: RED },
  stepLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    paddingHorizontal: 20,
    marginTop: 8,
  },

  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "800", color: "#111" },
  desc: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#111" },
  ubah: { color: RED, fontWeight: "800", fontSize: 14 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    gap: 12,
  },
  rowLabel: { color: "#666", fontSize: 14, flex: 1 },
  rowValue: {
    color: "#111",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },

  primaryBtn: {
    backgroundColor: RED,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
