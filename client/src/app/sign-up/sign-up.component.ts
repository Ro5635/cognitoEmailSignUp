// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit  {

  email = new FormControl('');
  public state;

  private busy_ = new BehaviorSubject(false);
  public busy = this.busy_.asObservable();

  private shouldShowEmailCollectionForm_ = new BehaviorSubject(false);
  public shouldShowEmailCollectionForm = this.busy_.asObservable();

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();

    ngOnInit() {
        if (this.email.value) {
            this.signUp();
        } else {
            this.shouldShowEmailCollectionForm_.next(true);
        }
    }

  constructor(private router: Router, private auth: AuthService,  private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
          this.email.setValue(params['email'] ? params['email'] : '');
          this.state = params['state'];
      });

      // This code block is duplicated in both sign-up nad sign-in...
      if (!this.state || this.state.length < 5) {
          console.log('Supplied state is invalid, this should mean that when this calls back on a client it will reject');
      }
      localStorage.setItem('passedState', this.state);
  }

  public async signUp() {
    this.errorMessage_.next('');
    this.busy_.next(true);
    try {
      await this.auth.signUp(this.email.value);
      await this.auth.signIn(this.email.value);
      this.router.navigate(['/enter-secret-code']);
    } catch (err) {
      if (err.code === 'UsernameExistsException') {
          console.log('User Account For Provided Email Address is Already Registered Within The UserPool');
          this.router.navigate([`/sign-in`], {queryParams: {email: this.email.value, state: this.state}});
      }
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }
}
