import { useContext, useState } from "react";
import { Button, ConfirmDialog } from "../..";
import { AttractionType, UserRoleType } from "../../../interfaces";
import { AuthContext } from "../../../context";
import { createContract, formatDate, formatterMoney } from "../../../services";
import { message } from "antd";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface ContactProps {
  local: AttractionType;
}

export const Contact: React.FC<ContactProps> = ({ local }) => {
  const navigate = useNavigate();

  const { user, UnauthorizeSession } = useContext(AuthContext);

  const enabledRole = (roles: UserRoleType[]) => {
    return roles.includes(user.userRole);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleContact = () => {
    const text = `
Olá, ${local.agency.user.name},

Me chamo *${
      user.name
    }* e estou entrando em contato para expressar meu interesse em um atrativo que vocês oferecem. 

Eu adoraria saber mais sobre as opções disponíveis e como posso fazer parte dessa experiência incrível!

*Atrativo:* ${local.name}
*Local:* ${local.location}
*Valor:* ${formatterMoney(local.pricing)}

Estou especialmente interessado(a) em participar no dia *${formatDate(
      local.date
    )}*. É um momento conveniente para mim, e estou animado(a) para explorar o que vocês têm a oferecer nesse dia.

Por favor, me informe sobre a disponibilidade e os detalhes para reservar essa experiência. Se houver alguma documentação necessária ou informações adicionais que vocês precisem de mim, estou à disposição para fornecer tudo o que for necessário.

Agradeço antecipadamente por sua assistência e aguardo ansiosamente a oportunidade de conhecer mais sobre o atrativo e como podemos prosseguir.

Atenciosamente,
${user.name}
${user.email}
`;
    const link = `https://wa.me//${local.agency.user.phone.trim()}?text=${encodeURIComponent(
      text
    )}`;

    window.open(link);
    setOpenDialog(true);
  };

  const { mutate: mutateCreateContract, isLoading: isLoadingCreate } =
    useMutation(createContract, {
      onSuccess: async () => {
        message.success(
          "Um contrato foi criado, verifique na aba de contratos."
        );
        setOpenDialog(false);
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          UnauthorizeSession();
        } else {
          message.error(
            "Desculpe, não foi possivel criar o contrato, tente novamente!"
          );
        }
      },
    });

  const onConfirmDialog = () => {
    const attractionId = local.id;
    const agencyId = local.agency.id;
    const touristId = user.id;
    mutateCreateContract({ attractionId, agencyId, touristId });
  };

  return (
    <div className="flex items-center justify-center my-16">
      <ConfirmDialog
        open={openDialog}
        title="Deseja incluir na lista de contratos?"
        content={
          <p className="text-auxiliary-beige">
            Ao incluir na lista de contratos, a agência poderá lhe informar da
            melhor maneira o status atual do passeio, bem como ter um resumo
            para o atrativo.
          </p>
        }
        loading={isLoadingCreate}
        onOk={onConfirmDialog}
        onCancel={() => setOpenDialog(false)}
      />
      <div className="w-1/2 rounded-md bg-secondary-light flex flex-col py-14 px-4 items-center justify-center gap-8 xs:w-full sm:w-full md:w-[80%] lg:w-[80%]">
        <h3 className="text-primary-dark text-2xl text-center font-semibold mx-8 xs:text-lg xs:mx-2 sm:text-xl sm:mx-4">
          Gostou do que viu e deseja saber mais sobre o local ou qualquer outro
          assunto? Sinta-se à vontade para contatar a agência ao passo de um
          clique!
        </h3>
        <h4 className="text-primary-darkOpacity text-lg font-medium">
          {!enabledRole(["ADMIN", "AGENCY", "BUSINESS", "TOURIST"]) &&
            "Registre-se ou acesse para entrar em contato!"}
        </h4>

        {enabledRole(["ADMIN", "AGENCY", "BUSINESS", "TOURIST"]) ? (
          <Button
            className="bg-primary-dark text-auxiliary-beige px-8 py-3 w-fit gap-4 flex items-center justify-center text-xl font-semibold xs:px-6 xs:py-2 xs:text-base sm:px-6 sm:py-2 sm:text-base"
            label="Entrar em contato"
            startIcon={<i className="fa-brands fa-whatsapp text-2xl" />}
            onConfirm={handleContact}
          />
        ) : (
          <div className="flex items-center gap-4">
            <Button
              className="py-3 w-auto bg-transparent border border-primary-dark text-primary-dark text-base font-semibold gap-2"
              label="Registrar-se"
              startIcon={<i className="fa-solid fa-user-plus" />}
              onConfirm={() => navigate("/register")}
            />
            <Button
              className="py-3 w-auto bg-primary-dark text-secondary-light text-base font-semibold gap-2"
              label="Entrar"
              startIcon={<i className="fa-solid fa-right-to-bracket" />}
              onConfirm={() => navigate("/login")}
            />
          </div>
        )}
      </div>
    </div>
  );
};
