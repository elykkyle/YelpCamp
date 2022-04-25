const mongoose = require('mongoose');
const Campground = require('../models/campground');
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
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    console.log('DONE!!!');
    mongoose.connection.close();
});
