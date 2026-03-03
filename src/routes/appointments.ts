import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import {
  appointments,
  appointmentStatusEnum,
  appointmentTypeEnum,
} from "../db/schema";

const VALID_STATUSES = appointmentStatusEnum.enumValues;
const VALID_TYPES = appointmentTypeEnum.enumValues;

const router = Router();

router.get("/", async (req, res) => {
  const { status, type, virtual, providerId, patientId } = req.query;
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

export default router;
