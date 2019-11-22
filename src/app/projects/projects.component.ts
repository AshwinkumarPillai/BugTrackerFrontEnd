import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent implements OnInit {
  @ViewChild("selectUser") input: ElementRef;
  project: any;
  users: any[] = [];
  bugs: any[] = [];
  search: boolean = false;
  Allusers: any[] = [];
  userList: any[] = [];
  selectedUser: any;
  message: any = "";
  updateMap = new Map();

  fakes: any[] = [1, 2, 3, 4, 5, 6, 7];
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    let data = JSON.parse(localStorage.getItem("projectData"));
    this.api.getOneProject(data).subscribe((response: any) => {
      this.project = response.project;
      this.users = response.users;
      this.bugs = response.bugs;
    });
  }

  createBug() {
    this.router.navigate(["/bug/new"]);
  }

  canSearch() {
    this.search = true;
    let data = { projectId: this.project._id };
    this.api.getEveryUser().subscribe((response: any) => {
      this.Allusers = response.Allusers;
    });
  }

  searchUser(element) {
    this.message = "";
    if (element.target.value.length > 2) {
      this.userList = this.Allusers.filter(user => {
        const regex = new RegExp(element.target.value, "gi");
        // console.log(regex);
        return user.name.match(regex) || user.email.match(regex);
      });
      // console.log(this.userList);
    } else {
      this.userList = [];
    }
  }

  addToInput(val) {
    let name = val.name;
    let email = val.email;
    this.selectedUser = val;

    this.input.nativeElement.value = name + " < " + email + " > ";

    this.userList = [];
  }

  addMember() {
    const data = {
      projectId: this.project._id,
      newId: this.selectedUser._id,
      role: "dev",
      isNew: true
    };
    this.api.addBuddy(data).subscribe((response: any) => {
      console.log(response);
      this.message = response.message;
      this.input.nativeElement.value = "";
    });
  }

  AssignDev(bug) {}

  editBug(bug, id) {
    this.updateMap.set(id, true);
    console.log(this.updateMap.get(id));
  }

  ArchiveBug(bug) {
    let data = {
      bugId: bug._id
    };
    let confirmArchive = confirm("Are you sure you want to archive this bug?");
    if (confirmArchive) {
      this.api.archiveBug(data).subscribe((response: any) => {
        console.log(response);
        this.ngOnInit();
      });
    }
  }

  updateBug(bugId, id, title, subtitle, priority, status, deadline) {
    let data = {
      bugId,
      title,
      subtitle,
      priority,
      status,
      screenShot: "",
      deadline
    };
    this.api.updateBug(data).subscribe((response: any) => {
      console.log(response);
      this.updateMap.delete(id);
      this.ngOnInit();
    });
  }

  cancel(id) {
    this.updateMap.delete(id);
  }
}
