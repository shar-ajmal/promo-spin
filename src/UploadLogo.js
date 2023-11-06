import { useEffect, useState } from "react";
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


export default function UploadLogo({imagePreviewUrl, setImagePreviewUrl, file, setFile}) {

    const handleFileChange = (info) => {
        if (info.file.status === 'removed') {
            // Clear the preview and the file state
            console.log("we're removing the file")
            setImagePreviewUrl(false);
            setFile(null);
            return
        }
        
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

    return (
        <div>
            <Upload onChange={handleFileChange}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {console.log("printing image previuew url")}
            {console.log(imagePreviewUrl)}
            {imagePreviewUrl && <img class="image-preview" src={imagePreviewUrl} alt="Preview" />}
        </div>
    )
}