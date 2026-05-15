import { AckResponse } from "../types.js";

export const ackSuccess = <T>(
  cb?: (response: AckResponse<T>) => void,
  data?: T
) => {
  if (!cb) return;

  cb({
    success: true,
    data,
  });
};

export const ackError = (
  cb?: (response: AckResponse) => void,
  error = "Something went wrong"
) => {
  if (!cb) return;

  cb({
    success: false,
    error,
  });
};
