import { Component, OnInit } from "@angular/core";
import { TranslationService } from "../services/translation.service";

@Component({
  selector: "app-language-switcher",
  templateUrl: "./language-switcher.component.html",
  styleUrls: ["./language-switcher.component.css"],
})
export class LanguageSwitcherComponent implements OnInit {
  selectedLanguage: String;
  constructor(public translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.getLanguage().subscribe((result) => {
      this.selectedLanguage = result;
    });
  }
  changeLanguage(event) {
    this.translationService.setLanguage(event.target.value);
    localStorage.setItem("preferredLanguage", event.target.value);
    sessionStorage.removeItem("translation");
    this.translationService.fetchTranslation().subscribe((data) => {
      this.translationService.shareTranslation(data);
      sessionStorage.setItem("translation", JSON.stringify(data));
    });
    //location.reload();
    console.log("Language switched to :", event.target.value);
  }
}
