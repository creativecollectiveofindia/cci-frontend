import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmissionFormComponent } from './submission-form/submission-form.component';
import { SubmissionComponent } from './submission/submission.component';
import { AuthGuard } from '../auth/auth.guard';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { PublishedListComponent } from './published-list/published-list.component';
import { PublishedDetailComponent } from './published-detail/published-detail.component';

const routes: Routes = [
  {path: 'submission_form', component: SubmissionFormComponent, canActivate: [AuthGuard]},
  {path: 'review/:submission_id', component: SubmissionComponent, canActivate: [AuthGuard]},
  {path: 'submission_form/:submission_id', component: SubmissionFormComponent, canActivate: [AuthGuard]},
  {path: 'submission-list', component: SubmissionListComponent, canActivate: [AuthGuard]},
  {path: 'published-list', component: PublishedListComponent},
  {path: 'published-detail/:submission_id', component: PublishedDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionRoutingModule { }
