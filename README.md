# Momenic - Digital Wedding Invitation Platform

A modern React-based web application for creating and managing digital wedding invitations with beautiful themes and customization options.

## Features

- **Multiple Theme Options**: Browse through various wedding invitation themes including 3D Motion, Art, and Luxury designs
- **Photo/No-Photo Options**: Choose between themes with or without photo galleries
- **Pricing Tiers**: Clear pricing structure with discounts displayed
- **Music Selection**: Browse and select background music for invitations
- **Responsive Design**: Fully responsive interface that works on all devices
- **Multi-language Support**: Interface available in Indonesian

## Tech Stack

- **Frontend**: React 18 with React Router for navigation
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for modern UI icons
- **Deployment**: Configured for both Vercel and cPanel hosting

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Page components for different routes
- `/src/data`: JSON data files for themes and pricing
- `/src/hooks`: Custom React hooks
- `/src/assets`: Static assets like images

## Deployment

The project is configured for deployment on both Vercel and cPanel:

- **Vercel**: Uses `vercel.json` for route configuration
- **cPanel**: Uses `.htaccess` for Apache configuration and `deploy.js` for build preparation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

All rights reserved. This is a proprietary project.
