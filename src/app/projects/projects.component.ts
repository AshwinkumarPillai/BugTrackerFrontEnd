import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

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
  currentUserId: any;
  changeRolesCalled: boolean = false;
  showRoleDevs: boolean = false;
  assignRoles: boolean = false;
  currentDevId: any;
  currentDev: String;
  currentRole: String;
  btndropdown: boolean = false;
  removeDev: boolean = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    if (!localStorage.getItem("currentUser")) {
      this.router.navigate(["/login/"]);
    } else if (!localStorage.getItem("projectData")) {
      this.router.navigate(["/"]);
    } else {
      this.currentUserId = JSON.parse(
        localStorage.getItem("userdata")
      ).userdata._id;
      this.spinner.show();
      let data = JSON.parse(localStorage.getItem("projectData"));
      this.bugUsers = [];
      this.api.getOneProject(data).subscribe((response: any) => {
        this.project = response.project;
        this.users = response.users;
        this.bugs = response.bugs;
        console.log(this.bugs);
        this.users.forEach(user => {
          if (user.role !== "owner") {
            this.bugUsers.push(user);
          }
        });
        this.spinner.hide();
      });
    }

    setTimeout(() => {
      this.spinner.hide();
    }, 8000);
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
        return user.name.match(regex) || user.email.match(regex);
      });
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
    this.spinner.show();
    if (!this.selectedUser) {
      this.input.nativeElement.value = "";
      this.message = "No user Found";
      this.spinner.hide();
    } else {
      const data = {
        projectId: this.project._id,
        newId: this.selectedUser._id,
        projectName: this.project.title,
        role: "dev",
        isNew: true
      };

      this.api.addBuddy(data).subscribe((response: any) => {
        if (response.message) {
          this.message = response.message;
          this.input.nativeElement.value = "";
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.input.nativeElement.value = "";
          this.message = "Invitation send successfully";
          this.ngOnInit();
        }
      });
    }
  }

  editBug(bug, id) {
    this.updateMap.clear();
    this.updateMap.set(id, true);
  }

  updateBug(bugId, id, title, subtitle, priority, status) {
    let data = {
      bugId,
      title,
      subtitle,
      priority,
      status,
      screenShot: "",
      projectName: this.project.title
    };
    this.api.updateBug(data).subscribe((response: any) => {
      this.updateMap.delete(id);
      this.ngOnInit();
    });
  }

  watchBug(bug) {
    this.api.watchBug({ bugId: bug._id }).subscribe((response: any) => {
      console.log(response);
      this.ngOnInit();
    });
  }

  cancel(id) {
    this.updateMap.delete(id);
  }

  ArchiveBug(bug) {
    let data = {
      bugId: bug._id,
      projectId: this.project._id,
      projectName: this.project.title
    };
    let confirmArchive = confirm("Are you sure you want to archive this bug?");
    if (confirmArchive) {
      this.api.archiveBug(data).subscribe((response: any) => {
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
      dev,
      projectId: this.project._id,
      projectName: this.project.title
    };

    this.advcalled = false;
    this.currentBug = "";
    this.assignDevMaps.clear();

    this.api.assignBugToDevs(data).subscribe((response: any) => {
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
        solution: this.solution.nativeElement.value,
        projectId: this.project._id,
        projectName: this.project.title
      };
      this.solution.nativeElement.value = "";
      this.currentBug = "";
      this.api.submitSolution(data).subscribe((response: any) => {
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

  viewProfile(user) {
    if (this.currentUserId == user.userId._id) {
      this.router.navigate(["/profile/"]);
    } else {
      this.api.viewUserId = user.userId._id;
      this.router.navigate([`/viewProfile/`]);
    }
  }

  deleteProject() {
    this.btnContainer();
    let confirmation = confirm(
      "Are you sure you want to detele the project? This action cannot be reverted."
    );
    if (confirmation) {
      let data = {
        projectId: this.project._id
      };

      this.api.deleteProject(data).subscribe((response: any) => {
        if (response.statusCode == 307) {
          alert(response.message);
        } else {
          localStorage.removeItem("projectData");
          this.router.navigate(["/"]);
        }
      });
    }
  }

  changeRoles() {
    this.btnContainer();
    this.changeRolesCalled = true;
    this.showRoleDevs = true;
  }

  selectDevToChangeRole(user) {
    this.currentDevId = user.userId._id;
    this.currentDev = user.userId.name;
    if (this.removeDev) {
      let confirmRemoval = confirm(
        "Are you sure, you want to remove this member from your project?"
      );
      if (confirmRemoval) {
        this.removeMember();
      }
    } else {
      this.showRoleDevs = false;
      this.assignRoles = true;
      this.currentRole = user.role;
    }
  }

  changeRoleFinal(element) {
    if (!element.value) {
    } else {
      let data = {
        projectId: this.project._id,
        projectName: this.project.title,
        newId: this.currentDevId,
        role: String(element.value),
        isNew: false
      };

      this.api.addBuddy(data).subscribe((response: any) => {
        if (response.message) {
          this.cancelRole();
          alert(response.message);
        }
        this.ngOnInit();
      });
    }
  }

  cancelRole() {
    this.currentDevId = null;
    this.currentDev = "";
    this.currentRole = "";
    this.changeRolesCalled = false;
    this.showRoleDevs = false;
    this.assignRoles = false;
  }

  btnContainer() {
    this.btndropdown = !this.btndropdown;
    let dropdown = document.getElementById("btnDrop");
    if (this.btndropdown) {
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
  }

  initializeRemoveMember() {
    this.btnContainer();
    this.changeRolesCalled = true;
    this.showRoleDevs = true;
    this.removeDev = true;
  }

  removeMember() {
    let data = {
      remove: true,
      projectId: this.project._id,
      userId: this.currentDevId,
      projectName: this.project.title
    };
    this.removeDev = false;
    this.cancelRole();

    this.api.removeBuddy(data).subscribe((response: any) => {
      alert(
        "It will take some time to remove the user from all bugs. Thank you for cooperation"
      );
      this.ngOnInit();
    });
  }

  exitProject() {
    let confirmExit = confirm("Are you sure you want to exit from project?");
    if (confirmExit) {
      let data = {
        remove: false,
        projectId: this.project._id,
        projectName: this.project.title
      };
      this.api.removeBuddy(data).subscribe((response: any) => {
        console.log(response);
        localStorage.removeItem("projectData");
        this.router.navigate(["/"]);
      });
    }
  }
}
