import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  public translation;
  public language;

  fetchTranslation() {
    return this.http.get(`./assets/${this.language}.json`);
  }

  setLanguage(value) {
    this.language = value;
    console.log("setLanguage", value);
  }

  shareTranslation(value) {
    this.translation = value;
    console.log("shareTranslation", value);
  }

  getLanguage() {
    return this.language;
  }

  getTranslation() {
    return this.translation;
  }
}
