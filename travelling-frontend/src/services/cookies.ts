// Importe a biblioteca 'js-cookie' para trabalhar com cookies
import Cookies from "js-cookie";
import { UserType } from "../interfaces";

// Função para definir um cookie com o token e dados do usuário
export function setUserTokenCookie(
  userToken: string,
  expirationDays: number = 7
) {
  // Defina o cookie com o nome 'userToken' e o token fornecido
  Cookies.set("userToken", userToken, { expires: expirationDays });
}

export function setUserDataCookie(
  userData: UserType,
  expirationDays: number = 7
) {
  // Defina o cookie com o nome 'userData' e os dados do usuário em formato JSON
  Cookies.set("userData", JSON.stringify(userData), {
    expires: expirationDays,
  });
}

// Função para recuperar o token do cookie
export function getUserTokenCookie(): string | null {
  return Cookies.get("userToken") ?? null;
}

// Função para recuperar os dados do usuário do cookie
export function getUserDataCookie(): UserType | null {
  const userDataString = Cookies.get("userData");
  if (userDataString) {
    return JSON.parse(userDataString) as UserType;
  }
  return null;
}

export function clearAllCookies() {
  const cookies = Cookies.get(); // Obtém todos os cookies como um objeto

  // Percorre todos os cookies e os remove
  for (const cookieName in cookies) {
    if (cookies.hasOwnProperty(cookieName)) {
      Cookies.remove(cookieName);
    }
  }
}
