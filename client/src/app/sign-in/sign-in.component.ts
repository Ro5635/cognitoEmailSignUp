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
  styleUrls: ['./sign-in.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {

  public showEmailCollectionForm = false;
  public email = new FormControl('');
  public state;

  private busy_ = new BehaviorSubject(false);
  public busy = this.busy_.asObservable();

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();

  ngOnInit() {
      if (this.email.value) {
        this.signIn();
      } else {
          this.showEmailCollectionForm = true;
      }
  }

  constructor(private router: Router, private auth: AuthService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.email.setValue(params['email'] ? params['email'] : '');
      this.state = params['state'];
    });
  }

  public async signIn() {
    this.busy_.next(true);
    this.errorMessage_.next('');
    try {
      await this.auth.signIn(this.email.value);
      this.router.navigate(['/enter-secret-code']);
    } catch (err) {
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }
}
