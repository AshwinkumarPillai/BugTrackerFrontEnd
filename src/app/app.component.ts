import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "./services/api.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "AshBugTracker";
  sdopen: boolean = false;
  sideMenu: boolean = false;
  inboxNum: number = 0;
  loggedIn = Boolean(localStorage.getItem("currentUser"));

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    if (localStorage.getItem("currentUser")) {
      this.countInbox();
    }
  }

  countInbox() {
    this.api.getNoOfinbox().subscribe((response: any) => {
      this.inboxNum = response.num;
      if (this.inboxNum > 0) {
        this.api.newExists = true;
      } else {
        this.api.newExists = false;
      }
    });
  }

  logOut() {
    localStorage.clear();
    this.inboxNum = 0;
    this.loggedIn = null;
    this.router.navigate(["/login/"]);
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
    if (screen.width < 800) {
      this.sideMenu = false;
    }
    if (localStorage.getItem("currentUser")) {
      this.countInbox();
    }
  }
}
