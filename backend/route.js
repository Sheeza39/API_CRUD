const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Book = require('./model');
const UserAuth = require('./user');
const bcrypt = require('bcrypt');



const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: 'librarySecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: false,
    },
  })
);

// MongoDB Atlas connection
mongoose
  .connect(
    'mongodb+srv://sheeza:sheeza1234@cluster0.iz15y.mongodb.net/libraryDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware to check for admin access
function isAdmin(req, res, next) {
  if (req.query.isAdmin === 'true') {
    return next();
  } else {
    return res.status(403).send('Not an Admin');
  }
}

// View count using session
app.get('/view-count', (req, res) => {
  if (!req.session.viewCount) req.session.viewCount = 0;
  req.session.viewCount++;
  res.send(`You have visited this page ${req.session.viewCount} times.`);
});

app.get('/set-session-cookie', (req, res) => {
  req.session.user = { name: 'Sheeza', role: 'admin' };
  res.cookie('myCookie', 'value123', { maxAge: 1000 * 60 * 60, httpOnly: true });
  res.status(200).json({
    message: 'Session and cookie set successfully',
    sessionData: req.session,
  });
});


app.get('/get-session-cookie', (req, res) => {
  const sessionData = req.session.user || 'No session data found';
  const visited = req.session.viewCount || 0;
  const cookieData = req.cookies.myCookie || 'No cookie found';
  res.status(200).json({
    session: sessionData,
    visitedCount: visited,
    cookie: cookieData,
  });
});

function isAdmin(req, res, next) {
  if (req.query.isAdmin === 'true') {
    return next();
  } else {
    return res.status(403).send('Not an Admin');
  }
}




app.get('/secret', (req, res) => {
  if (!req.session.user_id) {
    return  res.redirect('/login');
  }
  else {
      res.render('secret');
  }
});

app.get('/', (req, res) => {
  res.send('This is home page');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('All fields are required');
  }

  const hash = await bcrypt.hash(password, 12);
  const user = new UserAuth({
    username,
    password: hash,
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/');
});



app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/');
})



app.get('/login', (req , res) => {
  res.render('login');
})

app.post('/login',async (req , res) => {
  const {username, password } = req.body;
  const user = await UserAuth.findOne({username});
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
      req.session.user_id = user._id;
      res.redirect('/secret');
  }
  else {
      res.redirect('/login');
  }
});

/*
app.get('/secret',(req,res)=>{

   res.send("Only authorize person can see this")

})

app.get('/register',(req,res)=>{

  res.render('register');
})  */

app.get('/admin', isAdmin, (req, res) => {
  res.send('Welcome Admin');
});

function isAdmin(req, res, next) {
  if (req.query.isAdmin === 'true') {
    return next();
  } else {
    return res.status(403).send('Not an Admin');
  }
}

app.get('/admin', isAdmin, (req, res) => {
  res.send('Welcome Admin');
});



// CRUD operations
// Create a new book
app.post('/books', async (req, res) => {
  const { name, genre, quantity } = req.body;
  if (!name || !genre || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const book = new Book({ name, genre, quantity });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Read all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);  
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Read book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);  
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);  
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Update a book
app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { name, genre, quantity } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { name, genre, quantity },
      { new: true } 
    );
   
    res.status(200).json(updatedBook); 
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
