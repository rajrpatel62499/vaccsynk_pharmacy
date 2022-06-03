import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MustMatch } from '../../_helpers/must-match.validator';
import { VaccynkService } from '../../../services/vaccynk.service';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitted = false;
  isLoading = false;

  showPassword: boolean = true;
  oldPassword: boolean = true;
  showConfirmPassword: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    private formBuilder: FormBuilder,
    private _vacService: VaccynkService,
    private util: UtilsService,
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['',Validators.required],
        newPassword : ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      // this.http.handleError("Please check all fields");
      return;
    }

    const postData = {
      oldPassword: this.changePasswordForm.controls.oldPassword.value,
      newPassword: this.changePasswordForm.controls.newPassword.value,
    };

    this.isLoading = true;

    this._auth.changePasswordFromSetting(postData).subscribe(
      (res) => {
        this.util.showToaster(`Your password changed successfully`);
        this.isLoading = false;
        this.cancel();
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.util.handleError(err.error?.message);
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
