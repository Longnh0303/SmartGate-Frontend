import { AuthService } from "src/utils/axios/auth";

export function getAccessStats(params) {
  return AuthService({
    url: "/statistic/access",
    method: "get",
    params: params,
  });
}

export function getTotalMoneyStats(params) {
  return AuthService({
    url: "/statistic/money/total",
    method: "get",
    params: params,
  });
}

export function getAutoMoneyStats(params) {
  return AuthService({
    url: "/statistic/money/auto",
    method: "get",
    params: params,
  });
}

export function getManualMoneyStats(params) {
  return AuthService({
    url: "/statistic/money/manual",
    method: "get",
    params: params,
  });
}

export function getTotalVehicle(params) {
  return AuthService({
    url: "/statistic/vehicle",
    method: "get",
    params: params,
  });
}
