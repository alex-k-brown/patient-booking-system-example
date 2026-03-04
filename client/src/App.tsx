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

  const isLoading = isProvidersLoading || isAppointmentsLoading;
  const error = providersError || appointmentsError;

  return (
    <>
      <div>
        <div className="sticky top-0 flex flex-col items-center gap-2 py-4 bg-background z-10 opacity-95">
          <h1>Appointment Scheduler</h1>
          <Input
            placeholder="Search for doctors or specialties"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4">
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
