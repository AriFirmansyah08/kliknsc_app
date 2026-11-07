import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { submitAgent } from "@/services/agent";
import {
  DAFTAR_STEPS,
  DOC_STEP,
  REVIEW_STEP,
  FormValues,
  emptyValues,
} from "@/constants/daftarAgen";

export function useDaftarAgen() {
  const [step, setStep] = useState(0);
  const [docStage, setDocStage] = useState<0 | 1>(0); // 0 = persetujuan, 1 = foto
  const [returnToReview, setReturnToReview] = useState(false);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [loading, setLoading] = useState(false);

  const setField = (key: string, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const activeFields = () => {
    const fields = DAFTAR_STEPS[step].fields;
    if (step !== DOC_STEP) return fields;
    return docStage === 0
      ? fields.filter((f) => f.key === "consent")
      : fields.filter((f) => f.key !== "consent");
  };

  const next = () => {
    const kosong = activeFields()
      .filter((f) => f.required && !values[f.key])
      .map((f) => f.label);

    if (kosong.length) {
      Alert.alert("Belum lengkap", `Isi dulu: ${kosong.join(", ")}`);
      return;
    }

    if (step === DOC_STEP && docStage === 0) {
      setDocStage(1);
      return;
    }
    if (returnToReview) {
      setReturnToReview(false);
      setStep(REVIEW_STEP);
      return;
    }
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === DOC_STEP && docStage === 1) {
      setDocStage(0);
      return;
    }
    if (returnToReview && step !== REVIEW_STEP) {
      setReturnToReview(false);
      setStep(REVIEW_STEP);
      return;
    }
    if (step === 0) {
      router.back();
      return;
    }
    setStep((s) => s - 1);
  };

  // dipanggil dari tombol "Ubah" di review
  const goTo = (i: number) => {
    setReturnToReview(true);
    setDocStage(i === DOC_STEP ? 1 : 0);
    setStep(i);
  };

  const submit = async () => {
    try {
      setLoading(true);
      await submitAgent(values);
      Alert.alert("Berhasil", "Pendaftaran dikirim, tunggu verifikasi SPV KBA.");
      router.replace("/home");
    } catch (e: any) {
      Alert.alert("Gagal", e.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return { step, docStage, values, setField, next, back, goTo, submit, loading };
}