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
  sdopen: boolean = false;
  sideMenu: boolean = false;

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

  showSideMenu() {
    let sidemenu = document.getElementById("sidemenu");
    sidemenu.style.transform = "scale(1)";
    this.sdopen = true;
  }

  closeSidemenu() {
    if (this.sdopen) {
      this.sdopen = false;
      let sidemenu = document.getElementById("sidemenu");
      sidemenu.style.transform = "scale(0)";
    }
  }

  ToggleSidebar() {
    this.sideMenu = !this.sideMenu;
  }

  closeSideBar() {
    if (screen.width < 770) {
      this.sideMenu = false;
    }
  }
}
