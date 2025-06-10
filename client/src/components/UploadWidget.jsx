import { useEffect } from "react";

export default function UploadWidget({ uwfConfig, setState }) {
  useEffect(() => {
    // Ensure that the Cloudinary widget is loaded before using it.
    if (!window.cloudinary) {
      console.error("Cloudinary widget not loaded.");
    }
  }, []);

  const handleUpload = () => {
    // Ensure window.cloudinary is available before calling createUploadWidget
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: uwfConfig.cloudName,
          uploadPreset: uwfConfig.uploadPreset,
          multiple: uwfConfig.multiple,
          maxImageFileSize: uwfConfig.maxImageFileSize,
          folder: uwfConfig.folder,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("✅ Uploaded:", result.info.secure_url, result.info);
            setState(prev=>[...prev,result.info.secure_url]);
          }
        }
      );
      widget.open();
    } else {
      console.error("Cloudinary widget is not initialized yet.");
    }
  };

  return (
    <button
      type="button"
      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      onClick={handleUpload}
    >
      Upload New Photo
    </button>
  );
}
