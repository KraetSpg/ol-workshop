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
import MousePosition from 'ol/control/MousePosition.js';
import Overlay from 'ol/Overlay.js';


/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');

const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});


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

const featureLayer = new VectorLayer({
  source: source
})

map.addLayer(featureLayer)

//Stay at same position with refresh
map.addInteraction(new Link());

let mousePos = new MousePosition();

//How I can add an Popup on click (like creating a new Bikertreff)
map.addEventListener("singleclick", (e) => {
  let coordinates = e.coordinate

  content.innerHTML = '<p>You clicked here:</p><code></code>';
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

