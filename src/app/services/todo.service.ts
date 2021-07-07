import { Todo } from './../models/todo';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  apiUrl: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  }
  constructor(private HttpClient: HttpClient) {
    this.apiUrl = 'http://localhost:3000';

  }

  getTodos(): Observable<Todo[]> {
    return this.HttpClient.get<Todo[]>(`${this.apiUrl}/todos`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
      );
  }

  getTodo(id: number): Observable<Todo> {
    return this.HttpClient.get<Todo>(`${this.apiUrl}/todos/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.HttpClient.post<Todo>(
      `${this.apiUrl}/todos`,
      JSON.stringify(todo),
      this.httpOptions,
    );
  }

  handleError(error: any): Observable<never> {
    let message = '';
    if (error?.error instanceof ErrorEvent) {
      error = error.error.message;
    } else {
      error = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(message)
  }

  update(todo: Todo): Observable<Todo> {
    return this.HttpClient.put<Todo>(`${this.apiUrl}/todos/${todo?.id}`, todo);
  }

  delete(id: number) {
    return this.HttpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

}
