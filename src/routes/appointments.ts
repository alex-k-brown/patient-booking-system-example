import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { appointments, appointmentStatusEnum } from "../db/schema";

const VALID_STATUSES = appointmentStatusEnum.enumValues;

const router = Router();

router.get("/", async (req, res) => {
  const { status, providerId } = req.query;
  if (
    status !== undefined &&
    !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
  ) {
    res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
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
          providerId
            ? eq(appointments.providerId, providerId as string)
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
