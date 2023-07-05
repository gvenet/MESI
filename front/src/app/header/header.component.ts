import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { MapService } from '../services/mapService.service';
import { SelectedItemsService } from '../services/selectedItem.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements AfterViewInit {
  dropdownItems: string[] = [];
  selectedItem: string = '';
  loading: boolean = false;
  sidebarVisible: boolean = false;

  dropdownRegne: string[] = ["Animalia", "Plantae", "Fungi"];
  dropdownEmbranchement: string[] = [];
  dropdownClasse: string[] = [];
  dropdownOrdre: string[] = [];
  dropdownFamille: string[] = [];
  dropdownGenre: string[] = [];
  dropdownEspece: string[] = [];


  selectedRegne: string = this.dropdownRegne[0];
  selectedEmbranchement: string = '';
  selectedClasse: string = '';
  selectedOrdre: string = '';
  selectedFamille: string = '';
  selectedGenre: string = '';
  selectedEspece: string = '';


  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private authService: AuthService,
    private mapService: MapService,
    private selectedItemsService: SelectedItemsService


  ) { }

  ngAfterViewInit(): void {
    this.loadDropdownData();
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    // console.log(this.sidebarVisible)
  }

  onSelectItem(): void {
    console.log(this.selectedItem)
    this.selectedItemsService.setSelectedItem(this.selectedItem);
  }

  onselectedRegne(): void {
    console.log(this.selectedRegne)
    this.selectedItemsService.setSelectedItem(this.selectedRegne);
    this.onselectedEmbranchement(this.selectedRegne)
  }

  onselectedEmbranchement(regne: string) {
    if (regne === "Animalia") {
      this.dropdownEmbranchement = ["Chordata", "Arthropoda", "Mollusca", "Echinodermata", "Annelida"];
    } else if (regne === "Plantae") {
      this.dropdownEmbranchement = ["Bryophyta", "Pteridophyta", "Coniferophyta", "Magnoliophyta"];
    } else if (regne === "Fungi") {
      this.dropdownEmbranchement = ["Ascomycota", "Basidiomycota", "Zygomycota", "Glomeromycota", "Chytridiomycota", "Myxomycota"];
    }
    this.selectedEmbranchement = this.dropdownEmbranchement[0];
    this.selectedItemsService.setSelectedItem(this.selectedEmbranchement);
    this.onselectedClasse(this.selectedEmbranchement)
  }

  onselectedClasse(embranchement: string) {
    if (embranchement === "Chordata") {
      this.dropdownClasse = ["Mammalia", "Aves", "Reptilia", "Amphibia", "Actinopterygii", "Chondrichthyes", "Myxini", "Cephalaspidomorphi"]
    }
    this.selectedClasse = this.dropdownClasse[1];
    this.selectedItemsService.setSelectedItem(this.selectedClasse);
    this.onselectedOrdre(this.selectedClasse);
  }

  onselectedOrdre(classe: string) {
    if (classe === "Aves") {
      this.dropdownOrdre = ["Accipitriformes", "Anseriformes", "Apodiformes", "Caprimulgiformes", "Charadriiformes", "Ciconiiformes", "Columbiformes", "Coraciiformes", "Cuculiformes", "Falconiformes", "Galliformes", "Gaviiformes", "Gruiformes", "Passeriformes", "Pelecaniformes", "Piciformes", "Podicipediformes", "Procellariiformes", "Psittaciformes", "Sphenisciformes", "Strigiformes", "Struthioniformes", "Suliformes", "Tinamiformes", "Trogoniformes", "Upupiformes"];
    }
    this.selectedOrdre = this.dropdownOrdre[0];
    this.selectedItemsService.setSelectedItem(this.selectedOrdre);
  }



  requestINAT() {
    this.loading = true;
    this.spinner.show();
    this.mapService.requestINAT(this.selectedItem)
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.spinner.hide();
        },
        (error: any) => {
          console.log('La requête a échoué avec le code d\'erreur:', error.status);
          this.loading = false;
          this.spinner.hide();
          console.log(this.loading);
        }
      );
  }

  isAuthenticatedUser() {
    return (this.authService.isAuthenticatedUser() === true)
  }

  signOut() {
    this.authService.logout();
  }

  loadDropdownData() {
    this.http.get<any[]>('assets/json/species.json').subscribe(species => {
      for (let i in species) {
        this.dropdownItems.push(species[i])
      }
      this.selectedItem = this.dropdownItems[12];
      this.onSelectItem();
      this.onselectedRegne();
    });
  }

}
