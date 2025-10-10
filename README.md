# Church Admin - Feeding Centre Management System

A modern Next.js application for managing church feeding centres with admin authentication and member management.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **UI Components**: Headless UI
- **Testing**: Jest + React Testing Library

## Features

- 🔐 Admin authentication with Supabase
- 📊 Dashboard with key metrics
- 👥 Member management
- 📤 Data import functionality
- 💬 Messaging system
- 📅 Event scheduling
- 🔔 Notifications
- ⚙️ Admin settings
- 📱 Responsive design
- ♿ Accessibility features

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd churchDatabase
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard page
│   └── login/              # Login page
├── components/             # Reusable UI components
│   ├── __tests__/          # Component tests
│   ├── AuthGuard.tsx       # Route protection
│   ├── Button.tsx          # Button component
│   ├── Header.tsx          # App header
│   ├── Input.tsx           # Input component
│   ├── Layout.tsx          # Main layout
│   ├── Modal.tsx           # Modal component
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Table.tsx           # Data table
│   └── Toast.tsx           # Notification system
├── hooks/                  # Custom React hooks
│   └── useAuth.ts          # Authentication hook
├── lib/                    # Utility libraries
│   ├── reactQueryClient.ts # React Query setup
│   └── supabaseClient.ts   # Supabase client
└── tests/                  # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Components

### Core Components

- **Button**: Customizable button with variants (primary, secondary, outline, ghost)
- **Input**: Form input with validation support
- **Select**: Dropdown select component
- **Table**: Data table with sorting and loading states
- **Modal**: Accessible modal dialog
- **ConfirmationDialog**: Confirmation modal for destructive actions
- **Avatar**: User avatar with fallback initials
- **Toast**: Notification system

### Layout Components

- **Header**: App header with user info and logout
- **Sidebar**: Collapsible navigation sidebar
- **Layout**: Main app layout wrapper
- **Footer**: App footer
- **AuthGuard**: Route protection component

## Authentication

The app uses Supabase for authentication. The `useAuth` hook provides:

- User session management
- Sign in/out functionality
- Loading states
- Automatic session refresh

## Testing

Tests are written using Jest and React Testing Library. Run tests with:

```bash
npm test
```

Test files are located in `components/__tests__/` and follow the naming convention `*.test.tsx`.

## Styling

The app uses Tailwind CSS with a custom configuration. Key features:

- Custom color palette (primary/secondary)
- Responsive design utilities
- Component-specific styles in `globals.css`
- Dark mode support (ready for implementation)

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
