import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Technology, TechnologyCreateOrUpdate} from './technology';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',

})
export class TechnologyService {
  private apiUrl = '/api/technology';
  private http = inject(HttpClient);

  private _technologies = signal<Technology[]>([]);

  readonly technologies = this._technologies.asReadonly();

  constructor() {
    this.initialLoadTechnologies()
  }

  private initialLoadTechnologies(): void {
    this.getAll().subscribe({
      next: (technologies) => this._technologies.set(technologies),
      error: (err) => console.error('Error loading technologies:', err)
    });
  }

  getAll(): Observable<Technology[]> {
    return this.http.get<Technology[]>(this.apiUrl);
  }

  post(technology: TechnologyCreateOrUpdate): Observable<Technology> {
    let request = this.http.post<Technology>(this.apiUrl, technology);

    request.subscribe({
      next: (newTech) => {
        this._technologies.update(techs => [...techs, newTech]);
      },
      error: (err) => console.error('Error creating technology:', err)
    });

    return request;
  }

  put(id: string, technology: TechnologyCreateOrUpdate): Observable<Technology> {
    const request = this.http.put<Technology>(`${this.apiUrl}/${id}`, technology);

    request.subscribe({
      next: (updatedTech) => {
        this._technologies.update(techs =>
          techs.map(t => t._id === id ? updatedTech : t)
        );
      },
      error: (err) => console.error('Error updating technology:', err)
    });

    return request;
  }

  delete(id: string): Observable<Technology> {
    const request = this.http.delete<Technology>(`${this.apiUrl}/${id}`);

    request.subscribe({
      next: () => {
        this._technologies.update(techs => techs.filter(t => t._id !== id));
      },
      error: (err) => console.error('Error deleting technology:', err)
    });

    return request;
  }
}

