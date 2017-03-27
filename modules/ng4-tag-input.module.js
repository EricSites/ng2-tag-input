import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Ng4DropdownModule } from 'ng4-material-dropdown';
import { DeleteIconComponent } from './components/icon';
import { TagInputForm } from './components/tag-input-form';
import { TagInputComponent } from './components';
import { TagInputDropdown } from './components/dropdown/tag-input-dropdown.component';
import { HighlightPipe } from './components/pipes/highlight.pipe';
import { TagComponent } from './components/tag/tag.component';
import { TagRipple } from './components/tag/tag-ripple.component';
var TagInputModule = (function () {
    function TagInputModule() {
    }
    return TagInputModule;
}());
export { TagInputModule };
TagInputModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    BrowserAnimationsModule,
                    ReactiveFormsModule,
                    FormsModule,
                    Ng4DropdownModule
                ],
                declarations: [
                    TagInputComponent,
                    DeleteIconComponent,
                    TagInputForm,
                    TagComponent,
                    HighlightPipe,
                    TagInputDropdown,
                    TagRipple
                ],
                exports: [
                    TagInputComponent,
                    DeleteIconComponent,
                    TagInputForm,
                    TagComponent,
                    HighlightPipe,
                    TagInputDropdown,
                    TagRipple
                ]
            },] },
];
TagInputModule.ctorParameters = function () { return []; };
export { TagInputComponent, TagInputForm, TagInputDropdown, DeleteIconComponent, TagComponent, TagRipple };
//# sourceMappingURL=ng4-tag-input.module.js.map