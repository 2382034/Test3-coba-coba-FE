// src/services/mahasiswaApi.ts
import axios from 'axios';
import {
  CreateMahasiswaDto,
  UpdateMahasiswaDto,
  FindMahasiswaQueryDto,
  Prodi,
  Mahasiswa,
  PaginatedMahasiswaResponse,
} from '../types/mahasiswa';

// VITE_API_URL sekarang diharapkan sudah mengandung /api dari backend
// Contoh: https://test3-coba-coba-be.vercel.app/api
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Jika VITE_API_URL tidak disetel (misalnya di dev lokal tanpa .env),
// Anda mungkin ingin fallback yang juga menyertakan /api
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Periksa apakah API_BASE_URL ada, jika tidak, ini akan jadi masalah besar
if (!API_BASE_URL) {
  console.error("FATAL ERROR: VITE_API_URL is not defined! Backend calls will fail.");
  // Anda bisa melempar error di sini agar lebih jelas saat pengembangan
  // throw new Error("VITE_API_URL is not defined!");
}

const apiClient = axios.create({
  // Sekarang API_BASE_URL sudah berisi https://domain-backend/api
  // jadi kita hanya perlu menambahkan /data (untuk @Controller('data'))
  baseURL: `${API_BASE_URL}/data`,
});

// --- Prodi API ---
export const fetchProdiList = async (): Promise<Prodi[]> => {
  // Akan menjadi: GET https://domain-backend/api/data/prodi
  const response = await apiClient.get<Prodi[]>('/prodi');
  return response.data;
};

// --- Mahasiswa API ---
export const fetchMahasiswaList = async (query: FindMahasiswaQueryDto): Promise<PaginatedMahasiswaResponse> => {
  // Akan menjadi: GET https://domain-backend/api/data/mahasiswa?params...
  const response = await apiClient.get<PaginatedMahasiswaResponse>('/mahasiswa', { params: query });
  return response.data;
};

export const fetchMahasiswaById = async (id: number): Promise<Mahasiswa> => {
  // Akan menjadi: GET https://domain-backend/api/data/mahasiswa/ID
  const response = await apiClient.get<Mahasiswa>(`/mahasiswa/${id}`);
  return response.data;
};

export const createMahasiswa = async (data: CreateMahasiswaDto): Promise<Mahasiswa> => {
  const response = await apiClient.post<Mahasiswa>('/mahasiswa', data);
  return response.data;
};

export const updateMahasiswa = async (id: number, data: UpdateMahasiswaDto): Promise<Mahasiswa> => {
  const response = await apiClient.patch<Mahasiswa>(`/mahasiswa/${id}`, data);
  return response.data;
};

export const deleteMahasiswa = async (id: number): Promise<void> => {
  await apiClient.delete(`/mahasiswa/${id}`);
};

export const uploadMahasiswaFoto = async (id: number, foto: File): Promise<Mahasiswa> => {
  const formData = new FormData();
  formData.append('foto', foto);
  // Akan menjadi: POST https://domain-backend/api/data/mahasiswa/ID/foto
  const response = await apiClient.post<Mahasiswa>(`/mahasiswa/${id}/foto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Utility untuk getMahasiswaFotoUrl:
// Jika mahasiswa.foto dari backend adalah URL LENGKAP dari Vercel Blob,
// maka fungsi ini seharusnya hanya mengembalikan URL tersebut.
// Jika mahasiswa.foto adalah NAMA FILE saja, dan Anda ingin membangun URL
// berdasarkan API_BASE_URL (yang sekarang https://domain/api), ini mungkin tidak benar
// untuk file statis yang mungkin tidak disajikan melalui /api.
//
// ASUMSI: mahasiswa.foto dari backend adalah URL LENGKAP dari Vercel Blob
export const getMahasiswaFotoUrl = (fotoUrlLengkap: string | null | undefined): string | undefined => {
  return fotoUrlLengkap || undefined; // Atau URL placeholder
};

/*
// Jika mahasiswa.foto HANYA nama file dan Anda ingin membangunnya dari URL dasar NON-API
// Anda mungkin memerlukan variabel lingkungan terpisah untuk URL dasar file statis
const STATIC_FILES_BASE_URL = import.meta.env.VITE_STATIC_FILES_URL || 'https://test3-coba-coba-be.vercel.app'; // Tanpa /api
export const getMahasiswaFotoUrl_JikaNamaFile = (filename: string | null | undefined): string | undefined => {
  if (!filename) return undefined;
  return `${STATIC_FILES_BASE_URL}/uploads/mahasiswa-fotos/${filename}`; // Misal jika Anda punya route statis
};
*/
