import {Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Http, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {

  constructor(private http: Http) {}

  downloadFile(filepath): Observable<any>{
    return this.http.get(filepath, {responseType: ResponseContentType.Blob});
  }

}
