import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  @ViewChild("proname") projectName: ElementRef;
  projects: any[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    if (!localStorage.getItem("currentUser")) {
      this.router.navigate(["/login/"]);
    } else {
      this.spinner.show();
      this.api.getAllProject().subscribe((response: any) => {
        this.projects = response.projects;
        this.spinner.hide();
      });
    }
  }

  createProject(title) {
    let data = {
      title
    };
    this.api.createProject(data).subscribe(() => {
      this.api.getAllProject().subscribe((response: any) => {
        this.projects = response.projects;
        this.projectName.nativeElement.value = "";
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

  // signOut() {
  //   localStorage
  //   .getItem()
  // }
}
