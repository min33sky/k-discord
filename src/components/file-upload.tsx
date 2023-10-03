'use client';

import Image from 'next/image';
import { FileIcon, XIcon } from 'lucide-react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import UploadDropzone from './upload-dropzone';

interface FileUploadProps {
  onChange: (url?: string) => void; // Form onChange handler
  value: string; // Form value (File URL)
  endpoint: keyof OurFileRouter; // uploadthing endpoint
}

export default function FileUpload({
  onChange,
  value,
  endpoint,
}: FileUploadProps) {
  /**
   * 기본적으로 이미지 업로드 존을 보여주고,
   * 업로드 완료 후에는 해당 이미지를 보여준다.
   */

  const fileType = value?.split('.').pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="upload Image" className="rounded-full" />
        <button
          aria-label="remove image"
          type="button"
          onClick={() => onChange('')}
          className="absolute top-0 right-0 bg-rose-500 text-white p-1 rounded-full shadow-sm "
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === 'pdf') {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return <UploadDropzone endpoint={endpoint} callback={onChange} />;
}
