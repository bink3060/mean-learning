import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuth = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userAuth = this.authService.getUserStat();
    this.authListenerSub = this.authService.getAuthStatus().subscribe(isAuth => {
      this.userAuth = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }
}
