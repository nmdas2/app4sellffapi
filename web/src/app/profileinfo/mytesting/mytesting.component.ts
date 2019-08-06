import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mytesting',
  templateUrl: './mytesting.component.html',
  styleUrls: ['./mytesting.component.scss']
})
export class MytestingComponent implements OnInit {

  dynamicImg: string = "";

  modalRef: BsModalRef;

  imgGallery = [
    {id: 1, imgUrl : 'http://cdn2.nolocreo.com/wp-content/uploads/2015/01/cd74c6ef2247351c34703d55318e7bbe.jpg'},
    {id: 2, imgUrl : 'http://www.fondosanimados.com/wallpapers/animales/grandes_felinos/pumas/depredador_sin_igual/800x600_depredador_sin_igual.jpg'},
    {id: 3, imgUrl : 'http://www.muycurioso.net/sites/default/files/images/naturaleza/Mayo_2014/Animales%20blancos%20mas%20bonitos%20del%20mundo/02.jpg'},
    {id: 4, imgUrl : 'http://2.bp.blogspot.com/_kmCH50e9OWk/SsDSq_PIzzI/AAAAAAAAABI/r1WwWHFup5k/s1600/Loros.jp'}
  ]
  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
  }

  checkevent(imgUrl, template)
  {
    this.dynamicImg = imgUrl;
    this.modalRef = this.modalService.show(template);

  }

  closePopup(){
    this.modalRef.hide();
    this.dynamicImg = "";
  }
}
