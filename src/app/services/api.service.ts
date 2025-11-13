import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api/usuarios';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario, this.httpOptions);
  }

  update(id: string, usuario: Usuario): Observable<Usuario> {
    const usuarioSinId = { ...usuario };
    delete (usuarioSinId as any)._id;
    delete (usuarioSinId as any).id;

    console.log('Actualizando usuario con ID:', id);
    console.log('Datos enviados:', usuarioSinId);

    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuarioSinId, this.httpOptions);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}
