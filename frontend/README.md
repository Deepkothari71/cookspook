# Cookie Scanner

A modern web application that helps website owners ensure their cookie banners comply with privacy regulations like GDPR, CCPA, and ePrivacy Directive.

## Features

- 🔍 **Compliance Check**: Automatic scanning against all major privacy regulations
- 📊 **Detailed Reports**: Comprehensive analysis with actionable insights
- ⚡ **Quick Solutions**: Ready-to-implement fixes for common cookie banner issues
- 🎨 **Modern UI**: Beautiful and responsive design with smooth animations
- 🔒 **Privacy First**: Built with user privacy in mind

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Custom components with modern effects
- **State Management**: React Context API

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd cookie-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI components
│   │   └── layout/      # Layout components
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/yourusername/cookie-scanner/issues) section
2. Create a new issue if your problem isn't already listed

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the Next.js and Tailwind CSS communities for their excellent documentation and support
