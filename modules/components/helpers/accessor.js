import { Input } from '@angular/core';
export function isObject(obj) {
    return obj === Object(obj);
}
var TagInputAccessor = (function () {
    function TagInputAccessor() {
        this._items = [];
        this.displayBy = 'display';
        this.identifyBy = 'value';
    }
    Object.defineProperty(TagInputAccessor.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (items) {
            this._items = items;
            this._onChangeCallback(this._items);
        },
        enumerable: true,
        configurable: true
    });
    ;
    TagInputAccessor.prototype.onTouched = function (items) {
        this._onTouchedCallback(items);
    };
    TagInputAccessor.prototype.writeValue = function (items) {
        this._items = items || [];
    };
    TagInputAccessor.prototype.registerOnChange = function (fn) {
        this._onChangeCallback = fn;
    };
    TagInputAccessor.prototype.registerOnTouched = function (fn) {
        this._onTouchedCallback = fn;
    };
    TagInputAccessor.prototype.getItemValue = function (item) {
        return isObject(item) ? item[this.identifyBy] : item;
    };
    TagInputAccessor.prototype.getItemDisplay = function (item) {
        return isObject(item) ? item[this.displayBy] : item;
    };
    TagInputAccessor.prototype.getItemsWithout = function (index) {
        return this.items.filter(function (item, position) { return position !== index; });
    };
    return TagInputAccessor;
}());
export { TagInputAccessor };
TagInputAccessor.propDecorators = {
    'displayBy': [{ type: Input },],
    'identifyBy': [{ type: Input },],
};
//# sourceMappingURL=accessor.js.map