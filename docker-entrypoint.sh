#!/bin/sh

# Script to generate .env file from environment variables at container startup
# This is useful when using Docker with environment variables from outside

# Output file
ENV_FILE=./.env

echo "Generating .env file from environment variables..."

# MongoDB URI
if [ -n "$MONGODB_URI" ]; then
  echo "MONGODB_URI=$MONGODB_URI" > $ENV_FILE
else
  echo "MONGODB_URI=mongodb://mongo:27017/notes_mading" > $ENV_FILE
  echo "Using default MongoDB connection for Docker"
fi

# Cloudinary Configuration
if [ -n "$CLOUDINARY_CLOUD_NAME" ]; then
  echo "CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME" >> $ENV_FILE
fi

if [ -n "$CLOUDINARY_API_KEY" ]; then
  echo "CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY" >> $ENV_FILE
fi

if [ -n "$CLOUDINARY_API_SECRET" ]; then
  echo "CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET" >> $ENV_FILE
fi

# NODE_ENV
if [ -n "$NODE_ENV" ]; then
  echo "NODE_ENV=$NODE_ENV" >> $ENV_FILE
else
  echo "NODE_ENV=production" >> $ENV_FILE
fi

# PORT
if [ -n "$PORT" ]; then
  echo "PORT=$PORT" >> $ENV_FILE
else
  echo "PORT=3000" >> $ENV_FILE
fi

echo ".env file generated successfully"

# Start the actual application
exec "$@"