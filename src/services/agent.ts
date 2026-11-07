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

export type AgentStatusResponse = {
  status: AgentStatus;
  user: { name: string; phone: string };
  agent: AgentInfo | null;
};

export const getAgentStatus = () =>
  authRequest("/agent/status") as Promise<AgentStatusResponse>;

export const submitAgent = (nama_lengkap: string) =>
  authRequest("/agent/submit", { method: "POST", body: { nama_lengkap } });

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

export const getPengajuan = (page: number) =>
  authRequest(`/pengajuan?page=${page}`) as Promise<PengajuanPage>;
