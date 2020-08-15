import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model'
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  //call on destroy to this subscription to prevent memory leak once the commponent is removed from UI
  private postsSub: Subscription;

  constructor(public postsService: PostsService){

  }

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, 1);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe( (postData:{posts: Post[], postCount: number} ) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  }

onDelete(postId: string){
  this.isLoading = true;
  this.postsService.deletePost(postId)
  .subscribe( ()=>{
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  });
}

onChangedPage(pageData: PageEvent){
  this.isLoading = true;
  this.currentPage = pageData.pageIndex +1;
  this.postsPerPage = pageData.pageSize;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);
}


ngOnDestroy(){
  this.postsSub.unsubscribe();  }

}
