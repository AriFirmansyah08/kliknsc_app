import { DRAFT_KEY } from "@/constants/daftarAgen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const EXPIRES_KEY = "auth_expires_at";

export async function saveSession(token: string, expiresInSeconds: number) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(
    EXPIRES_KEY,
    String(Date.now() + expiresInSeconds * 1000),
  );
}

// Mengembalikan null kalau tidak ada token atau sudah lewat 5 menit
export async function getSession(): Promise<{
  token: string;
  expiresAt: number;
} | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const expiresAt = Number(await SecureStore.getItemAsync(EXPIRES_KEY));

  if (!token || !expiresAt || Date.now() >= expiresAt) {
    await clearSession();
    return null;
  }
  return { token, expiresAt };
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(EXPIRES_KEY);
  await AsyncStorage.removeItem(DRAFT_KEY); // draf ikut terhapus saat logout
}
