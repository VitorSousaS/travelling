import React, { useContext } from "react";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { AuthContext } from "../../context";
import { useNavigate } from "react-router";
import { ModalRegisterUsers } from "..";

interface ItemProfileProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const ItemProfile: React.FC<ItemProfileProps> = ({ icon, label, onClick }) => {
  return (
    <div className="flex items-center gap-2 p-1" onClick={onClick}>
      <i className={`${icon} text-primary-light text-base`} />
      <p className="text-primary-dark text-base">{label}</p>
    </div>
  );
};

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { openModalProfile, setOpenModalProfile, user, LogoutSession } =
    useContext(AuthContext);

  const handleEditProfile = () => {
    setOpenModalProfile(true);
  };

  const handleLogout = () => {
    LogoutSession();
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <ItemProfile
          label="Editar perfil"
          icon="fa-solid fa-address-card"
          onClick={handleEditProfile}
        />
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <ItemProfile
          label="Sair"
          icon="fa-solid fa-right-from-bracket"
          onClick={handleLogout}
        />
      ),
      danger: true,
    },
  ];

  return (
    <>
      <ModalRegisterUsers
        mode="edit"
        open={openModalProfile}
        setOpen={setOpenModalProfile}
        userRole={user.userRole}
      />
      <Dropdown menu={{ items }} trigger={["hover"]}>
        <div className="flex items-center justify-center gap-2 xs:gap-1 sm:gap-1 hover:cursor-pointer">
          <div className="w-10 h-10 flex rounded-full border-2 items-center justify-center bg-primary-dark">
            <i className="fa-solid fa-user text-secondary-light text-lg" />
          </div>
          <div className="flex">
            <p className="text-white xs:hidden sm:hidden">
              Olá,{" "}
              <span className="text-secondary-light font-medium">
                {user.name}!
              </span>
            </p>
          </div>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
      </Dropdown>
    </>
  );
};
