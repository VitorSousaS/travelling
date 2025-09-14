import {
  Modal,
  SwitchComponents,
  AgencyForm,
  BusinessForm,
  TouristForm,
} from "..";
import { UserRoleType } from "../../interfaces";

interface ModalRegisterUsersProps {
  userRole: UserRoleType;
  open: boolean;
  setOpen: (value: boolean) => void;
  mode: "create" | "edit";
}

const ROLE_TO_TEXT = {
  AGENCY: "agência",
  TOURIST: "turista",
  BUSINESS: "comércio",
};

export const ModalRegisterUsers: React.FC<ModalRegisterUsersProps> = ({
  userRole,
  mode,
  open,
  setOpen,
}) => {
  return (
    <Modal
      title={
        <h1 className="font-semibold text-2xl w-full text-center text-auxiliary-beige">
          {mode === "edit" ? "Editar" : "Cadastrar"} como{" "}
          <span className="text-secondary-light">
            {ROLE_TO_TEXT[userRole as keyof typeof ROLE_TO_TEXT]}
          </span>
        </h1>
      }
      open={open}
      setOpen={setOpen}
    >
      <div className="max-h-[592px]">
        <SwitchComponents active={userRole}>
          <AgencyForm name="AGENCY" mode={mode} />
          <TouristForm name="TOURIST" mode={mode} />
          <BusinessForm name="BUSINESS" mode={mode} />
        </SwitchComponents>
      </div>
    </Modal>
  );
};
