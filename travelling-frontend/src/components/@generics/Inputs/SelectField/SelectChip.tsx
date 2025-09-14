import { OptionType } from "../../../../interfaces";

interface SelectChipProps {
  item: OptionType;
  toggleSelection: (item: OptionType) => void;
}

export const SelectChip: React.FC<SelectChipProps> = ({
  item,
  toggleSelection,
}) => {
  return (
    <div
      key={item.value}
      className="flex items-center justify-center bg-primary-dark rounded-lg px-3 py-1 gap-2 select-none"
    >
      <p className="text-auxiliary-beige text-sm">{item.label}</p>
      <i
        className="fa-solid fa-xmark ml-auto text-auxiliary-beige text-sm"
        onClick={(e) => {
          e.stopPropagation();
          toggleSelection(item);
        }}
      />
    </div>
  );
};
