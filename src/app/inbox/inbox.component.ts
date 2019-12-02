import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-inbox",
  templateUrl: "./inbox.component.html",
  styleUrls: ["./inbox.component.scss"]
})
export class InboxComponent implements OnInit {
  inbox: any[] = [];
  empty: boolean = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    if (!localStorage.getItem("currentUser")) {
      this.router.navigate(["/login"]);
    } else {
      this.spinner.show();
      this.api.getInbox().subscribe((response: any) => {
        this.spinner.hide();
        this.inbox = response.inbox;
        if (this.inbox.length === 0) {
          this.empty = true;
        }
      });

      if (this.api.newExists) {
        this.api.markasNotNew().subscribe((response: any) => {
          console.log(response.message);
        });
      }
    }
  }

  acceptProject(message) {
    this.api
      .approveProject({
        projectId: message.projectId,
        recieverId: message.sourceId,
        inboxId: message._id,
        projectTitle: message.projName
      })
      .subscribe((response: any) => {
        console.log(response);
        this.ngOnInit();
      });
  }

  rejectProject(message) {
    this.api
      .rejectProject({
        projectId: message.projectId,
        recieverId: message.sourceId,
        inboxId: message._id,
        projectTitle: message.projName
      })
      .subscribe((response: any) => {
        console.log(response);
        this.ngOnInit();
      });
  }

  markAsRead(message, deleteM) {
    this.api
      .markAsRead({ inboxId: message._id, deleteM })
      .subscribe((response: any) => {
        console.log(response);
        this.ngOnInit();
      });
  }
}
