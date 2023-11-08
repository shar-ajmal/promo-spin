import { useEffect, useState } from "react";
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


export default function UploadLogo({imagePreviewUrl, setImagePreviewUrl, file, setFile}) {
    const [fileList, setFileList] = useState([])

    const handleFileChange = (info) => {
        if (info.file.status === 'removed') {
            // Clear the preview and the file state
            console.log("we're removing the file")
            setImagePreviewUrl(false);
            setFile(null);
            setFileList([])
            return
        }

        console.log("looking at file list")
        console.log(info.fileList)
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        console.log(newFileList)
        setFileList(newFileList);

        if (info.file.originFileObj) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreviewUrl(e.target.result); // Data URL for the image preview
        };
        reader.readAsDataURL(info.file.originFileObj);
        setFile(info.file.originFileObj); // Store the file itself in state
        }

        console.log("looking at file change")
        console.log(info.file.status)
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          console.error('You can only upload JPG/PNG file!');
        }
        // const isSingle = fileList.length < 1;
        // if (!isSingle) {
        //   console.error('You can only upload one file!');
        // }
        // return isJpgOrPng && isSingle;
        return isJpgOrPng
      };
    
      const handleChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1); // Only keep the last one
    
        // Update the state:
        setFileList(newFileList);
    
        // You can also handle the status of upload here:
        if (info.file.status === 'done') {
          console.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          console.error(`${info.file.name} file upload failed.`);
        }
      };

    return (
        <div>
            <Upload fileList={fileList} beforeUpload={beforeUpload} onChange={handleFileChange}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {console.log("printing image previuew url")}
            {console.log(imagePreviewUrl)}
            {imagePreviewUrl && <img class="image-preview" src={imagePreviewUrl} alt="Preview" />}
        </div>
    )
}