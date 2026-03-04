import { useQuery } from "@tanstack/react-query";

interface Provider {
  id: string;
  name: string;
  specialty: string;
}

async function fetchProviders(search: string): Promise<Provider[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`/api/providers${params}`);
  if (!res.ok) throw new Error("Failed to fetch providers");
  return res.json();
}

export function useProviders(search: string) {
  return useQuery({
    queryKey: ["providers", search],
    queryFn: () => fetchProviders(search),
  });
}
