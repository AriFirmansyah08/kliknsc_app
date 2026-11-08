import * as FileSystem from "expo-file-system/legacy";
import { authRequest } from "./auth";

export type AgentStatus =
  | "none"
  | "none_draft"
  | "pending"
  | "active"
  | "inactive_closing"
  | "inactive"
  | "rejected";

export type AgentInfo = {
  nama_lengkap: string;
  kode_agen: string | null;
  jenis_agen: string;
  kba_nama: string | null;
  kba_phone: string | null;
  submitted_at: string | null;
};

// status pending di tabel agents (endpoint lama)
export const submitAgent = (namaLengkap: string) =>
  authRequest("/agent/submit", {
    method: "POST",
    body: { nama_lengkap: namaLengkap },
  });

// data lengkap ke tabel agent
export const submitAppAgent = (values: Record<string, string>) =>
  authRequest("/agent/submit_app", {
    method: "POST",
    body: values,
  });

export type AgentStatusResponse = {
  status: AgentStatus;
  user: { name: string; phone: string };
  agent: AgentInfo | null;
};

export const getAgentStatus = () =>
  authRequest("/agent/status") as Promise<AgentStatusResponse>;

export type PengajuanItem = {
  id: number;
  nama_konsumen: string;
  nik: string;
  no_hp: string;
  plafon: string;
  status: "diajukan" | "disetujui" | "ditolak" | "cair" | string;
  created_at: string;
};

export type PengajuanPage = {
  data: PengajuanItem[];
  current_page: number;
  last_page: number;
  total: number;
};

// foto dikirim sebagai base64
export const uploadDokumenAgent = async (ktpUri: string, selfieUri: string) => {
  const ktp = await FileSystem.readAsStringAsync(ktpUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const selfie = await FileSystem.readAsStringAsync(selfieUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return authRequest("/agent/dokumen", {
    method: "POST",
    body: { ktp, selfie },
  });
};

export const getPengajuan = (page: number) =>
  authRequest(`/pengajuan?page=${page}`) as Promise<PengajuanPage>;
