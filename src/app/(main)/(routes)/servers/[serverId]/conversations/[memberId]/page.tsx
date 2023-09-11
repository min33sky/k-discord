import React from 'react';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

export default function MemberIdPage({ params }: ChannelIdPageProps) {
  return (
    <div>
      MemberIdPage {params.serverId} - {params.memberId}
    </div>
  );
}
