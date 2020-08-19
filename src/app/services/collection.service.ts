import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  serverUrl = environment.baseUrl;
  errorData: {};

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) {}

  getField(collection: string, fieldName: string) {
    return this.http
      .get<any>(`${this.serverUrl}fields/${collection}/${fieldName}`)
      .pipe(catchError(this.handleError));
  }

  getFields(collection: string) {
    return this.http
      .get<any>(`${this.serverUrl}fields/${collection}`)
      .pipe(catchError(this.handleError));
  }

  getItem(collection: string, itemId: string) {
    return this.http
      .get<any>(`${this.serverUrl}items/${collection}/${itemId}`)
      .pipe(catchError(this.handleError));
  }

  getItems(collection: string, filters: string = "") {
    return this.http
      .get<any>(`${this.serverUrl}items/${collection}${filters}`)
      .pipe(catchError(this.handleError));
  }

  createItem(collection: string, formData: object) {
    return this.http
      .post<any>(`${this.serverUrl}items/${collection}`, formData)
      .pipe(catchError(this.handleError));
  }

  updateItem(collection: string, itemId: number, formData: object) {
    return this.http
      .patch<any>(`${this.serverUrl}items/${collection}/${itemId}`, formData)
      .pipe(catchError(this.handleError));
  }

  deleteItem(collection: string, itemId: number) {
    return this.http
      .delete<any>(`${this.serverUrl}items/${collection}/${itemId}`)
      .pipe(catchError(this.handleError));
  }

  uploadFile(data) {
    const formData = new FormData();
    formData.append("file", data);

    return this.http
      .post<any>(`${this.serverUrl}files`, formData, {
        reportProgress: true,
        observe: "events",
      })
      .pipe(
        map((event) => this.getEventMessage(event, formData)),
        catchError(this.handleError)
      );
  }

  private getEventMessage(event: HttpEvent<any>, formData) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
        break;
      case HttpEventType.Response:
        return this.apiResponse(event);
        break;
      default:
        return `File "${formData.get("file").name}" surprising upload event: ${
          event.type
        }.`;
    }
  }

  private fileUploadProgress(event) {
    const percentDone = Math.round((100 * event.loaded) / event.total);
    return { status: "progress", message: percentDone };
  }

  private apiResponse(event) {
    return event.body;
  }

  deleteFile(fileId) {
    return this.http
      .delete<any>(`${this.serverUrl}files/${fileId}`)
      .pipe(catchError(this.handleError));
  }

  filePath(submissionId) {
    return this.http
      .get<any>(
        `${this.serverUrl}items/submission_directus_files?filter[submission_id][eq]=${submissionId}&fields=*.*`
      )

      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    }

    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: "Oops! Request for document failed",
      errorDesc: "Something bad happened. Please try again later.",
    };
    return throwError(this.errorData);
  }

  getUsersData(itemId: string) {
    return this.http
      .get<any>(`${this.serverUrl}users/${itemId}`)
      .pipe(catchError(this.handleError));
  }
}
