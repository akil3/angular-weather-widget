import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
var WeatherLocationComponent = /** @class */ (function () {
    function WeatherLocationComponent() {
    }
    WeatherLocationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'weather-location',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [
                        "\n      :host {\n        margin-top: 1em;\n        font-size: 1em;\n      }\n    "
                    ],
                    template: "\n    {{ place }}\n  "
                },] },
    ];
    WeatherLocationComponent.propDecorators = {
        place: [{ type: Input }]
    };
    return WeatherLocationComponent;
}());
export { WeatherLocationComponent };
//# sourceMappingURL=weather-location.component.js.map