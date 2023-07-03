import { Component } from '@angular/core';
import { HistoriqueService } from '../services/historique.service';


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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent {
  historiquesList: any[] = [];

  data: historique = {
    user: 'John',
    date: '2023-07-03',
    nelat: 123,
    nelng: 456,
    swlat: 789,
    swlng: 987,
    espece: 'example',
    nb_observation: 10,
    id: 0
  };

  constructor(private historiqueService: HistoriqueService) { }

  ngOnInit(): void {
    this.getHistorique();
  }

  getHistorique() {
    this.historiqueService.getHistorique().subscribe(
      (response: any) => {
        this.historiquesList = response.historique.map((record: any) => ({
          id: record[0],
          user: record[1],
          date: record[2],
          nelat: record[3],
          nelng: record[4],
          swlat: record[5],
          swlng: record[6],
          espece: record[7],
          nb_observation: record[8]
        }));
        console.log(this.historiquesList);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  addHistorique(data: historique) {
    this.historiqueService.addHistorique(data).subscribe((response: any) => {
      console.log(response);
    }, (error: any) => {
      console.error(error);
    });
  }

  updateHistorique(historique: historique) {
    this.historiqueService.updateHistorique(historique.id, historique).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  deleteHistorique(id: number) {
    this.historiqueService.deleteHistorique(id).subscribe(
      (response: any) => {
        console.log(response);
        this.historiquesList = this.historiquesList.filter((historique) => historique.id !== id);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

}

