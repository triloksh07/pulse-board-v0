import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createPollSchema,
  pollIdSchema,
  shareCodeSchema,
  updatePollSchema,
} from "./poll.validation.js";
import {
  create,
  destroy,
  index,
  publish,
  show,
  showByShareCode,
  update,
} from "./poll.controller.js";

const router = Router();

router.get("/", requireAuth, index);
router.post("/", requireAuth, validate(createPollSchema), create);
router.get("/share/:shareCode", validate(shareCodeSchema), showByShareCode);
router.get("/:id", requireAuth, validate(pollIdSchema), show);
router.patch("/:id", requireAuth, validate(updatePollSchema), update);
router.delete("/:id", requireAuth, validate(pollIdSchema), destroy);
router.patch("/:id/publish", requireAuth, validate(pollIdSchema), publish);

export default router;
