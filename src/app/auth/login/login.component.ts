import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error: {errorTitle: '', errorDesc: ''};
  loginError: string;
  resetSuccess: String;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.authService.logout();
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    this.submitted = true;
    this.authService.login(this.username.value, this.password.value).subscribe((data) => {
       if (this.authService.isLoggedIn) {
          const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/submission-list';
          this.router.navigate([redirect]);
        } else {
          this.router.navigate(['/loign']);
        }
      },
      (error) => {
        console.log(error);
        this.loginError = 'E-Mail and password do not match or you do not have an account yet.';
      }
    );
  }

  forgotPassword(){
    let formValue = this.loginForm.value;

    if (formValue.username != '')
    {
      if (this.loginForm.get('username').invalid == true)
      {
        this.loginError = 'Entered E-Mail Id is incorrect';

        return;
      }
      else
      {
        this.userService.requestPasswordReset(formValue.username).subscribe((data) => {
          this.resetSuccess = "please check your mail to reset your password";
         },
         (error) => {
           console.log(error);
           this.loginError = 'Unable to reset your password';
         }
       );
      }
    }
    else
    {
      this.loginError = 'Enter E-Mail Id';

      return;
    }
  }
}
