import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model'
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'

@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  isLoading = false;

  //call on destroy to this subscription to prevent memory leak once the commponent is removed from UI
  private postsSub: Subscription;

  constructor(public postsService: PostsService){

  }

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe( (posts: Post[] ) => {
      this.isLoading = false;
      this.posts = posts
    });
  }

onDelete(postId: string){
  this.postsService.deletePost(postId);
}

  ngOnDestroy(){
    this.postsSub.unsubscribe();  }

}
