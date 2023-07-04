import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedItemsService {
  private selectedItemSubject = new BehaviorSubject<string>('');

  setSelectedItem(item: string): void {
    this.selectedItemSubject.next(item);
  }

  getSelectedItem(): Observable<string> {
    return this.selectedItemSubject.asObservable();
  }
}
