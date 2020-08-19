import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.isLoggedIn()) {
      let user = JSON.parse(localStorage.getItem("currentUser"));

      if (user.data.lastLogin != undefined) {
        let currentDate = new Date();
        let cmpLastLogin = user.data.lastLogin;
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
        let cmpCurrent =
          currentDate.getFullYear().toString() +
          crtMonth +
          crtDate +
          crtHours +
          crtMinutes;

        if (parseInt(cmpCurrent) - parseInt(cmpLastLogin) > 19) {
          this.authService.logout();
        }

        if (parseInt(cmpCurrent) - parseInt(cmpLastLogin) > 10) {
          let user = JSON.parse(localStorage.getItem("currentUser"));
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

          localStorage.setItem("currentUser", JSON.stringify(user));

          this.authService.refreshToken(user.data.token).subscribe((data) => {
            if (data && data.data.token) {
              user.data.token = data.data.token;
              localStorage.setItem("currentUser", JSON.stringify(user));
            }
          });
        }
      }

      const authToken = this.authService.getAuthorizationToken();
      req = req.clone({
        setHeaders: { Authorization: "Bearer " + authToken },
      });
    }

    return next.handle(req);
  }
}
