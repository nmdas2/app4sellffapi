import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-confirmuseracc',
  templateUrl: './confirmuseracc.component.html',
  styleUrls: ['./confirmuseracc.component.scss']
})
export class ConfirmuseraccComponent implements OnInit {
  srchParam: string;

  constructor(
    private router: Router,
    private aroute: ActivatedRoute,
    private pfrlsrvs: UserService
  ) { }

  ngOnInit() {
    console.log('i am here');
    this.aroute.params.subscribe(p => {
      let key = p;
      this.srchParam = p.hashkey;
      console.log(this.srchParam);
      this.UserWillBeActivated();
    });
  }

  UserWillBeActivated() {
    this.pfrlsrvs.ActivateUserAccunt(this.srchParam)
      .subscribe(res => {
      });
  }

}
