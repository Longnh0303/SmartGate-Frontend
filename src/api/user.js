import { AuthService } from "src/utils/axios/auth";

export function getUsers(params) {
  return AuthService({
    url: "/users",
    method: "get",
    params: params,
  });
}

export function getUserById(id) {
  return AuthService({
    url: `/users/${id}`,
    method: "get",
  });
}

export function updateUser(id, data) {
  return AuthService({
    url: `/users/${id}`,
    method: "patch",
    data,
  });
}

export function deleteUser(id) {
  return AuthService({
    url: `/users/${id}`,
    method: "delete",
  });
}

export function createUser(data) {
  return AuthService({
    url: `/users`,
    method: "post",
    data,
  });
}
