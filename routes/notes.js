const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Notes = require("../models/Notes");
const fethuser = require('../middleware/fetchuser');
const { body, validationResult } = require("express-validator");
router.get('/fetchallnotes', fethuser ,async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});
router.post('/addnotes' ,  fethuser ,[
  body("title").isLength({ min: 3 }),
  body("description").isLength({min:5}),
],async (req, res) => {
  const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {title,description,tags} = req.body; 
    const note = new Notes({
      title,description, tags, user: req.user.id
    })
    const savedNote = await note.save();
    res.json(savedNote);
});
router.put('/updatenotes/:id' ,  fethuser , async (req, res) => {
  const {title, description, tags} = req.body;
  //Create a new note object;
  const newNote = {};
  if(title){newNote.title=title;};
  if(description){newNote.description=description;};
  if(tags){newNote.tags=tags;};
  let Note =await  Notes.findById(req.params.id);
  if(!Note){return res.status(404).send('Not Found')};
  if(Note.user.toString() !== req.user.id){return res.status(404).send('Not Found');};
  Note =await  Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:Note});
  res.json(Note);
});
//Delete notes
router.delete('/deleteNote/:id' ,  fethuser , async (req, res) => {
  
  //Create a new note object;
  
  let Note =await  Notes.findById(req.params.id);
  // console.log(Note);
  if(!Note){return res.status(404).send('Not Found')};
  if(Note.user.toString() !== req.user.id){return res.status(404).send('Not Found');};
  Note = await Notes.findByIdAndDelete(req.params.id);
  
  
  res.send('Sucess');
});
module.exports = router;
