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
  @ViewChild("solution") solution: ElementRef;
  @ViewChild("viewSolutionCode") viewSolutionCode: ElementRef;

  project: any;
  users: any[] = [];
  bugs: any[] = [];
  search: boolean = false;
  Allusers: any[] = [];
  userList: any[] = [];
  selectedUser: any;
  message: any = "";
  updateMap = new Map();
  advcalled: boolean = false;
  assignDevMaps = new Map();
  currentBug: any;
  showSolveArea: boolean = false;
  viewSolution: boolean = false;
  bugUsers: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem("currentUser")) {
      this.router.navigate(["/login/"]);
    }

    let data = JSON.parse(localStorage.getItem("projectData"));
    this.api.getOneProject(data).subscribe((response: any) => {
      this.project = response.project;
      this.users = response.users;
      this.bugs = response.bugs;
      this.users.forEach(user => {
        if (user.role !== "owner") {
          this.bugUsers.push(user);
        }
      });
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

  closeSearch() {
    this.search = false;
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
      if (!response.message) {
        alert("Added Member Successfully!");
      }
    });
  }

  editBug(bug, id) {
    this.updateMap.clear();
    this.updateMap.set(id, true);
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
    console.log(deadline);
    console.log(data);
    this.api.updateBug(data).subscribe((response: any) => {
      console.log(response);
      this.updateMap.delete(id);
      this.ngOnInit();
    });
  }

  ddchange(h) {
    console.log(h);
  }

  cancel(id) {
    this.updateMap.delete(id);
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

  AssignDev(bug) {
    this.advcalled = true;
    this.currentBug = bug._id;
    bug.assignedDev.forEach(user => {
      this.assignDevMaps.set(user.userId._id, user);
    });
  }

  selectDev(user, id) {
    if (this.assignDevMaps.get(id)) {
      this.assignDevMaps.delete(id);
    } else {
      this.assignDevMaps.set(id, user);
    }
  }

  assignBugToDevs() {
    let dev = [];
    this.assignDevMaps.forEach(user => {
      dev.push(user.userId._id);
    });
    let data = {
      bugId: this.currentBug,
      dev
    };

    this.advcalled = false;
    this.currentBug = "";
    this.assignDevMaps.clear();

    this.api.assignBugToDevs(data).subscribe((response: any) => {
      console.log(response);
      this.bugUsers = [];
      this.ngOnInit();
    });
  }

  CanceldevAssign() {
    this.currentBug = "";
    this.assignDevMaps.clear();
    this.advcalled = false;
  }

  solveBug(bug) {
    this.currentBug = bug._id;
    this.showSolveArea = true;
  }

  submitSolution() {
    if (/^\s*$/.test(this.solution.nativeElement.value)) {
      this.solution.nativeElement.value = "";
      alert("solution cannot be empty!");
    } else {
      this.showSolveArea = false;
      let data = {
        bugId: this.currentBug,
        solution: this.solution.nativeElement.value
      };
      this.solution.nativeElement.value = "";
      this.currentBug = "";
      this.api.submitSolution(data).subscribe((response: any) => {
        console.log(response);
        this.ngOnInit();
      });
    }
  }

  cancelSolution() {
    this.currentBug = "";
    this.showSolveArea = false;
    this.solution.nativeElement.value = "";
  }

  ViewSolution(bug) {
    this.currentBug = bug._id;
    this.viewSolution = true;
    setTimeout(() => {
      this.viewSolutionCode.nativeElement.value = bug.solution;
    }, 10);
  }

  closeSolution() {
    this.currentBug = "";
    this.viewSolutionCode.nativeElement.value = "";
    this.viewSolution = false;
  }
}
