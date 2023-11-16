/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role) => {
  if (role === "operator") return "/home";
  else return "/home";
};

export default getHomeRoute;
