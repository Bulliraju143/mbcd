# 🚀 QUICKSTART GUIDE - Martian Blue MERN Stack

## ⚡ 5-Minute Setup

### Step 1: Install MongoDB
**Option A - Local MongoDB:**
```bash
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
mongod
```

**Option B - MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env` file

### Step 2: Install Dependencies
```bash
# From project root
npm run install-all
```

### Step 3: Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI (if using Atlas)
```

### Step 4: Start the Application
```bash
# From project root
npm run dev
```

🎉 **Done!** Open http://localhost:3000

---

## 🎨 What You Get

### Frontend (React + Tailwind CSS)
- ✅ Cyberpunk-themed responsive design
- ✅ Smooth animations with Framer Motion
- ✅ Particle background effects
- ✅ 6 fully functional pages
- ✅ Mobile-responsive navigation

### Backend (Node.js + Express + MongoDB)
- ✅ RESTful API
- ✅ Contact form handling
- ✅ Blog management system
- ✅ Database integration

---

## 📱 Testing the Features

### 1. Navigation
- Click through all menu items
- Test mobile hamburger menu
- Notice smooth page transitions

### 2. Contact Form
- Go to Contact page
- Fill out the form
- Check MongoDB for saved data:
```bash
mongosh
use martian-blue
db.contacts.find()
```

### 3. Animations
- Scroll down on any page
- Watch elements animate in
- Hover over cards and buttons
- Notice particle background

---

## 🔧 Common Commands

```bash
# Install all dependencies
npm run install-all

# Run both frontend and backend
npm run dev

# Run only backend
npm run server

# Run only frontend
npm run client

# Build frontend for production
cd client && npm run build
```

---

## 🎯 Next Steps

1. **Customize Colors**: Edit `client/tailwind.config.js`
2. **Add Content**: Update text in page components
3. **Add Images**: Place images in `client/public/images/`
4. **Create Blog Posts**: Use API endpoints or add admin panel
5. **Deploy**: 
   - Frontend → Vercel/Netlify
   - Backend → Heroku/Railway
   - Database → MongoDB Atlas

---

## ❓ Troubleshooting

**Port 3000 already in use?**
```bash
npx kill-port 3000
```

**Port 5000 already in use?**
```bash
npx kill-port 5000
```

**MongoDB connection error?**
1. Ensure MongoDB is running: `mongod`
2. Check `.env` file has correct `MONGODB_URI`
3. If using Atlas, whitelist your IP address

**Styles not loading?**
1. Clear browser cache (Ctrl+Shift+R)
2. Restart dev server
3. Run `cd client && npm install`

---

## 📚 Learn More

- **React**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Framer Motion**: https://www.framer.com/motion/
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://www.mongodb.com/docs/

---

## 💪 Pro Tips

1. **Fast Refresh**: React updates automatically when you save files
2. **API Testing**: Use Postman or Thunder Client to test API endpoints
3. **Database GUI**: Use MongoDB Compass to view/edit database
4. **Responsive Testing**: Use browser DevTools (F12) → Device Mode
5. **Performance**: Check animations in Chrome DevTools → Performance tab

---

**Need Help?** Create an issue or email info@martianblue.com

Happy Coding! 🚀
