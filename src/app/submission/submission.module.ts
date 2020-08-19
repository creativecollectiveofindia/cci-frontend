import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { SubmissionRoutingModule } from "./submission-routing.module";
import { SubmissionFormComponent } from "./submission-form/submission-form.component";
import { SubmissionListComponent } from "./submission-list/submission-list.component";
import { SubmissionComponent } from "./submission/submission.component";
import { PublishedListComponent } from "./published-list/published-list.component";
import { PublishedDetailComponent } from "./published-detail/published-detail.component";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    SubmissionRoutingModule,
  ],
  declarations: [
    SubmissionFormComponent,
    SubmissionListComponent,
    SubmissionComponent,
    PublishedListComponent,
    PublishedDetailComponent,
  ],
})
export class SubmissionModule {}
