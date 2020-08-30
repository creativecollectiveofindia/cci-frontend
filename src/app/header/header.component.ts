import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";
import { CollectionService } from "../services/collection.service";
import { TranslationService } from "./../services/translation.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  currentUserSubscription: Subscription;
  isLoggedIn = null;
  isCreator = false;
  isReviewer = false;
  challenges: any = [];
  translation: any;

  constructor(
    private CollectionService: CollectionService,
    private titleService: Title,
    private authService: AuthService,
    private translationService: TranslationService
  ) {
    this.currentUserSubscription = this.authService.currentUser.subscribe(
      (user) => {
        this.isLoggedIn = user;
        this.isCreator =
          user != undefined && user.data.isCreator != undefined
            ? user.data.isCreator
            : null;
        this.isReviewer =
          user != undefined && user.data.isReviewer != undefined
            ? user.data.isReviewer
            : null;
      }
    );
  }

  ngOnInit() {
    this.translationService.getTranslation().subscribe((result) => {
      this.translation = result;
    });
    this.getChallengeData();
  }

  setPageTitle(title: string) {
    this.titleService.setTitle(title);
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  getChallengeData() {
    this.CollectionService.getItems("challenge_category").subscribe((data) => {
      data.data.forEach((result) => {
        this.challenges.push(result);
      });
    });
  }
}
