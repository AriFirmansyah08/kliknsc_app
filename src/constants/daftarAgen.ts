export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "date"
  | "choice"
  | "checkbox"
  | "photo";
export type FormValues = Record<string, string>;
export const DRAFT_KEY = "draft_daftar_agen";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  lowercase?: boolean;
  showIf?: (v: FormValues) => boolean;
  validate?: (v: string) => string | null;
};

export type StepDef = {
  title: string;
  desc: string;
  fields: FieldDef[];
};

export const emptyValues: FormValues = {};

/* ---------- aturan validasi ---------- */

const nikRule = (v: string) =>
  /^\d{15,17}$/.test(v) ? null : "NIK harus 15 sampai 17 digit angka";

const emailRule = (v: string) =>
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v)
    ? null
    : "Format email tidak valid";

const alamatRule = (v: string) =>
  v.trim().split(/\s+/).filter(Boolean).length >= 5
    ? null
    : "Alamat minimal 5 kata";

const rt3Rule = (label: string) => (v: string) =>
  /^\d{3}$/.test(v) ? null : `${label} harus 3 angka`;

const npwpRule = (v: string) =>
  /^\d{15}$/.test(v) ? null : "Nomor NPWP harus 15 digit angka";

/* ---------- langkah ---------- */

export const DAFTAR_STEPS: StepDef[] = [
  {
    title: "Verifikasi awal",
    desc: "Isi data dasar untuk mulai mendaftar sebagai agen.",
    fields: [
      {
        key: "jenisAgen",
        label: "Jenis agen",
        type: "select",
        options: ["Perorangan"],
        required: true,
      },
      {
        key: "nip",
        label: "NIP referensi",
        type: "number",
        required: true,
        hint: "Tanyakan NIP ke KBA kamu.",
      },
      {
        key: "nik",
        label: "NIK",
        type: "number",
        required: true,
        maxLength: 17,
        validate: nikRule,
      },
    ],
  },
  {
    title: "Data diri",
    desc: "Isi sesuai KTP.",
    fields: [
      {
        key: "namaLengkap",
        label: "Nama lengkap",
        type: "text",
        required: true,
      },
      { key: "kotaLahir", label: "Kota lahir", type: "text", required: true },
      {
        key: "tanggalLahir",
        label: "Tanggal lahir",
        type: "date",
        required: true,
      },
      {
        key: "jenisKelamin",
        label: "Jenis kelamin",
        type: "choice",
        options: ["Laki-laki", "Perempuan"],
        required: true,
      },
      {
        key: "golDarah",
        label: "Golongan darah",
        type: "select",
        options: ["O", "A", "B", "AB"],
        required: true,
      },
      {
        key: "kewarganegaraan",
        label: "Warga negara",
        type: "select",
        options: ["WNI", "WNA"],
        required: true,
      },
      {
        key: "agama",
        label: "Agama",
        type: "select",
        options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"],
        required: true,
      },
      {
        key: "statusKawin",
        label: "Status perkawinan",
        type: "select",
        options: ["Belum kawin", "Kawin", "Cerai hidup", "Cerai mati"],
        required: true,
      },
      {
        key: "email",
        label: "Email (opsional)",
        type: "text",
        placeholder: "nama@email.com",
        lowercase: true,
        validate: emailRule,
      },
    ],
  },
  {
    title: "Alamat",
    desc: "Alamat tempat tinggal sesuai KTP.",
    fields: [
      {
        key: "alamat",
        label: "Alamat lengkap",
        type: "textarea",
        required: true,
        validate: alamatRule,
      },
      {
        key: "rt",
        label: "RT",
        type: "number",
        required: true,
        maxLength: 3,
        validate: rt3Rule("RT"),
      },
      {
        key: "rw",
        label: "RW",
        type: "number",
        required: true,
        maxLength: 3,
        validate: rt3Rule("RW"),
      },
      {
        key: "provinsi",
        label: "Provinsi",
        type: "select",
        options: ["Jawa Barat", "DKI Jakarta", "Jawa Tengah", "Jawa Timur"],
        required: true,
      },
      {
        key: "kota",
        label: "Kota / kabupaten",
        type: "select",
        options: ["Kota Bandung", "Kabupaten Bandung"],
        required: true,
      },
      {
        key: "kecamatan",
        label: "Kecamatan",
        type: "select",
        options: ["Coblong", "Cicendo", "Sukajadi"],
        required: true,
      },
      {
        key: "kelurahan",
        label: "Kelurahan / desa",
        type: "select",
        options: ["Dago", "Lebakgede", "Cipaganti"],
        required: true,
      },
      {
        key: "kodePos",
        label: "Kode pos",
        type: "number",
        required: true,
        hint: "Terisi otomatis dari kelurahan. Ubah jika tidak sesuai.",
      },
    ],
  },
  {
    title: "NPWP & rekening",
    desc: "Komisi ditransfer ke rekening ini setiap hari.",
    fields: [
      {
        key: "punyaNpwp",
        label: "Punya NPWP?",
        type: "choice",
        options: ["Ya", "Tidak"],
        required: true,
      },
      {
        key: "nomorNpwp",
        label: "Nomor NPWP",
        type: "number",
        required: true,
        maxLength: 15,
        validate: npwpRule,
        showIf: (v) => v.punyaNpwp === "Ya",
      },
      {
        key: "bank",
        label: "Bank",
        type: "select",
        options: ["BRI", "BCA", "Mandiri", "BNI"],
        required: true,
      },
      {
        key: "nomorRekening",
        label: "Nomor rekening",
        type: "number",
        required: true,
      },
      {
        key: "namaRekening",
        label: "Nama sesuai buku tabungan",
        type: "text",
        required: true,
      },
    ],
  },
  {
    title: "Pekerjaan",
    desc: "Ceritakan sedikit tentang pekerjaan kamu.",
    fields: [
      {
        key: "pekerjaan",
        label: "Pekerjaan",
        type: "select",
        options: ["Wiraswasta", "Karyawan", "Pelajar", "Lainnya"],
        required: true,
      },
      {
        key: "subPekerjaan",
        label: "Sub pekerjaan",
        type: "select",
        options: ["Pedagang", "Jasa", "Lainnya"],
        required: true,
      },
      {
        key: "pernahOtomotif",
        label: "Pernah jadi agen otomotif atau finance?",
        type: "choice",
        options: ["Ya", "Tidak"],
        required: true,
      },
      {
        key: "unitPerBulan",
        label: "Sebulan pernah jual berapa unit?",
        type: "number",
        required: true,
        showIf: (v) => v.pernahOtomotif === "Ya",
      },
      {
        key: "tahuDari",
        label: "Tahu KlikNSC dari mana?",
        type: "select",
        options: ["Teman atau keluarga", "Media sosial", "Iklan", "Lainnya"],
        required: true,
      },
    ],
  },
  {
    title: "Dokumen",
    desc: "Kami perlu foto KTP dan selfie kamu untuk memastikan pendaftaran ini benar milikmu.",
    fields: [
      {
        key: "consent",
        label: "Persetujuan",
        type: "checkbox",
        required: true,
      },
      { key: "fotoKtp", label: "Foto KTP", type: "photo", required: true },
      { key: "selfie", label: "Selfie", type: "photo", required: true },
    ],
  },
];

export const DOC_STEP = DAFTAR_STEPS.length - 1;
export const REVIEW_STEP = DAFTAR_STEPS.length;

/** Field yang tampil sesuai isian lain (mis. NPWP hanya jika punya). */
export const visibleFields = (step: StepDef, values: FormValues) =>
  step.fields.filter((f) => !f.showIf || f.showIf(values));
