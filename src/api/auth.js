import { HttpService } from "src/utils/axios/http";
import { AuthService } from "src/utils/axios/auth";

export function login(data) {
  return HttpService({
    url: "/auth/login",
    method: "post",
    data,
  });
}

export function logOut(data) {
  return AuthService({
    url: "/auth/logout",
    method: "post",
    data,
  });
}

export function getInfoAccount() {
  return AuthService({
    url: "/account",
    method: "get",
  });
}
