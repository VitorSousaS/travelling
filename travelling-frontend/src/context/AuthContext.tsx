import { createContext, ReactNode, useMemo } from "react";
import { useAuth } from "./hooks";
import { UserRoleType, UserType } from "../interfaces";

interface IAuthProvider {
  children: ReactNode;
}

type AuthType = {
  user: UserType;
  setUser: (user: UserType) => void;
  authorized: boolean | undefined;
  isExpiredSession: boolean | undefined;
  setAuthorized: (value: boolean | undefined) => void;
  setIsExpiredSession: (value: boolean | undefined) => void;
  validateExpiryToken: () => void;
  UnauthorizeSession: () => void;
  LogoutSession: () => void;
  openModalProfile: boolean;
  setOpenModalProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialValues = {
  authorized: undefined,
  isExpiredSession: undefined,
  user: {
    id: "",
    name: "",
    email: "",
    userRole: "" as UserRoleType,
  },
  openModalProfile: false,
};

const AuthContext = createContext({} as AuthType);

const AuthProvider = (props: IAuthProvider) => {
  const authProps = useAuth(initialValues);

  return (
    <AuthContext.Provider value={useMemo(() => authProps, [authProps])}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
