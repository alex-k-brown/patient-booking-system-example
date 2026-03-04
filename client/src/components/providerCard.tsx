import { Card, CardContent, CardHeader } from "./ui/card";
import type { Appointment, Provider } from "@/types";
import AppointmentsTable from "./appointmentsTable";

interface ProviderCardProps {
  appointments?: Record<string, Appointment[]>;
  provider: Provider;
}

function ProviderCard({ provider, appointments }: ProviderCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2>{provider.name}</h2>
        <h3>{provider.specialty}</h3>
      </CardHeader>
      <CardContent>
        {!appointments || Object.keys(appointments).length === 0 ? (
          <p>No available appointments</p>
        ) : (
          <AppointmentsTable appointments={appointments} />
        )}
      </CardContent>
    </Card>
  );
}

export default ProviderCard;
