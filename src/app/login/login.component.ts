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

  ngOnInit() {}

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
      this.api.loginUser(data).subscribe((response: any) => {
        this.message = response.message;
        if (response.token) {
          this.api.token = response.token;
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ token: response.token })
          );
          localStorage.setItem(
            "userdata",
            JSON.stringify({ userdata: response.userdata })
          );
          this.spinner.hide();
          this.router.navigate(["/"]);
        }
      });
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
    }
  }

  cancelFgpass() {
    this.fgpass = false;
  }
}
