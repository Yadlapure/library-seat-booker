import apiClient from './client';

// Auth
export const registerUser = (data: { name: string; email: string; password: string }) =>
  apiClient.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  apiClient.post('/auth/login', data);

// Libraries
export const searchLibraries = (lat: number, lng: number) =>
  apiClient.get(`/search/libraries/nearby?lat=${lat}&lng=${lng}`);

// Floors
export const getFloors = (libraryId: string) =>
  apiClient.get(`/floors/${libraryId}`);

// Seats
export const getSeatLayout = (floorId: string) =>
  apiClient.get(`/seats/layout/${floorId}`);

// Bookings
export const createBooking = (data: {
  user_id: string;
  library_id: string;
  floor_id: string;
  seat_id: string;
  start_time: string;
  end_time: string;
}) => apiClient.post('/bookings/', data);

export const getUserBookings = (userId: string) =>
  apiClient.get(`/bookings/user/${userId}`);

export const cancelBooking = (bookingId: string) =>
  apiClient.delete(`/bookings/${bookingId}`);

// Payment
export const createPayment = (data: any) =>
  apiClient.post('/payment/create', data);

export const confirmPayment = (data: any) =>
  apiClient.post('/payment/confirm', data);

// QR
export const getQRCode = (bookingId: string) =>
  apiClient.get(`/qr/booking/${bookingId}`);

// Analytics
export const getAnalytics = (libraryId: string) =>
  apiClient.get(`/analytics/library/${libraryId}`);
