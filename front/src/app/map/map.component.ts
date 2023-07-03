import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { HistoriqueService } from '../services/historique.service';

interface Coordinates {
  lat: number;
  lng: number;
}

interface historique {
  user: string,
  date: string,
  nelat: number;
  nelng: number;
  swlat: number;
  swlng: number;
  espece: string,
  nb_observation: number,
  id: number,
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  map: any;
  visibleBounds: any;
  dropdownItems: string[] = [];
  selectedItem: string = '';
  markers: L.Marker[] = [];

  // retrieve from https://gist.github.com/ThomasG77/61fa02b35abf4b971390
  smallIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  constructor(private http: HttpClient, private authService: AuthService, private historiqueService: HistoriqueService) { }

  ngAfterViewInit(): void {
    this.createMap();
    this.loadDropdownData();
    
  }

  isAuthenticatedUser() {
    return (this.authService.isAuthenticatedUser() === true)
  }

  signOut() {
    this.authService.logout();
  }

  requestINAT() {
    const apiUrl = 'https://api.inaturalist.org/v1/observations';
    // const apiUrl = 'https://api.inaturalist.org/v2/observations'
    const searchTerm = this.selectedItem;
    const placeId = 1; // ID de l'emplacement (place_id)
    const perPage = 200; // Nombre d'observations par page
    let page = 1; // Numéro de page
    const orderBy = 'observed_on'; // Trier par date d'observation
    const order = 'desc'; // Trier par ordre décroissant
    const coorNE = this.visibleBounds._northEast;
    const coorSW = this.visibleBounds._southWest;
    const nelat = coorNE.lat;
    const nelng = coorNE.lng;
    const swlat = coorSW.lat;
    const swlng = coorSW.lng;
    const fields = "geojson,photos"

    // https://inaturalist-open-data.s3.amazonaws.com/photos/295885010/square.jpg

    // this.http.get(`${apiUrl}?swlat=${swlat}&swlng=${swlng}&nelat=${nelat}&nelng=${nelng}&q=${searchTerm}&per_page=${perPage}&page=${page}&order_by=${orderBy}&order=${order}&fields=${fields}`).subscribe((results: any) => {
    this.http.get(`${apiUrl}?swlat=${swlat}&swlng=${swlng}&nelat=${nelat}&nelng=${nelng}&q=${searchTerm}&per_page=${perPage}&page=${page}&order_by=${orderBy}&order=${order}`).subscribe((results: any) => {
      this.resetMarkers()
      console.log(results)
      for (const result of results['results']) {
        this.generateMarker(result)
      }

      const data: historique = {
        user: "admin",
        date: "date",
        nelat: nelat,
        nelng: nelng,
        swlat: swlat,
        swlng: swlng,
        espece: searchTerm,
        nb_observation: results.total_results,
        id: 0,
      }

      this.addHistorique(data)
    }, (error) => {
      console.log('La requête a échoué avec le code d\'erreur:', error.status);
    });
  }


  addHistorique(data: historique) {
    this.historiqueService.addHistorique(data).subscribe((response: any) => {
      console.log(response);
    }, (error: any) => {
      console.error(error);
    });
  }

  private generateMarker(result: any) {
    if ('geojson' in result && result['geojson'] !== null && 'coordinates' in result['geojson']) {
      const coordinates: Coordinates = {
        lat: result['geojson']['coordinates'][1],
        lng: result['geojson']['coordinates'][0]
      };
      const marker = L.marker([coordinates.lat, coordinates.lng], { icon: this.smallIcon });
      if (result['observation_photos'].length > 0) {
        marker.addTo(this.map).bindPopup(`<img src="${result['observation_photos'][0]['photo']['url']}" alt="">`, {
          minWidth: 70
        });

      }
      this.markers.push(marker);
    }
  }

  private resetMarkers() {
    for (const marker of this.markers) {
      marker.removeFrom(this.map);
    }

    this.markers.length = 0;
  }

  loadDropdownData() {
    this.http.get<any[]>('assets/json/species.json').subscribe(species => {
      for (let i in species) {
        this.dropdownItems.push(species[i])
      }
      this.selectedItem = this.dropdownItems[0];
    });
  }

  createMap() {

    const usa = {
      lat: 39.8283,
      lng: -98.5795,
    };

    const zoomLevel = 1;

    this.map = L.map('map', {
      center: [usa.lat, usa.lng],
      zoom: zoomLevel
    });

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 3,
      maxZoom: 14,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    mainLayer.addTo(this.map);

    this.map.on('moveend', () => {
      this.visibleBounds = this.map.getBounds();
    });

  }



}