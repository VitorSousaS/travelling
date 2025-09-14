import { format } from "date-fns";
import {
  AttractionType,
  CategoryType,
  EstablishmentType,
  FilterContextType,
  LocalTypeRegister,
  OptionType,
  TravellingLocalType,
  TravellingType,
} from "../interfaces";

export const isTokenExpired = (expiry: number | undefined) => {
  const currentTimestamp = Math.floor(Date.now() / 1000); // obter o timestamp atual em segundos

  if (expiry) {
    return currentTimestamp >= expiry;
  } else {
    return false;
  }
};

export function isNumeric(value: string): boolean {
  return (
    typeof value === "number" ||
    (typeof value === "string" &&
      !isNaN(Number(value)) &&
      isFinite(Number(value)))
  );
}

export const formatterNumeric = (numeroStr: string): string => {
  try {
    // Se a conversão for uma string, retorna a string
    if (!isNumeric(numeroStr)) return numeroStr;

    // Tenta converter a string para um número float
    const numero: number = parseFloat(numeroStr);

    // Verifica se o número é um número inteiro
    const isInteiro: boolean = numero % 1 === 0;

    // Formata o número com separadores de milhares e mantém as casas decimais se houver
    let numeroFormatado: string;

    if (isInteiro) {
      const partes: string[] = numero.toLocaleString().split(",");
      numeroFormatado = `${partes[0]}`;
    } else {
      const partes: string[] = numero.toFixed(2).split(".");
      partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      numeroFormatado = partes.join(",");
    }

    return numeroFormatado;
  } catch (error) {
    return numeroStr;
  }
};

export const formatterMoney = (value: string | number) => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(Number(value));
};

export const transformCategoriesToOptions = (
  categories: CategoryType[] | undefined
): OptionType[] => {
  if (categories) {
    return categories.map((category) => {
      return {
        label: category.title,
        value: category.id,
      };
    });
  }
  return [];
};

export const transformTravellingToOption = (
  travellings: TravellingType[] | undefined
): OptionType[] => {
  if (travellings) {
    return travellings.map((travelling) => {
      return {
        label: travelling.title,
        value: travelling.id,
      };
    });
  }
  return [];
};

export const transformLocalsType = (
  locals: TravellingLocalType[] | undefined
): LocalTypeRegister[] => {
  if (locals) {
    return locals.map((local) => {
      return {
        localId: local[local.type].id,
        type: local.type,
        position: local.position,
      };
    });
  }
  return [];
};

export const transformStringToOptions = (values: string[] | undefined) => {
  if (values) {
    return values.map((value) => {
      return {
        label: value,
        value: value,
      };
    });
  }
  return [];
};

export const formatAddress = (input: string) => {
  const parts = input.split(",").map((item) => item.trim());
  const city_state = `${parts[2]} - ${parts[1]}`;
  return city_state;
};

export const formatDate = (dataEntrada: string): string => {
  // Converter a string em um objeto de data
  const dataObj = new Date(dataEntrada);

  // Formatar a data no formato desejado (dd/MM/yyyy)
  const dataFormatada = format(dataObj, "dd/MM/yyyy");

  return dataFormatada;
};

export const formatPriceRange = (
  startPrice: number,
  endPrice: number
): string => {
  const formattedStart = `R$ ${formatterNumeric(startPrice.toString())}`;
  const formattedEnd = `${formatterNumeric(endPrice.toString())}`;
  return `${formattedStart} à ${formattedEnd}`;
};

export const formatHours = (dataISOString: string): string => {
  const date = new Date(dataISOString);
  const localHours = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return localHours;
};

export const formatDaysOpen = (inputDays: string[]): string => {
  const orderedDays = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const dayShortcuts = {
    Segunda: "Seg",
    Terça: "Ter",
    Quarta: "Qua",
    Quinta: "Qui",
    Sexta: "Sex",
    Sábado: "Sab",
    Domingo: "Dom",
  };

  const mappedArray = orderedDays.map((day) => inputDays.includes(day));

  const firstTrueIndex = mappedArray.indexOf(true);
  const lastTrueIndex = mappedArray.lastIndexOf(true);

  if (firstTrueIndex !== -1 && lastTrueIndex !== -1) {
    const slicedArray = mappedArray.slice(firstTrueIndex, lastTrueIndex + 1);

    // Verifique se há 'false' no vetor cortado
    if (slicedArray.includes(false)) {
      const inputWithAnd = inputDays.map(
        (day) => dayShortcuts[day as keyof typeof dayShortcuts]
      );

      return inputWithAnd.join(", ").replace(/,([^,]*)$/, " e$1");
    } else {
      const inputShortcuts = inputDays.map(
        (day) => dayShortcuts[day as keyof typeof dayShortcuts]
      );
      const firstItem = inputShortcuts.shift();
      const lastItem = inputShortcuts.pop(); // Remove o último elemento da matriz

      return `${firstItem} à ${lastItem}`;
    }
  } else {
    return "-";
  }
};

export const generateQuery = (
  filters: FilterContextType["selectedFilters"]
) => {
  const searchParams = new URLSearchParams();
  filters.forEach(({ filterKey, value }) => {
    if (Array.isArray(value)) {
      // Se id for um array de strings, junte-os com vírgula
      const joinedIds = value.join(",");
      searchParams.append(filterKey, joinedIds);
    } else {
      searchParams.set(filterKey, value);
    }
  });
  return searchParams.toString();
};

export const setterCategoriesFromId = (
  categoriesId: CategoryType[] | undefined,
  categories: CategoryType[] | undefined
): OptionType[] => {
  const categoriesUpdated = categories
    ?.filter((categoryOriginal) => {
      return categoriesId?.some(
        (categoryShort) =>
          categoryShort.id === categoryOriginal.id &&
          categoryShort.title === categoryOriginal.title
      );
    })
    .map((category) => {
      return {
        label: category.title,
        value: category.id,
      };
    });

  return categoriesUpdated ?? [];
};

export const setterCategoriesFromIdString = (
  categoriesId: string[] | undefined,
  categories: CategoryType[] | undefined
) => {
  const categoriesUpdated = categories
    ?.filter((categoryOriginal) => {
      return categoriesId?.some(
        (categoryShort) =>
          categoryShort === categoryOriginal.id ||
          categoryShort === categoryOriginal.title
      );
    })
    .map((category) => {
      return {
        label: category.title,
        value: category.id,
      };
    });

  return categoriesUpdated;
};

export const reorder = (
  list: (AttractionType | EstablishmentType)[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const sortLocalsByPosition = (
  locals: TravellingLocalType[]
): (AttractionType | EstablishmentType)[] => {
  const sorted_travellings = locals.sort((a, b) => a.position - b.position);

  return sorted_travellings.map((travelling) => {
    return travelling[travelling.type];
  });
};

export const formatPhone = (phone: string): string => {
  const numeroStr = phone.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

  if (numeroStr.length === 11) {
    return `(${numeroStr.slice(0, 2)}) ${numeroStr[2]} ${numeroStr.slice(
      3,
      7
    )}-${numeroStr.slice(7)}`;
  } else {
    return phone;
  }
};
