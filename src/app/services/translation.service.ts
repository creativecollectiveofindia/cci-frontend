import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  public translationSource = new BehaviorSubject<any>({});
  public translation = this.translationSource.asObservable();
  public languageSource = new BehaviorSubject<string>("en");
  public language = this.languageSource.asObservable();

  fetchTranslation() {
    let fetchLanguage = localStorage.getItem("preferredLanguage");
    return this.http.get(`./assets/${fetchLanguage}.json`);
  }

  setLanguage(value) {
    this.languageSource.next(value);
    console.log("setLanguage", value);
  }

  shareTranslation(value) {
    this.translationSource.next(value);
    this.translation = value;
    console.log("shareTranslation", value);
  }
}
