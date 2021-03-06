import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Object>();
    private keepAfterRouteChange = false;

    constructor (private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    this.keepAfterRouteChange = false;
                }
                else {
                    this.clear();
                }
            }
        });
    }

    onAlert(alertId?: string): Observable<Object> {
        return this.subject.asObservable().pipe(filter(x => x && x["alertId"] === alertId));
    }

    success(message: string, keep?: boolean, alertId?: string): void {
        this.alert({ "message": message, "type": 'success', "alertId": alertId, "keepAfterRouteChange": keep })
    }

    info(message: string, keep?: boolean, alertId?: string): void {
        this.alert({ "message": message, "type": 'info', "alertId": alertId, "keepAfterRouteChange": keep })
    }

    error(message: string, keep?: boolean, alertId?: string): void {
        this.alert({ "message": message, "type": 'error', "alertId": alertId, "keepAfterRouteChange": keep })
    }

    warn(message: string, keep?: boolean, alertId?: string): void {
        this.alert({ "message": message, "type": 'warn', "alertId": alertId, "keepAfterRouteChange": keep })
    }

    alert(alert: Object): void {
        this.keepAfterRouteChange = alert["keepAfterRouteChange"];
        this.subject.next(alert);
    }

    clear(alertId?: string): void {
        this.subject.next(({ "alertId": alertId }));
    }
}
