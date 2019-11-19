import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getAllProject().subscribe((response: any) => {
      console.log(response);
      this.projects = response.projects;
      // console.log(this.projects[0].superAdmin);
    });
  }

  createProject(title) {
    let data = {
      title
    };
    this.api.createProject(data).subscribe((response: any) => {
      console.log(response);
    });
  }
}
