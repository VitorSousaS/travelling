import React, { ReactElement, useEffect, useState } from "react";
import { Upload, message } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { removeFile, uploadFile } from "../../../../../services";

interface SingleFileProps {
  label: string;
  defaultFileUrl?: string;
  onChange: (fileUrl: string[]) => void;
}

interface ItemRenderProps {
  originNode: ReactElement;
  file: UploadFile;
  fileList: object[];
  actions: { download: () => void; preview: () => void; remove: () => void };
}

const ItemRenderPreview: React.FC<ItemRenderProps> = ({
  originNode,
  file,
  actions,
}) => {
  return (
    <div className={originNode.props.className}>
      <img
        className="h-auto w-20 hover:cursor-pointer hover:opacity-80"
        src={file.url || file.thumbUrl}
        onClick={actions.preview}
      />
      <a href={file.url || file.thumbUrl} target="_blank" className="ml-4">
        {file.name}
      </a>
      <i
        onClick={actions.remove}
        className="fa-solid fa-trash absolute right-4 hover:cursor-pointer hover:opacity-90"
      />
    </div>
  );
};

export const SingleFile: React.FC<SingleFileProps> = ({
  defaultFileUrl,
  label,
  onChange,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(defaultFileUrl ?? "");

  useEffect(() => {
    if (defaultFileUrl && defaultFileUrl.length > 0) {
      const defaultInitial: UploadFile[] = [
        {
          uid: "-1",
          name: defaultFileUrl?.split("/media/")[1] ?? "default",
          status: "done",
          url: defaultFileUrl ?? "",
          thumbUrl: defaultFileUrl ?? "",
        },
      ];
      setFileList(defaultInitial);
    } else {
      setFileList([]);
    }
  }, [defaultFileUrl]);

  const onChangeFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    try {
      if (fileList.length <= newFileList.length) {
        if (!!fileUrl) {
          await handleRemove();
        }

        const formData = new FormData();

        newFileList.forEach((file, index) => {
          if (file.originFileObj && index === newFileList.length - 1) {
            formData.append("files", file.originFileObj);
          }
        });

        const response = await uploadFile(formData);

        const currentFileUrl = response.data.url;

        if (!!currentFileUrl) {
          onChange(currentFileUrl);
          setFileUrl(currentFileUrl);
          setFileList(newFileList);
        } else {
          message.error("Ocorreu um erro ao enviar um arquivo.");
        }
      }
    } catch (error) {
      message.error("Ocorreu um erro ao enviar um arquivo.");
    }
  };

  const handleRemove = async () => {
    try {
      const validateUrl = fileUrl.split("/media/")[1];
      if (!!validateUrl) {
        await removeFile(validateUrl);
        setFileUrl("");
        setFileList([]);
      } else {
        message.error("Ocorreu um erro ao remover um arquivo.");
      }
    } catch (error) {
      message.error("Ocorreu um erro ao remover um arquivo.");
    }
  };

  const onRemove: UploadProps["onRemove"] = async () => {
    await handleRemove();
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const uploadButton = (
    <div className="text-primary-light flex flex-col items-center justify-center gap-1 border border-dashed border-primary-light p-4 rounded-lg">
      <i className="fa-solid fa-plus" />
      <div className="mt-2">Upload</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-normal text-auxiliary-beige text-sm focus-within:font-semibold">
        {label}
      </label>
      <div className="resize-none py-3 px-5 w-full text-base rounded-[0.625rem] text-primary-dark bg-auxiliary-beige border border-auxiliary-beige focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-darkOpacity">
        <Upload
          id="upload-single"
          accept=".png,.jpg,.jpeg"
          listType="picture"
          beforeUpload={() => false}
          multiple={false}
          fileList={fileList}
          onChange={onChangeFiles}
          onPreview={onPreview}
          onRemove={onRemove}
          maxCount={1}
          itemRender={(node, file, files, actions) => (
            <ItemRenderPreview
              originNode={node}
              file={file}
              fileList={files}
              actions={actions}
            />
          )}
          className="text-primary-light"
        >
          {fileList.length < 1 && uploadButton}
        </Upload>
      </div>
    </div>
  );
};
