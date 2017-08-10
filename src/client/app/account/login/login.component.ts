import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../../services/index';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidLogin: boolean;
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required,
  Validators.minLength(3),
  Validators.maxLength(100),
  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]);

  password = new FormControl('', [Validators.required,
  Validators.minLength(6)]);

  constructor(private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public toast: ToastComponent,
    private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.auth.loggedIn) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  // setClassEmail() {
  //   return { 'has-danger': !this.email.pristine && !this.email.valid };
  // }
  // setClassPassword() {
  //   return { 'has-danger': !this.password.pristine && !this.password.valid };
  // }

  login() {
    this.auth.login(this.loginForm.value).subscribe(
      result => {
        // tslint:disable-next-line:curly
        if (result) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/']);
        }
        // tslint:disable-next-line:curly
        else
          this.invalidLogin = true;
      },
      error => {
        this.toast.setMessage('invalid email or password! ' + error, 'danger');
      }
    );
  }

}
