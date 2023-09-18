'use client';

import { Button } from '../ui/button';
import { DialogHeader, Dialog, DialogContent, DialogTitle } from '../ui/dialog';

import { Input } from '../ui/input';
import { useModal } from '@/hooks/useModalStore';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { Label } from '../ui/label';
import useOrigin from '@/hooks/useOrigin';
import { useState } from 'react';
import { updateServerInviteCode } from '@/actions/server.action';

export default function InviteModal() {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'INVITE_MEMBER';
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  /**
   * 초대 링크를 클립보드에 복사한다
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  /**
   * 새로운 초대 링크를 생성한다
   */
  const handleNewLink = async () => {
    if (!server) return;

    try {
      setIsLoading(true);

      // TODO: 서버에 요청을 보내서 새로운 초대 링크를 생성한다
      const response = await updateServerInviteCode(server.id);

      // TODO: 모달 상태를 업데이트한다. onOpen()을 사용한다
      onOpen('INVITE_MEMBER', {
        server: response,
      });
    } catch (error) {
      console.log('새 초대 링크 생성에 실패했습니다', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            친구 초대하기
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            초대 링크
          </Label>

          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={handleCopy} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <Button
            onClick={handleNewLink}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            초대 링크 새로 만들기
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
