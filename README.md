# Notes Mading

A collaborative note-sharing web app. Students post short notes to a shared board (a digital *mading*, or wall magazine), attach images, and browse notes from their team.

Notes are stored in MongoDB and images are uploaded to Cloudinary. The whole app is containerized so it can be run with a single command.

## Features

- **Create, edit, and delete notes**
- **Image attachments** uploaded to Cloudinary
- **Team page** grouping notes by author
- **Fresh notes API** for recent posts
- **Docker Compose setup** bundling the app and MongoDB
- **Dark, responsive UI** built with Tailwind CSS

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) |
| Database | MongoDB with Mongoose |
| Media | Cloudinary |
| Styling | Tailwind CSS |
| Containerization | Docker + Docker Compose |

## Getting started

### With Docker (recommended)

```bash
cp .env.docker .env
# fill in your Cloudinary credentials
docker compose up --build
```

The app is available at http://localhost:3000.

### Local development

```bash
npm install
npm run dev
```

You will need a running MongoDB instance, either local or a MongoDB Atlas cluster.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NGROK_AUTHTOKEN` | Optional, for exposing the dev server |
| `PORT` | Application port, defaults to 3000 |

## API routes

| Route | Methods | Description |
| --- | --- | --- |
| `/api/notes` | GET, POST | List all notes, create a note |
| `/api/notes/[id]` | GET, PUT, DELETE | Read, update, delete a single note |
| `/api/fresh-notes` | GET | Most recent notes |
| `/api/upload` | POST | Upload an image to Cloudinary |

## Project structure

```
app/
  api/           # Route handlers (notes, fresh-notes, upload)
  create/        # Note creation page
  edit/[id]/     # Note editing page
  team/          # Team view
lib/mongodb.js   # Database connection helper
```

See `DOCKER_GUIDE.md` for container details.
