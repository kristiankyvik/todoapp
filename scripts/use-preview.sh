#!/bin/bash

# Script to automatically set up .env.local with preview branch credentials

# Get current git branch
BRANCH=$(git branch --show-current)

# Check if we're on main branch
if [ "$BRANCH" = "main" ]; then
  echo "🏠 On main branch - removing .env.local to use production environment"
  rm -f .env.local
  echo "✅ Now using production environment from .env"
  exit 0
fi

echo "🌿 On branch: $BRANCH"
echo "🔍 Fetching preview branch credentials from Supabase..."

# Try to get branch environment variables using Supabase CLI
BRANCH_ENV=$(supabase branches get "$BRANCH" -o env 2>/dev/null)

if [ $? -ne 0 ]; then
  echo "❌ No Supabase preview branch found for: $BRANCH"
  echo ""
  echo "This could mean:"
  echo "   1. The branch doesn't exist in Supabase yet (create a PR to auto-create it)"
  echo "   2. Supabase CLI is not authenticated (run: supabase login)"
  echo "   3. The branch name doesn't match exactly"
  echo ""
  echo "🔧 Options:"
  echo "   - Create a GitHub PR to auto-create the Supabase preview branch"
  echo "   - Manually enter preview branch credentials"
  echo "   - Use production environment (remove .env.local)"
  echo ""
  
  # Ask if user wants to manually enter credentials
  read -p "Do you want to manually enter preview branch credentials? (y/n): " manual_entry
  
  if [ "$manual_entry" = "y" ] || [ "$manual_entry" = "Y" ]; then
    echo ""
    read -p "Enter Supabase URL: " API_URL
    read -p "Enter Anon Key: " ANON_KEY
    
    if [ -n "$API_URL" ] && [ -n "$ANON_KEY" ]; then
      cat > .env.local << EOF
# Manual preview branch credentials for: $BRANCH
VITE_SUPABASE_URL=$API_URL
VITE_SUPABASE_ANON_KEY=$ANON_KEY
EOF
      echo "✅ Created .env.local with manual credentials"
      echo "🚀 Preview branch URL: $API_URL"
      exit 0
    else
      echo "❌ Invalid credentials provided"
      exit 1
    fi
  else
    echo "💡 Create a GitHub PR to auto-generate the Supabase preview branch"
    exit 1
  fi
fi

# Extract the API URL and anon key
API_URL=$(echo "$BRANCH_ENV" | grep "API_URL=" | cut -d'=' -f2)
ANON_KEY=$(echo "$BRANCH_ENV" | grep "ANON_KEY=" | cut -d'=' -f2)

if [ -z "$API_URL" ] || [ -z "$ANON_KEY" ]; then
  echo "❌ Could not extract API URL or anon key from branch environment"
  echo "Raw output:"
  echo "$BRANCH_ENV"
  exit 1
fi

# Create .env.local file
cat > .env.local << EOF
# Preview branch credentials for: $BRANCH
VITE_SUPABASE_URL=$API_URL
VITE_SUPABASE_ANON_KEY=$ANON_KEY
EOF

echo "✅ Created .env.local with preview branch credentials"
echo "🚀 Preview branch URL: $API_URL"
echo ""
echo "💡 Run 'npm run dev' to start with preview environment"