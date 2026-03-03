import { Router } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db } from "../db";
import { providers } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
  const { search, id } = req.query;

  try {
    const result = await db
      .select()
      .from(providers)
      .where(
        or(
          search
            ? or(
                ilike(providers.name, `%${search}%`),
                ilike(providers.specialty, `%${search}%`),
              )
            : undefined,
          id ? eq(providers.id, id as string) : undefined,
        ),
      );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
});

export default router;
