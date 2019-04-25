import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import {environment} from '../environments/environment' ;



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpHeaders = new HttpHeaders();
  constructor(private http : HttpClient) { 
    this.httpHeaders = this.httpHeaders.set('X-Authorization', 'Bearer ').set('Content-Type', 'application/json');
  }


  public static apiList = {

     getPublickey : '/get-public-key',
     saveLoginData:'/save-data',

  }

  postSerice (url, data): Observable<any> {
    console.log("url: ", environment.backendUrl+url);
    
    return this.http.post<any>(environment.backendUrl+url, data,
      {
        headers: this.httpHeaders
    }
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  getSerice (url): Observable<any> {
    return this.http.get<any>(environment.backendUrl+url)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
