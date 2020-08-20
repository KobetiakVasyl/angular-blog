import {Component, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {Post} from "../../shared/interfaces"
import {PostService} from "../../shared/post.service"
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private alert: AlertService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      text: [null, Validators.required],
      author: [null, Validators.required]
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }

    const post: Post = {
      title: this.form.value.title,
      author: this.form.value.author,
      text: this.form.value.text,
      date: new Date()
    }

    this.postService.create(post).subscribe((post) => {
      this.form.reset()
      this.alert.success('Post created successfully')
    })
  }

}
