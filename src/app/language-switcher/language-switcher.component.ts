import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-language-switcher",
  templateUrl: "./language-switcher.component.html",
  styleUrls: ["./language-switcher.component.css"],
})
export class LanguageSwitcherComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  changeLanguage(event) {
    localStorage.setItem("preferredLanguage", event.target.value);
    console.log("Language switched to :", event.target.value);
  }
}
