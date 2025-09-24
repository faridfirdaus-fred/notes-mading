# Panduan Docker untuk Notes Mading App

Dokumen ini berisi petunjuk untuk menjalankan aplikasi Notes Mading menggunakan Docker di berbagai lingkungan.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Menjalankan Aplikasi dengan Docker Compose

### 1. Setup Environment Variables

Salin file `.env.docker` menjadi `.env`:

```bash
cp .env.docker .env
```

Edit file `.env` dan isi dengan konfigurasi yang sesuai:

```
# MongoDB Connection - Gunakan salah satu
MONGODB_URI=mongodb://mongo:27017/notes_mading  # Untuk menggunakan MongoDB container
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes_mading  # Untuk MongoDB eksternal

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Node Environment
NODE_ENV=production
```

### 2. Menjalankan Aplikasi

#### Development Environment

```bash
# Build dan jalankan aplikasi dalam mode development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

#### Production Environment

```bash
# Build dan jalankan aplikasi dalam mode production
docker-compose up --build -d
```

### 3. Mengakses Aplikasi

- Aplikasi utama: `http://localhost:3000`
- MongoDB: `localhost:27017`
- Ngrok dashboard (jika digunakan): `http://localhost:4040`

## Menggunakan Ngrok

Ngrok sudah dikonfigurasi dalam docker-compose untuk membuat aplikasi dapat diakses dari internet. Untuk menggunakannya:

1. Dapatkan Ngrok authtoken dari [Ngrok Dashboard](https://dashboard.ngrok.com/)
2. Tambahkan authtoken ke file `.env`:

```
NGROK_AUTHTOKEN=your_ngrok_auth_token
```

3. Jalankan docker-compose dengan layanan ngrok:

```bash
docker-compose up -d
```

4. Akses dashboard Ngrok di `http://localhost:4040` untuk melihat URL publik yang dihasilkan

## Menggunakan MongoDB

### Opsi 1: MongoDB Container (Default)

Dalam konfigurasi default, aplikasi akan terhubung ke container MongoDB yang dijalankan bersama aplikasi.

### Opsi 2: MongoDB Atlas atau MongoDB Eksternal

Untuk menggunakan MongoDB Atlas atau MongoDB eksternal lainnya:

1. Komentar layanan `mongo` di docker-compose.yml atau jalankan tanpa layanan tersebut:

```bash
docker-compose up -d app
```

2. Update `.env` dengan URI MongoDB eksternal:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes_mading
```

## Troubleshooting

### Aplikasi tidak dapat terhubung ke MongoDB

1. Pastikan container MongoDB sudah berjalan:
   ```bash
   docker-compose ps
   ```

2. Periksa log MongoDB:
   ```bash
   docker-compose logs mongo
   ```

3. Jika menggunakan MongoDB eksternal, pastikan URI MongoDB sudah benar dan server MongoDB dapat diakses dari container Docker.

### Masalah dengan Cloudinary Upload

1. Pastikan konfigurasi Cloudinary di `.env` sudah benar.
2. Periksa log aplikasi:
   ```bash
   docker-compose logs app
   ```

## Menyesuaikan untuk Lingkungan Produksi

Untuk deployment produksi, disarankan untuk:

1. Menggunakan volume Docker yang lebih persisten
2. Menambahkan konfigurasi keamanan tambahan
3. Mengatur strategi backup untuk MongoDB
4. Menggunakan reverse proxy seperti Nginx untuk menangani SSL

### Contoh konfigurasi Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Deployment di Server Ubuntu

### 1. Persiapan Server

Instal Docker dan Docker Compose:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Tambahkan user ke grup docker (opsional)
sudo usermod -aG docker $USER
```

### 2. Clone Repositori

```bash
git clone https://github.com/yourusername/notes-mading.git
cd notes-mading
```

### 3. Konfigurasi Environment

```bash
cp .env.docker .env
nano .env  # Edit sesuai kebutuhan
```

### 4. Jalankan Aplikasi

```bash
docker-compose up -d
```

## Perintah Docker yang Berguna

```bash
# Melihat status container
docker-compose ps

# Melihat logs
docker-compose logs

# Melihat logs aplikasi saja dan follow
docker-compose logs -f app

# Restart aplikasi
docker-compose restart app

# Menghentikan semua container
docker-compose down

# Menghentikan dan menghapus semua volume (hapus data)
docker-compose down -v

# Rebuild aplikasi setelah perubahan kode
docker-compose build app
docker-compose up -d app
```