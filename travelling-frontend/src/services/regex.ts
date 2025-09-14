export const number = (e: React.FormEvent<HTMLInputElement>) => {
  const numericValue = e.currentTarget.value.replace(/\D/g, "");

  // Atualize o valor original no atributo personalizado
  e.currentTarget.setAttribute("data-original-value", numericValue);

  // Atualize o valor exibido no campo de entrada
  e.currentTarget.value = numericValue;

  return e;
};

export const currency = (e: React.FormEvent<HTMLInputElement>) => {
  // Remove todos os caracteres não numéricos
  const numericValue = e.currentTarget.value.replace(/\D/g, "");

  if (numericValue === "") {
    return ""; // Retorna uma string vazia se o valor for vazio
  }
  const cents = parseFloat(numericValue) / 100; // Converte centavos em reais

  const replacedValue = cents.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  e.currentTarget.value = replacedValue;

  return e;
};

export const formatCurrency = (value: number) => {
  const replacedValue = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return replacedValue;
};
