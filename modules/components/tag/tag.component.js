import { Component, Input, Output, EventEmitter, ElementRef, Renderer, HostListener, ViewChild } from '@angular/core';
import { TagRipple } from './tag-ripple.component';
var KeyboardEvent = global.KeyboardEvent;
var navigator = typeof window !== 'undefined' ? window.navigator : {
    userAgent: 'Chrome',
    vendor: 'Google Inc'
};
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var TagComponent = (function () {
    function TagComponent(element, renderer) {
        this.element = element;
        this.renderer = renderer;
        this.onSelect = new EventEmitter();
        this.onRemove = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onKeyDown = new EventEmitter();
        this.onTagEdited = new EventEmitter();
        this.editModeActivated = false;
        this.rippleState = 'none';
    }
    TagComponent.prototype.select = function ($event) {
        if (this.readonly) {
            return;
        }
        if ($event) {
            $event.stopPropagation();
        }
        this.focus();
        this.onSelect.emit(this.model);
    };
    TagComponent.prototype.remove = function () {
        this.onRemove.emit(this);
    };
    TagComponent.prototype.focus = function () {
        this.renderer.invokeElementMethod(this.element.nativeElement, 'focus');
    };
    TagComponent.prototype.keydown = function (event) {
        if (this.editModeActivated) {
            event.keyCode === 13 ? this.disableEditMode(event) : this.storeNewValue();
            return;
        }
        this.onKeyDown.emit({ event: event, model: this.model });
    };
    TagComponent.prototype.blink = function () {
        var classList = this.element.nativeElement.classList;
        classList.add('blink');
        setTimeout(function () { return classList.remove('blink'); }, 50);
    };
    TagComponent.prototype.toggleEditMode = function (event) {
        if (this.editModeActivated) {
            this.storeNewValue();
        }
        else {
            this.element.nativeElement.querySelector('[contenteditable]').focus();
        }
        this.editModeActivated = !this.editModeActivated;
        this.renderer.setElementClass(this.element.nativeElement, 'tag--editing', this.editModeActivated);
    };
    TagComponent.prototype.getDisplayValue = function (item) {
        return typeof item === 'string' ? item : item[this.displayBy];
    };
    TagComponent.prototype.getContentEditableText = function () {
        return this.element.nativeElement.querySelector('[contenteditable]').innerText.trim();
    };
    TagComponent.prototype.disableEditMode = function ($event) {
        this.editModeActivated = false;
        $event.preventDefault();
    };
    TagComponent.prototype.storeNewValue = function () {
        var _this = this;
        var input = this.getContentEditableText();
        var exists = function (model) {
            return typeof model === 'string' ?
                model === input :
                model[_this.identifyBy] === input;
        };
        if (exists(this.model)) {
            var itemValue = this.model[this.identifyBy];
            this.model = typeof this.model === 'string' ? input : (_a = {}, _a[this.identifyBy] = itemValue, _a[this.displayBy] = itemValue, _a);
            this.onTagEdited.emit(this.model);
        }
        var _a;
    };
    TagComponent.prototype.isDeleteIconVisible = function () {
        return !this.readonly && this.removable && !this.editModeActivated;
    };
    TagComponent.prototype.isRippleVisible = function () {
        return !this.readonly &&
            !this.editModeActivated &&
            isChrome &&
            this.hasRipple;
    };
    return TagComponent;
}());
export { TagComponent };
TagComponent.decorators = [
    { type: Component, args: [{
                selector: 'tag',
                templateUrl: './tag.template.html',
                styleUrls: ['./tag-component.style.scss']
            },] },
];
TagComponent.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer, },
]; };
TagComponent.propDecorators = {
    'model': [{ type: Input },],
    'readonly': [{ type: Input },],
    'removable': [{ type: Input },],
    'editable': [{ type: Input },],
    'template': [{ type: Input },],
    'displayBy': [{ type: Input },],
    'identifyBy': [{ type: Input },],
    'index': [{ type: Input },],
    'hasRipple': [{ type: Input },],
    'onSelect': [{ type: Output },],
    'onRemove': [{ type: Output },],
    'onBlur': [{ type: Output },],
    'onKeyDown': [{ type: Output },],
    'onTagEdited': [{ type: Output },],
    'ripple': [{ type: ViewChild, args: [TagRipple,] },],
    'keydown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
};
//# sourceMappingURL=tag.component.js.map