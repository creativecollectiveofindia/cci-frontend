import { Component, OnInit } from "@angular/core";
import { CollectionService } from "../../services/collection.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslationService } from "../../services/translation.service";
import {
  faFacebookSquare,
  faTwitterSquare,
  faInstagramSquare,
  faWhatsappSquare,
  faLinkedin,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPrint, faSms } from "@fortawesome/free-solid-svg-icons";

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
  pageurl: string;
  faFacebook = faFacebookSquare;
  faTwitter = faTwitterSquare;
  faInstagram = faInstagramSquare;
  faWhatsapp = faWhatsappSquare;
  faLinkedIn = faLinkedin;
  faEnvelopeSquare = faEnvelope;
  faPrint = faPrint;
  faSms = faSms;
  faTelegram = faTelegram;

  constructor(
    private CollectionService: CollectionService,
    private activatedRoute: ActivatedRoute,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.pageurl = encodeURIComponent(window.location.href);
    this.translationService.getTranslation().subscribe((result) => {
      this.translation = result;
    });
    this.submissionId = this.activatedRoute.snapshot.params.submission_id;
    this.getSubmission();
  }

  share(platform) {
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${this.pageurl}`
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/share?url=${this.pageurl}&text=${this.submissionDetail.title}&via=CCI_2020&hashtags=cci,COVID19`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${this.pageurl}`
        );
        break;
      case "whatsapp":
        window.open(`whatsapp://send?text=${this.pageurl}`);
        break;
      case "email":
        window.open(
          `mailto:?subject=${this.submissionDetail.title}&body=${this.submissionDetail.title} ${this.pageurl}`
        );
        break;
      case "gmail":
        window.open(
          `https://mail.google.com/mail/?view=cm&su=${this.submissionDetail.title}&body=${this.submissionDetail.title} ${this.pageurl}`
        );
        break;
      case "sms":
        window.open(
          `sms:99999999?body=${this.submissionDetail.title}${this.pageurl}`
        );
        break;
      case "telegram":
        window.open(
          `https://telegram.me/share/url?url=${this.pageurl}&text=${this.submissionDetail.title}`
        );
        break;
      case "print":
        window.print();
        break;
      default:
        break;
    }
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
