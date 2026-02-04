# Martian Blue - MERN Stack Cybersecurity Platform

A modern, dynamic, and highly interactive cybersecurity platform built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Tailwind CSS.

## 🚀 Features

- ✨ **Modern UI/UX**: Cyberpunk-inspired design with smooth animations and parallax effects
- 🎨 **Dynamic Animations**: Framer Motion for fluid page transitions and scroll animations
- 🎯 **Responsive Design**: Fully responsive across all devices
- 🔒 **Cybersecurity Focus**: Anti-phishing platform with comprehensive security solutions
- 📝 **Contact Management**: Full CRUD operations for contact form submissions
- 📰 **Blog System**: Dynamic blog with categories, tags, and view tracking
- 🌐 **REST API**: Complete backend API with Express.js
- 💾 **MongoDB Integration**: Persistent data storage with Mongoose ODM

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Heroicons** - Beautiful icon set

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone the Repository
```bash
git clone <repository-url>
cd martian-blue-mern
```

### Install Dependencies
```bash
# Install root dependencies
npm run install-all

# Or install individually:
npm install
cd client && npm install
cd ../server && npm install
```

### Environment Setup

1. Create `.env` file in the `server` directory:
```bash
cd server
cp .env.example .env
```

2. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/martian-blue
```

## 🚀 Running the Application

### Development Mode (Recommended)

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

### Run Separately

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm start
```

## 📁 Project Structure

```
martian-blue-mern/
├── client/                      # Frontend React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ParticlesBackground.js
│   │   │   └── ScrollToTop.js
│   │   ├── pages/               # Page components
│   │   │   ├── Home.js
│   │   │   ├── Cybersecurity.js
│   │   │   ├── Services.js
│   │   │   ├── About.js
│   │   │   ├── Blog.js
│   │   │   └── Contact.js
│   │   ├── App.js               # Main app component
│   │   ├── index.js             # Entry point
│   │   └── index.css            # Global styles + Tailwind
│   ├── package.json
│   ├── tailwind.config.js       # Tailwind configuration
│   └── postcss.config.js
├── server/                      # Backend Node.js application
│   ├── models/                  # Mongoose models
│   │   ├── Contact.js
│   │   └── Blog.js
│   ├── routes/                  # API routes
│   │   ├── contact.js
│   │   └── blog.js
│   ├── server.js                # Server entry point
│   ├── package.json
│   └── .env.example
├── package.json                 # Root package.json
└── README.md
```

## 🎨 Design Features

### Color Scheme
- **Cyber Dark**: `#0a0e27` - Main background
- **Cyber Navy**: `#0f1729` - Secondary background
- **Cyber Blue**: `#00b4d8` - Primary accent
- **Cyber Purple**: `#7b2cbf` - Secondary accent
- **Cyber Green**: `#00ff9f` - Tertiary accent

### Typography
- **Display Font**: Orbitron - For headings and titles
- **Body Font**: Space Grotesk - For body text

### Animations
- Fade in/out effects
- Slide animations
- Scale transformations
- Parallax scrolling
- Particle background effects
- Hover state animations
- Page transition animations

## 🔌 API Endpoints

### Contact Routes
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts
- `GET /api/contact/:id` - Get contact by ID
- `PATCH /api/contact/:id/status` - Update contact status
- `DELETE /api/contact/:id` - Delete contact

### Blog Routes
- `GET /api/blog` - Get all published blogs (with pagination)
- `GET /api/blog/:id` - Get single blog post
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

## 🎯 Key Components

### Navbar
- Sticky navigation with glass morphism effect
- Animated logo and menu items
- Mobile-responsive hamburger menu
- Active route highlighting

### ParticlesBackground
- Canvas-based particle system
- Connected particle network
- Smooth animations
- Performance optimized

### Pages
- **Home**: Hero section, features grid, stats, CTA
- **Cybersecurity**: Security solutions showcase
- **Services**: Comprehensive service listings
- **About**: Company info, team, testimonials
- **Blog**: Dynamic blog post listings
- **Contact**: Interactive contact form

## 🔧 Customization

### Modify Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  cyber: {
    dark: '#your-color',
    // ... other colors
  }
}
```

### Add Animations
Edit `client/src/index.css` for custom animations or use Framer Motion in components.

### Modify Backend
Add new routes in `server/routes/` and models in `server/models/`.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables in hosting platform
# Deploy server directory
```

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 💡 Tips

- Use `npm run dev` for development to run both client and server
- Clear browser cache if styles don't update
- Check MongoDB connection if API requests fail
- Enable MongoDB in your system before running the server

## 🐛 Common Issues

**Port already in use:**
```bash
# Kill process on port 3000 or 5000
npx kill-port 3000
npx kill-port 5000
```

**MongoDB connection error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

**Tailwind styles not applying:**
```bash
cd client
npm run build:css
```

## 📞 Support

For support, email info@martianblue.com or create an issue in the repository.

---

Built with ❤️ by the Martian Blue Team
