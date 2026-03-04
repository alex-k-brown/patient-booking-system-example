export interface Provider {
  id: string;
  name: string;
  specialty: string;
}

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "available"
  | "selected";

export type AppointmentType = "wellness" | "sick" | "follow-up";

export interface Appointment {
  id: string;
  patientId: string | null;
  providerId: string;
  datetime: Date;
  reason: string;
  status: AppointmentStatus;
  type: AppointmentType;
  virtual: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
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
