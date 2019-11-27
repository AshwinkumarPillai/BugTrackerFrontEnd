import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.scss"]
})
export class ViewProfileComponent implements OnInit {
  user: any;
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (!this.api.viewUserId) this.router.navigate(["/project/"]);
    this.api
      .viewUserProfile({ userId: this.api.viewUserId })
      .subscribe((response: any) => {
        if (response.status == 200) {
          this.user = response.user;
        }
      });
  }
}
