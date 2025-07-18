# Todo App with Supabase

A simple todo application built with React, TypeScript, and Supabase.

## Features

- User authentication with Supabase Auth
- Create, read, update, and delete todos
- Add descriptions to todos
- Set deadlines for todos
- Real-time updates

## Development Setup

### Prerequisites

- Node.js (v18 or later)
- Supabase CLI (optional, for preview branch automation)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase project URL and anon key

### Running the App

```bash
npm run dev
```

## Preview Branch Testing

This project includes automation for testing with Supabase preview branches.

### Automatic Setup (Recommended)

```bash
npm run use:preview
```

This script will:
- **On main branch**: Remove `.env.local` to use production environment
- **On feature branches**: 
  - Try to fetch preview branch credentials from Supabase CLI
  - If branch doesn't exist, offer to manually enter credentials
  - Create `.env.local` with preview branch settings

### Manual Setup

If you prefer to manually set up preview branch testing:

1. Create a `.env.local` file
2. Add your preview branch credentials:
   ```
   VITE_SUPABASE_URL=https://your-preview-branch.supabase.co
   VITE_SUPABASE_ANON_KEY=your-preview-anon-key
   ```

### Workflow

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Push to GitHub and create a PR (this creates the Supabase preview branch)
3. Run `npm run use:preview` to set up local environment
4. Make your changes and test locally
5. Merge the PR to deploy to production

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run use:preview` - Set up preview branch environment

## Database Schema

The app uses a simple `todos` table with the following columns:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `title` (text)
- `description` (text, optional)
- `deadline` (date, optional)
- `completed` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)