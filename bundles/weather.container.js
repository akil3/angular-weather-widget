import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';
import { WeatherApiService } from './services/api/weather.api.service';
import { WeatherLayout, WeatherSettings } from './weather.interfaces';
var WeatherContainer = /** @class */ (function () {
    function WeatherContainer(weatherApi, changeDetectorRef, renderer, element) {
        this.weatherApi = weatherApi;
        this.changeDetectorRef = changeDetectorRef;
        this.renderer = renderer;
        this.element = element;
        this.width = 'auto';
        this.height = 'auto';
        this.isWideLayout = false;
    }
    Object.defineProperty(WeatherContainer.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        set: function (value) {
            if (!value) {
                return;
            }
            this._settings = value;
            this.background = this._settings.backgroundColor || 'white';
            this.color = this._settings.color || 'black';
            this.width = this._settings.width;
            this.height = this._settings.height;
            if (this.weatherApi.apiConfig.name && this.weatherApi.apiConfig.key) {
                this.getWeather();
            }
            if (this._settings.layout) {
                this.isWideLayout = this._settings.layout === WeatherLayout.WIDE;
            }
        },
        enumerable: true,
        configurable: true
    });
    WeatherContainer.prototype.ngOnDestroy = function () {
        if (this.subscriptionCurrentWeather) {
            this.subscriptionCurrentWeather.unsubscribe();
        }
        if (this.subscriptionForecast) {
            this.subscriptionForecast.unsubscribe();
        }
    };
    WeatherContainer.prototype.onMouseEnter = function () {
        this.renderer.addClass(this.element.nativeElement, 'active');
        this.isMouseOn = true;
    };
    WeatherContainer.prototype.onMouseLeave = function () {
        this.renderer.removeClass(this.element.nativeElement, 'active');
        this.isMouseOn = false;
    };
    WeatherContainer.prototype.getWeather = function () {
        var _this = this;
        if (this.subscriptionCurrentWeather) {
            this.subscriptionCurrentWeather.unsubscribe();
        }
        if (this.subscriptionForecast) {
            this.subscriptionForecast.unsubscribe();
        }
        this.currentWeather$ = this.currentWeatherCall();
        this.forecast$ = this.forecastCall();
        this.subscriptionCurrentWeather = this.currentWeather$.subscribe(function (data) {
            _this.currentWeather = data;
            _this.changeDetectorRef.markForCheck();
        });
        this.subscriptionForecast = this.forecast$.subscribe(function (data) {
            _this.forecast = data;
            _this.changeDetectorRef.markForCheck();
        });
    };
    WeatherContainer.prototype.currentWeatherCall = function () {
        var params = Object.assign({}, this.settings.location, { units: this.settings.scale }, { lang: this.settings.language });
        return this.weatherApi.currentWeather(params);
    };
    WeatherContainer.prototype.forecastCall = function () {
        var params = Object.assign({}, this.settings.location, { units: this.settings.scale }, { lang: this.settings.language });
        return this.weatherApi.forecast(params);
    };
    WeatherContainer.decorators = [
        { type: Component, args: [{
                    selector: 'weather-widget',
                    changeDetection: ChangeDetectionStrategy.Default,
                    styles: [
                        "\n      :host {\n        display: flex;\n        position: relative;\n        padding: 1em;\n        box-sizing: border-box;\n      }\n      .info {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        width: 100%;\n      }\n      .info.wide {\n        flex-direction: row;\n      }\n      .wide .current {\n        flex-grow: 0;\n      }\n      .wide .forecast {\n        flex-grow: 1;\n        overflow-y: auto;\n        height: 100%;\n      }\n      .current {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        min-width: 140px;\n      }\n      .forecast {\n        min-width: 200px;\n        width: 100%;\n        overflow-y: auto;\n      }\n      .current,\n      .forecast {\n        padding: 0.5em;\n      }\n      weather-actions {\n        display: block;\n        position: absolute;\n        top: 10px;\n        right: 10px;\n      }\n      weather-current-temperature.big {\n        font-size: 3em;\n      }\n      weather-icon.big {\n        font-size: 6em;\n        padding: 0.15em;\n      }\n      .empty {\n        flex-direction: row;\n      }\n      .empty i {\n        font-size: 3em;\n        margin-right: 0.3em;\n      }\n    "
                    ],
                    template: "\n    <link\n      rel=\"stylesheet\"\n      href=\"https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css\"\n    />\n    <link\n      rel=\"stylesheet\"\n      href=\"https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons-wind.min.css\"\n    />\n    <div *ngIf=\"currentWeather\" class=\"info\" [class.wide]=\"isWideLayout\">\n      <div class=\"current\">\n        <weather-icon\n          class=\"big\"\n          [iconImageUrl]=\"currentWeather?.iconUrl\"\n          [iconClass]=\"currentWeather?.iconClass\"\n        ></weather-icon>\n        <weather-current-description\n          [descripion]=\"currentWeather?.description\"\n        ></weather-current-description>\n        <weather-current-wind\n          *ngIf=\"settings.showWind\"\n          [scale]=\"settings.scale\"\n          [deg]=\"currentWeather?.wind.deg\"\n          [speed]=\"currentWeather?.wind.speed\"\n        ></weather-current-wind>\n        <weather-location [place]=\"currentWeather?.location\"></weather-location>\n        <weather-current-temperature\n          class=\"big\"\n          [temp]=\"currentWeather?.temp\"\n          [deg]=\"settings.scale\"\n        ></weather-current-temperature>\n        <weather-current-details\n          *ngIf=\"settings.showDetails\"\n          [maxTemp]=\"currentWeather?.maxTemp\"\n          [minTemp]=\"currentWeather?.minTemp\"\n          [pressure]=\"currentWeather?.pressure\"\n          [humidity]=\"currentWeather?.humidity\"\n        ></weather-current-details>\n      </div>\n      <div class=\"forecast\" *ngIf=\"settings.showForecast\">\n        <weather-forecast\n          [forecast]=\"forecast\"\n          [settings]=\"settings\"\n          [mode]=\"settings.forecastMode\"\n        ></weather-forecast>\n      </div>\n    </div>\n    <div *ngIf=\"!currentWeather\" class=\"info empty\">\n      <i class=\"wi wi-sunrise\"></i>\n      No weather data...\n    </div>\n    <weather-actions\n      *ngIf=\"isMouseOn\"\n      (update)=\"getWeather()\"\n    ></weather-actions>\n  "
                },] },
    ];
    /** @nocollapse */
    WeatherContainer.ctorParameters = function () { return [
        { type: WeatherApiService },
        { type: ChangeDetectorRef },
        { type: Renderer2 },
        { type: ElementRef }
    ]; };
    WeatherContainer.propDecorators = {
        background: [{ type: HostBinding, args: ['style.background',] }],
        color: [{ type: HostBinding, args: ['style.color',] }],
        width: [{ type: HostBinding, args: ['style.width',] }],
        height: [{ type: HostBinding, args: ['style.height',] }],
        forecast: [{ type: Input }],
        currentWeather: [{ type: Input }],
        settings: [{ type: Input }],
        onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
        onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
    };
    return WeatherContainer;
}());
export { WeatherContainer };
//# sourceMappingURL=weather.container.js.map