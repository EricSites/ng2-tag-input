import { Component, animate, trigger, style, transition, keyframes, state, Input } from '@angular/core';
var TagRipple = (function () {
    function TagRipple() {
        this.state = 'none';
    }
    return TagRipple;
}());
export { TagRipple };
TagRipple.decorators = [
    { type: Component, args: [{
                selector: 'tag-ripple',
                styles: ["\n        :host {\n            width: 100%;\n            height: 100%;\n            left: 0;\n            overflow: hidden;\n            position: absolute;\n        }\n        \n        .tag-ripple {\n            background: rgba(0, 0, 0, 0.1);\n            top: 50%;\n            left: 50%;\n            height: 100%;\n            transform: translate(-50%, -50%);\n            position: absolute;\n        }\n    "],
                template: "\n        <div class=\"tag-ripple\" [@ink]=\"state\"></div>\n    ",
                animations: [
                    trigger('ink', [
                        state('none', style({ width: 0, opacity: 0 })),
                        transition('none => clicked', [
                            animate(300, keyframes([
                                style({ opacity: 1, offset: 0, width: '30%', borderRadius: '100%' }),
                                style({ opacity: 1, offset: 0.5, width: '50%' }),
                                style({ opacity: 0.5, offset: 1, width: '100%', borderRadius: '16px' })
                            ]))
                        ])
                    ])
                ]
            },] },
];
TagRipple.ctorParameters = function () { return []; };
TagRipple.propDecorators = {
    'state': [{ type: Input },],
};
//# sourceMappingURL=tag-ripple.component.js.map