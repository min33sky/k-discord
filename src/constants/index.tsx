import { MemberRole } from '@prisma/client';
import { ShieldAlertIcon, ShieldCheckIcon } from 'lucide-react';

export const ROLE_ICON_MAP = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheckIcon className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: (
    <ShieldAlertIcon className="h-4 w-4 ml-2 text-rose-500" />
  ),
};
