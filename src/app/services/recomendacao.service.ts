import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Livro } from '../models/livro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecomendacaoService {
  private readonly apiUrl = '/api/recomendacoes';

  constructor(private readonly httpClient: HttpClient) { }

  getRecomendacoesByUsuario(usuarioId: number): Observable<Livro[]> {
    return this.httpClient.get<Livro[]>(`${this.apiUrl}/usuarios/${usuarioId}`);
  }
}
