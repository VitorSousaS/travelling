import { useContext } from "react";
import { Collapse, CollapseProps, Empty } from "antd";
import { PanelsLocalType } from "../../../../interfaces";
import { LocalCard, ModalRegisterLocals } from "../../..";
import { LocalContext } from "../../../../context";
import { motion } from "framer-motion";

interface LocalCollapseProps {
  panels: PanelsLocalType[];
}

interface CustomPanelProps {
  panel: PanelsLocalType;
}

const CustomPanel: React.FC<CustomPanelProps> = ({ panel }) => {
  return (
    <div className="flex flex-col w-full">
      <ModalRegisterLocals localType={panel.type} />
      {panel && panel.list?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap flex-grow gap-4 justify-start w-full"
        >
          {panel?.list.map((local, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <LocalCard type={panel.type} card={local} />
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <Empty
          description={
            <h1 className="text-auxiliary-beige text-base text-center select-none">
              Não há nada cadastrado!
            </h1>
          }
        />
      )}
    </div>
  );
};

export const LocalCollapse: React.FC<LocalCollapseProps> = ({ panels }) => {
  const { setMode, setOpen, setSelectedLocal } = useContext(LocalContext);

  const blockStyle = {
    marginBottom: 24,
    borderRadius: "1rem",
    border: "none",
    background: "#6B7D5C",
    padding: "0.5rem 0",
  };

  const genExtra = () => (
    <i
      className="fa-solid fa-square-plus text-xl text-secondary-light transition duration-200 hover:cursor-pointer hover:opacity-80"
      onClick={(event) => {
        event.stopPropagation();
        setOpen(true);
        setMode("create");
        setSelectedLocal(null);
      }}
    />
  );

  const items: CollapseProps["items"] = panels
    .filter((panel) => panel.enabled)
    .map((panel) => ({
      key: panel.key,
      label: (
        <p className="text-auxiliary-beige text-base select-none">
          {panel.title}
        </p>
      ),
      children: <CustomPanel panel={panel} />,
      style: blockStyle,
      extra: genExtra(),
    }));

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) =>
        isActive ? (
          <i className="fa-solid fa-chevron-down text-base text-auxiliary-beige" />
        ) : (
          <i className="fa-solid fa-chevron-right text-base text-auxiliary-beige" />
        )
      }
      items={items}
      style={{ background: "transparent" }}
    />
  );
};
