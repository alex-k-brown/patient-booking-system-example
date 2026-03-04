import { Router } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "../db";
import { patients } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
  const { name, email, id, phone } = req.query;
  const emailLower =
    typeof email === "string" ? email.toLowerCase() : undefined;
  const phoneSanitized =
    typeof phone === "string" ? phone.replace(/[\s.\-()]/g, "") : undefined;

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

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Name, email, and phone are required" });
    return;
  }

  const newPatient = {
    id: randomUUID(),
    name,
    email: email.toLowerCase(),
    phone: phone.replace(/[\s.\-()]/g, ""),
  };

  try {
    const result = await db.insert(patients).values(newPatient).returning();

    res.status(201).json(result[0]);
  } catch (err) {
    const pgCode =
      (err as { code?: string }).code ??
      (err as { cause?: { code?: string } }).cause?.code;
    if (pgCode === "23505") {
      res
        .status(400)
        .json({ error: "A patient with that email or phone already exists" });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db
      .delete(patients)
      .where(eq(patients.id, req.params.id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.status(200).json(deleted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});

export default router;
