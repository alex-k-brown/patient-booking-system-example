export interface Provider {
  id: string;
  name: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  time: string; // "09:00", "10:00", etc.
  reason: string;
  createdAt: string; // ISO timestamp
}

export interface CreateAppointmentRequest {
  patientName: string;
  email: string;
  phone: string;
  providerId: string;
  date: string;
  time: string;
  reason: string;
}
