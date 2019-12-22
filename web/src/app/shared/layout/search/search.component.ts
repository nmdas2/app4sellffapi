import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileinfoService } from 'src/app/_services/profileinfo.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  results: any[] = [];
  searchprofiles: FormControl = new FormControl();
  constructor(
    private profileService: ProfileinfoService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchprofiles: ['', [Validators.required, Validators.maxLength(25)]]
    });
    // this.searchprofiles.valueChanges
    //   .subscribe(searchprofiles => this.profileService.getUsersBySearchTerm(searchprofiles)
    //   .subscribe(response => this.results=response));
  }

  onSubmit() {
    if (this.searchForm.invalid) {
      return;
    }
    var sparam = this.searchForm.value["searchprofiles"];
    this.router.navigate(['/profileinfo/searchsummary/'], { queryParams: { searchTerm: sparam } });
  }

  get f() { return this.searchForm.controls; }

}
