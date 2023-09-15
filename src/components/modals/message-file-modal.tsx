'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModalStore';
import FileUpload from '../file-upload';
import qs from 'query-string';
import axios from 'axios';

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: 'Attachment is required',
  }),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * 파일 업로드 모달
 */
export default function MessageFileModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'MESSAGE_FILE';
  const { apiUrl, query } = data;

  console.log('테스트용: ', apiUrl, query);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      });

      const response = await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      console.log('파일 전송 성공 : ', response.data);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log('파일 업로드 실패', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            파일 첨부하기
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            채팅방에 파일을 업로드 할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                업로드
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
