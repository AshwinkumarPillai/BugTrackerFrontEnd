import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-create-bug",
  templateUrl: "./create-bug.component.html",
  styleUrls: ["./create-bug.component.scss"]
})
export class CreateBugComponent implements OnInit {
  project: any;
  dev: any[] = [];
  // users: any[] = [];
  priority: any = "Low";
  watch: number = 0;
  constructor(private api: ApiService) {}

  ngOnInit() {
    let lcl = JSON.parse(localStorage.getItem("projectData"));
    const projectId = lcl.projectId;
    let data = {
      projectId
    };
    this.api.getAllUsers(data).subscribe((response: any) => {
      console.log(response);
      if (response.users.length > 1) {
        this.dev = response.users.map(obj => {
          if (obj.role !== "owner") {
            return obj;
          }
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
      let data = {
        projectId: JSON.parse(localStorage.getItem("projectData")).projectId,
        title,
        subtitle,
        status: "open",
        priority: this.priority,
        screenShot: "",
        deadline,
        assignedDev: this.dev,
        watch: this.watch
      };
      console.log(data);
    }
  }
}
