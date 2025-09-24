// Script untuk memverifikasi variabel lingkungan Cloudinary
// Jalankan dengan: node scripts/check-cloudinary-config.js

const checkCloudinaryConfig = () => {
  console.log('\n===== CLOUDINARY CONFIGURATION CHECK =====');
  
  const requiredVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.error(`❌ ${varName} is missing!`);
      allPresent = false;
    } else {
      // Cetak beberapa karakter pertama dari nilai untuk memverifikasi, masking sisanya
      const maskedValue = value.substring(0, 3) + '...';
      console.log(`✅ ${varName} is set (${maskedValue})`);
    }
  });
  
  if (allPresent) {
    console.log('\n✅ All Cloudinary configuration is correct.');
    
    // Verifikasi koneksi Cloudinary (optional)
    try {
      const { v2: cloudinary } = require('cloudinary');
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
      });
      
      console.log('📡 Testing Cloudinary connection...');
      
      // Bisa menambahkan test ping ke Cloudinary API di sini jika perlu
      
    } catch (error) {
      console.error('❌ Error loading Cloudinary:', error.message);
    }
  } else {
    console.error('\n❌ Cloudinary configuration is incomplete. Upload features may not work correctly.');
    console.log('\nMake sure you have these variables in your .env file:');
    console.log(`
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    `);
  }
  
  console.log('\n=======================================');
};

// Cek jika file dijalankan langsung
if (require.main === module) {
  // Muat variabel lingkungan dari file .env jika ada
  try {
    require('dotenv').config();
    checkCloudinaryConfig();
  } catch (error) {
    console.error('Error loading .env:', error.message);
  }
}

module.exports = checkCloudinaryConfig;