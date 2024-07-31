import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Link from 'ol/interaction/Link';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature.js';
import { Icon, Style } from 'ol/style.js';
import Point from 'ol/geom/Point.js';
import Overlay from 'ol/Overlay.js';

//PopUp when clicking
const popup = document.getElementById("popup");
const overlay = new Overlay({
  element: popup,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

//The map that is displayed (an OpenStreetLayerMap)
const map = new Map({
  overlays: [overlay],
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
});

//used to store features
const source = new VectorSource({
});

//Layer that gets added to the Map
const featureLayer = new VectorLayer({
  source: source
})
map.addLayer(featureLayer)

//Stay at same position with refresh
map.addInteraction(new Link());



//How I can add an Popup on click (like creating a new Bikertreff)
map.addEventListener("singleclick", (e) => {

  let coordinates = e.coordinate

  overlay.setPosition(coordinates);

  let feature = new Feature({
    geometry: new Point(coordinates),
    name: 'Bikertreff',
  })

  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'data/marker-black.svg',
    }),
  });

  feature.setStyle(iconStyle);

  source.addFeature(feature);
})

// #### BACKEND STUFF####
function addFeature(coordinates, name) {

  let feature = new Feature({
    geometry: new Point(coordinates),
    name: name,
  })

  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'data/marker-black.svg',
    }),
  });

  feature.setStyle(iconStyle);
  source.addFeature(feature);
}

function getBikerMeetupsFromBackend() {
  fetch("https://innolab.spengergasse.at/schueler/db/30/items/bikermeetups")
    .then(response => response.json())
    .then(bikertreffs => {
      for (let i in bikertreffs.data) {
        let bikertreff = bikertreffs.data[i];
        addFeature([bikertreff.xValue, bikertreff.yValue], bikertreff.name)
      }
    })
}


//Take function to modular Scope to be able to call it in the HTML
window.createMeetUp = createMeetUp;

function createMeetUp() {
  let name = document.getElementById('name').value;
  let date = document.getElementById('startzeit').value;

  let coordinates = overlay.getPosition();

  fetch('https://innolab.spengergasse.at/schueler/db/30/items/bikermeetups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      xValue: coordinates[0],
      yValue: coordinates[1]
    })
  }).then(response => response.json())
    .then(json => console.log(json))
}

//Show Info on Hover over Feature
map.on('pointermove', (event) => {
  map.forEachFeatureAtPixel(event.pixel, (feature) => {
    alert(feature.values_.name)
  })
})

getBikerMeetupsFromBackend();
