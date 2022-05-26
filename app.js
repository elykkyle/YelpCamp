const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
// const morgan = require('morgan');
const methodOverride = require('method-override');
// const { findByIdAndUpdate } = require('./models/campground');
app.use(express.urlencoded({ extended: true }));
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');
app.use(methodOverride('_method'));
// app.use(morgan('combined'));
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});
