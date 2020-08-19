import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, BehaviorSubject, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  serverUrl = environment.baseUrl;
  errorData: {};
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  redirectUrl: string;

  login(username: string, password: string) {
    return this.http
      .post<any>(`${this.serverUrl}auth/authenticate`, {
        email: username,
        password: password,
      })
      .pipe(
        map((user) => {
          if (user && user.data.token) {
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
            user.data.isCreator = this.isCreator();
            user.data.isReviewer = this.isReviewer();
            user.data.isAdmin = this.isAdmin();
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(oldToken) {
    return this.http
      .post<any>(`${this.serverUrl}auth/refresh`, { token: oldToken })
      .pipe(catchError(this.handleError));
  }

  isLoggedIn() {
    let user = JSON.parse(localStorage.getItem("currentUser"));

    if (user != null && user.data.lastLogin != undefined) {
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
      let cmpLastLogin = user.data.lastLogin;
      let cmpCurrent =
        currentDate.getFullYear().toString() +
        crtMonth +
        crtDate +
        crtHours +
        crtMinutes;

      if (parseInt(cmpCurrent) - parseInt(cmpLastLogin) > 20) {
        localStorage.removeItem("currentUser");
        window.location.reload();
      }
    }

    if (localStorage.getItem("currentUser")) {
      return true;
    }
    return false;
  }

  isCreator() {
    if (localStorage.getItem("currentUser")) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (currentUser != null && currentUser.data.user.role == 3) {
        return true;
      }
    }

    return false;
  }

  isReviewer() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser != null && currentUser.data.user.role == 4) {
      return true;
    }

    return false;
  }

  getAuthorizationToken() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser.data.token;
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: "Oops! Request for document failed",
      errorDesc: "Something bad happened. Please try again later.",
    };
    return throwError(this.errorData);
  }

  isAdmin() {
    if (localStorage.getItem("currentUser")) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (currentUser.data.user.role == 1) {
        return true;
      }
    }
  }
}
