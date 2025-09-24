import mongoose from 'mongoose';

// Get MONGODB_URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

// Jika dijalankan di Docker, cek untuk koneksi MongoDB container
const DOCKER_MONGODB_URI = process.env.NODE_ENV === 'production' && !MONGODB_URI 
  ? 'mongodb://mongo:27017/notes_mading'
  : null;

// Hardcoded fallback if environment variable fails (gunakan hanya untuk development)
const FALLBACK_URI = process.env.NODE_ENV === 'development' 
  ? 'mongodb+srv://root:kelempat123@cluster0.imcdnnt.mongodb.net/notes_mading?retryWrites=true&w=majority'
  : null;

// Tentukan URI yang akan digunakan
const URI_TO_USE = MONGODB_URI || DOCKER_MONGODB_URI || FALLBACK_URI;

// Log the connection string (masking the password)
if (URI_TO_USE) {
  console.log('MongoDB URI prefix:', URI_TO_USE.substring(0, 15) + '...');
  if (DOCKER_MONGODB_URI === URI_TO_USE) {
    console.log('Using Docker MongoDB container connection');
  }
} else {
  console.error('No MongoDB URI available. Please set MONGODB_URI environment variable.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 60000, // Increased timeout
      family: 4,
      retryWrites: true, // Enable retry writes
      w: 'majority', // Write concern
      // Opsi tambahan untuk Docker
      connectTimeoutMS: 60000, // 60 seconds connection timeout
    };

    console.log('Connecting to MongoDB...');
    
    // Periksa apakah URI_TO_USE valid, jika tidak tampilkan pesan error
    if (!URI_TO_USE || !URI_TO_USE.startsWith('mongodb')) {
      throw new Error('Invalid MongoDB connection string. Please check your environment variables.');
    }

    console.log('Using connection string that starts with:', URI_TO_USE.substring(0, 15) + '...');
    
    cached.promise = mongoose.connect(URI_TO_USE, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        
        // Jika gagal terhubung ke MongoDB container dan dalam Docker environment, coba lagi dengan delay
        if (process.env.NODE_ENV === 'production' && URI_TO_USE === DOCKER_MONGODB_URI) {
          console.log('MongoDB container might still be starting. Retrying in 5 seconds...');
          // Tunggu 5 detik dan coba lagi
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(mongoose.connect(URI_TO_USE, opts));
            }, 5000);
          });
        }
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Clear the failed promise so a new one can be created on next request
    cached.promise = null;
    
    // Return a fallback connection or throw a more descriptive error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('MONGODB CONNECTION FAILED. Using in-memory fallback for development.');
      // In development, we can return a mock connection or continue with limited functionality
      return { 
        connection: { db: null },
        isConnected: false,
        isFallback: true
      };
    }
    
    // In production, we should still throw but with more context
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

export default connectToDatabase;
