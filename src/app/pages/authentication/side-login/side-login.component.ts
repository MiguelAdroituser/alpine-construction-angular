import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {

  form: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /* form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  }); */

  get f() {
    return this.form.controls;
  }

  get getform() {
    return {
      ...this.form.value
    }
  }
  /* submit() {
    // console.log(this.form.value);
    this.router.navigate(['/']);
  } */

  async submit() {
    this.submitted = true;

    if ( this.form.valid ) {
      const { email, password } = this.getform;

      this.authService.login(email, password).subscribe(
        token => {
          console.log('Logged in with token:', token);
          
          this.router.navigate(['/ui-components/crafts'])
        },
        error => {
          console.error('Login failed:', error);
          // this.errorMessage = 'Invalid email or password!';
          // this.showError = true;
          this.submitted = false;

          // setTimeout(() => this.showError = false, 3000);
        }
      );

    }
  }
}
