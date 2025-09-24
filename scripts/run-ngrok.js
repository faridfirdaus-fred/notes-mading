// Script untuk menjalankan Ngrok dengan konfigurasi optimal
// Simpan sebagai run-ngrok.js dan jalankan dengan: node scripts/run-ngrok.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Pastikan ngrok terinstal
try {
  console.log('Checking ngrok installation...');
  execSync('ngrok --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Ngrok tidak terdeteksi. Pastikan ngrok terinstal dan tersedia di PATH.');
  console.log('Anda dapat menginstal ngrok dengan: npm install -g ngrok');
  process.exit(1);
}

// Ambil port dari .env file atau gunakan default
let port = 3000;
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const portMatch = envContent.match(/PORT=(\d+)/);
    if (portMatch && portMatch[1]) {
      port = parseInt(portMatch[1], 10);
    }
  }
} catch (error) {
  console.warn('⚠️ Error membaca file .env:', error.message);
}

// Jalankan ngrok dengan konfigurasi optimal
console.log(`\n🚀 Menjalankan ngrok untuk port ${port} dengan konfigurasi optimal untuk Next.js...`);
console.log('\n✅ Tips untuk upload gambar melalui ngrok:');
console.log('1. Pastikan semua variabel lingkungan Cloudinary dikonfigurasi dengan benar');
console.log('2. Gunakan file gambar dengan ukuran kurang dari 5MB');
console.log('3. Jika upload gagal, coba refresh halaman dan coba lagi\n');

try {
  // Gunakan execSync agar script tetap berjalan sampai ngrok dihentikan
  execSync(
    `ngrok http ${port} --host-header="localhost:${port}"`,
    { stdio: 'inherit' } // Teruskan output ke konsol
  );
} catch (error) {
  // Akan dieksekusi ketika ngrok dihentikan dengan Ctrl+C
  console.log('\n👋 Ngrok dihentikan.');
}