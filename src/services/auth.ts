import { router } from "expo-router";
import { clearSession, getSession, saveSession } from "./session";
//export const API_URL = "http://192.168.1.13:8000/api";
export const API_URL = "http://10.117.190.84:8000/api";
// export const API_URL = "http://172.26.86.65:8000/api";

const SESSION_EXPIRED = "SESSION_EXPIRED";

export function isSessionExpired(e: unknown) {
  return (e as Error)?.message === SESSION_EXPIRED;
}

async function forceLogout() {
  await clearSession();
  router.replace("/login");
}

async function post(path: string, body: object, fallbackError: string) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err: any = new Error(data.message ?? fallbackError);
    err.status = res.status;
    throw err;
  }
  return data;
}

// Dipakai semua request yang butuh login (termasuk service lain)
export async function authRequest(
  path: string,
  options: { method?: "GET" | "POST"; body?: object } = {},
) {
  const session = await getSession(); // null kalau sudah lewat 5 menit
  if (!session) {
    await forceLogout();
    throw new Error(SESSION_EXPIRED);
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    await forceLogout();
    throw new Error(SESSION_EXPIRED);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Terjadi kesalahan");
  return data;
}

export async function login(phone: string, password: string) {
  const data = await post(
    "/login",
    { phone, password },
    "Nomor HP atau password salah",
  );
  await saveSession(data.token, data.expires_in);
  return data;
}

export function requestOtp(
  phone: string,
  mode: "register" | "reset",
  channel: "whatsapp" | "sms" = "whatsapp",
) {
  return post("/otp/request", { phone, mode, channel }, "Gagal mengirim kode");
}

export function verifyOtp(
  phone: string,
  otp: string,
  mode: "register" | "reset",
) {
  return post("/otp/verify", { phone, otp, mode }, "Kode OTP tidak valid");
}

export async function registerUser(
  phone: string,
  password: string,
  otp: string,
) {
  const data = await post(
    "/register",
    { phone, password, otp },
    "Gagal membuat akun",
  );
  await saveSession(data.token, data.expires_in);
  return data;
}

export function resetPassword(phone: string, otp: string, password: string) {
  return post(
    "/password/reset",
    { phone, otp, password },
    "Gagal menyimpan password",
  );
}

export function cekNoTelpAgen(noTelp: string): Promise<{ ada: boolean }> {
  return post("/agent/cek-nomor", { no_telp: noTelp }, "Gagal mengecek nomor");
}

export async function verifikasiAgen(
  phone: string,
  nik: string,
  password: string,
) {
  const data = await post(
    "/agent/verifikasi",
    { no_telp: phone, nik, password },
    "Verifikasi gagal",
  );
  if (data.token) await saveSession(data.token, data.expires_in);
  return data;
}

export function changePassword(currentPassword: string, password: string) {
  return authRequest("/password/change", {
    method: "POST",
    body: { current_password: currentPassword, password },
  });
}

export async function logout() {
  try {
    await authRequest("/logout", { method: "POST" });
  } catch {
    // Token sudah habis, tidak apa-apa. Lanjut hapus lokal.
  }
  await forceLogout();
}
