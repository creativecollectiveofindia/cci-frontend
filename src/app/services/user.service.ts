import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  access_token =
    "cxFd3Dsasds43sadsDSdsadawq32sdasAsadADSdewdsacxfaewdsFFSDfSDfewsfdsffda334";
  serverUrl = environment.baseUrl;
  siteUrl = environment.siteUrl;
  errorData: {};

  constructor(private http: HttpClient) {}

  RegisterUser(formValue: object) {
    return this.http
      .post<any>(
        `${this.serverUrl}users?access_token=${this.access_token}`,
        formValue
      )
      .pipe(catchError(this.handleError));
  }

  resetPassword(formValue: object) {
    return this.http
      .post<any>(`${this.serverUrl}auth/password/reset`, formValue)
      .pipe(catchError(this.handleError));
  }

  requestPasswordReset(username: String) {
    let formValue = {
      email: username,
      reset_url: this.siteUrl + "resetpassword",
    };

    return this.http
      .post<any>(`${this.serverUrl}auth/password/request`, formValue)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
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

  getItem(collection: string, itemId: string) {
    return this.http
      .get<any>(`${this.serverUrl}${collection}/${itemId}`)
      .pipe(catchError(this.handleError));
  }

  updateItem(collection: string, itemId: number, formData: object) {
    return this.http
      .patch<any>(`${this.serverUrl}${collection}/${itemId}`, formData)
      .pipe(catchError(this.handleError));
  }
}
