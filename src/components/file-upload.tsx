'use client';

import { UploadButton } from '@/lib/uploadthing';
import React from 'react';

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import '@uploadthing/react/styles.css';
import Image from 'next/image';
import { XIcon } from 'lucide-react';

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
          className="absolute top-0 ring-0 bg-rose-500 text-white p-1 rounded-full shadow-sm "
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log('upload File : ', res);
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        console.log('upload error : ', error);
      }}
    />
  );
}
