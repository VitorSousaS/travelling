import { OptionType } from "../../../interfaces";

interface ChipListProps {
  title: string;
  chips: OptionType[];
}

interface ChipProps {
  chip: OptionType;
}

const Chip: React.FC<ChipProps> = ({ chip }) => {
  return (
    <div
      key={chip.value}
      className="flex items-center justify-center bg-secondary-dark rounded-md px-3 py-1 gap-2 select-none"
    >
      <p className="text-auxiliary-beige text-sm">{chip.label}</p>
    </div>
  );
};

export const ChipList: React.FC<ChipListProps> = ({ title, chips }) => {
  return (
    <div className="flex flex-col w-full my-4">
      <h2 className="font-semibold text-primary-dark text-2xl py-4">{title}</h2>
      <div className="w-full p-4 flex items-center flex-wrap flex-grow gap-2 bg-primary-light rounded-lg">
        {chips.map((chip) => {
          return <Chip key={chip.value} chip={chip} />;
        })}
      </div>
    </div>
  );
};
