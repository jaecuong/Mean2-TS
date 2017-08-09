import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { AppConfig } from './app.config';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';
import { AccountComponent } from './account/account.component';
import { LogoutComponent } from './account/logout/logout.component';
import { RegisterComponent } from './account/register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CatsComponent } from './cats/cats.component';
import { AboutComponent } from './about/about.component';
import { AuthService, AuthGuardLogin, AuthGuardAdmin, CatService, UserService } from './services/index';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    AccountComponent,
    LogoutComponent,
    RegisterComponent,
    NotFoundComponent,
    CatsComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    // CoreModule, //Singletonobjects
    SharedModule //Shared (multi-instance) objects
  ],
  providers: [
    AppConfig,
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    CatService,
    UserService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
