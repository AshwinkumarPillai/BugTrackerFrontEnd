import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  message: any = "";
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {}

  register(
    name,
    email,
    password,
    contact,
    designation,
    github,
    twitter,
    portfolio,
    linkedIn
  ) {
    this.message = "";

    if (/^\s*$/.test(name.value)) {
      this.message = "Please fill your name";
    } else if (/^\s*$/.test(email.value)) {
      this.message = "Please fill email";
    } else if (/^\s*$/.test(password.value)) {
      this.message = "Password cannot be blank";
    } else if (/^\s*$/.test(contact.value)) {
      this.message = "Enter your contact details";
    } else if (/^\s*$/.test(designation.value)) {
      this.message = "Please specify your designation";
    } else {
      if (/^\s*$/.test(github)) {
        github = "";
      }
      if (/^\s*$/.test(twitter)) {
        twitter = "";
      }
      if (/^\s*$/.test(portfolio)) {
        portfolio = "";
      }
      if (/^\s*$/.test(linkedIn)) {
        linkedIn = "";
      }

      let data = {
        name: name.value,
        email: email.value,
        password: password.value,
        contact: contact.value,
        designation: designation.value,
        github,
        twitter,
        portfolio,
        linkedIn
      };

      this.api.registerUser(data).subscribe((response: any) => {
        this.message = response.message;
        setTimeout(() => {
          if (response.status == 200) this.router.navigate(["/login/"]);
        }, 1000);
      });
    }
  }
}
