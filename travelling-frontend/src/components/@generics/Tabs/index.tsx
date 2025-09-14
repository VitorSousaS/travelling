import { tv } from "tailwind-variants";

const tabItem = tv({
  base: "h-full flex flex-col items-center justify-center relative transition duration-200 hover:cursor-pointer hover:text-secondary-light",
  variants: {
    isSelected: {
      true: "text-secondary-light border-secondary-light xs:text-xs sm:text-sm",
      false: "text-auxiliary-beige xs:text-xs sm:text-sm",
    },
  },
});

interface TabsProps {
  tabs: string[];
  selected: string;
  onChange: (selected: string) => void;
}

interface TabItemProps {
  label: string;
  onChange: (selected: string) => void;
  selected: string;
}

const DICT_LABEL_TO_STATUS = {
  Solicitações: "Pendente",
  Confirmados: "Confirmado",
  Cancelados: "Cancelado",
  Finalizados: "Finalizado",
};

const TabItem: React.FC<TabItemProps> = ({ label, selected, onChange }) => {
  const isSelected =
    selected ===
    DICT_LABEL_TO_STATUS[label as keyof typeof DICT_LABEL_TO_STATUS];

  return (
    <div className={tabItem({ isSelected })} onClick={() => onChange(label)}>
      <p className="select-none">{label}</p>
      {isSelected && (
        <div className="absolute bottom-0 bg-secondary-light h-1 rounded-lg w-full" />
      )}
    </div>
  );
};

export const Tabs: React.FC<TabsProps> = ({ tabs, onChange, selected }) => {
  return (
    <div className="rounded-lg mt-16 w-2/3 flex bg-primary-light justify-evenly h-20 xs:w-[90%] xs:h-16 sm:w-[90%] sm:h-16">
      {tabs.map((label) => {
        return (
          <TabItem
            key={label}
            label={label}
            onChange={onChange}
            selected={selected}
          />
        );
      })}
    </div>
  );
};
