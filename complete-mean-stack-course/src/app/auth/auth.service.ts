import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  private timerToken: any;
  private isAuth = false;
  private token: string;
  private authStatus = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getUserStat() {
    return this.isAuth;
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  createUser(email, pwd) {
    const authData: AuthData = {email: email, password: pwd};

    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(res => {
      console.log(res);
    });
  }

  login(email: string, pwd: string) {
    const authData: AuthData = {email: email, password: pwd};

    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData)
      .subscribe(res => {
        this.token = res.token;
        console.log(res);
        if (res.token) {
          const expireIn = res.expiresIn;
          this.setAuthTimer(expireIn);
          this.isAuth = true;
          const now = new Date();
          const expiration = new Date(now.getTime() + expireIn * 1000);
          this.saveAuthData(res.token, expiration);
          this.authStatus.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  autoLog() {
    const authInf = this.getAuthData();
    if (!authInf) {
      return;
    }
    const expiresIn = authInf.exp.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.token = authInf.token;
      this.isAuth = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatus.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatus.next(false);
    clearTimeout(this.timerToken);
    this.clearAuthData();
    this.router.navigate(['/']);

  }

  private setAuthTimer(duration: number) {
    this.timerToken = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('exp', expDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expDate = localStorage.getItem('exp');
    if (!token || !expDate) {
      return;
    }
    return {token: token, exp: new Date(expDate)};
  }
}
