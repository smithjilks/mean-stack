import {Post} from './post.model'
import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/posts/"

@Injectable({
  providedIn: 'root'
})

export class PostsService{

  private posts: Post[] = [];
  private postsUpdated = new Subject <{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  getPosts(postPerPage: number, currentPage: number){

    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get< {message: string, body: any, maxPosts: number }>(BACKEND_URL + queryParams)  //changed Post[] to 'any' inoder to map the data
    .pipe(
      map(
        postData => {
          return { posts: postData.body.map( post =>{
            return {
              title: post.title,
              content: post.content,
              id:post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
    }))
    .subscribe(transformedPostsData =>{
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostsData.maxPosts
      });
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File){

    const postData = new FormData;
    postData.append("title",title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{message : string, post: Post}>(BACKEND_URL, postData)
    .subscribe((responseData) => {
      this.router.navigate(["/"]);
    });


  }

  updatePost(id: string, title: string, content: string, image: File | string){

    let postData : FormData | Post;

    if(typeof(image)=== 'object'){
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content',content);
      postData.append('image', image, title);

    } else{

      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null //Using currently logged in user id would open a window for the user to manipulate this. Handle on the server
      }
    }

    this.http.put(BACKEND_URL + id, postData)
    .subscribe( response => {
      this.router.navigate(["/"]);   //navigate user to messages
    })
  }

  getPost(id: string){
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>
    (BACKEND_URL + id);

  }

  deletePost(postId: string){
    return this.http.delete(BACKEND_URL + postId);

      //const updatedPosts = this.posts.filter(post => post.id != postId); // updating the UI after deleting the post


  }
}
