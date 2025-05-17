import axios from "axios";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY;

export const uploadIconToCloudinary = async (
  file: File,
  display_name: string,
  onProgress?: (percent: number) => void
) => {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      file: base64,
      upload_preset: "init_icons",
      context: `caption=${display_name}|alt=${display_name}`,
      filename_override: display_name,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          console.log({ progressEvent });
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          onProgress(percent);
        }
      },
    }
  );

  return res;
};
