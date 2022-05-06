const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require('./models/campground');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main()
  .then(() => {
    console.log('MONGO CONNECTION OPEN!');
  })
  .catch((err) => {
    console.log('ERROR CONNECTING TO MONGO');
    console.log(err);
  });

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});
app.post('/campgrounds', async (req, res, next) => {
  try {
    const campground = await new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});
app.get('/campgrounds/:id', async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground });
});
app.get('/campgrounds/:id/edit', async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground });
});
app.put('/campgrounds/:id', async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.use((err, req, res, next) => {
  console.log(err);
  res.send('Oh Boy, something went wrong!');
});

app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});
