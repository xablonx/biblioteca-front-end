import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Emprestimo } from '../models/emprestimo';
import { EmprestimoDTO } from '../models/emprestimoDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmprestimoService {
  private readonly apiUrl = '/api/emprestimos';

  constructor(private readonly httpClient: HttpClient) { }

  getEmprestimos(): Observable<Emprestimo[]> {
    return this.httpClient.get<Emprestimo[]>(this.apiUrl);
  }

  createEmprestimo(emprestimo: EmprestimoDTO): Observable<Emprestimo> {
    return this.httpClient.post<Emprestimo>(this.apiUrl, emprestimo);
  }

  returnEmprestimo(id: number): Observable<Emprestimo> {
    return this.httpClient.patch<Emprestimo>(`${this.apiUrl}/${id}/devolucao`, {});
  }
}
