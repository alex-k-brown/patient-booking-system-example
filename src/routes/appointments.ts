import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import {
  appointments,
  appointmentStatusEnum,
  appointmentTypeEnum,
  patients,
} from "../db/schema";

const VALID_STATUSES = appointmentStatusEnum.enumValues;
const VALID_TYPES = appointmentTypeEnum.enumValues;
const HOURS_BEFORE_BOOKING = 2;

const router = Router();

router.get("/", async (req, res) => {
  const { id, status, type, virtual, providerId, patientId } = req.query;
  if (
    status !== undefined &&
    !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
  ) {
    res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    });
    return;
  }

  if (
    type !== undefined &&
    !VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])
  ) {
    res.status(400).json({
      error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`,
    });
    return;
  }

  try {
    const result = await db
      .select()
      .from(appointments)
      .where(
        and(
          id ? eq(appointments.id, id as string) : undefined,
          status
            ? eq(appointments.status, status as (typeof VALID_STATUSES)[number])
            : undefined,
          type
            ? eq(appointments.type, type as (typeof VALID_TYPES)[number])
            : undefined,
          virtual !== undefined
            ? eq(appointments.virtual, virtual === "true")
            : undefined,
          providerId
            ? eq(appointments.providerId, providerId as string)
            : undefined,
          patientId
            ? eq(appointments.patientId, patientId as string)
            : undefined,
        ),
      );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

router.patch("/select/:id", async (req, res) => {
  const { patientId } = req.body;

  const appointment = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, req.params.id));

  const appointmentTime = appointment[0]?.datetime.getTime();
  const bookingDeadline = appointmentTime
    ? appointmentTime - HOURS_BEFORE_BOOKING * 60 * 60 * 1000
    : undefined;

  if (appointment.length === 0) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  if (appointment[0]?.status !== "available") {
    res
      .status(400)
      .json({ error: "Only available appointments can be selected" });
    return;
  }

  if (bookingDeadline && Date.now() > bookingDeadline) {
    res.status(409).json({
      error: `Appointments must be selected at least ${HOURS_BEFORE_BOOKING} hours in advance`,
    });
    return;
  }

  const patient = await db
    .select()
    .from(patients)
    .where(eq(patients.id, patientId));

  if (patient.length === 0) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  try {
    const updated = await db
      .update(appointments)
      .set({
        patientId,
        status: "selected",
        selectedAt: new Date(),
      })
      .where(eq(appointments.id, req.params.id))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to select appointment" });
  }
});

router.patch("/book/:id", async (req, res) => {
  const { patientId } = req.body;

  const appointment = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, req.params.id));

  const appointmentTime = appointment[0]?.datetime.getTime();
  const bookingDeadline = appointmentTime
    ? appointmentTime - HOURS_BEFORE_BOOKING * 60 * 60 * 1000
    : undefined;

  if (appointment.length === 0) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  if (
    appointment[0]?.status !== "available" &&
    appointment[0]?.status !== "selected"
  ) {
    res.status(400).json({ error: "Appointment is not available" });
    return;
  }

  if (
    appointment[0]?.status === "selected" &&
    appointment[0]?.patientId !== patientId
  ) {
    res
      .status(400)
      .json({ error: "Appointment is selected by another patient" });
    return;
  }

  if (bookingDeadline && Date.now() > bookingDeadline) {
    res.status(409).json({
      error: `Appointments must be booked at least ${HOURS_BEFORE_BOOKING} hours in advance`,
    });
    return;
  }

  const patient = await db
    .select()
    .from(patients)
    .where(eq(patients.id, patientId));

  if (patient.length === 0) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  try {
    const updated = await db
      .update(appointments)
      .set({
        patientId,
        status: "scheduled",
        selectedAt: null,
      })
      .where(eq(appointments.id, req.params.id))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

router.patch("/cancel/:id", async (req, res) => {
  const appointment = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, req.params.id));

  const appointmentTime = appointment[0]?.datetime.getTime();
  const cancelDeadline = appointmentTime
    ? appointmentTime - HOURS_BEFORE_BOOKING * 60 * 60 * 1000
    : undefined;

  if (appointment.length === 0) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  if (
    appointment[0]?.status !== "scheduled" &&
    appointment[0]?.status !== "selected"
  ) {
    res.status(400).json({
      error:
        "Only uncompleted scheduled or selected ppointments can be cancelled",
    });
    return;
  }

  if (appointmentTime && cancelDeadline && Date.now() > cancelDeadline) {
    res.status(409).json({
      error: `Appointments must be cancelled at least ${HOURS_BEFORE_BOOKING} hours in advance`,
    });
    return;
  }

  try {
    const updated = await db
      .update(appointments)
      .set({
        patientId: null,
        status: "available",
      })
      .where(eq(appointments.id, req.params.id))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

export default router;
