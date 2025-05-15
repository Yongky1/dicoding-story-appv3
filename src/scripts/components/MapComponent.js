import L from 'leaflet';

class MapComponent {
  constructor() {
    this._map = null;
    this._marker = null;
    this._markers = [];
    this._onLocationSelect = null;
  }

  init(containerId, options = {}) {
    if (this._map) {
      this.destroy();
    }

    // Reset _leaflet_id jika sudah ada, agar tidak error saat inisialisasi ulang
    const container = document.getElementById(containerId);
    if (container && container._leaflet_id) {
      container._leaflet_id = null;
    }

    try {
      this._map = L.map(containerId).setView([-6.2088, 106.8456], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this._map);

      // Add click handler for marker placement, kecuali untuk stories-map (Home)
      if (containerId !== 'stories-map') {
        this._map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          this.addMarker(lat, lng);
          
          if (this._onLocationSelect) {
            this._onLocationSelect(lat, lng);
          }
        });
      }

      // Initialize with default marker if coordinates provided
      if (options.lat && options.lon) {
        this.addMarker(options.lat, options.lon);
      }

      // Add current location button if requested
      if (options.showCurrentLocation) {
        this._addCurrentLocationButton();
      }

      return true;
    } catch (error) {
      console.error('Error initializing map:', error);
      return false;
    }
  }

  addMarker(lat, lng, options = {}) {
    if (!this._map) return;

    // Remove existing marker if it's a single marker map
    if (this._marker) {
      this._map.removeLayer(this._marker);
      this._marker = null;
    }

    // Create new marker
    const marker = L.marker([lat, lng], {
      draggable: options.draggable || false,
      title: options.title || 'Selected Location'
    }).addTo(this._map);

    // Add popup if content provided
    if (options.popupContent) {
      marker.bindPopup(options.popupContent);
    }

    // Handle drag end if marker is draggable
    if (options.draggable) {
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        if (this._onLocationSelect) {
          this._onLocationSelect(lat, lng);
        }
      });
    }

    // Store marker reference
    if (options.isMultiple) {
      this._markers.push(marker);
    } else {
      this._marker = marker;
    }

    // Center map on marker
    this._map.setView([lat, lng], this._map.getZoom());

    return marker;
  }

  addMarkers(markers) {
    if (!this._map) return;

    // Clear existing markers
    this.clearMarkers();

    // Add new markers
    markers.forEach(markerData => {
      const { lat, lng, popupContent } = markerData;
      this.addMarker(lat, lng, {
        popupContent,
        isMultiple: true
      });
    });
  }

  clearMarkers() {
    if (this._marker) {
      this._map.removeLayer(this._marker);
      this._marker = null;
    }

    this._markers.forEach(marker => {
      this._map.removeLayer(marker);
    });
    this._markers = [];
  }

  setView(lat, lng, zoom = 13) {
    if (this._map) {
      this._map.setView([lat, lng], zoom);
    }
  }

  setCenter(lat, lon, zoom = 13) {
    this.setView(lat, lon, zoom);
  }

  onLocationSelect(callback) {
    this._onLocationSelect = callback;
  }

  _addCurrentLocationButton() {
    if (!this._map) return;

    const button = L.control({ position: 'topleft' });
    
    button.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML = `
        <a href="#" title="Get current location" role="button" aria-label="Get current location">
          <i class="fas fa-location-arrow"></i>
        </a>
      `;
      
      div.onclick = (e) => {
        e.preventDefault();
        this._getCurrentLocation();
      };
      
      return div;
    };
    
    button.addTo(this._map);
  }

  _getCurrentLocation() {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.addMarker(latitude, longitude);
        this.setView(latitude, longitude);
        
        if (this._onLocationSelect) {
          this._onLocationSelect(latitude, longitude);
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.addMarker(latitude, longitude);
          this.setView(latitude, longitude);
          if (this._onLocationSelect) {
            this._onLocationSelect(latitude, longitude);
          }
          resolve({ lat: latitude, lon: longitude });
        },
        (error) => {
          reject(new Error('Error getting current location: ' + error.message));
        }
      );
    });
  }

  destroy() {
    if (this._map) {
      this.clearMarkers();
      this._map.remove();
      this._map = null;
    }
  }

  fitBounds(bounds) {
    if (this._map && bounds && bounds.length > 0) {
      this._map.fitBounds(bounds);
    }
  }
}

export default MapComponent;