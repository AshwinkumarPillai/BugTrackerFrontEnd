import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getAllProject().subscribe((response: any) => {
      this.projects = response.projects;
    });
  }

  createProject(title) {
    let data = {
      title
    };
    this.api.createProject(data).subscribe(() => {
      this.api.getAllProject().subscribe((response: any) => {
        this.projects = response.projects;
      });
    });
  }

  openProject(project) {
    let data = {
      projectId: project._id,
      bugAssigned: project.bugAssigned
    };
    localStorage.setItem("projectData", JSON.stringify(data));
    this.router.navigate(["/project/"]);
  }
}
