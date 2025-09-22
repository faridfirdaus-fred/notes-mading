import mongoose from 'mongoose';

// Get MONGODB_URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

// Optional: Add a local development fallback URI if needed
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/notes_mading';

// Log the connection string (masking the password)
console.log('MongoDB URI prefix:', MONGODB_URI?.substring(0, 15) + '...');

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment variables. Using fallback connection.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  // Clear previous promise if there was a connection error
  if (cached.connectionError) {
    cached.promise = null;
    cached.connectionError = false;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('Connecting to MongoDB...');
    
    // Try connection strings in order: MONGODB_URI -> LOCAL_MONGODB_URI
    const connectionStrings = [];
    
    if (MONGODB_URI) {
      connectionStrings.push({
        uri: MONGODB_URI,
        name: "Atlas"
      });
    }
    
    connectionStrings.push({
      uri: LOCAL_MONGODB_URI,
      name: "Local"
    });
    
    // Try connections sequentially
    let lastError = null;
    for (const conn of connectionStrings) {
      try {
        console.log(`Attempting to connect to ${conn.name} MongoDB...`);
        const mongoose_instance = await mongoose.connect(conn.uri, opts);
        console.log(`✅ Successfully connected to ${conn.name} MongoDB`);
        cached.promise = Promise.resolve(mongoose_instance);
        return mongoose_instance;
      } catch (error) {
        console.error(`❌ Failed to connect to ${conn.name} MongoDB:`, error.message);
        lastError = error;
      }
    }
    
    // If we get here, all connections failed
    cached.connectionError = true;
    
    const errorMessage = `
    ====== MongoDB Connection Failed ======
    
    Failed to connect to any MongoDB instance. 
    
    If using MongoDB Atlas:
    1. Check that your IP address is whitelisted in Atlas: 
       https://www.mongodb.com/docs/atlas/security-whitelist/
    2. Verify your connection string is correct
    3. Ensure your MongoDB user has the correct permissions
    
    If using local MongoDB:
    1. Ensure MongoDB is running locally
    2. Check that the connection port is correct
    
    Original error: ${lastError?.message}
    =====================================
    `;
    
    console.error(errorMessage);
    throw new Error("Failed to connect to any MongoDB instance");
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.connectionError = true;
    throw error;
  }
}

export default connectToDatabase;
