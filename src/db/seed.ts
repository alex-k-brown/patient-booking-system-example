import "dotenv/config";
import { db } from "./index";
import { providers, patients, appointments } from "./schema";
import mockData from "../data/mockData.json";

async function seed() {
  console.log("Seeding database...");

  await db.insert(providers).values(mockData.providers).onConflictDoNothing();
  console.log("Providers inserted.");

  await db.insert(patients).values(mockData.patients).onConflictDoNothing();
  console.log("Patients inserted.");

  const appointmentValues = mockData.appointments.map((appt) => ({
    id: appt.id,
    patientId: appt.patientId,
    providerId: appt.providerId,
    datetime: new Date(appt.datetime),
    reason: appt.reason,
    status: appt.status as "scheduled" | "completed" | "available",
    type: appt.type as "wellness" | "sick" | "follow-up",
    virtual: appt.virtual,
  }));

  await db.insert(appointments).values(appointmentValues).onConflictDoNothing();
  console.log("Appointments inserted.");

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
