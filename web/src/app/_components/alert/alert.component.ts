import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getAlert()
        .subscribe(message => {
            switch (message && message.type) {
                case 'success':
                    message.cssClass = 'alert alert-success';
                    break;
                case 'error':
                    message.cssClass = 'alert alert-danger';
                    break;
            }

            this.message = message;

            if(message && message.timeOut){
                let timeOut = message.timeOut
                setTimeout(() => {
                    this.alertService.clear();
                }, timeOut)
            }
        });
}

ngOnDestroy() {
    this.subscription.unsubscribe();
}

}
