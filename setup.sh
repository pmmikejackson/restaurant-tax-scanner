#!/bin/bash

echo "🚀 Setting up Texas Restaurant Tax Scanner Database System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created (.env)"
    echo "⚠️  Please update .env with your actual configuration values"
else
    echo "✅ Environment file already exists"
fi

# Initialize database
echo "🗄️  Initializing database..."
npm run init-db

if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize database"
    exit 1
fi

echo "✅ Database initialized successfully"

# Populate cities (optional)
echo "🏙️  Populating cities database..."
node scripts/populate-cities.js

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Failed to populate cities (this is optional)"
else
    echo "✅ Cities populated successfully"
fi

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with actual configuration values"
echo "2. Add your Google Maps API key to config.js"
echo "3. Start the server with: npm start"
echo "4. Access the main app at: http://localhost:3000"
echo "5. Access the admin panel at: http://localhost:3000/admin"
echo "   Default login: admin / admin123"
echo ""
echo "📚 For detailed documentation, see DATABASE_README.md"
echo ""
echo "⚠️  Security reminders:"
echo "- Change the default admin password immediately"
echo "- Update JWT_SECRET in .env for production"
echo "- Never commit .env or config.js to version control" 