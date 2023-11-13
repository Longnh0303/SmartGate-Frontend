import { AuthService } from "src/utils/axios/auth";

export function getHistory(params) {
  return AuthService({
    url: "/history",
    method: "get",
    params: params,
  });
}
