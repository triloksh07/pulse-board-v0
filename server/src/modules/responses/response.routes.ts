import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { create, index } from "./response.controller.js";
import { pollIdSchema, submitResponseSchema } from "./response.validation.js";

const router = Router();

router.post("/:pollId", optionalAuth, validate(submitResponseSchema), create);
router.get("/:pollId", requireAuth, validate(pollIdSchema), index);

export default router;