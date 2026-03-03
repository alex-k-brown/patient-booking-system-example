import { Router } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db } from "../db";
import { patients } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
  const { name, email, id, phone } = req.query;
  const emailLower =
    typeof email === "string" ? email.toLowerCase() : undefined;
  const phoneSanitized =
    typeof phone === "string" ? phone.replace(/[\s.\-()\s]/g, "") : undefined;

  try {
    const result = await db
      .select()
      .from(patients)
      .where(
        or(
          name ? ilike(patients.name, name as string) : undefined,
          emailLower ? eq(patients.email, emailLower) : undefined,
          id ? eq(patients.id, id as string) : undefined,
          phoneSanitized ? eq(patients.phone, phoneSanitized) : undefined,
        ),
      );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

export default router;
