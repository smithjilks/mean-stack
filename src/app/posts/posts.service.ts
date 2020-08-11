import {Post} from './post.model'
import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})

export class PostsService{

  private posts: Post[] = [];
  private postsUpdated = new Subject <Post[]>();

  constructor(private http: HttpClient){}

  getPosts(){
    this.http.get< {message: string, body: any }>('http://localhost:3000/api/posts')  //changed Post[] to 'any' inoder to map the data
    .pipe(map((postData) => {

      return postData.body.map( post =>{
        return {
          title: post.title,
          content: post.content,
          id:post._id
        }
      })
    }))
    .subscribe((transformedPosts)=>{
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string){

    const post: Post = {id: null, title: title, content: content};

    this.http.post<{message : string , postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      const id = responseData.postId;
      post.id = id;

      //done async when success
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });


  }

  updatePost(id: string, title: string, content: string){
    const post: Post = {
      id: id,
      title: title,
      content: content
    };

    this.http.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe( response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts])
    })
  }

  getPost(id: string){
    return this.http.get<{_id: string, title: string, content: string}>
    ('http://localhost:3000/api/posts/' + id);

  }

  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {

      const updatedPosts = this.posts.filter(post => post.id != postId); // updating the UI after deleting the post
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });

  }
}