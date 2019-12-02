import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  //   constructor(private api: ApiService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // throw new Error("Method not implemented.");

    if (localStorage.getItem("currentUser")) {
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = currentUser.token;
      const cloned = req.clone({
        headers: req.headers.set("x-auth", token)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
