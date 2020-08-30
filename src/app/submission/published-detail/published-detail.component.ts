import { Component, OnInit } from "@angular/core";
import { CollectionService } from "../../services/collection.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: "app-published-detail",
  templateUrl: "./published-detail.component.html",
  styleUrls: ["./published-detail.component.css"],
})
export class PublishedDetailComponent implements OnInit {
  submissionDetail: any = [];
  challengeDetail: any = [];
  categoryDetail: any = [];
  submissionFiles: any = [];
  submissionId = "";
  translation: any;

  constructor(
    private CollectionService: CollectionService,
    private activatedRoute: ActivatedRoute,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.translationService.getTranslation().subscribe((result) => {
      this.translation = result;
    });
    this.submissionId = this.activatedRoute.snapshot.params.submission_id;
    this.getSubmission();
  }

  getSubmission() {
    this.CollectionService.getItem(
      "submission",
      this.submissionId + "?fields=*.*"
    ).subscribe((data) => {
      this.submissionDetail = data.data;
      this.challengeDetail = data.data.challenge;
      this.categoryDetail = data.data.challenge_category;
      this.getSubmissionFiles(data.data.id);
    });
  }

  getSubmissionFiles(submissionId) {
    this.CollectionService.getItems(
      "submission_directus_files",
      `?filter[submission_id][eq]=${submissionId}&fields=directus_files_id.*`
    ).subscribe((data) => {
      this.submissionFiles = data.data;
    });
  }

  humanize(data) {
    var i = 0;
    if (Array.isArray(data)) {
      for (i = 0; i < data.length; i++) {
        data[i] = data[i]
          .replace("_", " ")
          .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
      }
      return data.filter(Boolean);
    } else {
      if (data != undefined) {
        return data.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
      }

      return "";
    }
  }

  previewImage(imgSrc) {
    let modal = document.getElementById("myModal");
    let modalImg = document.getElementById("myModalImg");
    modal.style.display = "block";

    if ((modalImg as HTMLImageElement).src != undefined) {
      (modalImg as HTMLImageElement).src = imgSrc;
    }
  }

  closePreview() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    let modalImg = document.getElementById("myModalImg");
  }
}
