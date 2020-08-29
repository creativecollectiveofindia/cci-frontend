import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-language-switcher",
  templateUrl: "./language-switcher.component.html",
  styleUrls: ["./language-switcher.component.css"],
})
export class LanguageSwitcherComponent implements OnInit {
  selectedLanguage: String;
  constructor() {}

  ngOnInit() {
    this.selectedLanguage = localStorage.getItem("preferredLanguage");
  }
  changeLanguage(event) {
    localStorage.setItem("preferredLanguage", event.target.value);
    sessionStorage.removeItem("translation");
    window.location.reload();
    console.log("Language switched to :", event.target.value);
  }
}
