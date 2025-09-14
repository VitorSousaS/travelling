import { tv } from "tailwind-variants";
import { ContractStatusType } from "../../../interfaces";
import { Spin } from "antd";

const statusDot = tv({
  base: "rounded-full h-4 w-4",
  variants: {
    status: {
      CONFIRMED: "bg-primary-extraLight",
      PENDING: "bg-auxiliary-info",
      CANCELED: "bg-auxiliary-error",
      FINISHED: "bg-primary-dark",
    },
  },
});

const statusText = tv({
  base: "w-auto h-auto text-sm select-none",
  variants: {
    status: {
      CONFIRMED: "text-primary-extraLight",
      PENDING: "text-auxiliary-info",
      CANCELED: "text-auxiliary-error",
      FINISHED: "text-primary-dark",
    },
  },
});

const DICT_STATUS = {
  CONFIRMED: "Confirmado",
  PENDING: "Pendente",
  CANCELED: "Cancelado",
  FINISHED: "Finalizado",
};

interface ContractStatusProps {
  status: ContractStatusType;
  loading: boolean;
}

interface LabelStatusProps {
  status: ContractStatusType;
}

export const ContractStatus: React.FC<ContractStatusProps> = ({
  status,
  loading,
}) => {
  return (
    <div className="bg-secondary-light rounded-lg w-36 py-1 absolute left-40 -top-3 flex items-center justify-center gap-1 z-20 hover:cursor-pointer xs:left-1/2 xs:-translate-x-1/2 sm:left-1/2 sm:-translate-x-1/2 md:left-52 lg:left-56">
      {!loading && <div className={statusDot({ status })} />}
      {loading && <Spin size="small" />}
      <p className={statusText({ status })}>
        {loading ? "Aguarde..." : DICT_STATUS[status]}
      </p>
    </div>
  );
};

export const LabelStatus: React.FC<LabelStatusProps> = ({ status }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={statusDot({ status })} />
      <p className="text-primary-extraLight w-auto h-auto text-sm">
        {DICT_STATUS[status]}
      </p>
    </div>
  );
};
