import "dotenv/config";
import express from "express";
import providersRouter from "./routes/providers";
import appointmentsRouter from "./routes/appointments";
import patientsRouter from "./routes/patients";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/providers", providersRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/patients", patientsRouter);

app.get("/", (req, res) => {
  res.send("Patient Booking API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
