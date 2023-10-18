import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http : HttpClient) { }

  async sendEmail(email:string) : Promise<Observable<any>> {
    return this.http.post('http://localhost:8081/sendEmail',{email : email});    
  }
}
