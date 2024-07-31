const path = require('path');

const express = require('express');

const blogRoutes = require('./routes/blog');


const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static('public')); // Serve static files (e.g. CSS files)

app.use('/', blogRoutes);

app.use((req, res) => {
  res.status(404).render('404');
}); //This will be called when the request is invalid

app.use((error, req, res, next) => {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render('500');
});

app.listen(3000);
