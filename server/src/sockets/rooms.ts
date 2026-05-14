type roomType = "poll" | "quiz";

export function roomName(roomType: roomType, pollId: string) {
  return `${roomType}:${pollId}`;
}

export const rooms = {
  poll: (pollId: string) => `poll:${pollId}`,
};