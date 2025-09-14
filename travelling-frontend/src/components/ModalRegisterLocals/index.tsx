import { useContext } from "react";
import { Modal, SwitchComponents, AttractionForm, EstablishmentForm } from "..";
import { LocalType } from "../../interfaces";
import { LocalContext } from "../../context";

interface ModalRegisterLocalsProps {
  localType: LocalType;
}

const ROLE_TO_TEXT = {
  establishment: "um estabelecimento",
  attraction: "uma atração",
};

export const ModalRegisterLocals: React.FC<ModalRegisterLocalsProps> = ({
  localType,
}) => {
  const { open, mode, setOpen } = useContext(LocalContext);

  return (
    <Modal
      title={
        <h1 className="font-semibold text-2xl w-full text-center text-auxiliary-beige">
          {mode === "create" ? "Cadastrar" : "Editar"}{" "}
          <span className="text-secondary-light">
            {ROLE_TO_TEXT[localType as keyof typeof ROLE_TO_TEXT]}
          </span>
        </h1>
      }
      open={open}
      setOpen={setOpen}
    >
      <SwitchComponents active={localType}>
        <AttractionForm name="attraction" closeModal={() => setOpen(false)} />
        <EstablishmentForm
          name="establishment"
          closeModal={() => setOpen(false)}
        />
      </SwitchComponents>
    </Modal>
  );
};
