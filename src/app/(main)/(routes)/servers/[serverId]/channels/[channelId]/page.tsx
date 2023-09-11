import React from 'react';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

export default function ChannelIdPage({ params }: ChannelIdPageProps) {
  return (
    <div>
      Channel ID Page - {params.serverId} - {params.channelId}{' '}
    </div>
  );
}
