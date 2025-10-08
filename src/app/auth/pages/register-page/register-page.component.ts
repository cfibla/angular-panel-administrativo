import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router)

  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['',[ Validators.required, Validators.email ]],
    password: ['',[ Validators.required, Validators.minLength(6) ]],
    fullName: ['',[ Validators.required, Validators.minLength(6) ]],
  })

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {this.hasError.set(false)}, 2000);
      return;
    }

    const { email='', password='', fullName='' } = this.loginForm.value;

    this.authService.register(email!, password!, fullName!)
    .subscribe(isAuthenticated => {
      if(isAuthenticated){
        this.router.navigateByUrl('/');
        return
      }
      this.hasError.set(true);
      setTimeout(() => {this.hasError.set(false)}, 2000);
      return;
    })
  }
}
