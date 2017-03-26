import { Component, Input, Output, EventEmitter, Renderer, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
var TagInputForm = (function () {
    function TagInputForm(renderer) {
        this.renderer = renderer;
        this.onSubmit = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onKeyup = new EventEmitter();
        this.onKeydown = new EventEmitter();
        this.validators = [];
        this.inputTextChange = new EventEmitter();
        this.inputTextValue = '';
    }
    Object.defineProperty(TagInputForm.prototype, "inputText", {
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
    TagInputForm.prototype.ngOnInit = function () {
        this.form = new FormGroup({
            item: new FormControl('', Validators.compose(this.validators))
        });
    };
    Object.defineProperty(TagInputForm.prototype, "value", {
        get: function () {
            return this.form.get('item');
        },
        enumerable: true,
        configurable: true
    });
    TagInputForm.prototype.isInputFocused = function () {
        return document.activeElement === this.input.nativeElement;
    };
    TagInputForm.prototype.getErrorMessages = function (messages) {
        var _this = this;
        return Object.keys(messages)
            .filter(function (err) { return _this.value.hasError(err); })
            .map(function (err) { return messages[err]; });
    };
    TagInputForm.prototype.hasErrors = function () {
        return this.form.dirty &&
            this.form.value.item &&
            this.form.invalid;
    };
    TagInputForm.prototype.focus = function () {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    };
    TagInputForm.prototype.blur = function () {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'blur');
    };
    TagInputForm.prototype.getElementPosition = function () {
        return this.input.nativeElement.getBoundingClientRect();
    };
    TagInputForm.prototype.destroy = function () {
        var input = this.input.nativeElement;
        this.renderer.invokeElementMethod(input.parentElement, 'removeChild', [input]);
    };
    TagInputForm.prototype.onKeyDown = function ($event) {
        return this.onKeydown.emit($event);
    };
    TagInputForm.prototype.submit = function ($event) {
        this.onSubmit.emit($event);
    };
    return TagInputForm;
}());
export { TagInputForm };
TagInputForm.decorators = [
    { type: Component, args: [{
                selector: 'tag-input-form',
                styleUrls: ['./tag-input-form.style.scss'],
                templateUrl: './tag-input-form.template.html'
            },] },
];
TagInputForm.ctorParameters = function () { return [
    { type: Renderer, },
]; };
TagInputForm.propDecorators = {
    'onSubmit': [{ type: Output },],
    'onBlur': [{ type: Output },],
    'onFocus': [{ type: Output },],
    'onKeyup': [{ type: Output },],
    'onKeydown': [{ type: Output },],
    'placeholder': [{ type: Input },],
    'validators': [{ type: Input },],
    'inputId': [{ type: Input },],
    'inputClass': [{ type: Input },],
    'inputText': [{ type: Input },],
    'input': [{ type: ViewChild, args: ['input',] },],
    'inputTextChange': [{ type: Output },],
};
//# sourceMappingURL=tag-input-form.component.js.map