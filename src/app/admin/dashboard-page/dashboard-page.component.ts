import {Component, OnDestroy, OnInit} from '@angular/core'
import {PostService} from "../../shared/post.service"
import {Post} from "../../shared/interfaces"
import {Subscription} from "rxjs"
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})

export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  postSubscription: Subscription
  deleteSubscription: Subscription

  searchStr = ''

  constructor(
    private postService: PostService,
    private alert: AlertService
  ) {
  }

  ngOnInit() {
    this.postSubscription = this.postService.getAll().subscribe(posts => {
      this.posts = posts
    })
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe()
    }

    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe()
    }
  }

  remove(id: string) {
    this.deleteSubscription = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== id)
      this.alert.warning('Post was deleted')
    })
  }
}
