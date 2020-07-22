// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { BehaviorSubject } from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {

  public email = new FormControl('');
  public state;
  public redirectUri;

  private busy_ = new BehaviorSubject(false);
  public busy = this.busy_.asObservable();

  private shouldShowEmailCollectionForm_ = new BehaviorSubject(false);
  public shouldShowEmailCollectionForm = this.shouldShowEmailCollectionForm_.asObservable();

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();

  ngOnInit() {
      if (this.email.value) {
        this.signIn();
      } else {
          this.shouldShowEmailCollectionForm_.next(true);
      }
  }

  constructor(private router: Router, private auth: AuthService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.email.setValue(params['email'] ? params['email'] : '');
      this.state = params['state'];
      this.redirectUri = params['redirect_uri'];
    });

    if (!this.redirectUri) {
      // TODO: Handle the error in some way
      console.log('The supplied redirect_uri was invalid');
    }
    localStorage.setItem('passedState', this.state);
    localStorage.setItem('passedRedirectUri', this.redirectUri);
  }

  public async signIn() {
    this.busy_.next(true);
    this.errorMessage_.next('');
    try {
      await this.auth.signIn(this.email.value);
      this.router.navigate(['/enter-secret-code']);
    } catch (err) {
      this.errorMessage_.next(err.message || err);
      this.shouldShowEmailCollectionForm_.next(true);

    } finally {
      this.busy_.next(false);
    }
  }
}
