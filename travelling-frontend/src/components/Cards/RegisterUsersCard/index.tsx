import { useState } from "react";
import { ModalRegisterUsers } from "../..";
import { UserRoleType } from "../../../interfaces";

export type RegisterUsersCardUserType = {
  title: string;
  image: string;
  subtitle: string;
  userRole: UserRoleType;
};

interface RegisterUsersCardProps {
  card: RegisterUsersCardUserType;
}

export const RegisterUsersCard: React.FC<RegisterUsersCardProps> = ({
  card,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModalRegister = () => {
    setOpenModal(true);
  };

  return (
    <>
      <ModalRegisterUsers
        mode="create"
        open={openModal}
        setOpen={setOpenModal}
        userRole={card.userRole}
      />
      <div
        onClick={handleOpenModalRegister}
        className="w-[27rem] h-[27rem] xs:w-[80%] sm:w-[80%] bg-primary-light rounded-lg flex flex-col items-center justify-center transform transition duration-500 hover:scale-110 hover:cursor-pointer"
      >
        <img src={card.image} alt="Image" className="w-auto h-56" />
        <h3 className="mt-6 p-2 text-2xl text-center text-secondary-light font-semibold">
          {card.title}
        </h3>
        <p className="mx-12 text-center text-auxiliary-beige font-normal">
          {card.subtitle}
        </p>
      </div>
    </>
  );
};
