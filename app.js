const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const Campground = require('./models/campground');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({
        title: 'My Backyard',
        description: 'cheap camping',
    });
    await camp.save();
    res.send(camp);
});

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`);
});
