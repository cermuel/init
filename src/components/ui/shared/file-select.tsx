"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

type FileSelectProps = {
  label: string;
  accept: string;
  onSelect: (file: File) => void;
};

const FileSelect = ({ label, accept, onSelect }: FileSelectProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      onSelect(file);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 hover:border-[#737cde] bg-white dark:bg-[#24313e] p-4 text-center transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <UploadCloud className="mx-auto mb-2 text-gray-500" size={28} />
      <p className="text-sm font-semibold">{selectedFileName ?? label}</p>
      <p className="text-xs text-gray-500">Click to upload {accept}</p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileSelect;
