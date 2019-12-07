import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import "rxjs/Rx";
import { HttpClient } from "@angular/common/http";

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class ApiService {
  // url: string = "http://localhost:3500";
  url: string = "https://ash-bug-tracker.herokuapp.com";
  token: any;
  currentProject: any;
  currentBugs: any;
  currentUsers: any;
  viewUserId: any;
  newExists: boolean;

  constructor(private httpClient: HttpClient) {}

  // User Routes
  registerUser(data) {
    console.log(data);
    return this.httpClient
      .post(this.url + "/user/register", data)
      .map((response: Response) => {
        return response;
      });
  }

  loginUser(data) {
    return this.httpClient
      .post(this.url + "/user/login", data)
      .map((response: Response) => {
        return response;
      });
  }

  updateUser(data) {
    return this.httpClient
      .post(this.url + "/user/update", data)
      .map((response: Response) => {
        return response;
      });
  }

  getOneProject(data) {
    return this.httpClient
      .post(this.url + "/user/getOneProject", data)
      .map((response: Response) => {
        return response;
      });
  }

  getAllProject() {
    return this.httpClient
      .post(this.url + "/user/getAllProjects", {})
      .map((response: Response) => {
        return response;
      });
  }

  getEveryUser() {
    return this.httpClient
      .post(this.url + "/user/getEveryUser", {})
      .map((response: Response) => {
        return response;
      });
  }

  viewUserProfile(data) {
    return this.httpClient
      .post(this.url + "/user/viewProfile", data)
      .map((response: Response) => {
        return response;
      });
  }

  forgotPassWord(data) {
    return this.httpClient
      .post(this.url + "/user/forgotPass", data)
      .map((response: Response) => {
        return response;
      });
  }

  getInbox() {
    return this.httpClient
      .post(this.url + "/user/getInbox", {})
      .map((response: Response) => {
        return response;
      });
  }

  markAsRead(data) {
    return this.httpClient
      .post(this.url + "/user/mark-as-read", data)
      .map((response: Response) => {
        return response;
      });
  }

  markasNotNew() {
    return this.httpClient
      .post(this.url + "/user/markasNotNew", {})
      .map((response: Response) => {
        return response;
      });
  }

  getNoOfinbox() {
    return this.httpClient
      .post(this.url + "/user/getNoOfinbox", {})
      .map((response: Response) => {
        return response;
      });
  }

  // Project Routes
  createProject(data) {
    return this.httpClient
      .post(this.url + "/project/new", data)
      .map((response: Response) => {
        return response;
      });
  }

  addBuddy(data) {
    return this.httpClient
      .post(this.url + "/project/addbuddy", data)
      .map((response: Response) => {
        return response;
      });
  }

  getAllUsers(data) {
    return this.httpClient
      .post(this.url + "/project/getAllUsers", data)
      .map((response: Response) => {
        return response;
      });
  }

  removeBuddy(data) {
    return this.httpClient
      .post(this.url + "/project/removeBuddy", data)
      .map((response: Response) => {
        return response;
      });
  }

  deleteProject(data) {
    return this.httpClient
      .post(this.url + "/project/delete", data)
      .map((response: Response) => {
        return response;
      });
  }

  approveProject(data) {
    return this.httpClient
      .post(this.url + "/project/approveProject", data)
      .map((response: Response) => {
        return response;
      });
  }

  rejectProject(data) {
    return this.httpClient
      .post(this.url + "/project/rejectProject", data)
      .map((response: Response) => {
        return response;
      });
  }

  // Bug
  getAllBug(data) {
    return this.httpClient
      .post(this.url + "/bug/all", data)
      .map((response: Response) => {
        return response;
      });
  }

  registerBug(data) {
    return this.httpClient
      .post(this.url + "/bug/new", data)
      .map((response: Response) => {
        return response;
      });
  }

  updateBug(data) {
    return this.httpClient
      .post(this.url + "/bug/edit", data)
      .map((response: Response) => {
        return response;
      });
  }

  watchBug(data) {
    return this.httpClient
      .post(this.url + "/bug/watch", data)
      .map((response: Response) => {
        return response;
      });
  }

  archiveBug(data) {
    return this.httpClient
      .post(this.url + "/bug/archive", data)
      .map((response: Response) => {
        return response;
      });
  }

  submitSolution(data) {
    return this.httpClient
      .post(this.url + "/bug/solution", data)
      .map((response: Response) => {
        return response;
      });
  }

  assignBugToDevs(data) {
    return this.httpClient
      .post(this.url + "/bug/assignDev", data)
      .map((response: Response) => {
        return response;
      });
  }
}
