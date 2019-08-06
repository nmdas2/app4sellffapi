import { Component, OnInit } from '@angular/core';
import { searchRes, ProfileinfoService } from 'src/app/_services/profileinfo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-searchsummary',
  templateUrl: './searchsummary.component.html',
  styleUrls: ['./searchsummary.component.scss']
})
export class SearchsummaryComponent implements OnInit {

  searchResults: searchRes[] = [];
  userTrackerSub = new Subscription;
  
  constructor(private pis: ProfileinfoService) { }

  ngOnInit() {

    // this.searchResults = this.pis.getUsersBySearchTerm();
    //     this.userTrackerSub = this.pis.SearchResTracker.subscribe(
    //         (searchResults: searchRes[]) => {
    //             this.searchResults = searchResults;
    //             console.log(searchResults);
    //         }
    //     );
  }

  ngOnDestroy() {
    this.userTrackerSub.unsubscribe();
}

}
