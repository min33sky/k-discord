# K-Discord

Next13 (serverActions) + Clerk + Prisma + UploadThing + socket.io + react-query + LiveKit

## Getting Started

1. install

```bash
pnpm i
```

2. DB Schema Generation

```bash
pnpm prisma generate
```

3. Start

```bash
pnpm dev
```

## Environment Variables

```bash
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/


UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

NEXT_PUBLIC_SITE_URL=http://localhost:3000

# LiveKit
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

## Note

1. **zod@3.21.4**를 설치하자

- [링크](https://github.com/colinhacks/zod/issues/2663)

2. ws관련 next.js Error (Can't resolve 'bufferutil' and 'utf-8-validate) 해결하기

- `next@13.4.12` 설치

- next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });

    return config;
  },
  images: {
    domains: ['uploadthing.com'],
  },
};

module.exports = nextConfig;
```

3. `uploadthing` css 파일과 `pretendard` 폰트를 cdn에서 불러오는 코드가 충돌함. 일단 폰트 대체로 해결

4. `vercel`이 아닌 `railway`를 이용해 배포함.

- 이유는 `vercel`은 **serverless** 서비스라 `websocket`을 사용할 수 없다.
