# BloodBridge - Blood Donation Management System

A modern, full-featured blood donation management system built with React.js, featuring a responsive UI, state management, and a complete admin & user dashboard.

## 🚀 Tech Stack

### Frontend Framework & Libraries
- **React 18.3** - UI Library
- **Vite** - Build tool and dev server
- **React Router DOM 6** - Client-side routing
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Reusable component system
- **Framer Motion** - Animation library
- **Class Variance Authority** - Component variants
- **Tailwind Merge & CLSX** - Conditional styling utilities

### Forms & Validation
- **React Hook Form** - Form state management
- **Yup** - Schema validation
- **@hookform/resolvers** - Integration layer

### API & HTTP
- **Axios** - HTTP client
- **RTK Query** - Advanced data fetching

### Notifications & Icons
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library
- **React Icons** - Additional icons

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Shadcn-style base components
│   ├── BloodGroupCard.jsx
│   ├── StatCard.jsx
│   ├── TestimonialCard.jsx
│   └── DataTable.jsx
├── pages/            # Page components
│   ├── admin/        # Admin dashboard pages
│   │   ├── AdminDashboard.jsx
│   │   ├── BloodInventory.jsx
│   │   ├── PublicRequests.jsx
│   │   ├── HospitalRequests.jsx
│   │   ├── Donors.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── user/         # User dashboard pages
│   │   ├── UserDashboard.jsx
│   │   ├── DonorHistory.jsx
│   │   └── TrackDonation.jsx
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── HospitalRegister.jsx
├── layouts/          # Layout components
│   ├── MainLayout.jsx
│   ├── AdminLayout.jsx
│   ├── UserLayout.jsx
│   ├── Navbar.jsx
│   └── Footer.jsx
├── hooks/            # Custom React hooks
├── store/            # Redux store configuration
│   ├── slices/       # Redux slices
│   │   ├── authSlice.js
│   │   ├── userSlice.js
│   │   ├── requestsSlice.js
│   │   └── inventorySlice.js
│   ├── api/          # RTK Query API slices
│   │   └── apiSlice.js
│   └── store.js      # Store configuration
├── utils/            # Utility functions
│   ├── api.js                 # Axios configuration
│   ├── constants.js           # App constants
│   ├── validationSchemas.js   # Yup validation schemas
│   └── helpers.js             # Helper functions
├── routes/           # Route definitions
│   └── AppRoutes.jsx
├── styles/           # Global styles
│   └── index.css
├── App.jsx           # Root component
└── main.jsx          # Entry point
```

## 🎯 Features

### ✅ User Features
- User registration and login
- Profile management
- Blood donation tracking
- Donation history
- Real-time status updates

### ✅ Admin Features
- Complete dashboard with statistics
- Blood inventory management
- Request management (Public & Hospital)
- Donor management
- Reports generation
- System settings

### ✅ UI/UX Features
- Fully responsive design
- Smooth animations with Framer Motion
- Toast notifications
- Form validation with error messages
- Loading states
- Interactive data tables with search & pagination
- Dropdown menus
- Modal dialogs

### ✅ Technical Features
- JWT authentication (ready for backend integration)
- Protected routes
- Redux state management
- API layer with Axios interceptors
- Form handling with React Hook Form
- Yup schema validation
- Component-based architecture
- Reusable UI components

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   cd e:\Practicum\Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   copy .env.example .env
   
   # Edit .env and add your API base URL
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   Navigate to: http://localhost:3000
   ```

## 📦 Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The project uses **Tailwind CSS** with a custom configuration:

### Color Palette
- **Primary (Red)**: `#A83231` - Main brand color
- **Secondary (Green)**: `#006747` - Accent color
- **Accent (Orange)**: `#FFC269` - Highlight color

### Custom Tailwind Classes
Configured in `tailwind.config.js` with custom colors, fonts, and animations.

## 🔐 Authentication

The app includes a complete authentication system:

1. **Login** - `/login`
2. **User Registration** - `/register`
3. **Hospital Registration** - `/hospital-register`

Authentication state is managed via Redux and persisted in localStorage.

## 🗺️ Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - User registration
- `/hospital-register` - Hospital registration

### Protected Routes

#### Admin Routes (`/admin/*`)
- `/admin/dashboard` - Admin overview
- `/admin/inventory` - Blood inventory
- `/admin/requests/public` - Public blood requests
- `/admin/requests/hospital` - Hospital requests
- `/admin/donors` - Donor management
- `/admin/reports` - Reports
- `/admin/settings` - Settings

#### User Routes (`/user/*`)
- `/user/dashboard` - User profile & settings
- `/user/history` - Donation history
- `/user/track` - Track donations

## 🧩 Component Library

### UI Components (Shadcn-style)
- `Button` - Customizable button with variants
- `Input` - Form input field
- `Select` - Dropdown select
- `Label` - Form label
- `Card` - Content card with header/footer

### Custom Components
- `BloodGroupCard` - Display blood group with units
- `StatCard` - Dashboard statistics card
- `TestimonialCard` - User testimonial
- `DataTable` - Advanced table with search, pagination, and actions

## 📝 Forms & Validation

All forms use **React Hook Form** with **Yup** validation:

- Login form
- User registration
- Hospital registration
- Profile update
- Password change

Validation schemas are defined in `src/utils/validationSchemas.js`.

## 🔄 State Management

### Redux Slices
- **authSlice** - Authentication state
- **userSlice** - User profile and donations
- **requestsSlice** - Blood requests
- **inventorySlice** - Blood inventory

### RTK Query
- **apiSlice** - API endpoints with automatic caching

## 🎭 Animations

Framer Motion is used for:
- Page transitions
- Card hover effects
- Staggered list animations
- Dropdown menus
- Modal dialogs

## 🚧 Backend Integration

The app is ready for backend integration. Update the API base URL in `.env`:

```env
VITE_API_BASE_URL=http://your-backend-url/api
```

API calls are handled by:
- **Axios** (configured in `src/utils/api.js`)
- **RTK Query** (configured in `src/store/api/apiSlice.js`)

## 📱 Responsive Design

Fully responsive with breakpoints:
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🤝 Contributing

This project was converted from HTML/CSS/JavaScript to a modern React application using:
- Component-based architecture
- Modern hooks (useState, useEffect, useForm, etc.)
- State management with Redux
- Proper routing with React Router
- Form validation
- Animations

## 📄 License

Copyright © 2025 BloodBridge. All rights reserved.

## 🙏 Acknowledgments

- Original HTML/CSS/JavaScript project
- Tailwind CSS team
- Shadcn/UI
- React & Redux communities

---

**Built with ❤️ using React, Tailwind CSS, and Modern Web Technologies**
