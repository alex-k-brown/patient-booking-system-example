import express from "express";
import providersRouter from "./routes/providers";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/providers", providersRouter);

app.get("/", (req, res) => {
  res.send("Patient Booking API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
