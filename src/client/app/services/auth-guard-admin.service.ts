import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(public auth: AuthService, private router: Router) { }

  canActivate() {
    // tslint:disable-next-line:curly
    if (this.auth.isAdmin)
      return true;
    this.router.navigate(['/notfound']);
    return false;
  }

}
