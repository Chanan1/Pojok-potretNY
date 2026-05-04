# 🎨 Pojok•Potret — Project Specification

## 📌 Overview
Pojok•Potret adalah web photobooth digital berbasis web yang memungkinkan user:
- mengambil foto
- mengedit hasil
- menggunakan template estetik
- serta memungkinkan creator membuat & membagikan template

---

## 🧭 Pages

### 🌐 Public Pages
- `/` → Landing (one-page storytelling)
- `/explore` → Eksplor template
- `/create` → Setup sebelum foto
- `/about` → Tentang (optional, bisa digabung landing)

---

### 📸 Core Feature Pages
- `/capture` → Kamera (Step 2)
- `/editor` → Editor (Step 3)

---

### 👨‍🎨 Creator Pages
- `/creator` → Creator Hub
- `/creator/upload` → Upload Template
- `/creator/settings` → Pengaturan akun
- `/profile/[username]` → Profil publik creator

---

## 🔄 User Flow

### 🧑 User Flow
Landing → Explore / Create → Capture → Editor → Download

---

### 👨‍🎨 Creator Flow
Creator Hub → Upload Template → Publish → Explore → Public Profile

---

## 🧩 Core Features

### 📸 Capture
- Kamera live
- Timer (3s / 5s / 10s)
- Layout frame (2,3,4,6,8)
- Upload foto manual
- Retake

---

### 🎨 Editor
Tools:
- Layout
- Warna
- Filter
- Teks
- Template
- Stiker
- Upload

Layout:
- Sidebar kiri (tools)
- Tengah (preview utama)
- Kanan (panel aktif)

---

### 🔍 Explore
- Filter kategori (Cute, Vintage, dll)
- Filter frame (2,3,4,6,8)
- Search
- Template grid (masonry)

---

### ✨ Create
- Pilih jumlah frame
- Pilih template
- Preview
- Start capture

---

### 👨‍🎨 Creator System
- Upload template PNG
- Auto detect frame dari template
- Preview live
- Publish template

---

### 👤 Profile Creator
- Nama, bio
- Template list
- Stats (template, usage, like)

---

### ⚙️ Settings
- Edit profile
- Social link
- Username
- Bio

---

## 🧠 Data Structure

### BoothSession

```ts
BoothSession = {
  photos: string[],
  layout: string,
  filter: string,
  templateId: string,
  stickers: [],
  texts: [],
}