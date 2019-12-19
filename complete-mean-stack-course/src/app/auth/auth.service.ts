import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';

@Injectable({providedIn: 'root'})
export class AuthService {


  constructor(private http: HttpClient) {
  }

  createUser(email, pwd) {
    const authData: AuthData = {email: email, password: pwd};

    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(res => {

    });
  }
}
