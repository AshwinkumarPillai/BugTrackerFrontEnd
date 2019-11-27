import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProjectsComponent } from "./projects/projects.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateBugComponent } from "./create-bug/create-bug.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "project", component: ProjectsComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "profile", component: ProfileComponent },
  { path: "bug/new", component: CreateBugComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
