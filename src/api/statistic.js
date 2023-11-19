import { AuthService } from "src/utils/axios/auth";

export function getAccessStats(params) {
  return AuthService({
    url: "/statistic/access",
    method: "get",
    params: params,
  });
}
