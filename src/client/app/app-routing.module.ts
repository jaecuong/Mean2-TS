import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { LogoutComponent } from './account/logout/logout.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './account/register/register.component';
import { CatsComponent } from './cats/cats.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'cats', component: CatsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: 'notfound', component: NotFoundComponent },


  // otherwise redirect to home
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
