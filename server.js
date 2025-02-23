const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

let museos = [
  { id: 1,  titulo: "Museo del Louvre (París, Francia)",              categoria: "Arte",    lat: 48.8606,  lng: 2.3376,   descripcion: "El museo más visitado del mundo, con una colección única de arte y antigüedades." },
  { id: 2,  titulo: "Museo del Prado (Madrid, España)",                 categoria: "Arte",    lat: 40.4138,  lng: -3.6921,  descripcion: "Uno de los museos de arte clásicos más importantes, con obras de Velázquez, Goya, entre otros." },
  { id: 3,  titulo: "Museo Reina Sofía (Madrid, España)",               categoria: "Arte",    lat: 40.4086,  lng: -3.6940,  descripcion: "Destaca por su colección de arte contemporáneo, incluyendo el 'Guernica' de Picasso." },
  { id: 4,  titulo: "Museo Thyssen-Bornemisza (Madrid, España)",         categoria: "Arte",    lat: 40.4160,  lng: -3.7038,  descripcion: "Complementa la oferta museística de Madrid con colecciones variadas." },
  { id: 5,  titulo: "Museo Guggenheim (Bilbao, España)",                categoria: "Arte",    lat: 43.2630,  lng: -2.9349,  descripcion: "Icono de la arquitectura contemporánea y el arte moderno." },
  { id: 6,  titulo: "Centre Pompidou (París, Francia)",                categoria: "Arte",    lat: 48.8600,  lng: 2.3522,   descripcion: "Centro de arte moderno y contemporáneo de referencia mundial." },
  { id: 7,  titulo: "British Museum (Londres, Reino Unido)",           categoria: "Historia",lat: 51.5194,  lng: -0.1270,  descripcion: "Una de las colecciones de arte y cultura más completas del mundo." },
  { id: 8,  titulo: "Metropolitan Museum of Art (Nueva York, EE.UU.)",  categoria: "Arte",    lat: 40.7794,  lng: -73.9632, descripcion: "Uno de los museos de arte más grandes y completos del mundo." },
  { id: 9,  titulo: "Museum of Modern Art (Nueva York, EE.UU.)",        categoria: "Arte",    lat: 40.7614,  lng: -73.9776, descripcion: "Referente mundial del arte moderno y contemporáneo." },
  { id: 10, titulo: "Uffizi Gallery (Florencia, Italia)",              categoria: "Arte",    lat: 43.7687,  lng: 11.2550,  descripcion: "Colección única del Renacimiento italiano." },
  { id: 11, titulo: "Vatican Museums (Ciudad del Vaticano)",         categoria: "Historia",lat: 41.9065,  lng: 12.4536,  descripcion: "Posee una de las colecciones de arte religioso más importantes." },
  { id: 12, titulo: "State Hermitage Museum (San Petersburgo, Rusia)", categoria: "Arte/Historia", lat: 59.9398, lng: 30.3146, descripcion: "Uno de los museos más grandes y antiguos del mundo." },
  { id: 13, titulo: "Museo Nacional de Antropología (Ciudad de México, México)", categoria: "Historia", lat: 19.4260, lng: -99.1866, descripcion: "Exhibe importantes vestigios de culturas prehispánicas." },
  { id: 14, titulo: "Museum of Fine Arts (Boston, EE.UU.)",         categoria: "Arte",    lat: 42.3394,  lng: -71.0942, descripcion: "Uno de los museos más completos en arte clásico y moderno." },
  { id: 15, titulo: "Museo Picasso (Barcelona, España)",            categoria: "Arte",    lat: 41.3851,  lng: 2.1734,   descripcion: "Dedicado a la obra del gran pintor Pablo Picasso." },
  { id: 16, titulo: "Museo del Traje (Madrid, España)",              categoria: "Historia",lat: 40.4167,  lng: -3.7030,  descripcion: "Ofrece una visión de la evolución del vestido en España." },
  { id: 17, titulo: "Museo Sorolla (Madrid, España)",                categoria: "Arte",    lat: 40.4247,  lng: -3.7038,  descripcion: "Dedicado a la obra del pintor Joaquín Sorolla." },
  { id: 18, titulo: "National Gallery (Londres, Reino Unido)",      categoria: "Arte",    lat: 51.5089,  lng: -0.1283,  descripcion: "Cuenta con una extensa colección de pintura europea." },
  { id: 19, titulo: "Art Institute of Chicago (Chicago, EE.UU.)",   categoria: "Arte",    lat: 41.8796,  lng: -87.6237, descripcion: "Famoso por su colección de arte impresionista y moderno." },
  { id: 20, titulo: "Rijksmuseum (Ámsterdam, Países Bajos)",         categoria: "Arte",    lat: 52.3599,  lng: 4.8852,   descripcion: "Museo nacional de los Países Bajos, con obras maestras de la Edad de Oro." },
  { id: 21, titulo: "Museo Nacional del Prado (Madrid, España)",    categoria: "Arte",    lat: 40.4138,  lng: -3.6921,  descripcion: "Repetido intencionalmente para resaltar su importancia en España." },
  { id: 22, titulo: "Guggenheim Museum Bilbao (Bilbao, España)",    categoria: "Arte",    lat: 43.2630,  lng: -2.9349,  descripcion: "Pionero en museos de arte moderno y arquitectura innovadora." },
  { id: 23, titulo: "Musée d'Orsay (París, Francia)",               categoria: "Arte",    lat: 48.8600,  lng: 2.3266,   descripcion: "Famoso por su colección de arte impresionista y postimpresionista." },
  { id: 24, titulo: "National Museum of Korea (Seúl, Corea del Sur)", categoria: "Historia",lat: 37.5230, lng: 126.9800, descripcion: "Uno de los museos más grandes de Asia, con una colección diversa." },
  { id: 25, titulo: "Tokyo National Museum (Tokio, Japón)",         categoria: "Historia",lat: 35.7188,  lng: 139.7765, descripcion: "Museo más antiguo y grande de Japón, con importantes colecciones culturales." },
  { id: 26, titulo: "Pergamon Museum (Berlín, Alemania)",          categoria: "Historia",lat: 52.5211,  lng: 13.3969,  descripcion: "Reconocido por su colección de antigüedades clásicas y arquitectónicas." },
  { id: 27, titulo: "Museum Island (Berlín, Alemania)",            categoria: "Historia",lat: 52.5169,  lng: 13.4010,  descripcion: "Conjunto de cinco museos en una isla en el centro de Berlín." },
  { id: 28, titulo: "National Museum of China (Pekín, China)",      categoria: "Historia",lat: 39.9042,  lng: 116.4074, descripcion: "Uno de los museos más grandes del mundo en cuanto a historia y cultura china." },
  { id: 29, titulo: "Smithsonian Institution (Washington, EE.UU.)", categoria: "Historia",lat: 38.8977,  lng: -77.0365, descripcion: "Complejo de museos y centros de investigación de gran relevancia." },
  { id: 30, titulo: "National Gallery of Art (Washington, EE.UU.)",  categoria: "Arte",    lat: 38.8913,  lng: -77.0199, descripcion: "Museo nacional de arte con una amplia colección de obras maestras." }
];

app.get('/museos', (req, res) => {
  res.json(museos);
});

app.post('/museos', (req, res) => {
  const nuevoMuseo = { id: Date.now(), ...req.body };
  museos.push(nuevoMuseo);
  res.json(nuevoMuseo);
});

app.put('/museos/:id', (req, res) => {
  const museoId = parseInt(req.params.id);
  const index = museos.findIndex(m => m.id === museoId);
  if (index !== -1) {
    museos[index] = { ...museos[index], ...req.body };
    res.json(museos[index]);
  } else {
    res.status(404).send('Museo no encontrado');
  }
});

app.delete('/museos/:id', (req, res) => {
  const museoId = parseInt(req.params.id);
  museos = museos.filter(m => m.id !== museoId);
  res.json({ mensaje: "Museo eliminado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
