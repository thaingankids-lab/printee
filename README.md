# Printee Design Graphic

Tai lieu van hanh va trien khai ung dung Printee Design Graphic.

## Tong quan

Printee Design Graphic la ung dung web Single-Page Application xay dung bang React, TypeScript va Vite.

Ung dung ho tro:

1. Nhap va test API key truc tiep tren giao dien.
2. Tai anh mau lam visual reference.
3. Tao poster graphic moi theo thanh pho duoc chon.
4. Tai anh graphic da tao ve may.

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
[Nhap va test API key]
       |
       v
[Tai anh mau len]
       |
       v
[Tao poster theo thanh pho da chon]
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

Mac dinh ung dung cho phep nguoi dung nhap va test API key truc tiep tren giao dien. Key chi duoc giu trong bo nho cua phien web hien tai, khong luu vao localStorage hoac cookie.

Neu muon dat key mac dinh khi chay local, tao file `.env.local`:

```env
APP_API_KEY=your_api_key_here
```

Neu ban da co san bien ten `API_KEY` hoac `GEMINI_API_KEY`, app van se doc duoc. Uu tien khuyen dung `APP_API_KEY`. Key nguoi dung nhap tren giao dien se duoc uu tien hon key mac dinh.

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

Vercel khong bat buoc phai cau hinh API key. Nguoi dung co the tu nhap API key tren web khi su dung.

Neu muon dat key mac dinh cho ban deploy, them bien moi truong tren Vercel:

```env
APP_API_KEY=your_api_key_here
```

Co the dung `API_KEY` hoac `GEMINI_API_KEY` neu project cua ban da dat san ten do. Key nguoi dung nhap tren web se duoc uu tien hon key mac dinh cua Vercel.

Sau khi them hoac sua bien moi truong, bat buoc redeploy project de Vercel build lai bundle.
