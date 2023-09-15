'use client';

import { UploadButton } from '@/lib/uploadthing';
import React, { useState } from 'react';

import Image from 'next/image';
import { FileIcon, XIcon } from 'lucide-react';
import { Progress } from './ui/progress';

interface FileUploadProps {
  onChange: (url?: string) => void; // Form onChange handler
  value: string; // Form value (File URL)
  endpoint: 'messageFile' | 'serverImage'; // uploadthing endpoint
}

export default function FileUpload({
  onChange,
  value,
  endpoint,
}: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  /**
   * 기본적으로 이미지 업로드 존을 보여주고,
   * 업로드 완료 후에는 해당 이미지를 보여준다.
   */

  const fileType = value?.split('.').pop();

  if (isLoading) {
    return (
      <div className="flex flex-col w-[200px]">
        <Progress
          value={progressValue}
          className="w-full h-4 border border-blue-500 bg-blue-500 rounded-full overflow-hidden"
        />
      </div>
    );
  }

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

  return (
    <>
      <UploadButton
        className="cursor-pointer ut-button:transition-colors ut-button:hover:bg-blue-600 ut-button:p-2 ut-button:ut-uploading:p-0 ut-button:bg-blue-500 ut-button:ut-readying:bg-blue-500/50"
        onUploadBegin={(temp) => {
          console.log('준비 : ', temp);
          setIsLoading(true);
        }}
        onUploadProgress={(progress) => {
          console.log('진행 : ', progress);
          setProgressValue(progress);
        }}
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log('upload File : ', res);
          onChange(res?.[0].url);
          setIsLoading(false);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          console.log('upload error : ', error);
          setIsLoading(false);
        }}
      />
    </>
  );
}
