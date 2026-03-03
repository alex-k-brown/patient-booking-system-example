import { Router } from "express";
import { db } from "../db";
import { patients } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.select().from(patients);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

export default router;
