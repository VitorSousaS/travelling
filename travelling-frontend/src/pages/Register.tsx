import { Link } from "react-router-dom";
import { RegisterUsersCard, RegisterUsersCardUserType } from "../components";

export default function Register() {
  const cards_register: RegisterUsersCardUserType[] = [
    {
      title: "Turista e viajante",
      subtitle:
        "Deseja buscar por passeios, atrativos ou até estabelecimentos.",
      userRole: "TOURIST",
      image: "/img/tourist.svg",
    },
    {
      title: "Agência de viagem",
      subtitle: "Desejo cadastrar passeios voltados ao ecoturismo ou diversos.",
      userRole: "AGENCY",
      image: "/img/agency.svg",
    },
    {
      title: "Comércio local",
      subtitle: "Desejo colocar meu negócio como outdoor.",
      userRole: "BUSINESS",
      image: "/img/business.svg",
    },
  ];

  return (
    <div className="relative h-screen overflow-hidden xs:flex-1 sm:flex-1 md:flex-1">
      <img
        className="absolute top-[-3.5rem] left-[-2rem] -scale-x-100 z-0 sm:w-auto sm:h-52 xs:w-auto xs:h-52"
        src="/img/plant.svg"
        alt="Plant"
      />
      <img
        className="absolute top-[-3.5rem] right-[-2rem] z-0 sm:w-auto sm:h-52 xs:w-auto xs:h-52"
        src="/img/plant.svg"
        alt="Plant"
      />
      <img
        className="absolute bottom-[-2.5rem] left-0 xs:hidden sm:hidden md:hidden lg:w-auto lg:h-[30rem]"
        src="/img/camping.svg"
        alt="Camping"
      />

      <div className="relative z-20">
        <h1 className="my-8 mt-24 mx-4 font-black text-6xl text-center text-primary-light xs:text-4xl sm:text-4xl md:text-4xl md:mx-12 lg:text-5xl lg:mx-8">
          Qual perfil de <span className="text-primary-dark">Travelling</span>{" "}
          você pertence?
        </h1>
      </div>

      <div className="flex items-center justify-evenly mt-24 mx-5 gap-8 xs:mx-1 xs:mt-14 xs:flex-col sm:mt-14 sm:mx-1 sm:flex-col md:flex-col lg:mt-32">
        {cards_register.map((card, index) => {
          return <RegisterUsersCard key={index} card={card} />;
        })}
      </div>

      <p className="text-primary-light font-medium text-center absolute bottom-6 right-40 xs:static xs:py-8 sm:static sm:py-8 md:static md:py-8 lg:right-6">
        Já possui uma conta? Acesse{" "}
        <Link to="/login" style={{ textDecoration: "none", cursor: "pointer" }}>
          <span className="text-secondary-dark">aqui</span>!
        </Link>
      </p>
    </div>
  );
}
