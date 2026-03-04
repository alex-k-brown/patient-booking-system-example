import "dotenv/config";
import express from "express";
import { and, eq, lt } from "drizzle-orm";
import providersRouter from "./routes/providers";
import appointmentsRouter from "./routes/appointments";
import patientsRouter from "./routes/patients";
import { appointments } from "./db/schema";
import { db } from "./db";

const app = express();
const PORT = process.env["PORT"] ? Number(process.env["PORT"]) : 3000;

app.use(express.json());
app.use("/api/providers", providersRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/patients", patientsRouter);

app.get("/", (req, res) => {
  res.send("Patient Booking API");
});

setInterval(async () => {
  const cutoff = new Date(Date.now() - 2 * 60 * 1000);
  try {
    await db
      .update(appointments)
      .set({ status: "available", selectedAt: null, patientId: null })
      .where(
        and(
          eq(appointments.status, "selected"),
          lt(appointments.selectedAt, cutoff),
        ),
      );
  } catch (err) {
    console.error("Failed to reset expired selections:", err);
  }
}, 30 * 1000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
