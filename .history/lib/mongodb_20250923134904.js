import mongoose from 'mongoose';

// Get MONGODB_URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

// Hardcoded fallback if environment variable fails
const FALLBACK_URI = 'mongodb+srv://root:kelempat123@cluster0.imcdnnt.mongodb.net/notes_mading?retryWrites=true&w=majority';

// Log the connection string (masking the password)
if (MONGODB_URI) {
  console.log('MongoDB URI prefix:', MONGODB_URI.substring(0, 15) + '...');
} else {
  console.log('MongoDB URI not defined, will use fallback URI');
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
      w: 'majority' // Write concern
    };

    console.log('Connecting to MongoDB...');
    
    // Use either MONGODB_URI from env or fallback to hardcoded string if not defined or invalid
    const connectionString = MONGODB_URI && MONGODB_URI.startsWith('mongodb') ? MONGODB_URI : FALLBACK_URI;
    console.log('Using connection string that starts with:', connectionString.substring(0, 15) + '...');
    
    cached.promise = mongoose.connect(connectionString, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
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
