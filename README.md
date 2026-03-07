# مِهني - Mihni Platform

A professional templates and tools platform for individuals, companies, and government agencies in Saudi Arabia.

## Project Migration

This project has been successfully converted from Vite/React to **Next.js 16 App Router**. The conversion includes:

- ✅ Next.js 16 with App Router (`src/app`)
- ✅ All routes migrated from react-router-dom to Next.js routing
- ✅ Updated navigation components to use Next.js Link
- ✅ Tailwind CSS configured for Next.js
- ✅ All original sections and pages preserved
- ✅ RTL Arabic support maintained
- ✅ Original design and visual identity preserved

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── login/page.tsx     # Login page
│   ├── register/page.tsx  # Registration page
│   ├── dashboard/page.tsx # Dashboard page
│   ├── account/page.tsx   # Account management
│   ├── support/page.tsx   # Support page
│   ├── templates/page.tsx # Templates page
│   └── start/page.tsx     # Getting started page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── tools/            # Tool-specific components
│   └── auth/             # Authentication components
├── sections/             # Homepage sections
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Tools.tsx
│   ├── Templates.tsx
│   ├── Pricing.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   ├── HowItWorks.tsx
│   ├── Dashboard.tsx
│   └── Footer.tsx
├── lib/                  # Utilities and libraries
│   ├── routes.ts        # Route definitions
│   ├── api/             # API utilities
│   ├── auth/            # Authentication
│   ├── billing/         # Billing logic
│   └── entitlements/    # Feature entitlements
├── contexts/            # React contexts
├── hooks/              # Custom hooks
└── data/              # Data files

```

## Key Features

- **Homepage**: Hero section, features, pricing, testimonials, FAQ
- **Authentication**: Login, registration pages
- **Dashboard**: User dashboard with statistics
- **Tools**: Various productivity tools (templates generator, calculators, etc.)
- **Templates**: Browse and download templates
- **Responsive Design**: Mobile-first design approach
- **Dark Mode**: Theme support with Tailwind CSS
- **RTL Support**: Full Arabic language support with RTL layout
- **Billing**: Plan management and payment integration

## Technologies Used

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Sonner**: Toast notifications
- **Lucide React**: Icon library
- **shadcn/ui**: Accessible UI components

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
```

## Deployment

This project is optimized for deployment on Vercel:

```bash
npm run build
vercel deploy
```

Or simply push to GitHub and connect with Vercel for automatic deployments.

## Notes

- All react-router-dom imports have been replaced with Next.js Link and useRouter
- The project maintains the original design and user experience
- All API endpoints remain compatible
- Tailwind CSS is properly configured for Next.js

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
