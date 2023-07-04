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

  onSelectItem(): void {
    // console.log(this.selectedItem)
    this.selectedItemsService.setSelectedItem(this.selectedItem);
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
      this.selectedItem = this.dropdownItems[0];
      this.selectedItemsService.setSelectedItem(this.selectedItem);
    });
  }

}
