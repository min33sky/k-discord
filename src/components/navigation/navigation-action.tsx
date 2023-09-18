'use client';

import { PlusIcon } from 'lucide-react';
import ActionTooltip from '../action-tooltip';
import { useModal } from '@/hooks/useModalStore';

export default function NavigationAction() {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side="right" align="center" label="서버 추가하기">
        <button
          aria-label="navigaton-action button"
          onClick={() => onOpen('CREATE_SERVER')}
          className="group flex items-center"
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <PlusIcon
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}
