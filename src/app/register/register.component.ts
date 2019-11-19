import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  message: any = "";
  constructor(private api: ApiService) {}

  ngOnInit() {}

  register(name, email, password, contact, designation) {
    this.message = "";
    let data = {
      name: name.value,
      email: email.value,
      password: password.value,
      contact: contact.value,
      designation: designation.value
    };

    this.api.registerUser(data).subscribe((response: any) => {
      this.message = response.message;
      console.log(response);
    });
  }
}
