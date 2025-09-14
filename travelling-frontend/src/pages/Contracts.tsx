import { useContext, useMemo, useState } from "react";
import { Loading, Tabs } from "../components";
import { AuthContext } from "../context";
import { useQuery } from "react-query";
import { getContracts } from "../services";
import { ContractType } from "../interfaces";
import { ContractCard } from "../components/Cards/ContractCard";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { message } from "antd";

const DICT_STATUS = {
  Confirmado: "CONFIRMED",
  Pendente: "PENDING",
  Cancelado: "CANCELED",
  Finalizado: "FINISHED",
};

const DICT_LABEL_TO_STATUS = {
  Solicitações: "Pendente",
  Confirmados: "Confirmado",
  Cancelados: "Cancelado",
  Finalizados: "Finalizado",
};

export default function Contracts() {
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const [selected, setSelected] =
    useState<keyof typeof DICT_STATUS>("Pendente");

  const request_contracts = useMemo(() => {
    return {
      queryKey: ["contracts", user.id],
      queryFn: () => getContracts(user.id, user.userRole),
      enabled: !!user.id,
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar seus contratos, tente novamente!"
          );
        } else if (error.response?.status === 401) {
          UnauthorizeSession();
        }
      },
    };
  }, [user.id, user.userRole]);

  const { data: contracts, isLoading: isLoadingAttraction } =
    useQuery(request_contracts);

  const onFilterContracts = (current: string) => {
    setSelected(
      DICT_LABEL_TO_STATUS[
        current as keyof typeof DICT_LABEL_TO_STATUS
      ] as keyof typeof DICT_STATUS
    );
  };

  if (isLoadingAttraction) return <Loading />;

  const filteredContracts: ContractType[] =
    contracts?.filter(
      (contract: ContractType) => contract.status === DICT_STATUS[selected]
    ) ?? [];

  return (
    <div className="flex-1 flex flex-col items-center min-h-screen">
      <Tabs
        selected={selected}
        tabs={["Solicitações", "Confirmados", "Cancelados", "Finalizados"]}
        onChange={onFilterContracts}
      />
      {filteredContracts?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="w-4/5 mt-16 mb-8 flex flex-col gap-6 min-h-[15rem] max-h-[35rem] overflow-y-scroll overflow-x-hidden p-6 xs:items-center xs:w-[90%] xs:mt-8 sm:w-[90%] sm:mt-8 sm:items-center lg:w-[90%]"
        >
          {filteredContracts?.map((contract, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ContractCard key={index} card={contract} />
              </motion.div>
            );
          })}
        </motion.div>
      )}
      {filteredContracts?.length === 0 && (
        <div className="w-full h-full flex flex-col gap-6 items-center justify-center py-8 mt-8 xs:px-4 sm:px-4">
          <img src="/img/empty.svg" alt="Empty" className="h-36 w-auto" />
          <p className="font-semibold text-2xl text-primary-light text-center">
            Oops... Não há contratos com status de: {selected}
          </p>
        </div>
      )}
    </div>
  );
}
