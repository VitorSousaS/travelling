import { useState } from "react";
import { tv } from "tailwind-variants";
import { OptionType } from "../../../../interfaces";

interface MenuDropdownProps {
  isOpen: boolean;
  options: OptionType[];
  selectedItem: OptionType | null;
  toggleSelection: (item: OptionType) => void;
}

const content = tv({
  base: "flex flex-col gap-2 max-h-[12rem] transition-opacity overflow-scroll transform origin-top absolute z-10 mt-2 bg-auxiliary-beige border rounded-md shadow-lg w-full p-1",
  variants: {
    isOpen: {
      true: "opacity-100 scale-100",
      false: "opacity-0 scale-0",
    },
  },
});

const dropdownItem = tv({
  base: "p-2 rounded-md cursor-pointer hover:bg-primary-light hover:text-auxiliary-beige",
  variants: {
    includes: {
      true: "bg-primary-light text-auxiliary-beige",
      false: "",
    },
  },
});

export const MenuDropdown: React.FC<MenuDropdownProps> = ({
  isOpen,
  options,
  selectedItem,
  toggleSelection,
}) => {
  const [search, setSearch] = useState<string>("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={content({ isOpen })} onClick={(e) => e.preventDefault()}>
      <input
        className="w-full px-2 py-1 text-primary-dark text-sm rounded border border-primary-light focus:border-primary-dark focus:outline-none"
        type="text"
        placeholder="Buscar travelling..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredOptions.map((option) => {
        const isSelected = selectedItem?.value === option.value;
        return (
          <div
            key={option.value}
            onClick={() => toggleSelection(option)}
            className={dropdownItem({
              includes: isSelected,
            })}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};
