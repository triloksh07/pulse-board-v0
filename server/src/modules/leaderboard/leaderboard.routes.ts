import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { show } from "./leaderboard.controller.js";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
const schema = z.object({ params: z.object({ pollId: objectId }) });

const router = Router();

router.get("/:pollId", requireAuth, validate(schema), show);

export default router;
