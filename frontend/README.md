# TulasiAI Labs Frontend

A modern, startup-level Next.js 14 frontend for TulasiAI Labs with dark mode, smooth animations, and real-time API integration.

## Features

### Authentication
- **Supabase Auth** - Secure authentication with email/password
- **Protected Routes** - Automatic redirect for unauthenticated users
- **User Profile Management** - Complete user onboarding

### Modern UI/UX
- **Dark Mode Default** - Professional dark theme inspired by Stripe/Vercel
- **Framer Motion Animations** - Smooth transitions and micro-interactions
- **Responsive Design** - Mobile-first approach with proper breakpoints
- **Glass Morphism** - Modern card designs with backdrop blur

### Core Pages
- **Dashboard** - Real-time stats, tasks, and skills overview
- **Skills Management** - Add, edit, and track technical skills
- **Tasks** - Daily task management with completion tracking
- **Career Prediction** - AI-powered career insights
- **Notifications** - Real-time notification system

### State Management
- **Zustand Store** - Efficient state management with persistence
- **API Integration** - Real backend communication with error handling
- **Loading States** - Skeleton loaders and empty states

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **Animations**: Framer Motion
- **State**: Zustand
- **API**: Axios
- **Auth**: Supabase
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tulasi-ai-labs/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup:
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (auth)/              # Authentication group
      login/
      signup/
    dashboard/            # Main dashboard
    skills/               # Skills management
    tasks/                # Task management
    career/              # Career prediction
    notifications/       # Notification center
    globals.css          # Global styles
    layout.tsx           # Root layout
  components/
    layout/              # Layout components
      Layout.tsx
      Navbar.tsx
      Sidebar.tsx
    ui/                  # Reusable UI components
      Button.tsx
      Card.tsx
    dashboard/           # Dashboard-specific components
      NotificationCenter.tsx
  lib/
    api-client.ts        # API client with Axios
    supabase-client.ts   # Supabase authentication
    utils.ts             # Utility functions
  store/
    store.ts             # Zustand state management
```

## API Integration

The frontend is fully integrated with the FastAPI backend:

### Authentication Flow
1. User signs up/logs in via Supabase
2. Frontend receives user ID from Supabase
3. Frontend creates/updates profile in backend
4. User data stored in Zustand store

### Data Flow
- **Real API Calls** - No mock data, everything from backend
- **Error Handling** - Proper error states and user feedback
- **Loading States** - Skeleton loaders during API calls
- **Optimistic Updates** - Immediate UI feedback

## Design System

### Colors
- **Primary**: Zinc-950 background with zinc-100 text
- **Accent**: Blue-500 for primary actions
- **Gradients**: Blue-to-purple for CTAs
- **Semantic**: Green for success, red for errors

### Typography
- **Hierarchy**: Clear font sizes and weights
- **Readability**: High contrast for accessibility
- **Consistency**: Uniform spacing and alignment

### Components
- **Buttons**: Hover effects, loading states, variants
- **Cards**: Glass morphism with proper shadows
- **Forms**: Modern inputs with focus states
- **Navigation**: Collapsible sidebar with smooth transitions

## Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality
- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Component Structure** - Consistent patterns
- **Error Boundaries** - Proper error handling

## Deployment

### Environment Variables
Required for production:
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
NEXT_PUBLIC_API_URL=your_production_api_url
```

### Build Process
```bash
npm run build
npm run start
```

## Features in Detail

### Dashboard
- **Real-time Stats**: Job readiness, streak, skills, tasks
- **Quick Actions**: Easy access to common tasks
- **Recent Activity**: Latest tasks and skills
- **Responsive Layout**: Works on all screen sizes

### Skills Management
- **CRUD Operations**: Create, read, update, delete skills
- **Progress Tracking**: Visual progress bars
- **Categories**: Organize skills by type
- **Proficiency Levels**: Track skill improvement

### Task Management
- **Daily Tasks**: AI-generated task suggestions
- **Task Types**: Learning, projects, practice, reviews
- **Priority Levels**: Urgent, high, medium, low
- **Completion Tracking**: Mark tasks as complete

### Career Prediction
- **AI Analysis**: Based on current skills and interests
- **Role Suggestions**: Career path recommendations
- **Salary Insights**: Expected salary ranges
- **Learning Roadmaps**: Step-by-step improvement plans

## Performance

### Optimizations
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Optimized dependencies
- **Caching**: Proper API response caching

### Monitoring
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Fast load times
- **User Analytics**: Track user interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
