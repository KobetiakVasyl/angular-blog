import {Component, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {User} from "../../shared/interfaces"
import {AuthService} from "../shared/services/auth.service"
import {ActivatedRoute, Params, Router} from "@angular/router"
import {finalize} from "rxjs/operators"

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup
  submitted = false
  message: string

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params.loginAgain) {
        this.message = 'Please provide necessary data'
      } else if (params.authFailed) {
        this.message = 'Session has expired. Please provide necessary data'
      }
    })

    this.form = this.fb.group({
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(6)
      ]],
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }

    this.submitted = true

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }

    this.authService.login(user)
      .pipe(finalize(() => this.submitted = false))
      .subscribe(() => {
        this.form.reset()
        this.router.navigate(['/admin', 'dashboard'])
      })
  }
}
