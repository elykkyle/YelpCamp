const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const { PaginationParameters } = require('mongoose-paginate-v2');

const options = {
  page: 1,
  limit: 10,
};

module.exports.index = async (req, res) => {
  req.query ? (options.page = req.query.page) : '';
  const results = await Campground.paginate(
    {},
    options,
    function (err, result) {
      return result;
    }
  );
  const campgrounds = results.docs;
  const pageInfo = {};
  pageInfo.totalDocs = results.totalDocs;
  pageInfo.totalPages = results.totalPages;
  pageInfo.page = results.page;
  pageInfo.pagingCounter = results.pagingCounter;
  pageInfo.hasPrevPage = results.hasPrevPage;
  pageInfo.hasNextPage = results.hasNextPage;
  pageInfo.prevPage = results.prevPage;
  pageInfo.nextPage = results.nextPage;
  res.render('campgrounds/index', { campgrounds, pageInfo });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
};
