import { authRequest } from "./auth";

export type PengajuanM2wInput = {
  nik: string;
  namaLengkap: string;
  noHp: string;
  alamat: string;
  rt: string;
  rw: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  sumberPk: string;
  pilSumber: string;
};

export function kirimPengajuanM2w(input: PengajuanM2wInput) {
  return authRequest("/pengajuan/m2w", { method: "POST", body: input });
}
