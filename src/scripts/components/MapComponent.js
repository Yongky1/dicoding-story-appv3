import L from 'leaflet';

class MapComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.markers = [];
  }

  init(center = [-6.914744, 107.609810]) {
    this.map = L.map(this.containerId).setView(center, 13);
    
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    const cartoDarkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO'
    });

    const cartoLightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO'
    });

    const esriWorldImageryLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Dark Mode": cartoDarkLayer,
      "Light Mode": cartoLightLayer,
      "Satellite": esriWorldImageryLayer
    };

    osmLayer.addTo(this.map);
    
    L.control.layers(baseMaps).addTo(this.map);

    this.map.on('click', (e) => {
      const event = new CustomEvent('map-clicked', {
        detail: {
          lat: e.latlng.lat,
          lon: e.latlng.lng
        }
      });
      window.dispatchEvent(event);
    });
  }

  addMarker(lat, lon, title, description) {
    const marker = L.marker([lat, lon]).addTo(this.map);
    marker.bindPopup(`
      <div class="marker-popup">
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
    `);
    this.markers.push(marker);
  }

  clearMarkers() {
    this.markers.forEach(marker => {
      marker.remove();
    });
    this.markers = [];
  }

  setCenter(lat, lon, zoom = 13) {
    this.map.setView([lat, lon], zoom);
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.setCenter(latitude, longitude);
            resolve({ lat: latitude, lon: longitude });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }
}

export default MapComponent;