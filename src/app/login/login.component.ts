import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  message: any = "";
  fgpass: boolean = false;
  @ViewChild("fgemail") fgemail: ElementRef;

  constructor(
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    if (localStorage.getItem("currentUser")) {
      this.router.navigate(["/"]);
    }
  }

  login(email, password) {
    if (/^\s*$/.test(email)) {
      alert("Provide proper email");
    } else if (/^\s*$/.test(password)) {
      alert("Password cannot be empty");
    } else {
      this.message = "";
      let data = {
        email,
        password
      };
      this.spinner.show();
      let flag = 0;
      setTimeout(() => {
        console.log(flag);
        if (flag == 0) alert("Looks like you are not connected to internet");
      }, 10000);

      if (flag == 0) {
        this.api.loginUser(data).subscribe((response: any) => {
          flag = 1;
          this.message = response.message;
          if (response.token) {
            this.api.token = response.token;
            localStorage.setItem(
              "currentUser",
              JSON.stringify({ token: response.token, loggedIn: true })
            );
            localStorage.setItem(
              "userdata",
              JSON.stringify({ userdata: response.userdata })
            );
            this.spinner.hide();
            location.reload();
            this.router.navigate(["/"]);
          } else {
            this.spinner.hide();
          }
        });
      }
    }
  }

  register() {
    this.router.navigate(["/register/"]);
  }

  forgotPassword() {
    this.fgpass = true;
  }

  mailpass() {
    if (/^\s*$/.test(this.fgemail.nativeElement.value)) {
      alert("Please provide your email. We can't magically provide you a link");
    } else {
      let data = {
        email: this.fgemail.nativeElement.value
      };
      this.api.forgotPassWord(data).subscribe((response: any) => {
        alert(response.message);
        this.router.navigate(["/login/"]);
      });
    }
  }

  cancelFgpass() {
    this.fgpass = false;
  }
}
