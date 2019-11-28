import { Component, OnInit, OnChanges } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnChanges, OnInit {
  title = "BugTracker-frontend";
  loggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("currentUser")) {
      this.loggedIn = true;
    }
  }

  ngOnChanges() {
    if (localStorage.getItem("currentUSer")) {
      this.loggedIn = true;
    }
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(["/login/"]);
    this.loggedIn = false;
  }

  logIn() {
    this.router.navigate(["/login/"]);
  }
}
