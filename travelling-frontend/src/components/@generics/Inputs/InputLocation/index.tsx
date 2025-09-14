import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { InputableField } from "..";
import { getLocationByCEP } from "../../../../services";

interface InputLocationProps {
  initialValue?: string;
  onChange: (location: string) => void;
  hasError: boolean;
  helperText: string | undefined;
}

export const InputLocation: React.FC<InputLocationProps> = ({
  initialValue,
  onChange,
  hasError,
  helperText,
}) => {
  const [errors, setErrors] = useState({
    cep: {
      hasError: false,
      message: "CEP inválido",
    },
    country: {
      hasError: false,
      message: "Pais inválido",
    },
    uf: {
      hasError: false,
      message: "Estado inválido",
    },
    city: {
      hasError: false,
      message: "Cidade inválida",
    },
    district: {
      hasError: false,
      message: "Bairro inválido",
    },
    address: {
      hasError: false,
      message: "Rua inválida",
    },
    number: {
      hasError: false,
      message: "Número inválido",
    },
  });

  const defaultLocation = {
    cep: "",
    country: "",
    uf: "",
    city: "",
    district: "",
    address: "",
    number: "",
  };

  const [location, setLocation] = useState(defaultLocation);

  useEffect(() => {
    if (initialValue && initialValue.length > 0) {
      const splited = initialValue.split(",");
      setLocation({
        ...location,
        country: splited[0].trimStart().trimEnd() ?? "",
        uf: splited[1].trimStart().trimEnd() ?? "",
        city: splited[2].trimStart().trimEnd() ?? "",
        district: splited[3].trimStart().trimEnd() ?? "",
        address: splited[4].trimStart().trimEnd() ?? "",
        number: splited[5].trimStart().trimEnd() ?? "",
      });
    } else {
      setLocation(defaultLocation);
    }
  }, [initialValue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      [key]: e.target.value,
    }));
  };

  const toggleError = (key: string, value: boolean) => {
    setErrors((prevState) => ({
      ...prevState,
      [key]: {
        hasError: value,
        message: prevState.cep.message,
      },
    }));
  };

  useEffect(() => {
    const replacedCep = location.cep.replace(/[^0-9]/g, "");

    if (replacedCep.length === 8) {
      getLocationByCEP(replacedCep).then((location: any) => {
        const { localidade, logradouro, bairro, uf, erro } = location.data;
        if (!erro) {
          toggleError("cep", false);
          setLocation((prevLocation) => ({
            ...prevLocation,
            uf: uf,
            city: localidade,
            district: bairro,
            address: logradouro,
            country: "Brasil",
          }));
        } else {
          toggleError("cep", true);
        }
      });
    } else if (location.cep.length > 0) {
      setLocation((prevLocation) => ({
        ...prevLocation,
        uf: "",
        city: "",
        district: "",
        address: "",
      }));
    }
  }, [location.cep]);

  useEffect(() => {
    if (!Object.values(location).every((v) => v === "")) {
      const { country, uf, city, district, address, number } = location;
      onChange(
        `${country}, ${uf}, ${city}, ${district}, ${address}, ${number}`
      );
    }
  }, [location]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="font-normal text-auxiliary-beige text-sm focus-within:font-semibold">
        Localização
      </h3>
      <div className="flex flex-col w-full border-y-[1px] py-4 gap-4">
        <InputMask
          mask="999999-99"
          maskPlaceholder={null}
          disabled={false}
          value={location.cep}
          onChange={(e) => handleChange(e, "cep")}
        >
          <InputableField
            id="cep"
            label="CEP"
            placeholder="928380-98"
            hasError={errors["cep"].hasError}
            helperText={
              errors["cep"] ? errors["cep"].message : "" || helperText
            }
          />
        </InputMask>

        <div className="flex gap-4 xs:flex-col sm:flex-col">
          <InputableField
            id="country"
            label="Pais"
            placeholder="Brasil"
            hasError={errors["country"].hasError || hasError}
            helperText={errors["country"] ? errors["country"].message : ""}
            value={location.country}
            onChange={(e) => handleChange(e, "country")}
          />
          <InputableField
            id="uf"
            label="Estado"
            placeholder="MS"
            hasError={errors["uf"].hasError || hasError}
            helperText={errors["uf"] ? errors["uf"].message : ""}
            value={location.uf}
            onChange={(e) => handleChange(e, "uf")}
          />
        </div>

        <div className="flex gap-4 xs:flex-col sm:flex-col">
          <InputableField
            id="city"
            label="Cidade"
            placeholder="Campo Grande"
            hasError={errors["city"].hasError || hasError}
            helperText={errors["city"] ? errors["city"].message : ""}
            value={location.city}
            onChange={(e) => handleChange(e, "city")}
          />
          <InputableField
            id="district"
            label="Bairro"
            placeholder="Alphaville"
            hasError={errors["district"].hasError || hasError}
            helperText={errors["district"] ? errors["district"].message : ""}
            value={location.district}
            onChange={(e) => handleChange(e, "district")}
          />
        </div>

        <div className="flex gap-4 xs:flex-col sm:flex-col">
          <InputableField
            id="address"
            label="Rua"
            placeholder="Rua das árvores"
            hasError={errors["address"].hasError || hasError}
            helperText={errors["address"] ? errors["address"].message : ""}
            value={location.address}
            onChange={(e) => handleChange(e, "address")}
          />
          <InputableField
            id="number"
            label="N°"
            mask="number"
            placeholder="222"
            hasError={errors["number"].hasError || hasError}
            helperText={errors["number"] ? errors["number"].message : ""}
            value={location.number}
            onChange={(e) => handleChange(e, "number")}
          />
        </div>
      </div>
    </div>
  );
};
