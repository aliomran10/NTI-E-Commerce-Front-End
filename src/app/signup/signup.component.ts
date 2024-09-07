import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
  constructor(private _AuthService: AuthService, private _Router:Router){}
  
  signupForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
  });

  emailErrors: string = '';
  passwordErrors: string = '';

  signup(formData:FormGroup){
    this._AuthService.signUp(formData.value).subscribe((res) => {
      if(res.token) { 
        localStorage.setItem('user', res.token);
        this._AuthService.saveCurrentUser();
      }
      this._Router.navigate(['/home'])
    }, (err) => {
      err.error.errors.map((error:any) => {
        if(error.path === 'email') this.emailErrors = error.msg;
        if(error.path === 'password') this.passwordErrors = error.msg;
      })
    })
  }
}
