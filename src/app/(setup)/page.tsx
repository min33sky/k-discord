import prisma from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import React from 'react';
import { redirect } from 'next/navigation';
import InitialModal from '@/components/modals/initial-modal';

export default async function SetupPage() {
  const profile = await initialProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center font-bold text-lg">
        서버 에러.............................................
      </div>
    );
  }

  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
