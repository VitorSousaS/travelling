import { useContext, useMemo } from "react";
import { Loading, LocalCollapse } from "../components";
import { PanelsLocalType } from "../interfaces";
import { AgencyContext, AuthContext } from "../context";
import { AxiosError } from "axios";
import { message } from "antd";

export default function Agency() {
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const { getAttractions } = useContext(AgencyContext);

  const { data: attractions, isLoading } = getAttractions(
    user.id,
    (error: AxiosError) => {
      if (error.response?.status === 500) {
        message.error(
          "Não foi possível carregar suas atrações, tente novamente!"
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
        title: "Atrações",
        type: "attraction",
        list: attractions,
        enabled: true,
      },
    ];
  }, [attractions]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex-1 w-full h-full min-h-screen">
      <div className="p-8">
        <LocalCollapse panels={panels} />
      </div>
    </div>
  );
}
