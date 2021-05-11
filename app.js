// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

// Set up Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Creates basic Route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Displays all notes saved to the database
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db', 'db.json'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Creates new note
app.post('/api/notes', (req, res) => {
  let obj = {
    table: []
  };

  const newNote = req.body;
  newNote.id = uniqid.process();

  fs.readFile('./db/db.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      // turn obj into an object
      obj = JSON.parse(data);
      obj.push(newNote);
      // convert back to json after new note is added
      json = JSON.stringify(obj);
      fs.writeFile('./db/db.json', json, 'utf8', (err) => {
        if (err) throw err;
        console.log('Successfully saved new note.')
        res.sendStatus(200);
      });
    }
  });
})

// Get server to start listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));