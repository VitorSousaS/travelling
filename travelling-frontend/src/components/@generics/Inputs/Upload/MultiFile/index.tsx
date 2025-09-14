import React, { ReactElement, useEffect, useState } from "react";
import { Upload, message } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { removeFile, uploadFile } from "../../../../../services";

type FileResponse = {
  url: string;
  uid: string;
};

interface MultiFileProps {
  label: string;
  defaultFiles: string[];
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
        className="h-full w-auto hover:cursor-pointer hover:opacity-80"
        src={file.url || file.thumbUrl}
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 items-center justify-center z-10">
        <i
          onClick={actions.preview}
          className="fa-regular fa-eye text-auxiliary-beige hover:cursor-pointer hover:opacity-90 z-10 text-xs"
        />
        <i
          onClick={actions.remove}
          className="fa-solid fa-trash text-auxiliary-beige hover:cursor-pointer hover:opacity-90 z-10 text-xs"
        />
      </div>
    </div>
  );
};

export const MultiFile: React.FC<MultiFileProps> = ({
  label,
  defaultFiles,
  onChange,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [filesUrl, setFilesUrl] = useState<FileResponse[]>([]);

  useEffect(() => {
    if (defaultFiles && defaultFiles.length > 0) {
      const defaultInitial: UploadFile[] = defaultFiles.map(
        (fileUrl, index) => {
          return {
            uid: `${index}`,
            name: fileUrl.split("/media/")[1] ?? "default",
            status: "done",
            url: fileUrl,
            thumbUrl: fileUrl,
          };
        }
      );
      const filesUrlDefault = defaultFiles.map((fileUrl, index) => {
        return {
          uid: `${index}`,
          url: fileUrl,
        };
      });
      setFileList(defaultInitial);
      setFilesUrl(filesUrlDefault);
    } else {
      setFileList([]);
    }
  }, [defaultFiles]);

  const onChangeFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    try {
      if (fileList.length <= newFileList.length) {
        const formData = new FormData();
        newFileList.forEach((file, index) => {
          if (file.originFileObj && index === newFileList.length - 1) {
            formData.append("files", file.originFileObj);
          }
        });
        const response = await uploadFile(formData);

        const fileUrl = response.data.url;
        if (!!fileUrl) {
          setFilesUrl((filesUrl) => [
            ...filesUrl,
            { url: fileUrl, uid: fileUrl.split("media/")[1] },
          ]);
          setFileList(newFileList);
        } else {
          message.error("Ocorreu um erro ao enviar um arquivo.");
        }
      }
    } catch (error) {
      message.error("Ocorreu um erro ao enviar um arquivo.");
    }
  };

  useEffect(() => {
    onChange(filesUrl.map((file) => file.url));
  }, [filesUrl]);

  const onRemove: UploadProps["onRemove"] = async (file: UploadFile) => {
    // Lógica para remover um arquivo da lista
    const indexFile = fileList.indexOf(file);

    const indexFileUrl = filesUrl.findIndex(
      (fileUrl) =>
        fileUrl.uid.includes(file.name) || fileUrl.url.includes(file.name)
    );

    if (indexFile !== -1 && indexFileUrl !== -1) {
      try {
        await removeFile(
          file.url?.split("/media/")[1] ?? filesUrl[indexFileUrl].uid
        );
        const newFileList = [...fileList];
        newFileList.splice(indexFile, 1);
        setFileList(newFileList);

        const newFileUrlList = [...filesUrl];
        newFileUrlList.splice(indexFileUrl, 1);
        setFilesUrl(newFileUrlList);
      } catch (error) {
        message.info("Arquivo já foi removido ou ocorreu um erro.");
      }
    }
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
    <div
      className={`text-primary-light flex flex-col items-center justify-center gap-1 ${
        fileList.length > 4 && "cursor-not-allowed"
      }`}
    >
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
          id="upload-multi"
          accept=".png,.jpg,.jpeg"
          listType="picture-card"
          beforeUpload={() => false}
          multiple={false}
          fileList={fileList}
          itemRender={(node, file, files, actions) => (
            <ItemRenderPreview
              originNode={node}
              file={file}
              fileList={files}
              actions={actions}
            />
          )}
          onChange={onChangeFiles}
          onPreview={onPreview}
          onRemove={onRemove}
          maxCount={4}
          className="text-primary-light"
        >
          {uploadButton}
        </Upload>
      </div>
    </div>
  );
};
