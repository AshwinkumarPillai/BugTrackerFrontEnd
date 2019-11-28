import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  user: any;
  updateOn: boolean = false;
  @ViewChild("github") github: ElementRef;
  @ViewChild("twitter") twitter: ElementRef;
  @ViewChild("portfolio") portfolio: ElementRef;
  @ViewChild("linkedIn") linkedIn: ElementRef;

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    if (!localStorage.getItem("currentUser")) this.router.navigate(["/login/"]);
    else {
      this.user = JSON.parse(localStorage.getItem("userdata")).userdata;
    }
  }

  editProfile() {
    this.updateOn = true;
  }

  updateProfile(name, designation) {
    if (/^\s*$/.test(name)) {
      alert("Name cannot be empty!");
    } else if (/^\s*$/.test(designation)) {
      alert("Designation cannot be empty!");
    } else {
      if (/^\s*$/.test(this.github.nativeElement.value)) {
        this.github.nativeElement.value = "";
      }
      if (/^\s*$/.test(this.twitter.nativeElement.value)) {
        this.twitter.nativeElement.value = "";
      }
      if (/^\s*$/.test(this.portfolio.nativeElement.value)) {
        this.portfolio.nativeElement.value = "";
      }
      if (/^\s*$/.test(this.linkedIn.nativeElement.value)) {
        this.linkedIn.nativeElement.value = "";
      }

      let data = {
        name,
        designation,
        github: this.github.nativeElement.value,
        portfolio: this.portfolio.nativeElement.value,
        linkedIn: this.linkedIn.nativeElement.value,
        twitter: this.twitter.nativeElement.value
      };

      this.updateOn = false;

      this.api.updateUser(data).subscribe((response: any) => {
        localStorage.removeItem("userdata");
        localStorage.setItem(
          "userdata",
          JSON.stringify({ userdata: response.userdata })
        );
        this.ngOnInit();
      });
    }
  }

  cancel() {
    this.updateOn = false;
  }
}
