import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  public getTranslation(language) {
    return this.http.get(`./assets/${language}.json`);
  }
}
