mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campgroundCoordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker().setLngLat(campgroundCoordinates).addTo(map);
