const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors'); // Import cors module

const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware to enable CORS

const port = 5000;
connectToMongo();
// Routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
