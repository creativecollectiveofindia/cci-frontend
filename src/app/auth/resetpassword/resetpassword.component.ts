import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CollectionService } from '../../services/collection.service';
import { User } from '../user.model';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  form = new FormGroup({});
  user : User;
  submitted = false;
  resetError: string;
  success: string;
  isSubmitted: string;
  loading:boolean = false;
  constructor( private userService : UserService,private CollectionService: CollectionService, private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) { }

  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    password1: ['', Validators.required],
    token: [''],
  });

  ngOnInit() {
  }

  reset(){
    let token = this.activatedRoute.snapshot.queryParamMap.get("token");

    if (!token)
    {
      this.resetError = 'Invalid reset password token';

      return;
    }

    this.isSubmitted = 'true';
    let formValue = this.resetForm.value;
    formValue.token = token;

    if (formValue.password != formValue.password1)
    {
      document.documentElement.scrollTop = 0;
      this.resetError = 'Password does not match';

      return;
    }

    delete formValue.password1;
    this.loading = true;
     this.userService.resetPassword(formValue)
    .subscribe(
      data => {
        this.loading = false;
        this.resetForm.reset();
        document.documentElement.scrollTop = 0;
        this.success = 'Your password is updated successfully';
      },
      (error) => {
        this.loading = false;
        console.log(error);
        document.documentElement.scrollTop = 0;
        this.resetError = 'Failed to reset your password';
      });
  }
}
