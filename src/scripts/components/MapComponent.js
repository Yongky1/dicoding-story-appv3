import L from 'leaflet';

class MapComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.markers = [];
    this.onLocationSelect = null;
  }

  init(center = [-6.914744, 107.609810]) {
    if (this.map) {
      this.map.remove();
    }
    const mapContainer = document.getElementById(this.containerId);
    if (mapContainer && mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = '';
    }
    this.map = L.map(this.containerId, {
      center: center,
      zoom: 13,
      zoomControl: true,
      attributionControl: true
    });
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
    if (this.onLocationSelect) {
      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.onLocationSelect({ lat, lng });
      });
    }
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);
    L.control.scale({
      imperial: false,
      position: 'bottomright'
    }).addTo(this.map);
    return this.map;
  }

  addMarker(lat, lon, title, description) {
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }
    const marker = L.marker([lat, lon]).addTo(this.map);
    const popupContent = `
      <div class="marker-popup">
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="popup-actions">
          <button class="btn btn-link view-story" data-lat="${lat}" data-lon="${lon}">
            <i class="fas fa-eye"></i> View Story
          </button>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent, {
      maxWidth: 300,
      minWidth: 200,
      className: 'custom-popup'
    });
    this.markers.push(marker);
    return marker;
  }

  clearMarkers() {
    this.markers.forEach(marker => {
      marker.remove();
    });
    this.markers = [];
  }

  setCenter(lat, lon, zoom = 13) {
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }
    this.map.setView([lat, lon], zoom);
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setCenter(latitude, longitude);
          resolve({ lat: latitude, lon: longitude });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.clearMarkers();
  }
}

export default MapComponent;