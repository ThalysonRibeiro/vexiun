import { ActionResponse, isSuccessResponse } from "./error-handler";

export function unwrapServerData<T>(result: ActionResponse<T>): T {
  if (!isSuccessResponse(result)) {
    throw new Error(result.error);
  }
  return result.data as T;
}