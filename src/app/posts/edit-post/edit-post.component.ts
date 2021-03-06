import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/model/posts.model';
import { AppState } from 'src/app/store/app.state';
import { updatePost } from '../state/posts.actions';
import { getPostById } from '../state/posts.selectors';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  post: Post;
  postForm: FormGroup;
  postSubscription: Subscription;
  constructor(private route: ActivatedRoute, private store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    setTimeout(() => {
      this.postSubscription = this.store.select(getPostById).subscribe((post) => {
        console.log(post);
        if (post) {
          this.post = post;
          this.postForm.patchValue({
            title: post.title,
            description: post.description,
          });
        }
      });
    }, 1);
   

    // this.createForm();
    // this.postSubscription = this.store.select(getPostById).subscribe((post) => {
    //   if (post) {
    //     this.post = post;
    //     this.postForm.patchValue({
    //       title: post.title,
    //       description: post.description,
    //     });
    //   }
    // });
    // this.route.paramMap.subscribe((params) => {
    //   const id = params.get('id');
    //   this.postSubscription = this.store.select(getPostById, { id }).subscribe((data) => {
    //     this.post = data;
    //     console.log(this.post);
    //     this.createForm();
    //   })
    // });
      
  }

  createForm() {
    this.postForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  onSubmit() {
    if (!this.postForm.valid) {
      return;
    }

    const title = this.postForm.value.title;
    const description = this.postForm.value.description;

    const post: Post = {
      id: this.post.id,
      title,
      description,
    };

    //dispatch the action
    this.store.dispatch(updatePost({ post }));
    this.router.navigate(['posts']);
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

}
