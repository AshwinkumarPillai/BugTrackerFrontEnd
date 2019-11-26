import { Injectable } from "@angular/core";
import * as auth0 from "auth0-js";

@Injectable()
export class AuthService {
  constructor(
    private auth0WebAuth: auth0.WebAuth,
    private authOptions: auth0.AuthOptions
  ) {
    this.authOptions = {
      domain: "ashwinkumar-pillai.auth0.com",
      clientID: "mZ42vy3i0CAR2fnPeVrlucXamuTe63V3"
    };

    this.auth0WebAuth = new auth0.WebAuth(this.authOptions);
  }
}
