import { Request, Response as ExpressResponse } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { emitResponseCountUpdated } from "../../sockets/emitters/poll.emitters.js";
import { getResponsesForPoll, submitResponse } from "./response.service.js";
import { Response as ResponseModel } from "./response.model.js";

export const create = asyncHandler(
  async (req: Request, res: ExpressResponse) => {
    const pollId = req.params.pollId as string;
    const response = await submitResponse(pollId, req.body, req.user);
    const io = req.app.get("io");
    const totalResponses = await ResponseModel.countDocuments({ pollId });

    await emitResponseCountUpdated(io, pollId, totalResponses);
    res.status(201).json({ response });
  }
);

export const index = asyncHandler(
  async (req: Request, res: ExpressResponse) => {
    res.json({
      responses: await getResponsesForPoll(
        req.params.pollId as string,
        req.user._id
      ),
    });
  }
);
