import { Injectable, NgZone } from '@angular/core';
import { multicast, mergeMap, merge, refCount } from 'rxjs/operators';
import { Observable, Subject, interval } from 'rxjs';
var PoolingService = /** @class */ (function () {
    function PoolingService(zone) {
        this.zone = zone;
    }
    // NOTE: Running the interval outside Angular ensures that e2e tests will not hang.
    PoolingService.prototype.execute = function (operation, frequency) {
        var _this = this;
        if (frequency === void 0) { frequency = 1000; }
        var subject = new Subject();
        var source = Observable.create(function (observer) {
            var sub;
            _this.zone.runOutsideAngular(function () {
                var zone = _this.zone;
                sub = interval(frequency)
                    .pipe(mergeMap(operation))
                    .subscribe({
                    next: function (result) {
                        zone.run(function () {
                            observer.next(result);
                        });
                    },
                    error: function (err) {
                        zone.run(function () {
                            observer.error(err);
                        });
                    }
                });
            });
            return function () {
                if (sub) {
                    sub.unsubscribe();
                }
            };
        });
        return source.pipe(multicast(subject), refCount(), merge(operation()));
    };
    PoolingService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    PoolingService.ctorParameters = function () { return [
        { type: NgZone }
    ]; };
    return PoolingService;
}());
export { PoolingService };
//# sourceMappingURL=poling.service.js.map