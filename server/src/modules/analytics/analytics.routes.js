import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { z } from "zod";
import { show, showPublic } from "./analytics.controller.js";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
const schema = z.object({ params: z.object({ pollId: objectId }) });

const router = Router();

router.get("/:pollId", requireAuth, validate(schema), show);
router.get("/:pollId/public", validate(schema), showPublic);

export default router;
