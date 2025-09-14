import { ReactNode } from "react";
import { Modal as AntdModal } from "antd";

interface ModalProps {
  title: string | JSX.Element;
  open: boolean;
  setOpen: (value: boolean) => void;
  children: JSX.Element;
  footer?: ReactNode[];
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  setOpen,
  children,
  footer = [],
}) => {
  return (
    <AntdModal
      open={open}
      onCancel={() => setOpen(false)}
      title={title}
      width={"clamp(16rem, 90vw, 780px)"}
      closeIcon={
        <i className="fa-solid fa-xmark" onClick={() => setOpen(false)} />
      }
      centered
      destroyOnClose
      footer={footer}
    >
      <div>{children}</div>
    </AntdModal>
  );
};
