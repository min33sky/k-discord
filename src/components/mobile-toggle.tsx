import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';
import NavigationSidebar from './navigation/navigation-sidebar';
import { ServerSidebar } from './server/server-sidebar';
import { Button } from './ui/button';

/**
 * 모바일 뷰에서 사이드바를 보여줄 수 있는 버튼
 * @param {string} serverId
 */
export default function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}
