// Inicializar el mapa (vista global)
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let museos = [];

// Cargar museos desde el backend
function cargarMuseos() {
  fetch("/museos")
    .then(res => res.json())
    .then(data => {
      museos = data;
      mostrarMuseos();
    });
}

// Mostrar museos en el mapa
function mostrarMuseos() {
  // Remover marcadores previos
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
  
  museos.forEach(museo => {
    const marker = L.marker([museo.lat, museo.lng]).addTo(map);
    marker.bindPopup(`
      <h3>${museo.titulo}</h3>
      <p>${museo.descripcion || ""}</p>
      <br>
      <button onclick="editarMuseo(${museo.id})">Editar</button>
      <button onclick="eliminarMuseo(${museo.id})">Eliminar</button>
    `);
  });
}

// Fórmula de Haversine para calcular la distancia
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Encontrar el museo más cercano a la ubicación del usuario
function encontrarMasCercano() {
  if (!navigator.geolocation) {
    alert("Geolocalización no soportada.");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const latUser = position.coords.latitude;
    const lonUser = position.coords.longitude;

    let masCercano = null;
    let menorDistancia = Infinity;

    museos.forEach(museo => {
      const distancia = calcularDistancia(latUser, lonUser, museo.lat, museo.lng);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        masCercano = museo;
      }
    });

    if (masCercano) {
      alert(`Museo más cercano: ${masCercano.titulo} (${menorDistancia.toFixed(2)} km)`);
      map.setView([masCercano.lat, masCercano.lng], 15);
    }
  });
}

document.getElementById("btnMasCercano").addEventListener("click", encontrarMasCercano);

// Filtrar museos por categoría
function filtrarPorCategoria() {
  const categoriaSeleccionada = document.getElementById("categoriaFiltro").value;
  localStorage.setItem("categoriaSeleccionada", categoriaSeleccionada);

  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  museos.forEach(museo => {
    if (categoriaSeleccionada === "todos" || museo.categoria === categoriaSeleccionada) {
      const marker = L.marker([museo.lat, museo.lng]).addTo(map);
      marker.bindPopup(`<h3>${museo.titulo}</h3><p>${museo.descripcion || ""}</p>`);
    }
  });
}

document.getElementById("btnFiltrar").addEventListener("click", filtrarPorCategoria);

// Agregar un nuevo museo
function agregarMuseo() {
  const titulo = prompt("Nombre del museo:");
  const categoria = prompt("Categoría:");
  const descripcion = prompt("Descripción:");
  const lat = parseFloat(prompt("Latitud:"));
  const lng = parseFloat(prompt("Longitud:"));

  if (titulo && categoria && !isNaN(lat) && !isNaN(lng)) {
    fetch("/museos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, categoria, lat, lng, descripcion })
    })
    .then(() => cargarMuseos());
  } else {
    alert("Datos inválidos.");
  }
}

document.getElementById("btnAgregar").addEventListener("click", agregarMuseo);

// Eliminar un museo
function eliminarMuseo(id) {
  fetch(`/museos/${id}`, { method: "DELETE" })
    .then(() => cargarMuseos());
}

// Editar un museo: solicita nuevos datos y envía una petición PUT al backend
function editarMuseo(id) {
  // Buscar el museo actual
  const museo = museos.find(m => m.id === id);
  if (!museo) {
    alert("Museo no encontrado");
    return;
  }
  
  // Pedir nuevos datos mediante prompt (puedes sustituir por un formulario modal si lo prefieres)
  const nuevoTitulo = prompt("Editar Nombre del museo:", museo.titulo) || museo.titulo;
  const nuevaCategoria = prompt("Editar Categoría:", museo.categoria) || museo.categoria;
  const nuevaDescripcion = prompt("Editar Descripción:", museo.descripcion) || museo.descripcion;
  const nuevaLat = parseFloat(prompt("Editar Latitud:", museo.lat)) || museo.lat;
  const nuevaLng = parseFloat(prompt("Editar Longitud:", museo.lng)) || museo.lng;
  
  // Enviar petición PUT para actualizar el museo
  fetch(`/museos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: nuevoTitulo, categoria: nuevaCategoria, descripcion: nuevaDescripcion, lat: nuevaLat, lng: nuevaLng })
  })
  .then(() => cargarMuseos());
}

document.addEventListener("DOMContentLoaded", () => {
  const categoriaGuardada = localStorage.getItem("categoriaSeleccionada");
  if (categoriaGuardada) {
    document.getElementById("categoriaFiltro").value = categoriaGuardada;
  }
  cargarMuseos();
});
