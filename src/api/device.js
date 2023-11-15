import { AuthService } from "src/utils/axios/auth";

export function getDevices() {
  return AuthService({
    url: "/device",
    method: "get",
  });
}

export function createDevice(data) {
  return AuthService({
    url: "/device",
    method: "post",
    data,
  });
}

export function updateDevice(id, data) {
  return AuthService({
    url: `/device/${id}`,
    method: "patch",
    data,
  });
}

export function deleteDevice(id) {
  return AuthService({
    url: `/device/${id}`,
    method: "delete",
  });
}
