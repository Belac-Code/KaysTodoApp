// // server.js
// import express from 'express';
// import cors from 'cors';

// const app = express();

// // MIDDLEWARE: Allows front-end requests and parses incoming JSON data
// app.use(cors()); 
// app.use(express.json());

// // IN-MEMORY DATABASE (Resets when server restarts — super easy for learning!)
// const users = []; // Stores user accounts: { id, name, email, password, isActive, todos }

// // -------------------------------------------------------------------
// // ROUTE 1: Sign Up / Create Account
// // -------------------------------------------------------------------
// app.post('/api/signup', (req, res) => {
//   const { name, email, password } = req.body;

//   // Check if user already exists
//   const existingUser = users.find(u => u.email === email);
//   if (existingUser) {
//     return res.status(400).json({ error: 'User already exists' });
//   }

//   // Create new user object
//   const newUser = {
//     id: users.length + 1,
//     name,
//     email,
//     password, // Stored plain text for learning simplicity
//     isActive: true, // Marked active upon signup
//     todos: []
//   };

//   users.push(newUser);
//   res.json({ message: 'Account created successfully!', user: newUser });
// });

// // -------------------------------------------------------------------
// // ROUTE 2: Login
// // -------------------------------------------------------------------
// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;

//   const user = users.find(u => u.email === email && u.password === password);
//   if (!user) {
//     return res.status(401).json({ error: 'Invalid email or password' });
//   }

//   // Set active status to true
//   user.isActive = true;
//   res.json({ message: 'Login successful!', user });
// });

// // -------------------------------------------------------------------
// // ROUTE 3: Add Todo item for a User
// // -------------------------------------------------------------------
// app.post('/api/todos', (req, res) => {
//   const { userId, text } = req.body;

//   const user = users.find(u => u.id === userId);
//   if (!user) return res.status(404).json({ error: 'User not found' });

//   const newTodo = { id: Date.now(), text, completed: false };
//   user.todos.push(newTodo);

//   res.json({ message: 'Todo added!', todos: user.todos });
// });

// // -------------------------------------------------------------------
// // ROUTE 4: ADMIN ROUTE - See all users, their details & active status
// // -------------------------------------------------------------------
// app.get('/api/admin/users', (req, res) => {
//   // Returns list of all registered users with name, email, password, active status & todos
//   res.json(users);
// });

// // Start the server on port 5000
// app.listen(5000, () => {
//   console.log('Server is running on http://localhost:5000');
// });

// server.js
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); 
app.use(express.json());

// IN-MEMORY DATABASE
const users = []; // Stores standard users: { id, name, email, password, isActive, todos }

// ADMIN CREDENTIALS (Hardcoded for simple testing)
const ADMIN_CREDENTIALS = {
  email: 'admin@app.com',
  password: 'admin123'
};

// -------------------------------------------------------------------
// USER ROUTES: Signup & Login
// -------------------------------------------------------------------

app.get('/', (req, res) => {
  res.send('API is running successfully!');
});


app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now(), // Unique ID using timestamp
    name,
    email,
    password,
    isActive: true,
    todos: []
  };

  users.push(newUser);
  res.json({ message: 'Account created successfully!', user: newUser });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  user.isActive = true;
  res.json({ message: 'Login successful!', user });
});

app.post('/api/todos', (req, res) => {
  const { userId, text } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const newTodo = { id: Date.now(), text, completed: false };
  user.todos.push(newTodo);

  res.json({ message: 'Todo added!', todos: user.todos });
});

// -------------------------------------------------------------------
// ADMIN ROUTE 1: Admin Login
// -------------------------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    // Return an admin key/token flag to verify identity
    res.json({ message: 'Admin authenticated!', isAdmin: true });
  } else {
    res.status(401).json({ error: 'Invalid Admin credentials!' });
  }
});

// -------------------------------------------------------------------
// ADMIN ROUTE 2: Get All Users (Protected)
// -------------------------------------------------------------------
app.get('/api/admin/users', (req, res) => {
  // Simple check using custom request header
  const isAdmin = req.headers['x-is-admin'];
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  res.json(users);
});

// -------------------------------------------------------------------
// ADMIN ROUTE 3: Delete a User Off the System (DELETE Method)
// -------------------------------------------------------------------
app.delete('/api/admin/users/:id', (req, res) => {
  const isAdmin = req.headers['x-is-admin'];
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  const userId = parseInt(req.params.id);

  // Find index of user in our array
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Remove 1 user from array at userIndex
  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({ message: `User ${deletedUser.name} deleted successfully!`, users });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
