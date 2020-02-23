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
  teammates: any[] = [];
  currentUserId: any;
  // Modal controls
  dispbackdrop: boolean = false;
  scrollVal: any;
  modal_action: any = "";
  modal_heading: any = "";
  actionNumber: any;
  valueChanged: boolean = false;
  // action - 1
  showUserList: boolean = true;
  selectedRole: any;
  // action - 3,4,5
  selectedBug: any;
  // action - 5
  bugUsers = new Map();

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
      this.teammates = [];
      this.api.getOneProject(data).subscribe((response: any) => {
        this.project = response.project;
        this.users = response.users;
        this.bugs = response.bugs;
        console.log(this.bugs);
        this.users.forEach(user => {
          if (user.role !== "owner") {
            this.teammates.push(user);
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

  viewProfile(user) {
    if (this.currentUserId == user.userId._id) {
      this.router.navigate(["/profile/"]);
    } else {
      this.api.viewUserId = user.userId._id;
      this.router.navigate([`/viewProfile/`]);
    }
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

  deleteProject() {
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

  showModal(info, usecase, bug) {
    this.dispbackdrop = true;
    this.scrollVal = window.pageYOffset;
    window.scrollTo(0, 0);
    document.body.style.overflowY = "hidden";
    this.actionNumber = usecase;
    if (bug) {
      this.selectedBug = bug;
    }
    switch (usecase) {
      case 1: {
        this.modal_action = "Done";
        this.modal_heading = "Change Role of teammates";
        break;
      }
      case 2: {
        this.modal_action = "Done";
        this.modal_heading = "Remove Member";

        break;
      }
      case 3: {
        this.modal_action = "Submit";
        this.modal_heading = "Provide solution to bug";
        break;
      }
      case 4: {
        this.modal_action = "Done";
        this.modal_heading = "View Solution";
        break;
      }
      case 5: {
        this.modal_action = "Assign";
        this.modal_heading = "Assign bug to developer";
        bug.assignedDev.forEach(user => {
          this.bugUsers.set(user.userId._id, user);
        });
        console.log(bug);
        break;
      }
      default: {
        break;
      }
    }
  }

  closeModal() {
    this.dispbackdrop = false;
    this.bugUsers.clear();
    if (this.valueChanged) this.ngOnInit();
    document.body.style.overflowY = "scroll";
    window.scrollBy(0, this.scrollVal);
  }

  // action 1
  selectUserToChangeRole(dev) {
    this.showUserList = false;
    this.selectedUser = dev;
    this.selectedRole = dev.role;
  }

  changeRole(event) {
    this.selectedRole = event.target.selectedOptions[0].value;
  }

  // action 5
  selectDev(user, id) {
    if (this.bugUsers.get(id)) {
      this.bugUsers.delete(id);
    } else {
      this.bugUsers.set(id, user);
    }
  }

  performAction(options?) {
    switch (this.actionNumber) {
      case 1: {
        let data = {
          projectId: this.project._id,
          projectName: this.project.title,
          newId: this.selectedUser.userId._id,
          role: String(this.selectedRole),
          isNew: false
        };

        this.api.addBuddy(data).subscribe((response: any) => {
          if (response.message) {
            alert(response.message);
          }
          this.valueChanged = true;
          this.closeModal();
        });

        break;
      }
      case 2: {
        if (!options) {
          this.closeModal();
          break;
        }
        let confirmAction = confirm(
          "Are you sure you want to remove this member?"
        );
        if (confirmAction) {
          let data = {
            remove: true,
            projectId: this.project._id,
            userId: this.selectedUser.userId._id,
            projectName: this.project.title
          };

          this.api.removeBuddy(data).subscribe((response: any) => {
            alert(
              "It will take some time to remove the user from all bugs. Thank you for cooperation"
            );
            this.valueChanged = true;
            this.closeModal();
          });
        } else {
          this.closeModal();
        }
      }
      case 3: {
        if (/^\s*$/.test(this.solution.nativeElement.value)) {
          this.solution.nativeElement.value = "";
          alert("solution cannot be empty!");
        } else {
          let data = {
            bugId: this.selectedBug,
            solution: this.solution.nativeElement.value,
            projectId: this.project._id,
            projectName: this.project.title
          };
          this.solution.nativeElement.value = "";
          this.selectedBug = "";
          this.api.submitSolution(data).subscribe((response: any) => {
            this.valueChanged = true;
            this.closeModal();
          });
        }
        break;
      }
      case 4: {
        this.closeModal();
        break;
      }
      case 5: {
        let dev = [];
        this.bugUsers.forEach(user => {
          dev.push(user.userId._id);
        });
        let data = {
          bugId: this.selectedBug._id,
          dev,
          projectId: this.project._id,
          projectName: this.project.title
        };
        this.selectedBug = "";
        this.bugUsers.clear();

        this.api.assignBugToDevs(data).subscribe((response: any) => {
          this.teammates = [];
          this.valueChanged = true;
          this.closeModal();
        });
      }

      default: {
        break;
      }
    }
  }

  showSubtitleContent(text) {
    if (text) alert(text);
  }
}
