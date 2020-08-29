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
    this.selectedLanguage = localStorage.getItem("preferredLanguage");
  }
  changeLanguage(event) {
    localStorage.setItem("preferredLanguage", event.target.value);
    sessionStorage.removeItem("translation");
    if (!sessionStorage.getItem("translation")) {
      this.translationService.getTranslation().subscribe((data) => {
        sessionStorage.setItem("translation", JSON.stringify(data));
        console.log(data);
      });
    }
    window.location.reload();
    console.log("Language switched to :", event.target.value);
  }
}
