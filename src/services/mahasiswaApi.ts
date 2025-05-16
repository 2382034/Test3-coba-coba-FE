// src/services/mahasiswaApi.ts (Assuming this is your file structure)
import axios from 'axios';
import { FindMahasiswaQueryDto, Mahasiswa, PaginatedMahasiswaResponse, Prodi } from '../types/mahasiswa'; // Adjust path as needed

// IMPORTANT: Configure your API base URL
// If your NestJS backend runs on http://localhost:3000
// And your DataController has @Controller('data')
// And you are NOT using a global prefix like app.setGlobalPrefix('api') in main.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // Default for local dev

// If you set app.setGlobalPrefix('api') in NestJS main.ts:
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // You might want to include headers for authentication if needed
  // headers: {
  //   'Authorization': `Bearer ${localStorage.getItem('token')}`
  // }
});

// Interceptors can be useful for global error handling or token refresh
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle global errors, e.g., unauthorized, network errors
    console.error('API call error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export const fetchMahasiswaList = async (
  params: FindMahasiswaQueryDto
): Promise<PaginatedMahasiswaResponse> => {
  // The path here is appended to API_BASE_URL.
  // If API_BASE_URL is 'http://localhost:3000' and controller is @Controller('data'),
  // then path should be '/data/mahasiswa'
  const response = await apiClient.get('/data/mahasiswa', { params });
  return response.data; // NestJS controller returns { data, count, currentPage, totalPages }
};

export const fetchProdiList = async (): Promise<Prodi[]> => {
  const response = await apiClient.get('/data/prodi');
  return response.data; // NestJS controller returns Prodi[]
};

export const deleteMahasiswa = async (id: number): Promise<void> => {
  await apiClient.delete(`/data/mahasiswa/${id}`);
};

// Function to get the photo URL
// If mahasiswa.foto from backend ALREADY contains the full Vercel Blob URL, this is simple:
export const getMahasiswaFotoUrl = (fotoUrl: string | null | undefined): string | undefined => {
  if (fotoUrl) {
    return fotoUrl; // Assuming fotoUrl is already the complete public URL from Vercel Blob
  }
  return undefined; // Or return a placeholder URL string
};

// Other API functions (create, update, findOne, uploadFoto) would go here
// Example for fetching a single mahasiswa
export const fetchMahasiswaById = async (id: number): Promise<Mahasiswa> => {
  const response = await apiClient.get(`/data/mahasiswa/${id}`);
  return response.data;
};

// Example for creating mahasiswa
export const createMahasiswa = async (mahasiswaData: any): Promise<Mahasiswa> => { // Use CreateMahasiswaDto type
  const response = await apiClient.post('/data/mahasiswa', mahasiswaData);
  return response.data;
};

// Example for updating mahasiswa
export const updateMahasiswa = async (id: number, mahasiswaData: any): Promise<Mahasiswa> => { // Use UpdateMahasiswaDto type
  const response = await apiClient.patch(`/data/mahasiswa/${id}`, mahasiswaData);
  return response.data;
};

// Example for uploading foto
export const uploadMahasiswaFoto = async (id: number, formData: FormData): Promise<Mahasiswa> => {
  const response = await apiClient.post(`/data/mahasiswa/${id}/foto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
