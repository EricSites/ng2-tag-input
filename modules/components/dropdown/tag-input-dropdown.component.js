var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Component, ViewChild, forwardRef, Inject, TemplateRef, ContentChildren, Input, HostListener } from '@angular/core';
import { TagInputComponent } from '../tag-input';
import { Ng4Dropdown } from 'ng4-material-dropdown';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
var TagInputDropdown = (function () {
    function TagInputDropdown(tagInput) {
        var _this = this;
        this.tagInput = tagInput;
        this.offset = '50 0';
        this.focusFirstElement = false;
        this.showDropdownIfEmpty = false;
        this.minimumTextLength = 1;
        this.displayBy = 'display';
        this.identifyBy = 'value';
        this.matchingFn = function (value, target) {
            var targetValue = target[_this.displayBy].toString();
            return targetValue && targetValue
                .toLowerCase()
                .indexOf(value.toLowerCase()) >= 0;
        };
        this.appendToBody = true;
        this.items = [];
        this._autocompleteItems = [];
    }
    Object.defineProperty(TagInputDropdown.prototype, "autocompleteItems", {
        get: function () {
            var _this = this;
            var items = this._autocompleteItems;
            if (!items) {
                return [];
            }
            return items.map(function (item) {
                return typeof item === 'string' ? (_a = {},
                    _a[_this.displayBy] = item,
                    _a[_this.identifyBy] = item,
                    _a) : item;
                var _a;
            });
        },
        set: function (items) {
            this._autocompleteItems = items;
        },
        enumerable: true,
        configurable: true
    });
    TagInputDropdown.prototype.ngOnInit = function () {
        var _this = this;
        this.onItemClicked()
            .subscribe(this.addNewItem.bind(this));
        this.onHide()
            .subscribe(this.resetItems.bind(this));
        this.tagInput.inputForm.onKeyup
            .subscribe(this.show.bind(this));
        if (this.autocompleteObservable) {
            this.tagInput
                .onTextChange
                .filter(function (text) { return text.trim().length >= _this.minimumTextLength; })
                .subscribe(this.getItemsFromObservable.bind(this));
        }
    };
    TagInputDropdown.prototype.updatePosition = function () {
        this.dropdown.menu.updatePosition(this.tagInput.inputForm.getElementPosition());
    };
    Object.defineProperty(TagInputDropdown.prototype, "isVisible", {
        get: function () {
            return this.dropdown.menu.state.menuState.isVisible;
        },
        enumerable: true,
        configurable: true
    });
    TagInputDropdown.prototype.onHide = function () {
        return this.dropdown.onHide;
    };
    TagInputDropdown.prototype.onItemClicked = function () {
        return this.dropdown.onItemClicked;
    };
    Object.defineProperty(TagInputDropdown.prototype, "selectedItem", {
        get: function () {
            return this.dropdown.menu.state.dropdownState.selectedItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagInputDropdown.prototype, "state", {
        get: function () {
            return this.dropdown.menu.state;
        },
        enumerable: true,
        configurable: true
    });
    TagInputDropdown.prototype.addNewItem = function (item) {
        if (!item) {
            return;
        }
        var display = typeof item.value === 'string' ? item.value : item.value[this.displayBy];
        var value = typeof item.value === 'string' ? item.value : item.value[this.identifyBy];
        var model = __assign({}, item.value, { display: display, value: value });
        this.tagInput.addItem(true, model);
        this.dropdown.hide();
    };
    TagInputDropdown.prototype.show = function () {
        var value = this.tagInput.inputForm.value.value.trim();
        var position = this.tagInput.inputForm.getElementPosition();
        var items = this.getMatchingItems(value);
        var hasItems = items.length > 0;
        var showDropdownIfEmpty = this.showDropdownIfEmpty && hasItems && !value;
        var hasMinimumText = value.length >= this.minimumTextLength;
        var assertions = [
            hasItems,
            this.isVisible === false,
            hasMinimumText
        ];
        var showDropdown = (assertions.filter(function (item) { return item; }).length === assertions.length) ||
            showDropdownIfEmpty;
        var hideDropdown = this.isVisible && (!hasItems || !hasMinimumText);
        this.setItems(items);
        if (showDropdown && !this.isVisible) {
            this.dropdown.show(position);
        }
        else if (hideDropdown) {
            this.dropdown.hide();
        }
    };
    TagInputDropdown.prototype.scrollListener = function () {
        if (!this.isVisible) {
            return;
        }
        this.updatePosition();
    };
    TagInputDropdown.prototype.getMatchingItems = function (value) {
        var _this = this;
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }
        return this.autocompleteItems.filter(function (item) {
            var hasValue = _this.tagInput.tags.some(function (tag) {
                var identifyBy = _this.tagInput.identifyBy;
                var model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];
                return model === item[_this.identifyBy];
            });
            return _this.matchingFn(value, item) && hasValue === false;
        });
    };
    TagInputDropdown.prototype.setItems = function (items) {
        this.items = items.slice(0, this.limitItemsTo || items.length);
    };
    TagInputDropdown.prototype.resetItems = function () {
        this.items = [];
    };
    TagInputDropdown.prototype.populateItems = function (data) {
        var _this = this;
        this.autocompleteItems = data.map(function (item) {
            return typeof item === 'string' ? (_a = {},
                _a[_this.displayBy] = item,
                _a[_this.identifyBy] = item,
                _a) : item;
            var _a;
        });
        return this;
    };
    TagInputDropdown.prototype.getItemsFromObservable = function (text) {
        var _this = this;
        this.setLoadingState(true);
        this.autocompleteObservable(text)
            .subscribe(function (data) {
            _this.setLoadingState(false)
                .populateItems(data)
                .show();
        }, function () { return _this.setLoadingState(false); });
    };
    TagInputDropdown.prototype.setLoadingState = function (state) {
        this.tagInput.isLoading = state;
        return this;
    };
    return TagInputDropdown;
}());
export { TagInputDropdown };
TagInputDropdown.decorators = [
    { type: Component, args: [{
                selector: 'tag-input-dropdown',
                templateUrl: './tag-input-dropdown.template.html'
            },] },
];
TagInputDropdown.ctorParameters = function () { return [
    { type: TagInputComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return TagInputComponent; }),] },] },
]; };
TagInputDropdown.propDecorators = {
    'dropdown': [{ type: ViewChild, args: [Ng4Dropdown,] },],
    'templates': [{ type: ContentChildren, args: [TemplateRef,] },],
    'offset': [{ type: Input },],
    'focusFirstElement': [{ type: Input },],
    'showDropdownIfEmpty': [{ type: Input },],
    'autocompleteObservable': [{ type: Input },],
    'minimumTextLength': [{ type: Input },],
    'limitItemsTo': [{ type: Input },],
    'displayBy': [{ type: Input },],
    'identifyBy': [{ type: Input },],
    'matchingFn': [{ type: Input },],
    'appendToBody': [{ type: Input },],
    'autocompleteItems': [{ type: Input },],
    'scrollListener': [{ type: HostListener, args: ['window:scroll',] },],
};
//# sourceMappingURL=tag-input-dropdown.component.js.map