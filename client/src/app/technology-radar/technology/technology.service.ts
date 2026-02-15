import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Technology} from './technology';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',

})
export class TechnologyService {
  private apiUrl = 'http://localhost:3000/technology';
  private http = inject(HttpClient);

  getAll(): Observable<Technology[]> {
    return this.http.get<Technology[]>(this.apiUrl);
  }

  post(technology: Technology): Observable<Technology> {
    return this.http.post<Technology>(this.apiUrl, technology);
  }
}

