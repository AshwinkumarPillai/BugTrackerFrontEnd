import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-update-profile",
  templateUrl: "./update-profile.component.html",
  styleUrls: ["./update-profile.component.scss"]
})
export class UpdateProfileComponent implements OnInit {
  message: any = "";
  constructor(private api: ApiService) {}

  ngOnInit() {}

  update(name, email, contact, designation) {
    this.message = "";
    let data = {
      name,
      email,
      contact,
      designation
    };

    this.api.updateUser(data).subscribe(response => {
      this.message = response.message;
      console.log(response);
    });
  }
}
