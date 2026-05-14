export interface AckResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface JoinPollPayload {
  pollId: string;
}

export interface LeavePollPayload {
  pollId: string;
}

export interface LeaderboardRequestPayload {
  pollId: string;
}
