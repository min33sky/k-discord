import React from 'react';
import MobileToggle from '../mobile-toggle';
import { HashIcon } from 'lucide-react';
import UserAvatar from '../user-avatar';
import SocketIndicator from '../socket-indicator';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

export default function ChatHeader({
  name,
  serverId,
  type,
  imageUrl,
}: ChatHeaderProps) {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <HashIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="w-8 h-8 md:h-6 md:w-6 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>

      {/* Socket-IO Indicator */}
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
}
