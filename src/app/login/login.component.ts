import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  message: any = "";
  constructor(private api: ApiService, private router: Router) {}

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
        console.log(response);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ token: response.token })
        );
        localStorage.setItem(
          "userdata",
          JSON.stringify({ userdata: response.userdata })
        );
        this.router.navigate(["/"]);
      }
    });
  }

  register() {
    this.router.navigate(["/register/"]);
  }
}
