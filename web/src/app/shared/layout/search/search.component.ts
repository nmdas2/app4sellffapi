import { Component, OnInit } from '@angular/core';
import {  FormBuilder,Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  ngOnInit(): void {
    
  }

  searchType: any = [{ 'value': 0, 'name': 'All' }, { 'value': 1, 'name': 'By Name' }, { 'value': 2, 'name': 'By Services offered' }, { 'value': 3, 'name': 'By Services needed' }]
  submitted = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  searchForm = this.formBuilder.group({
    searchprofilesType:[this.searchType[0]],
    searchprofiles: ['', [Validators.required, Validators.maxLength(25)]]     
  });
  
  onSubmit() {
    if (this.searchForm.invalid) {
      return;
    }
    var sparamType = this.searchForm.value["searchprofilesType"].value;
    var sparamValue = this.searchForm.value["searchprofiles"];
    this.router.navigate(['/profileinfo/searchsummary/'], { queryParams: { searchType: sparamType, searchTerm: sparamValue } });
  }

  get f() { return this.searchForm.controls; }

}
