const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/elykkyle/image/upload/v1656016383/YelpCamp/yylfmpxd9u5vjgmjsvcj.jpg',
          filename: 'YelpCamp/yylfmpxd9u5vjgmjsvcj',
        },
        {
          url: 'https://res.cloudinary.com/elykkyle/image/upload/v1656016383/YelpCamp/syeu3dbwapahlrkyo4jb.jpg',
          filename: 'YelpCamp/syeu3dbwapahlrkyo4jb',
        },
        {
          url: 'https://res.cloudinary.com/elykkyle/image/upload/v1656016383/YelpCamp/eoespuyv7x8thfw3nmr2.jpg',
          filename: 'YelpCamp/eoespuyv7x8thfw3nmr2',
        },
      ],
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut minus incidunt veniam quae earum reprehenderit animi ratione debitis facilis minima perferendis rem, vero totam distinctio dolores repudiandae cumque pariatur.',
      price: price,
      geometry: {
        type: 'Point',
        coordinates: [-93.265469, 44.9773],
      },
      author: '629ff7dfff6c0371b37e49dd',
    });
    await camp.save();
  }
};

seedDB().then(() => {
  console.log('DONE!!!');
  mongoose.connection.close();
});
