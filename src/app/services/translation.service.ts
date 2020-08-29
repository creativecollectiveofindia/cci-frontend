import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  getTranslation() {
    let preferredLanguage = localStorage.getItem("preferredLanguage");
    if (!preferredLanguage) {
      localStorage.setItem("preferredLanguage", "en");
      preferredLanguage = "en";
    }
    return this.http.get(`./assets/${preferredLanguage}.json`);
  }
}
