import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-create-bug",
  templateUrl: "./create-bug.component.html",
  styleUrls: ["./create-bug.component.scss"]
})
export class CreateBugComponent implements OnInit {
  project: any;
  users: any[] = [];
  priority: any = "Low";
  watch: number = 0;
  devs = new Map();

  constructor(
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    if (!localStorage.getItem("currentUser")) {
      this.router.navigate(["/login/"]);
    }
    let lcl = JSON.parse(localStorage.getItem("projectData"));
    const projectId = lcl.projectId;
    let data = {
      projectId
    };
    this.api.getAllUsers(data).subscribe((response: any) => {
      if (response.users.length > 1) {
        response.users.forEach(obj => {
          if (obj.role !== "owner") this.users.push(obj);
        });
      }
    });
  }

  setPriority(option) {
    this.priority = option.srcElement.value;
  }

  setWatch(option) {
    this.watch = option.srcElement.value;
  }

  create(title, subtitle, deadline) {
    if (!deadline) deadline = "";

    if (!title) {
      alert("Please enter title!");
    } else {
      this.spinner.show();
      let selectedDevs = [];
      this.devs.forEach(val => {
        selectedDevs.push(val.userId._id);
      });
      let data = {
        projectId: JSON.parse(localStorage.getItem("projectData")).projectId,
        title,
        subtitle,
        status: "open",
        priority: this.priority,
        screenShot: "",
        deadline,
        assignedDev: selectedDevs,
        watch: this.watch
      };
      console.log(data.deadline);
      this.api.registerBug(data).subscribe((response: any) => {
        // console.log(response);
        this.spinner.hide();
        // alert("Bug registered successfully!");
        this.router.navigate(["/project/"]);
      });
    }
  }

  addDev(user, id) {
    if (this.devs.get(id)) {
      this.devs.delete(id);
    } else {
      this.devs.set(id, user);
    }
  }
}
