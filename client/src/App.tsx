import { useState } from "react";
import "./App.css";
import { Input } from "./components/ui/input";
import { useProviders } from "./hooks/useProviders";
import { useAppointments } from "./hooks/useAppointments";
import ProviderCard from "./components/providerCard";

function App() {
  const [search, setSearch] = useState("");
  const {
    data: providers,
    isLoading: isProvidersLoading,
    error: providersError,
  } = useProviders(search);

  const {
    grouped: groupedAppointments,
    isLoading: isAppointmentsLoading,
    error: appointmentsError,
  } = useAppointments("available");

  console.log("Grouped Appointments:", groupedAppointments);
  const isLoading = isProvidersLoading || isAppointmentsLoading;
  const error = providersError || appointmentsError;

  return (
    <>
      <div>
        <h1>Appointment Scheduler</h1>
        <Input
          placeholder="Search for doctors or specialties"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {providers?.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              appointments={groupedAppointments?.[provider.id]}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
