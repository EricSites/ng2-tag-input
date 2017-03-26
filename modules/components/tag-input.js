var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Component, forwardRef, Input, Output, EventEmitter, Renderer, ViewChild, ViewChildren, ContentChildren, ContentChild, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagInputAccessor } from './helpers/accessor';
import { TagInputForm } from './tag-input-form/tag-input-form.component';
import { TagInputDropdown } from './dropdown/tag-input-dropdown.component';
import { TagComponent } from './tag/tag.component';
import 'rxjs/add/operator/debounceTime';
import { animations } from './animations';
import * as constants from './helpers/constants';
import listen from './helpers/listen';
var CUSTOM_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return TagInputComponent; }),
    multi: true
};
var TagInputComponent = (function (_super) {
    __extends(TagInputComponent, _super);
    function TagInputComponent(renderer) {
        var _this = _super.call(this) || this;
        _this.renderer = renderer;
        _this.separatorKeys = [];
        _this.separatorKeyCodes = [];
        _this.placeholder = constants.PLACEHOLDER;
        _this.secondaryPlaceholder = constants.SECONDARY_PLACEHOLDER;
        _this.transform = function (item) { return item; };
        _this.validators = [];
        _this.onlyFromAutocomplete = false;
        _this.errorMessages = {};
        _this.onTextChangeDebounce = 250;
        _this.pasteSplitPattern = ',';
        _this.blinkIfDupe = true;
        _this.removable = true;
        _this.editable = false;
        _this.allowDupes = false;
        _this.modelAsStrings = false;
        _this.trimTags = true;
        _this.ripple = true;
        _this.onAdd = new EventEmitter();
        _this.onRemove = new EventEmitter();
        _this.onSelect = new EventEmitter();
        _this.onFocus = new EventEmitter();
        _this.onBlur = new EventEmitter();
        _this.onTextChange = new EventEmitter();
        _this.onPaste = new EventEmitter();
        _this.onValidationError = new EventEmitter();
        _this.onTagEdited = new EventEmitter();
        _this.isLoading = false;
        _this.listeners = (_a = {},
            _a[constants.KEYDOWN] = [],
            _a[constants.KEYUP] = [],
            _a.change = [],
            _a);
        _this.inputTextChange = new EventEmitter();
        _this.inputTextValue = '';
        return _this;
        var _a;
    }
    Object.defineProperty(TagInputComponent.prototype, "inputText", {
        get: function () {
            return this.inputTextValue;
        },
        set: function (text) {
            this.inputTextValue = text;
            this.inputTextChange.emit(text);
        },
        enumerable: true,
        configurable: true
    });
    TagInputComponent.prototype.removeItem = function (tag, index) {
        this.items = this.getItemsWithout(index);
        if (this.selectedTag === tag) {
            this.selectedTag = undefined;
        }
        this.focus(true, false);
        this.onRemove.emit(tag);
    };
    TagInputComponent.prototype.addItem = function (isFromAutocomplete, item) {
        if (isFromAutocomplete === void 0) { isFromAutocomplete = false; }
        if (item === void 0) { item = this.formValue; }
        var display = this.getItemDisplay(item);
        var inputValue = this.setInputValue(display);
        var isFormInvalid = !this.inputForm.form.valid || !inputValue;
        if (isFormInvalid) {
            return;
        }
        var tag = this.createTag(isFromAutocomplete ? item : inputValue);
        var isValid = this.isTagValid(tag, isFromAutocomplete);
        if (isValid) {
            this.appendNewTag(tag);
            this.onAdd.emit(tag);
        }
        else {
            this.onValidationError.emit(tag);
        }
        this.setInputValue('');
        this.focus(true, false);
    };
    TagInputComponent.prototype.isTagValid = function (tag, isFromAutocomplete) {
        var _this = this;
        if (isFromAutocomplete === void 0) { isFromAutocomplete = false; }
        var selectedItem = this.dropdown ? this.dropdown.selectedItem : undefined;
        if (selectedItem && !isFromAutocomplete) {
            return;
        }
        var dupe = this.findDupe(tag, isFromAutocomplete);
        var hasDupe = !!dupe && dupe !== undefined;
        if (!this.allowDupes && hasDupe && this.blinkIfDupe) {
            var item = this.tags.find(function (_tag) {
                return _this.getItemValue(_tag.model) === _this.getItemValue(dupe);
            });
            if (!!item) {
                item.blink();
            }
        }
        var fromAutocomplete = isFromAutocomplete && this.onlyFromAutocomplete;
        var assertions = [
            !hasDupe || this.allowDupes === true,
            this.maxItemsReached === false,
            ((fromAutocomplete) || this.onlyFromAutocomplete === false)
        ];
        return assertions.filter(function (item) { return item; }).length === assertions.length;
    };
    TagInputComponent.prototype.appendNewTag = function (tag) {
        var newTag = this.modelAsStrings ? tag[this.identifyBy] : tag;
        this.items = this.items.concat([newTag]);
    };
    TagInputComponent.prototype.createTag = function (model) {
        var trim = function (val, key) {
            return typeof val === 'string' ? val.trim() : val[key];
        };
        return __assign({}, typeof model !== 'string' ? model : {}, (_a = {}, _a[this.displayBy] = this.trimTags ? trim(model, this.displayBy) : model, _a[this.identifyBy] = this.trimTags ? trim(model, this.identifyBy) : model, _a));
        var _a;
    };
    TagInputComponent.prototype.selectItem = function (item) {
        if (this.readonly || !item) {
            return;
        }
        this.selectedTag = item;
        this.onSelect.emit(item);
    };
    TagInputComponent.prototype.fireEvents = function (eventName, $event) {
        var _this = this;
        this.listeners[eventName].forEach(function (listener) { return listener.call(_this, $event); });
    };
    TagInputComponent.prototype.handleKeydown = function (data) {
        var event = data.event;
        var key = event.keyCode || event.which;
        switch (constants.KEY_PRESS_ACTIONS[key]) {
            case constants.ACTIONS_KEYS.DELETE:
                if (this.selectedTag && this.removable) {
                    this.removeItem(this.selectedTag, this.items.indexOf(this.selectedTag));
                }
                break;
            case constants.ACTIONS_KEYS.SWITCH_PREV:
                this.switchPrev(data.model);
                break;
            case constants.ACTIONS_KEYS.SWITCH_NEXT:
                this.switchNext(data.model);
                break;
            case constants.ACTIONS_KEYS.TAB:
                this.switchNext(data.model);
                break;
            default:
                return;
        }
        event.preventDefault();
    };
    TagInputComponent.prototype.setInputValue = function (value) {
        var item = value ? this.transform(value) : '';
        var control = this.getControl();
        control.setValue(item);
        return item;
    };
    TagInputComponent.prototype.getControl = function () {
        return this.inputForm.value;
    };
    TagInputComponent.prototype.focus = function (applyFocus, displayAutocomplete) {
        if (applyFocus === void 0) { applyFocus = false; }
        if (displayAutocomplete === void 0) { displayAutocomplete = false; }
        if (this.readonly) {
            return;
        }
        this.selectedTag = undefined;
        if (applyFocus) {
            this.inputForm.focus();
            this.onFocus.emit(this.formValue);
        }
        if (displayAutocomplete && this.dropdown) {
            this.dropdown.show();
        }
    };
    TagInputComponent.prototype.blur = function () {
        this.onBlur.emit(this.formValue);
    };
    TagInputComponent.prototype.hasErrors = function () {
        return this.inputForm && this.inputForm.hasErrors();
    };
    TagInputComponent.prototype.isInputFocused = function () {
        return this.inputForm && this.inputForm.isInputFocused();
    };
    TagInputComponent.prototype.hasCustomTemplate = function () {
        var template = this.templates ? this.templates.first : undefined;
        var menuTemplate = this.dropdown && this.dropdown.templates ? this.dropdown.templates.first : undefined;
        return template && template !== menuTemplate;
    };
    TagInputComponent.prototype.switchNext = function (item) {
        if (this.tags.last.model === item) {
            this.focus(true);
            return;
        }
        var tags = this.tags.toArray();
        var tagIndex = tags.findIndex(function (tag) { return tag.model === item; });
        var tag = tags[tagIndex + 1];
        tag.select.call(tag);
    };
    TagInputComponent.prototype.switchPrev = function (item) {
        if (this.tags.first.model !== item) {
            var tags = this.tags.toArray();
            var tagIndex = tags.findIndex(function (tag) { return tag.model === item; });
            var tag = tags[tagIndex - 1];
            tag.select.call(tag);
        }
    };
    Object.defineProperty(TagInputComponent.prototype, "maxItemsReached", {
        get: function () {
            return this.maxItems !== undefined && this.items.length >= this.maxItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagInputComponent.prototype, "formValue", {
        get: function () {
            return this.inputForm.value.value;
        },
        enumerable: true,
        configurable: true
    });
    TagInputComponent.prototype.ngOnInit = function () {
        var maxItemsReached = this.maxItems !== undefined && this.items && this.items.length > this.maxItems;
        if (maxItemsReached) {
            this.maxItems = this.items.length;
            console.warn(constants.MAX_ITEMS_WARNING);
        }
    };
    TagInputComponent.prototype.ngAfterViewInit = function () {
        this.setUpKeypressListeners();
        this.setupSeparatorKeysListener();
        this.setUpInputKeydownListeners();
        if (this.onTextChange.observers.length) {
            this.setUpTextChangeSubscriber();
        }
        if (this.clearOnBlur || this.addOnBlur) {
            this.setUpOnBlurSubscriber();
        }
        if (this.addOnPaste) {
            this.setUpOnPasteListener();
        }
        if (this.hideForm) {
            this.inputForm.destroy();
        }
    };
    TagInputComponent.prototype.setupSeparatorKeysListener = function () {
        var _this = this;
        var useSeparatorKeys = this.separatorKeyCodes.length > 0 || this.separatorKeys.length > 0;
        listen.call(this, constants.KEYDOWN, function ($event) {
            var hasKeyCode = _this.separatorKeyCodes.indexOf($event.keyCode) >= 0;
            var hasKey = _this.separatorKeys.indexOf($event.key) >= 0;
            if (hasKeyCode || hasKey) {
                $event.preventDefault();
                _this.addItem();
            }
        }, useSeparatorKeys);
    };
    TagInputComponent.prototype.setUpKeypressListeners = function () {
        var _this = this;
        listen.call(this, constants.KEYDOWN, function ($event) {
            var isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;
            if (isCorrectKey &&
                !_this.formValue &&
                _this.items.length) {
                _this.tags.last.select.call(_this.tags.last);
            }
        });
    };
    TagInputComponent.prototype.setUpInputKeydownListeners = function () {
        var _this = this;
        this.inputForm.onKeydown.subscribe(function (event) {
            _this.fireEvents('keydown', event);
            if (event.key === 'Backspace' && _this.formValue === '') {
                event.preventDefault();
            }
        });
    };
    TagInputComponent.prototype.setUpOnPasteListener = function () {
        var input = this.inputForm.input.nativeElement;
        this.renderer.listen(input, 'paste', this.onPasteCallback.bind(this));
    };
    TagInputComponent.prototype.setUpTextChangeSubscriber = function () {
        var _this = this;
        this.inputForm.form.valueChanges
            .debounceTime(this.onTextChangeDebounce)
            .subscribe(function () { return _this.onTextChange.emit(_this.formValue); });
    };
    TagInputComponent.prototype.setUpOnBlurSubscriber = function () {
        var _this = this;
        this.inputForm
            .onBlur
            .filter(function () { return _this.dropdown && _this.dropdown.isVisible; })
            .subscribe(function () {
            if (_this.addOnBlur) {
                _this.addItem();
            }
            _this.setInputValue('');
        });
    };
    TagInputComponent.prototype.findDupe = function (tag, isFromAutocomplete) {
        var _this = this;
        var identifyBy = isFromAutocomplete ? this.dropdown.identifyBy : this.identifyBy;
        return this.items.find(function (item) { return _this.getItemValue(item) === tag[identifyBy]; });
    };
    TagInputComponent.prototype.trackBy = function (item) {
        return item[this.identifyBy];
    };
    TagInputComponent.prototype.onPasteCallback = function (data) {
        var _this = this;
        var text = data.clipboardData.getData('text/plain');
        text.split(this.pasteSplitPattern)
            .map(function (item) { return _this.createTag(item); })
            .forEach(function (item) { return _this.addItem(false, item); });
        this.onPaste.emit(text);
        setTimeout(function () { return _this.setInputValue(''); }, 0);
    };
    return TagInputComponent;
}(TagInputAccessor));
export { TagInputComponent };
TagInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'tag-input',
                providers: [CUSTOM_ACCESSOR],
                styleUrls: ['./tag-input.style.scss'],
                templateUrl: './tag-input.template.html',
                animations: animations
            },] },
];
TagInputComponent.ctorParameters = function () { return [
    { type: Renderer, },
]; };
TagInputComponent.propDecorators = {
    'separatorKeys': [{ type: Input },],
    'separatorKeyCodes': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'secondaryPlaceholder': [{ type: Input },],
    'maxItems': [{ type: Input },],
    'readonly': [{ type: Input },],
    'transform': [{ type: Input },],
    'validators': [{ type: Input },],
    'onlyFromAutocomplete': [{ type: Input },],
    'errorMessages': [{ type: Input },],
    'theme': [{ type: Input },],
    'onTextChangeDebounce': [{ type: Input },],
    'inputId': [{ type: Input },],
    'inputClass': [{ type: Input },],
    'clearOnBlur': [{ type: Input },],
    'hideForm': [{ type: Input },],
    'addOnBlur': [{ type: Input },],
    'addOnPaste': [{ type: Input },],
    'pasteSplitPattern': [{ type: Input },],
    'blinkIfDupe': [{ type: Input },],
    'removable': [{ type: Input },],
    'editable': [{ type: Input },],
    'allowDupes': [{ type: Input },],
    'modelAsStrings': [{ type: Input },],
    'trimTags': [{ type: Input },],
    'inputText': [{ type: Input },],
    'ripple': [{ type: Input },],
    'onAdd': [{ type: Output },],
    'onRemove': [{ type: Output },],
    'onSelect': [{ type: Output },],
    'onFocus': [{ type: Output },],
    'onBlur': [{ type: Output },],
    'onTextChange': [{ type: Output },],
    'onPaste': [{ type: Output },],
    'onValidationError': [{ type: Output },],
    'onTagEdited': [{ type: Output },],
    'dropdown': [{ type: ContentChild, args: [TagInputDropdown,] },],
    'templates': [{ type: ContentChildren, args: [TemplateRef, { descendants: false },] },],
    'inputForm': [{ type: ViewChild, args: [TagInputForm,] },],
    'tags': [{ type: ViewChildren, args: [TagComponent,] },],
    'inputTextChange': [{ type: Output },],
};
//# sourceMappingURL=tag-input.js.map