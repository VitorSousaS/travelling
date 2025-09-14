import { useContext, useMemo } from "react";
import { useQuery } from "react-query";
import {
  Button,
  Loading,
  Modal,
  TravellingCollapse,
  TravellingForm,
} from "../components";
import { AuthContext, TravellingContext } from "../context";
import { getTravellingByTourist } from "../services";
import { AxiosError } from "axios";
import { message } from "antd";

export default function Travellings() {
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const { open, setOpen, mode, setMode, setSelectedTravelling } =
    useContext(TravellingContext);

  const request_travellings = useMemo(() => {
    return {
      queryKey: ["travellings", user.id],
      enabled: !!user && user.userRole === "TOURIST",
      queryFn: () => getTravellingByTourist(user.id),
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar os estabelecimentos, tente novamente!"
          );
        } else if (error.response?.status === 401) {
          UnauthorizeSession();
        }
      },
    };
  }, [user.id]);

  const { data: travellings, isLoading } = useQuery(request_travellings);

  const handleCreateTravelling = () => {
    setMode("create");
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTravelling(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex-1 p-8 min-h-screen">
      <Modal
        title={
          <h1 className="font-semibold text-2xl w-full text-center text-auxiliary-beige">
            {mode === "create" ? "Cadastrar" : "Editar"}{" "}
            <span className="text-secondary-light">StoryTravelling</span>
          </h1>
        }
        open={open}
        setOpen={setOpen}
      >
        <TravellingForm closeModal={handleCloseModal} />
      </Modal>
      <TravellingCollapse travellings={travellings?.reverse() ?? []} />
      <Button
        className="w-fit mx-auto py-3 px-6 gap-2 bg-transparent border border-primary-light border-dashed hover:opacity-70 text-primary-light"
        label="Criar novo StoryTravelling"
        startIcon={<i className="fa-solid fa-plus text-xl" />}
        onConfirm={handleCreateTravelling}
      />
    </div>
  );
}
