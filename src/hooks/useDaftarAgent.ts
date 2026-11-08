import {
    DAFTAR_STEPS,
    DOC_STEP,
    FieldDef,
    FormValues,
    REVIEW_STEP,
    emptyValues,
    visibleFields,
} from "@/constants/daftarAgen";
import { submitAgent, submitAppAgent, uploadDokumenAgent } from "@/services/agent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const DRAFT_KEY = "draft_daftar_agen";

type Draft = { step: number; docStage: 0 | 1; values: FormValues };

export function useDaftarAgent() {
  const [step, setStep] = useState(0);
  const [docStage, setDocStage] = useState<0 | 1>(0); // 0 = persetujuan, 1 = foto
  const [returnToReview, setReturnToReview] = useState(false);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // muat draf saat layar dibuka
  useEffect(() => {
    AsyncStorage.getItem(DRAFT_KEY)
      .then((raw) => {
        if (!raw) return;
        const d: Draft = JSON.parse(raw);
        setStep(d.step);
        setDocStage(d.docStage);
        setValues(d.values);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  // simpan draf otomatis (ditunda 400ms)
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const draft: Draft = { step, docStage, values };
      AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft)).then(() =>
        setSavedAt(new Date()),
      );
    }, 400);
    return () => clearTimeout(t);
  }, [ready, step, docStage, values]);

  const setField = (key: string, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const activeFields = (): FieldDef[] => {
    const fields = visibleFields(DAFTAR_STEPS[step], values);
    if (step !== DOC_STEP) return fields;
    return docStage === 0
      ? fields.filter((f) => f.key === "consent")
      : fields.filter((f) => f.key !== "consent");
  };

  const cekField = (fields: FieldDef[]): string | null => {
    for (const f of fields) {
      const v = values[f.key] ?? "";
      if (f.required && !v) return `${f.label} wajib diisi`;
      if (v && f.validate) {
        const err = f.validate(v);
        if (err) return err;
      }
    }
    return null;
  };

  const next = () => {
    const err = cekField(activeFields());
    if (err) {
      Alert.alert("Periksa lagi", err);
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
  // kirim field yang tampil, kecuali foto (foto dikirim terpisah)
  const payload: FormValues = {};
  DAFTAR_STEPS.forEach((s) =>
    visibleFields(s, values).forEach((f) => {
      if (f.type !== "photo") payload[f.key] = values[f.key] ?? "";
    }),
  );

  try {
    setLoading(true);
    await submitAppAgent(payload);
    await uploadDokumenAgent(values.fotoKtp ?? "", values.selfie ?? "");
    await submitAgent(payload.namaLengkap);
    await AsyncStorage.removeItem(DRAFT_KEY);
    Alert.alert("Berhasil", "Pendaftaran dikirim, tunggu verifikasi SPV KBA.");
    router.replace("/home");
  } catch (e: any) {
    Alert.alert("Gagal", e.message ?? "Terjadi kesalahan");
  } finally {
    setLoading(false);
  }
};

  return {
    step,
    docStage,
    values,
    setField,
    next,
    back,
    goTo,
    submit,
    loading,
    ready,
    savedAt,
  };
}
