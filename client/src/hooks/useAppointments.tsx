import { useQuery } from "@tanstack/react-query";
import type { Appointment, AppointmentStatus } from "@/types";
import { useMemo } from "react";

async function fetchAppointments(
  status: AppointmentStatus,
): Promise<Appointment[]> {
  const params = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`/api/appointments${params}`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export function useAppointments(status: AppointmentStatus) {
  const query = useQuery({
    queryKey: ["appointments", status],
    queryFn: () => fetchAppointments(status),
  });

  const grouped = useMemo(() => {
    if (!query.data) return {};
    return query.data.reduce<Record<string, Record<string, Appointment[]>>>(
      (acc, appt) => {
        const day = new Date(appt.datetime).toLocaleDateString();
        acc[appt.providerId] ??= {};
        acc[appt.providerId][day] ??= [];
        acc[appt.providerId][day].push(appt);
        return acc;
      },
      {},
    );
  }, [query.data]);

  return { ...query, grouped };
}
