import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

interface ImageUploaderProps {
    fileList: UploadFile[];
    setFileList: (files: UploadFile[]) => void;
}

const ImageUploader = ({ fileList, setFileList }: ImageUploaderProps) => {
    const handleChange = ({ fileList }: UploadChangeParam) => {
        setFileList(fileList);
    };

    return (
        <Upload.Dragger
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleChange}
            accept="image/*"
            multiple
            listType="picture-card"
            showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: true,
                removeIcon: <DeleteOutlined className="text-red-500" />,
            }}
            className="mb-6"
        >
            {fileList.length === 0 && (
                <div className="p-4">
                    <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                    <p className="text-gray-600">Haz clic o arrastra imágenes aquí</p>
                    <p className="text-gray-400 text-sm">Formatos soportados: JPG, PNG</p>
                </div>
            )}
        </Upload.Dragger>
    );
};

export default ImageUploader;
