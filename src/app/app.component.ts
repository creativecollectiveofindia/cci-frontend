import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../app/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "CCI";
  constructor(public router: Router, private authService: AuthService) {
    setInterval(function () {
      if (authService.isLoggedIn()) {
        let user = JSON.parse(localStorage.getItem("currentUser"));

        authService.refreshToken(user.data.token).subscribe((data) => {
          if (data && data.data.token) {
            let currentDate = new Date();
            let crtMonth =
              currentDate.getMonth() < 10
                ? "0" + currentDate.getMonth().toString()
                : currentDate.getMonth().toString();
            let crtDate =
              currentDate.getDate() < 10
                ? "0" + currentDate.getDate().toString()
                : currentDate.getDate().toString();
            let crtHours =
              currentDate.getHours() < 10
                ? "0" + currentDate.getHours().toString()
                : currentDate.getHours().toString();
            let crtMinutes =
              currentDate.getMinutes() < 10
                ? "0" + currentDate.getMinutes().toString()
                : currentDate.getMinutes().toString();
            user.data.lastLogin =
              currentDate.getFullYear().toString() +
              crtMonth +
              crtDate +
              crtHours +
              crtMinutes;
            user.data.token = data.data.token;
            localStorage.setItem("currentUser", JSON.stringify(user));
          }
        });
      }
    }, 180000);
  }
}
