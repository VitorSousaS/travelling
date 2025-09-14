import { useContext, useMemo } from "react";
import { Loading, LocalCollapse } from "../components";
import { PanelsLocalType } from "../interfaces";
import { AuthContext, BusinessContext } from "../context";
import { AxiosError } from "axios";
import { message } from "antd";

export default function Business() {
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const { getEstablishments } = useContext(BusinessContext);

  const { data: establishments, isLoading } = getEstablishments(
    user.id,
    (error: AxiosError) => {
      if (error.response?.status === 500) {
        message.error(
          "Não foi possível carregar seus estabelecimentos, tente novamente!"
        );
      } else if (error.response?.status === 401) {
        UnauthorizeSession();
      }
    }
  );

  const panels: PanelsLocalType[] = useMemo(() => {
    return [
      {
        key: "1",
        title: "Estabelecimentos",
        type: "establishment",
        list: establishments,
        enabled: true,
      },
    ];
  }, [establishments]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex-1 w-full h-full min-h-screen">
      <div className="p-8">
        <LocalCollapse panels={panels} />
      </div>
    </div>
  );
}
