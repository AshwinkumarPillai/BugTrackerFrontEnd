import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import "rxjs/Rx";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class ApiService {
  url: string = "http://localhost:3500";
  token: any;
  constructor(private http: Http, private httpClient: HttpClient) {}

  // User Routes
  registerUser(data) {
    console.log(data);
    return this.http.post(this.url + "/user/register", data).map((response: Response) => {
      return response.json();
    });
  }

  loginUser(data) {
    return this.httpClient.post(this.url + "/user/login", data).map((response: Response) => {
      return response;
    });
    // return this.http.post(this.url + "/user/login", data).map((response: Response) => {
    //   return response.json();
    // });
  }

  updateUser(data) {
    return this.http.post(this.url + "/user/update", data).map((response: Response) => {
      return response.json();
    });
  }

  getOneProject(data) {
    return this.http.post(this.url + "/user/getOneProject", data).map((response: Response) => {
      return response.json();
    });
  }

  getAllProject(data) {
    return this.http.post(this.url + "/user/getAllProjects", data).map((response: Response) => {
      return response.json();
    });
  }

  // Project Routes
  createProject(data) {
    return this.http.post(this.url + "/project/new", data).map((response: Response) => {
      return response.json();
    });
  }

  addBuddy(data) {
    return this.http.post(this.url + "/project/addbuddy", data).map((response: Response) => {
      return response.json();
    });
  }

  getAllUsers(data) {
    return this.http.post(this.url + "/project/getAllUsers", data).map((response: Response) => {
      return response.json();
    });
  }

  removeBuddy(data) {
    return this.http.post(this.url + "/project/removeBuddy", data).map((response: Response) => {
      return response.json();
    });
  }

  // Bug
  getAllBug(data) {
    return this.http.post(this.url + "/bug/all", data).map((response: Response) => {
      return response.json();
    });
  }

  registerBug(data) {
    return this.http.post(this.url + "/bug/new", data).map((response: Response) => {
      return response.json();
    });
  }

  updateBug(data) {
    return this.http.post(this.url + "/bug/edit", data).map((response: Response) => {
      return response.json();
    });
  }

  watchBug(data) {
    return this.http.post(this.url + "/bug/watch", data).map((response: Response) => {
      return response.json();
    });
  }

  archiveBug(data) {
    return this.http.post(this.url + "/bug/archive", data).map((response: Response) => {
      return response.json();
    });
  }

  submitSolution(data) {
    return this.http.post(this.url + "/bug/solution", data).map((response: Response) => {
      return response.json();
    });
  }

  assignBugToDevs(data) {
    return this.http.post(this.url + "/bug/assignDev", data).map((response: Response) => {
      return response.json();
    });
  }
}
