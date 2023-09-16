# K-Discord

Next13 (serverActions) + Clerk + Prisma + UploadThing + socket.io + react-query

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

```

## Note

1. **zod@3.21.4**를 설치하자

- [링크](https://github.com/colinhacks/zod/issues/2663)

2. ws관련 next.js Error (Can't resolve 'bufferutil' and 'utf-8-validate)

- 다음 패키지 설치

```bash
npm install --save-dev utf-8-validate@5.0.10 bufferutil@4.0.7 supports-color@8.1.1
```

- next.config.js

```js
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
        'supports-color': 'supports-color',
      });
    }

    return config;
  },
};
```

3. `uploadthing` css 파일과 `pretendard` 폰트를 cdn에서 불러오는 코드가 충돌함. 일단 폰트 대체로 해결
