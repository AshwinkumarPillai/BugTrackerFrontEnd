import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "BugTracker-frontend";

  constructor(private router: Router) {}

  logOut() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("projectData");
    this.router.navigate(["/login/"]);
  }
}
