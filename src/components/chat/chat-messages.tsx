'use client';

import useChatQuery from '@/hooks/use-chat-query';
import { Member } from '@prisma/client';
import { Loader2, ServerCrashIcon } from 'lucide-react';
import React, { Fragment } from 'react';
import ChatWelcome from './chat-welcome';
import { MessageWithMemberWithProfile } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import ChatItem from './chat-item';
import useChatSocket from '@/hooks/use-chat-socket';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl?: string; //? 필요 없을듯
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

export default function ChatMessages({
  name,
  member,
  chatId,
  apiUrl, //! TODO: 삭제 예정
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });

  if (status === 'loading') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrashIcon className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT, {
                  locale: ko,
                })}
                isUpdated={
                  new Date(message.updatedAt).getTime() !==
                  new Date(message.createdAt).getTime()
                }
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
