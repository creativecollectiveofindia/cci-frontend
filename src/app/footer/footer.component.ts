import { Component, OnInit } from "@angular/core";
import { TranslationService } from "./../services/translation.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  translation: any;
  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.getTranslation().subscribe((result) => {
      this.translation = result;
    });
  }
}
