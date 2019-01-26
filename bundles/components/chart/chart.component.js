import { Component, Input, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
var ChartComponent = /** @class */ (function () {
    function ChartComponent(elementRef) {
        this.elementRef = elementRef;
    }
    ChartComponent.prototype.ngOnInit = function () {
        this.options.scales = {
            yAxes: [
                {
                    ticks: {
                        // Remove excess decimal places
                        callback: function (value, index, values) {
                            return Number(value.toFixed(0));
                        }
                    }
                }
            ]
        };
        this.chart = new Chart(this.elementRef.nativeElement.querySelector('canvas'), {
            type: this.type,
            data: this.data,
            options: this.options
        });
    };
    ChartComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.chart && changes['data']) {
            var currentValue_1 = changes['data'].currentValue;
            ['datasets', 'labels', 'xLabels', 'yLabels'].forEach(function (property) {
                _this.chart.data[property] = currentValue_1[property];
            });
            this.chart.update();
        }
    };
    ChartComponent.decorators = [
        { type: Component, args: [{
                    selector: 'weather-chart',
                    template: '<canvas></canvas>',
                    styles: [':host { display: block; }']
                },] },
    ];
    /** @nocollapse */
    ChartComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    ChartComponent.propDecorators = {
        type: [{ type: Input }],
        data: [{ type: Input }],
        options: [{ type: Input }]
    };
    return ChartComponent;
}());
export { ChartComponent };
//# sourceMappingURL=chart.component.js.map