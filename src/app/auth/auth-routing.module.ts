import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'registration', component: RegistrationComponent },
  {path: 'registration/:registration_id', component: RegistrationComponent, canActivate: [AuthGuard]},
  {path: 'resetpassword', component: ResetpasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
