import { useState } from "react";
import "./App.css";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { useProviders } from "./hooks/useProviders";

function App() {
  const [search, setSearch] = useState("");
  const { data: providers, isLoading, error } = useProviders(search);

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
            <Card key={provider.id}>
              <h2>{provider.name}</h2>
              <h3>{provider.specialty}</h3>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
