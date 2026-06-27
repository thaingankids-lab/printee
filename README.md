# Printee Design Graphic

Tai lieu van hanh va trien khai ung dung Printee Design Graphic.

## Tong quan

Printee Design Graphic la ung dung web Single-Page Application xay dung bang React, TypeScript va Vite.

Ung dung ho tro:

1. Phan tich phong cach thiet ke tu anh mau.
2. Tao poster graphic moi theo thanh pho duoc chon.
3. Tach lop mau CMYK phuc vu quy trinh in an.

## Ban quyen

Copyright (c) Hoang Nguyen. Toan bo noi dung, ma nguon, giao dien, cau truc ung dung, y tuong trien khai, prompt, hinh anh minh hoa va tai lieu di kem thuoc ban quyen cua Hoang Nguyen.

Cam sao chep, tai ban, phan phoi, chinh sua, dao tao lai, thuong mai hoa, ban lai, chuyen giao hoac su dung noi dung app duoi moi hinh thuc neu chua co su cho phep bang van ban cua chu so huu.

Viet app theo yeu cau, lien he: 0931325512.

## Co che truy cap

Ung dung co man hinh xac thuc don gian de gioi han quyen su dung:

- Mat khau truy cap: `printee@1234`
- Trang thai dang nhap duoc quan ly trong component chinh.

## Luong hoat dong

Ung dung gom 3 buoc chinh:

```text
[Tai anh mau len]
       |
       v
[Phan tich phong cach thiet ke]
       |
       v
[Tao poster theo thanh pho da chon]
       |
       v
[Tach 4 lop mau CMYK]
```

## Cau truc ma nguon

```text
.
|-- .env.local             # Bien moi truong local, khong commit len git
|-- .gitignore
|-- App.tsx                # Logic va giao dien chinh
|-- constants.ts           # Danh sach thanh pho
|-- index.html             # HTML goc
|-- index.tsx              # Diem mount React
|-- metadata.json          # Metadata ung dung
|-- package.json           # Dependencies va scripts
|-- tsconfig.json
|-- types.ts               # TypeScript interfaces
|-- vite.config.ts         # Cau hinh Vite
`-- components/
    |-- Icons.tsx
    `-- Spinner.tsx
```

## Cai dat local

Yeu cau:

- Node.js 18+ khuyen dung Node.js 20+
- NPM

Cai dependencies:

```bash
npm install
```

Tao file `.env.local`:

```env
APP_API_KEY=your_api_key_here
```

Chay development:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Ket qua build nam trong thu muc `dist`.

## Deploy Vercel

Thiet lap tren Vercel:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Them bien moi truong tren Vercel:

```env
APP_API_KEY=your_api_key_here
```

Sau khi them bien moi truong, redeploy project.
