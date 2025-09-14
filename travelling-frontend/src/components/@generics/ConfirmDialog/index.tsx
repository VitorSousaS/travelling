import { Modal } from "antd";
import { ReactNode } from "react";
import { Button } from "../..";

interface ConfirmDialogProps {
  title: string;
  content: ReactNode;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  loading,
  open,
  content,
  title,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title={<p className="px-2 text-secondary-light text-xl">{title}</p>}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            key="back"
            label="Cancelar"
            onConfirm={onCancel}
            className="w-fit py-1 bg-transparent border border-secondary-light text-secondary-light"
          />
          <Button
            key="submit"
            label={loading ? "Carregando..." : "Ok"}
            onConfirm={onOk}
            className="w-fit py-1"
          />
        </div>
      }
    >
      <div className="p-2">{content}</div>
    </Modal>
  );
};
