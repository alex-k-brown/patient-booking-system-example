import { Card } from "./ui/card";
import type { Appointment, Provider } from "@/types";
import AppointmentsTable from "./appointmentsTable";

interface ProviderCardProps {
  appointments?: Record<string, Appointment[]>;
  provider: Provider;
}

function ProviderCard({ provider, appointments }: ProviderCardProps) {
  return (
    <Card key={provider.id}>
      <h2>{provider.name}</h2>
      <h3>{provider.specialty}</h3>
      <AppointmentsTable appointments={appointments} />
    </Card>
  );
}

export default ProviderCard;
