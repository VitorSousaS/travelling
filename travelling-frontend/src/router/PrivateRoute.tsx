import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context";
import { Loading } from "../components";

interface IPrivateRoute {
  children: JSX.Element;
}

export function PrivateRoute({ children }: IPrivateRoute) {
  const { authorized } = useContext(AuthContext);

  if (authorized === undefined) {
    return <Loading />;
  }

  return authorized ? children : <Navigate to="/login" replace />;
}
