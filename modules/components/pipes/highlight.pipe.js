import { Pipe } from '@angular/core';
var escape = function (s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };
var HighlightPipe = (function () {
    function HighlightPipe() {
    }
    HighlightPipe.prototype.transform = function (value, arg) {
        if (!arg.trim()) {
            return value;
        }
        try {
            var regex = new RegExp("(" + escape(arg) + ")", 'i');
            return value.replace(regex, '<b>$1</b>');
        }
        catch (e) {
            return value;
        }
    };
    return HighlightPipe;
}());
export { HighlightPipe };
HighlightPipe.decorators = [
    { type: Pipe, args: [{
                name: 'highlight'
            },] },
];
HighlightPipe.ctorParameters = function () { return []; };
//# sourceMappingURL=highlight.pipe.js.map