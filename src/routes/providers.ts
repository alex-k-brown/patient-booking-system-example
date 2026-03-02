import { Router } from "express";
import type { Provider } from "../types";
import mockData from "../data/mockData.json";

const router = Router();

const providers: Provider[] = mockData.providers;

router.get("/", (req, res) => {
  res.json(providers);
});

export default router;
