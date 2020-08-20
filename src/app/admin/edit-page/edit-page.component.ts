import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostService} from "../../shared/post.service";
import {finalize, switchMap} from "rxjs/operators";
import {Post} from "../../shared/interfaces";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})

export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  post: Post
  submitted = false;
  updateSubscription: Subscription

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private postService: PostService,
    private alert: AlertService
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        return this.postService.getById(params.id)
      })
    ).subscribe((post: Post) => {
      this.post = post
      this.form = this.fb.group({
        title: [post.title, Validators.required],
        text: [post.text, Validators.required]
      })
    })
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe()
    }
  }

  submit() {
    if (this.form.invalid) {
      return
    }

    this.submitted = true

    this.updateSubscription = this.postService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    }).pipe(finalize(() => this.submitted = false))
      .subscribe(() => {
        this.alert.success('Post updated successfully')
      })
  }
}
