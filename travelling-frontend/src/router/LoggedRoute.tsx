import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context";
import { getUserDataCookie } from "../services";

interface ILoggedRoute {
  children: JSX.Element;
}

export function LoggedRoute({ children }: ILoggedRoute) {
  const { authorized } = useContext(AuthContext);

  const userRole = getUserDataCookie()?.userRole;

  const routesRoles = {
    AGENCY: "/agency",
    TOURIST: "/tourist",
    BUSINESS: "/business",
    ADMIN: "/tourist",
  };

  return authorized ? (
    <Navigate to={routesRoles[userRole ?? "TOURIST"]} replace />
  ) : (
    children
  );
}
