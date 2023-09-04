import { PlusIcon } from 'lucide-react';
import React from 'react';
import ActionTooltip from '../action-tooltip';

export default function NavigationAction() {
  return (
    <section>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button
          aria-label="navigaton-action"
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
    </section>
  );
}
