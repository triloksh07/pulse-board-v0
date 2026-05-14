export const SOCKET_EVENTS = {
  // poll lifecycle
  POLL_JOIN: "poll:join",
  POLL_LEAVE: "poll:leave",
  POLL_PUBLISHED: "poll:published",
  POLL_EXPIRED: "poll:expired",

  // responses
  RESPONSE_SUBMIT: "response:submit",
  RESPONSE_COUNT_UPDATED: "response:countUpdated",

  // analytics
  ANALYTICS_UPDATED: "analytics:updated",

  // leaderboard
  LEADERBOARD_REQUEST: "leaderboard:request",
  LEADERBOARD_UPDATED: "leaderboard:updated",

  // generic
  ERROR: "error",
} as const;