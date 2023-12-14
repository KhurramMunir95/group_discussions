import express, { request, urlencoded } from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
// importing routes
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import expressEjsLayouts from 'express-ejs-layouts'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

connectDB()

const app = express();

// app.use(cookieParser())

app.use(session({
   secret: 'mySecret',
   saveUninitialized: false,
   resave: false
}))

app.use(function(req, res, next) {
   res.locals.user = req.session.user;
   next();
})

function isAdmin(req, res, next) {
   if (req.session && req.session.user && req.session.user.role === 'admin') {
       next();
   } else {
       res.redirect('login')
   }
}

app.use(expressEjsLayouts)
app.use((req, res, next) => {
   if(req.url.startsWith('/admin')) {
      app.set('layout', './layouts/admin.ejs');
   } else {
      app.set('layout', './layouts/main.ejs');
   }
   next();
})
app.set('view engine', 'ejs')

// Set the views directory
app.use(express.static('assets'));
// app.use('/images', express.static('images'));

const PORT = process.env.port || 3000

app.get('/', (req, res) => {
   res.render('index');
})

app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/admin/groups', groupRoutes);
// admin
app.use('/admin', adminRoutes);
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

export {
   isAdmin
}