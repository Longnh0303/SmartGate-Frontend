import { AuthService } from "src/utils/axios/auth";

export function getRfid(params) {
  return AuthService({
    url: "/rfid",
    method: "get",
    params: params,
  });
}

export function createRfid(data) {
  return AuthService({
    url: `/rfid`,
    method: "post",
    data,
  });
}

export function updateRfid(id, data) {
  return AuthService({
    url: `/rfid/${id}`,
    method: "patch",
    data,
  });
}

export function deleteRfid(id) {
  return AuthService({
    url: `/rfid/${id}`,
    method: "delete",
  });
}

export function getRfidByCardId(cardId) {
  return AuthService({
    url: `/rfid/card/${cardId}`,
    method: "get",
  });
}
