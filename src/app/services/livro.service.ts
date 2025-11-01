import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Livro } from '../models/livro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private readonly apiUrl = '/api/livros';

  constructor(private readonly httpClient: HttpClient) { }

  getLivros(): Observable<Livro[]> {
    return this.httpClient.get<Livro[]>(this.apiUrl);
  }

  getLivrosById(id: number): Observable<Livro> {
    return this.httpClient.get<Livro>(`${this.apiUrl}/${id}`);
  }

  createLivro(livro: Livro): Observable<Livro> {
    return this.httpClient.post<Livro>(this.apiUrl, livro);
  }

  updateLivro(id: number, livro: Livro): Observable<Livro> {
    return this.httpClient.put<Livro>(`${this.apiUrl}/${id}`, livro);
  }

  deleteLivro(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchGoogleBooks(titulo: string): Observable<Livro[]> {
    return this.httpClient.get<Livro[]>(`${this.apiUrl}/google-search`, { params: { titulo } });
  }

  saveGoogleBook(livro: Livro): Observable<Livro> {
    return this.httpClient.post<Livro>(`${this.apiUrl}/google-save`, livro);
  }
}
