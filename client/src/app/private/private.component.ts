// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../auth.service';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import {IdToken} from '../IdToken';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateComponent implements OnInit {

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.returnUserToCallingClientWithToken();
  }

  public async returnUserToCallingClientWithToken() {
    this.errorMessage_.next('');
    try {
      const { idToken }: { idToken: IdToken } = await this.auth.getIdTokenFromSession();
      const { jwtToken } = idToken;

      const state = localStorage.getItem('passedState');
      const baseUrl = 'https://uat.meetbel.com';

      console.log('Returning user to the app with id_token and state');
      window.location.href = `${baseUrl}/sign-up#id_token=${jwtToken}&state=${state}`;
    } catch (err) {
      this.errorMessage_.next(err.message || err);
    }
  }
}
