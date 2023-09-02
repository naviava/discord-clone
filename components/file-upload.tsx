"use client";

import Image from "next/image";

import { X } from "lucide-react";
import "@uploadthing/react/styles.css";
import { UploadDropzone } from "@/lib/uploadthing";
import { memo, useMemo } from "react";

interface FileUploadProps {
  endpoint: "messageFile" | "serverImage";
  value: string;
  onChange: (url?: string) => void;
}

function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = useMemo(() => value?.split(".").pop(), [value]);

  if (value && fileType !== "pdf")
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Server image"
          className="rounded-full object-contain"
        />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => console.log(error)}
    />
  );
}

export default memo(FileUpload);
