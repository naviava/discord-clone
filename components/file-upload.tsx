"use client";

import { memo, useMemo } from "react";
import Image from "next/image";

import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";

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

  if (value && fileType === "pdf")
    return (
      <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 transition hover:underline dark:text-indigo-400"
        >
          {value}
        </a>
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
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
