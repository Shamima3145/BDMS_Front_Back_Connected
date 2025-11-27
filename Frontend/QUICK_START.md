# 🚀 Quick Start Guide

## Get Started in 3 Steps

### 1️⃣ Install Dependencies
```powershell
npm install
```

### 2️⃣ Set Up Environment Variables
```powershell
copy .env.example .env
```
Then edit `.env` file and set your API URL if needed.

### 3️⃣ Run Development Server
```powershell
npm run dev
```

Your app will be available at **http://localhost:3000** 🎉

---

## 📋 Available Routes

### Public Routes
- `/` - Landing Page
- `/login` - User Login
- `/register` - User Registration
- `/hospital-register` - Hospital Registration

### Admin Routes (after login as admin)
- `/admin/dashboard` - Admin Dashboard
- `/admin/inventory` - Blood Inventory
- `/admin/requests/public` - Public Requests
- `/admin/requests/hospital` - Hospital Requests
- `/admin/donors` - Donor Management
- `/admin/reports` - Reports & Analytics
- `/admin/settings` - Settings

### User Routes (after login as user)
- `/user/dashboard` - User Dashboard & Profile
- `/user/history` - Donation History
- `/user/track` - Track Donations

---

## 🎨 Test Credentials (Mock Data)

Use these for testing the login flow:

**Admin Login:**
- Email: `admin@bloodbridge.com`
- Password: `admin123`

**User Login:**
- Email: `user@bloodbridge.com`
- Password: `user123`

---

## 🛠️ Build Commands

```powershell
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Lint Code
npm run lint
```

---

## 📦 What's Included

✅ **React 18** with modern hooks  
✅ **React Router 6** for navigation  
✅ **Redux Toolkit** for state management  
✅ **Tailwind CSS** for styling  
✅ **Framer Motion** for animations  
✅ **React Hook Form** + **Yup** for forms  
✅ **Axios** for API calls  
✅ **React Toastify** for notifications  
✅ **Lucide React** for icons  
✅ **Shadcn/UI** component patterns  

---

## 🔧 Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── ui/         # Base components (Button, Input, Card, etc.)
│   └── ...         # Custom components
├── pages/          # Page components
│   ├── admin/      # Admin pages
│   ├── user/       # User pages
│   └── ...         # Public pages
├── layouts/        # Layout wrappers
├── store/          # Redux store & slices
├── utils/          # Utilities & helpers
├── routes/         # Route configuration
└── styles/         # Global styles
```

---

## 🎯 Next Steps

1. **Connect Backend API**  
   Update `VITE_API_BASE_URL` in `.env` with your backend URL

2. **Copy Assets**  
   Copy your images from the original project:
   ```powershell
   xcopy /E /I assets public\assets
   ```

3. **Customize Theme**  
   Edit `tailwind.config.js` to customize colors, fonts, etc.

4. **Add More Features**  
   The codebase is modular and ready for expansion!

---

## ❓ Need Help?

- Check the main `README.md` for detailed documentation
- All components have inline comments
- Forms use Yup schemas in `src/utils/validationSchemas.js`
- API calls are in `src/utils/api.js` and `src/store/api/apiSlice.js`

---

**Happy Coding! 🩸❤️**
