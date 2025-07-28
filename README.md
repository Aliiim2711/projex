# ProjeX - Modern Kanban Project Management

![ProjeX Logo](https://img.shields.io/badge/ProjeX-Project%20Management-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)

## 🚀 Live Application
**Deployed URL:** [https://projex-n2us-69znx6rbs-aleems-projects-5695fbac.vercel.app/](https://projex-n2us-69znx6rbs-aleems-projects-5695fbac.vercel.app/)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Team Contributions](#team-contributions)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## 🎯 Overview

ProjeX is a modern, full-stack project management application built with Next.js that revolutionizes how teams organize and track their work using intuitive Kanban boards. The application provides a comprehensive solution for project management, featuring real-time collaboration, advanced analytics, and seamless team coordination.

### Problem Statement
Traditional project management tools are often either too complex for small teams or too simplistic for growing organizations. Teams struggle with scattered communication, lack of visual progress tracking, complex tool overload, and poor real-time collaboration.

### Our Solution
ProjeX addresses these challenges by providing:
- ✅ **Visual Task Management** with intuitive Kanban boards
- ✅ **Real-time Collaboration** with live updates across team members  
- ✅ **Complete Authentication System** with multiple login options
- ✅ **Rich Project Documentation** with advanced text editing capabilities
- ✅ **Advanced Analytics** with interactive data visualizations
- ✅ **Professional Team Management** with role-based access control

---

## ✨ Features

### 🔐 Authentication System
- **Multiple Sign-in Options**: Email/password, GitHub OAuth, Google OAuth
- **Secure User Management**: JWT tokens, session handling with NextAuth.js
- **Profile Customization**: Photo uploads, user descriptions, account settings
- **Password Security**: Secure password requirements and validation

### 📊 Project Management
- **Rich Text Editor**: TipTap integration for detailed project descriptions
- **Project Status Management**: Active/Closed project categorization
- **Project Analytics**: Visual insights with Recharts integration
- **Search & Filtering**: Advanced project discovery and organization

### 📋 Kanban Board System
- **Drag-and-Drop Interface**: Smooth task movement between columns
- **Customizable Workflows**: Add, rename, and organize columns
- **Task Management**: Detailed task creation with priorities, due dates, and assignments
- **Real-time Updates**: Live synchronization across all team members
- **Mobile Responsive**: Touch-friendly interactions on all devices

### 👥 Team Collaboration
- **Role-Based Access Control**: Owner, Admin, Member, Read-only permissions
- **Team Invitations**: Professional email invitations with Resend integration
- **Real-time Presence**: Live user activity and presence indicators
- **Activity Tracking**: Comprehensive audit trails and activity feeds

### 📈 Analytics & Insights
- **Interactive Charts**: Recharts-powered data visualizations
- **Project Metrics**: Task completion rates, team performance analytics
- **Progress Tracking**: Visual project progress and milestone tracking
- **Customizable Dashboards**: Configurable chart layouts and metrics

---

## 🛠 Tech Stack

### Frontend Technologies
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router for server-side rendering
- **[React 18](https://reactjs.org/)** - Component-based UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better development experience
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for responsive design
- **[Shadcn/UI](https://ui.shadcn.com/)** - Beautiful, accessible component library
- **[TipTap](https://tiptap.dev/)** - Rich text editor for project descriptions
- **[React DnD](https://react-dnd.github.io/react-dnd/)** - Drag-and-drop functionality for Kanban boards
- **[Recharts](https://recharts.org/)** - Data visualization and analytics charts
- **[Lucide React](https://lucide.dev/)** - Consistent and beautiful icon system

### Backend & Infrastructure
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service for database and real-time features
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Supabase Storage](https://supabase.com/storage)** - File storage for profile photos and attachments
- **[Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)** - Row Level Security for access control
- **[NextAuth.js](https://next-auth.js.org/)** - Comprehensive authentication system
- **[Resend](https://resend.com/)** - Professional email delivery service
- **[React Email](https://react.email/)** - Component-based email templates

### Development & Deployment
- **[Vercel](https://vercel.com/)** - Production deployment and hosting
- **[ESLint](https://eslint.org/)** - Code linting and quality assurance
- **[Prettier](https://prettier.io/)** - Code formatting and consistency

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed on your machine
- npm or yarn package manager
- Git for version control

### 1. Clone the Repository
```bash
git clone [YOUR_GITHUB_CLASSROOM_URL]
cd projex
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup
Create a `.env.local` file in the root directory and add the following variables:

```env
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service
RESEND_API_KEY=your_resend_api_key

# Storage
NEXT_PUBLIC_SUPABASE_STORAGE_URL=your_supabase_storage_url
```

### 4. Database Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in the Supabase SQL editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Project members with roles
CREATE TABLE project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'read' CHECK (role IN ('owner', 'admin', 'member', 'read')),
  invitation_status TEXT DEFAULT 'invited' CHECK (invitation_status IN ('invited', 'accepted', 'declined')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(project_id, user_id)
);

-- Kanban columns
CREATE TABLE columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tasks
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  column_id UUID REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  assignee_id UUID REFERENCES auth.users(id),
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Add your security policies here)
```

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
projex/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── auth/                 # NextAuth.js configuration
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main dashboard pages
│   ├── projects/                 # Project management pages
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── ui/                       # Shadcn/UI components
│   ├── auth/                     # Authentication components
│   ├── kanban/                   # Kanban board components
│   ├── projects/                 # Project-related components
│   └── TextEditor/               # TipTap rich text editor
├── lib/                          # Utility functions and configurations
│   ├── auth.ts                   # NextAuth configuration
│   ├── supabase.ts              # Supabase client setup
│   └── utils.ts                  # Common utilities
├── utils/                        # Additional utilities
│   └── supabase/                 # Supabase helpers
├── public/                       # Static assets
├── types/                        # TypeScript type definitions
└── README.md                     # Project documentation
```

---

## 👥 Team Contributions

### Team Member 1 - [Aleem] (Project Lead & Advanced Features)
**Primary Responsibilities:**
- **Project Architecture & Planning**: Overall system design and user experience flow
- **Project Insights & Analytics**: Recharts integration for data visualization
- **Access Management System**: Role-based permissions with Supabase RLS

**Specific Contributions:**
- Designed and implemented the complete project architecture
- Built interactive analytics dashboard with Recharts
- Developed team access management with role-based permissions
- Created project insights with real-time data visualization
- Coordinated team development and feature integration

**Key Technologies Used:**
- Recharts for data visualization
- Supabase RLS for access control
- Project planning and team coordination

**Major Challenges Solved:**
- Complex data visualization with real-time Supabase updates
- Frontend UI synchronization with backend permission policies
- Coordinating multiple team features into cohesive user experience

---

### Team Member 2 - Vaishnavi Reddy (Authentication & Security Specialist)
**Primary Responsibilities:**
- **Complete Authentication System**: Multi-provider login and security
- **Email Integration**: Professional invitation system with Resend

**Specific Contributions:**
- Implemented NextAuth.js with multiple OAuth providers (GitHub, Google)
- Built secure user registration and login flows
- Developed profile management with photo upload functionality
- Created email invitation system using Resend and React Email
- Implemented security best practices and data validation

**Key Technologies Used:**
- NextAuth.js for authentication
- Supabase Auth for user management
- Resend for email delivery
- React Email for template design
- Supabase Storage for file uploads

**Major Challenges Solved:**
- OAuth integration complexity with different provider data structures
- Secure file upload system with validation and virus protection
- Email delivery reliability with custom React Email templates
- Cross-domain authentication and session management

---

### Team Member 3 - Teesha (Project Management Specialist)
**Primary Responsibilities:**
- **Project Creation & Management**: Complete project lifecycle
- **Rich Text Editing**: TipTap editor integration

**Specific Contributions:**
- Built comprehensive project creation and management system
- Integrated TipTap rich text editor for project descriptions
- Developed project status management (Active/Closed)
- Created project search and filtering functionality
- Implemented project cards and dashboard interface

**Key Technologies Used:**
- TipTap for rich text editing
- React Hook Form for form management
- Supabase for data persistence
- Custom React components for UI

**Major Challenges Solved:**
- TipTap editor customization with markdown support
- Complex database relationship design for projects and users
- Rich text data persistence and retrieval optimization
- Responsive project management interface design

---

### Team Member 4 - Alexey (Kanban Board Specialist)
**Primary Responsibilities:**
- **Kanban Board System**: Core drag-and-drop functionality
- **Real-time Collaboration**: Live updates and synchronization

**Specific Contributions:**
- Built interactive Kanban board with React DnD
- Implemented smooth drag-and-drop task management
- Developed real-time collaboration features
- Created task detail modals and management system
- Optimized performance for large datasets

**Key Technologies Used:**
- React DnD for drag-and-drop
- Custom React hooks for state management
- Supabase Realtime for live updates
- TypeScript for type-safe operations

**Major Challenges Solved:**
- High-performance drag-and-drop with 60fps smooth animations
- Real-time state synchronization across multiple concurrent users
- Mobile-responsive touch-based drag operations
- Complex task relationship management and persistence

---

## 🔗 API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - User logout

### Project Management
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Kanban Board
- `GET /api/projects/[id]/columns` - Get project columns
- `POST /api/projects/[id]/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Team Management
- `POST /api/projects/[id]/invite` - Invite team member
- `GET /api/projects/[id]/members` - Get project members
- `PUT /api/projects/[id]/members/[userId]` - Update member role

---

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Build Settings**: Vercel automatically detects Next.js configuration
4. **Deploy**: Push to main branch triggers automatic deployment

### Manual Deployment Steps
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production
Ensure all environment variables are properly configured in your deployment platform:
- Database URLs and keys
- Authentication secrets
- OAuth provider credentials
- Email service API keys

---

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- Authentication flows
- Kanban board functionality
- Project management features
- Team collaboration features

---

## 🔮 Future Enhancements

### Planned Features
- **Advanced Analytics**: More detailed project insights and reporting
- **Mobile App**: Native iOS and Android applications
- **API Integration**: Slack, Discord, and Microsoft Teams notifications
- **Time Tracking**: Built-in time tracking and productivity metrics
- **Template System**: Pre-built project templates for different industries
- **Advanced Permissions**: Granular role-based access control
- **Offline Support**: Progressive Web App with offline capabilities

### Technical Improvements
- **Performance Optimization**: Enhanced caching and query optimization
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Multi-language support
- **Advanced Security**: Enhanced security features and audit logs

---

## 🤝 Contributing

This is a course project, but feedback and suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 🎉 Acknowledgments

- **Course Instructor**: For guidance and project requirements
- **Team Members**: For collaborative development and feature implementation
- **Open Source Community**: For the amazing tools and libraries used in this project

---

**Built with ❤️ by the ProjeX Team**
