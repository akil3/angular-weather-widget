import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
var WeatherCurrentDescriptionComponent = /** @class */ (function () {
    function WeatherCurrentDescriptionComponent() {
    }
    WeatherCurrentDescriptionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'weather-current-description',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [
                        "\n      :host {\n        display: block;\n        text-align: center;\n      }\n    "
                    ],
                    template: "\n    {{ descripion | uppercase }}\n  "
                },] },
    ];
    WeatherCurrentDescriptionComponent.propDecorators = {
        descripion: [{ type: Input }]
    };
    return WeatherCurrentDescriptionComponent;
}());
export { WeatherCurrentDescriptionComponent };
//# sourceMappingURL=weather-current-description.component.js.map