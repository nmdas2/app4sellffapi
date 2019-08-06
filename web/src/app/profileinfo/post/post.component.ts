import { Component, OnInit } from '@angular/core';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  userPosts: any;

  constructor(
    private profileInfoService: ProfileinfoService
  ) { 
    this.userPosts = [];
  }

  ngOnInit() {
    this.getUserPosts();
  }

  getUserPosts(){
    this.userPosts = [];
    this.profileInfoService.getUserPosts(1)
    .subscribe(res => {
      if(res && res.length)
        this.userPosts = res;

    }, error => {
      console.log(error);
    })
  }

}
