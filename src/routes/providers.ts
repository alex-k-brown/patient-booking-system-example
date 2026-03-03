import { Router } from "express";
import { db } from "../db";
import { providers } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.select().from(providers);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
});

export default router;
