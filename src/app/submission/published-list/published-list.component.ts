import { Component, OnInit } from "@angular/core";
import { CollectionService } from "../../services/collection.service";
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
} from "@angular/forms";
import { Submission } from "../submission";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-published-list",
  templateUrl: "./published-list.component.html",
  styleUrls: ["./published-list.component.css"],
})
export class PublishedListComponent implements OnInit {
  submissionList: any = [];
  submission: Submission;
  result = [];
  offset = 0;
  limit = 10;
  flag = 0;
  status = "";
  filters = "";
  statusFilter = "";
  submissionFiles = [];

  constructor(
    private CollectionService: CollectionService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private AuthService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getSubmissionList();
  }

  getSubmissionList(isPrev?, isNext?) {
    if (isNext) {
      this.flag++;
    }
    if (isPrev) {
      this.flag--;
    }
    this.offset = this.flag * this.limit;
    this.status = "published";
    this.filters =
      "?offset=" +
      this.offset +
      "&limit=" +
      this.limit +
      "&status=" +
      this.status +
      "&fields=*.*";
    this.CollectionService.getItems("submission", this.filters).subscribe(
      (result) => {
        this.submissionList = [];
        result.data.forEach((result) => {
          result.challenge_name = result.challenge_category.title;
          result.topic = result.challenge.title;
          result.owner_name =
            result.owner.first_name + " " + result.owner.last_name;
          this.submissionList.push(result);

          this.getSubmissionFiles(result.id);
        });
      }
    );
  }

  getSubmissionFiles(submissionId) {
    this.CollectionService.getItems(
      "submission_directus_files",
      `?filter[submission_id][eq]=${submissionId}&fields=directus_files_id.*`
    ).subscribe((data) => {
      if (data.data[0].directus_files_id.type.indexOf("image") > -1) {
        this.submissionFiles[submissionId] =
          data.data[0].directus_files_id.data.thumbnails[3].url;
      }
    });
  }
}
