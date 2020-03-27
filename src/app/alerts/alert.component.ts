import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

@Component({
    selector: 'alert', 
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.sass']

})
export class AlertComponent implements OnInit, OnDestroy {
    @Input() id: string;

    alerts: Object[] = [];
    subscription: Subscription;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                if (!alert["message"]) {
                    this.alerts = [];
                    return;
                }
                this.alerts.push(alert);
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    removeAlert(alert: Object) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Object) {
        if (!alert) {
            return;
        }
        switch (alert["type"]) {
            case 'success':
                return 'alert alert-success';
            case 'error':
                return 'alert alert-danger';
            case 'info':
                return 'alert alert-info';
            case 'warn':
                return 'alert alert-warning';
        }
    }
}
