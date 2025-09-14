import { useEffect, useState } from "react";
import {
  Forage,
  clearAllCookies,
  getUserDataCookie,
  getUserTokenCookie,
  isTokenExpired,
} from "../../services";
import { DecodeJWTResponse, UserType } from "../../interfaces";
import jwt_decode from "jwt-decode";

type AuthType = {
  authorized: boolean | undefined;
  isExpiredSession: boolean | undefined;
  user: UserType;
  openModalProfile: boolean;
};

export const useAuth = (initialValues: AuthType) => {
  const [openModalProfile, setOpenModalProfile] = useState(
    initialValues.openModalProfile
  );
  const [user, setUser] = useState<UserType>(initialValues.user);
  const [authorized, setAuthorized] = useState(initialValues.authorized);
  const [isExpiredSession, setIsExpiredSession] = useState(
    initialValues.isExpiredSession
  );

  const validateExpiryToken = () => {
    const userToken = getUserTokenCookie();

    if (!userToken) {
      Forage.clearAll();
      clearAllCookies();
      setUser(initialValues.user);
      setAuthorized(false);
    } else {
      const decoded: DecodeJWTResponse = jwt_decode(userToken);

      if (isTokenExpired(decoded.exp ?? 0)) {
        UnauthorizeSession();
      } else {
        setAuthorized(true);
        setIsExpiredSession(false);
      }
    }
  };

  const UnauthorizeSession = () => {
    Forage.clearAll();
    clearAllCookies();
    setUser(initialValues.user);
    setAuthorized(false);
    setIsExpiredSession(true);
  };

  const LogoutSession = () => {
    Forage.clearAll();
    clearAllCookies();
    setUser(initialValues.user);
    setAuthorized(false);
  };

  const setCurrentUser = () => {
    const userData = getUserDataCookie();
    setUser(userData ?? initialValues.user);
  };

  useEffect(() => {
    setCurrentUser();
    validateExpiryToken();
  }, [authorized]);

  return {
    openModalProfile,
    setOpenModalProfile,
    user,
    setUser,
    authorized,
    setAuthorized,
    isExpiredSession,
    setIsExpiredSession,
    validateExpiryToken,
    UnauthorizeSession,
    LogoutSession,
  };
};
