export interface Provider {
  id: string;
  name: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  patientId: string | null;
  providerId: string;
  datetime: Date;
  reason: string;
  status: "scheduled" | "completed" | "available";
  type: "wellness" | "sick" | "follow-up";
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
