import { useContext } from "react";
import { Profile } from "..";
import { Button } from "../@generics";
import { AuthContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { UserRoleType } from "../../interfaces";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const enabledRole = (roles: UserRoleType[]) => {
    return roles.includes(user.userRole);
  };

  return (
    <nav className="bg-primary-light h-24 w-full px-8 flex justify-between items-center xs:gap-1 xs:px-4 sm:px-4 sm:gap-1">
      <img
        className="hover:cursor-pointer"
        loading="lazy"
        src="/img/logo-mini.svg"
        alt="Logo"
        onClick={() => navigate("/")}
      />
      <div className="flex justify-evenly gap-4">
        {enabledRole(["TOURIST"]) && (
          <Button
            className="py-2 w-auto bg-secondary-light text-primary-dark text-base font-semibold gap-2"
            label={<p className="xs:hidden sm:hidden">Meus StoryTravellings</p>}
            startIcon={<i className="fa-solid fa-signs-post" />}
            onConfirm={() => navigate("/travellings")}
          />
        )}

        {enabledRole(["AGENCY", "BUSINESS"]) && (
          <Button
            className="py-2 w-auto text-primary-dark bg-secondary-light text-base font-semibold gap-2"
            label={
              <p className="xs:hidden sm:hidden">
                {user.userRole === "BUSINESS"
                  ? "Meu estabelecimentos"
                  : "Meus atrativos"}
              </p>
            }
            startIcon={
              user.userRole === "BUSINESS" ? (
                <i className="fa-solid fa-bell-concierge" />
              ) : (
                <i className="fa-solid fa-person-walking-luggage" />
              )
            }
            onConfirm={
              user.userRole === "BUSINESS"
                ? () => navigate("/business")
                : () => navigate("/agency")
            }
          />
        )}

        {enabledRole(["TOURIST", "AGENCY"]) && (
          <Button
            className="py-2 w-auto bg-primary-dark text-secondary-light text-base font-semibold gap-2"
            label={
              <p className="xs:hidden sm:hidden">
                {user.userRole === "TOURIST" ? "Meus Contratos" : "Contratos"}
              </p>
            }
            startIcon={<i className="fa-solid fa-file-signature" />}
            onConfirm={() => navigate("/contracts")}
          />
        )}

        {enabledRole(["AGENCY", "BUSINESS", "TOURIST", "ADMIN"]) && <Profile />}

        {!enabledRole(["AGENCY", "BUSINESS", "TOURIST", "ADMIN"]) && (
          <div className="flex items-center gap-4">
            <Button
              className="py-2 w-auto bg-transparent border border-secondary-light text-secondary-light text-base font-semibold gap-2"
              label="Registrar-se"
              startIcon={<i className="fa-solid fa-user-plus" />}
              onConfirm={() => navigate("/register")}
            />
            <Button
              className="py-2 w-auto bg-primary-dark text-secondary-light text-base font-semibold gap-2"
              label="Entrar"
              startIcon={<i className="fa-solid fa-right-to-bracket" />}
              onConfirm={() => navigate("/login")}
            />
          </div>
        )}
      </div>
    </nav>
  );
};
