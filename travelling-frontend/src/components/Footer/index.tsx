import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-light text-white px-4 py-24">
      <div className="mx-auto flex justify-between items-center xs:flex-col xs:gap-4 sm:flex-col sm:gap-4">
        <div className="flex items-center space-x-4 xs:flex-col xs:justify-center xs:gap-4 sm:flex-col sm:justify-center sm:gap-4">
          <img
            src="/img/logo-bigger.svg"
            alt="Logo"
            className="h-24 w-24 xs:h-32 xs:w-32 sm:h-32 sm:w-32"
          />
          <div className="flex flex-col gap-1 xs:items-center xs:text-center xs:w-full xs:gap-4 sm:items-center sm:text-center sm:gap-4 ">
            <p className="text-lg font-bold text-secondary-light xs:text-2xl sm:text-2xl">
              Travelling
            </p>
            <p className="xs:text-center sm:text-center">
              Cidade Universitária, Av. Costa e Silva - Pioneiros, MS, 79070-900
            </p>
            <p className="xs:text-center sm:text-center">
              Telefone: (67) 4546-7890
            </p>
          </div>
        </div>
        <div>
          <p className="xs:text-center sm:text-center">
            &copy; {new Date().getFullYear()} Travelling. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
