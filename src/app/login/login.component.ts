import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  message: any = "";
  constructor(private api: ApiService) {}

  ngOnInit() {}

  login(email, password) {
    this.message = "";
    let data = {
      email,
      password
    };
    this.api.loginUser(data).subscribe((response: any) => {
      this.message = response.message;
      if (response.token) {
        this.api.token = response.token;
        localStorage.setItem("currentUser", JSON.stringify({ token: response.token }));
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        let token = currentUser.token;
      }
    });
  }
}
