import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ModConfig } from '../../static/mod-config.const';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/toolbar";
import * as i2 from "@angular/router";
import * as i3 from "../mod-user-display/mod-user-display.component";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/menu";
import * as i7 from "@angular/material/icon";
import * as i8 from "../../models/mod-framework-config.model";
function ModHeaderComponent_div_9_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 11);
    i0.ɵɵlistener("click", function ModHeaderComponent_div_9_button_6_Template_button_click_0_listener() { const restoredCtx = i0.ɵɵrestoreView(_r5); const option_r3 = restoredCtx.$implicit; const ctx_r4 = i0.ɵɵnextContext(2); return ctx_r4.optionSelected(option_r3); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r3 = ctx.$implicit;
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate(option_r3);
} }
function ModHeaderComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵelementStart(1, "button", 8);
    i0.ɵɵelementStart(2, "mat-icon");
    i0.ɵɵtext(3, "help");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "mat-menu", null, 9);
    i0.ɵɵtemplate(6, ModHeaderComponent_div_9_button_6_Template, 2, 1, "button", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const _r1 = i0.ɵɵreference(5);
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("matMenuTriggerFor", _r1);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r0.config.helpOptions);
} }
const _c0 = function () { return ["/"]; };
const _c1 = ["*"];
export class ModHeaderComponent {
    constructor(config) {
        this.menuClick = new EventEmitter();
        this.userOptionSelect = new EventEmitter();
        this.helpOptionSelect = new EventEmitter();
        this.config = config;
    }
    ngOnInit() {
    }
    onMenuClick() {
        this.menuClick.emit();
    }
    onUserOptionSelect(option) {
        this.userOptionSelect.emit(option);
    }
    optionSelected(option) {
        this.helpOptionSelect.emit(option);
    }
}
ModHeaderComponent.ɵfac = function ModHeaderComponent_Factory(t) { return new (t || ModHeaderComponent)(i0.ɵɵdirectiveInject(ModConfig)); };
ModHeaderComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ModHeaderComponent, selectors: [["mod-header"]], inputs: { appName: "appName" }, outputs: { menuClick: "menuClick", userOptionSelect: "userOptionSelect", helpOptionSelect: "helpOptionSelect" }, ngContentSelectors: _c1, decls: 10, vars: 5, consts: [[1, "mod-header"], [1, "logo-text-mark", 3, "routerLink"], ["src", "/assets/US-OfficeOfManagementAndBudget-Seal.png", "tabindex", "-1", 1, "mod-logo"], ["tabindex", "-1", "alt", "Textmark", 1, "text-mark"], [1, "fill-remaining-space"], [1, "welcome-user"], [3, "showUser", "selectOption"], [4, "ngIf"], ["mat-icon-button", "", "aria-label", "Help Menu", 3, "matMenuTriggerFor"], ["menu", "matMenu"], ["mat-menu-item", "", 3, "click", 4, "ngFor", "ngForOf"], ["mat-menu-item", "", 3, "click"]], template: function ModHeaderComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef();
        i0.ɵɵelementStart(0, "mat-toolbar", 0);
        i0.ɵɵelementStart(1, "a", 1);
        i0.ɵɵelement(2, "img", 2);
        i0.ɵɵelementStart(3, "div", 3);
        i0.ɵɵtext(4);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(5, "span", 4);
        i0.ɵɵprojection(6);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(7, "div", 5);
        i0.ɵɵelementStart(8, "mod-user-display", 6);
        i0.ɵɵlistener("selectOption", function ModHeaderComponent_Template_mod_user_display_selectOption_8_listener($event) { return ctx.onUserOptionSelect($event); });
        i0.ɵɵelementEnd();
        i0.ɵɵtemplate(9, ModHeaderComponent_div_9_Template, 7, 2, "div", 7);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction0(4, _c0));
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(ctx.appName);
        i0.ɵɵadvance(4);
        i0.ɵɵproperty("showUser", true);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.config.showHelp);
    } }, directives: [i1.MatToolbar, i2.RouterLinkWithHref, i3.ModUserDisplayComponent, i4.NgIf, i5.MatButton, i6.MatMenuTrigger, i7.MatIcon, i6.MatMenu, i4.NgForOf, i6.MatMenuItem], styles: [".mod-header[_ngcontent-%COMP%]{justify-content:center;background-color:#112e51;display:flex;color:#fff}a[_ngcontent-%COMP%]{text-decoration:none}.logo-text-mark[_ngcontent-%COMP%]{cursor:pointer;display:flex;align-items:center}.text-mark[_ngcontent-%COMP%]{cursor:pointer;margin-left:12px;font-size:1.4em;display:inline-block;vertical-align:middle;color:#d8b304}.mod-logo[_ngcontent-%COMP%]{margin-left:4px;height:50px}.fill-remaining-space[_ngcontent-%COMP%]{flex:1 1 auto;align-items:center;margin-left:15px}.welcome-user[_ngcontent-%COMP%]{font-size:.85em;padding-top:2px;padding-right:5px;flex:1;display:flex;justify-content:flex-end}.mat-button-base[_ngcontent-%COMP%]{height:auto;line-height:inherit}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ModHeaderComponent, [{
        type: Component,
        args: [{
                selector: 'mod-header',
                templateUrl: './mod-header.component.html',
                styleUrls: ['./mod-header.component.scss']
            }]
    }], function () { return [{ type: i8.ModFrameworkConfig, decorators: [{
                type: Inject,
                args: [ModConfig]
            }] }]; }, { appName: [{
            type: Input
        }], menuClick: [{
            type: Output
        }], userOptionSelect: [{
            type: Output
        }], helpOptionSelect: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb2QtZnJhbWV3b3JrL3NyYy9saWIvY29tcG9uZW50cy9tb2QtaGVhZGVyL21vZC1oZWFkZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9kLWZyYW1ld29yay9zcmMvbGliL2NvbXBvbmVudHMvbW9kLWhlYWRlci9tb2QtaGVhZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7Ozs7Ozs7Ozs7O0lDc0IxQyxrQ0FBaUc7SUFBakMsMFFBQWdDO0lBQUMsWUFBWTtJQUFBLGlCQUFTOzs7SUFBckIsZUFBWTtJQUFaLCtCQUFZOzs7SUFMckgsMkJBQTZCO0lBQ3pCLGlDQUEwRTtJQUN0RSxnQ0FBVTtJQUFBLG9CQUFJO0lBQUEsaUJBQVc7SUFDN0IsaUJBQVM7SUFDVCx5Q0FBMEI7SUFDdEIsZ0ZBQXNIO0lBQzFILGlCQUFXO0lBQ2YsaUJBQU07Ozs7SUFOc0IsZUFBMEI7SUFBMUIsdUNBQTBCO0lBSUwsZUFBcUI7SUFBckIsbURBQXFCOzs7O0FEZDlFLE1BQU0sT0FBTyxrQkFBa0I7SUFnQjNCLFlBQStCLE1BQTBCO1FBVnpELGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBR3BDLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFHOUMscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUsxQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUTtJQUNSLENBQUM7SUFFTSxXQUFXO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRU0sa0JBQWtCLENBQUMsTUFBYztRQUNwQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxjQUFjLENBQUMsTUFBYztRQUNoQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7O29GQWpDUSxrQkFBa0IsdUJBZ0JQLFNBQVM7cUVBaEJwQixrQkFBa0I7O1FDVC9CLHNDQUFnQztRQU81Qiw0QkFBK0M7UUFDM0MseUJBQTRGO1FBQzVGLDhCQUFvRDtRQUFBLFlBQWE7UUFBQSxpQkFBTTtRQUMzRSxpQkFBSTtRQUVKLCtCQUFtQztRQUMvQixrQkFBeUI7UUFDN0IsaUJBQU87UUFFUCw4QkFBMEI7UUFDdEIsMkNBQWdGO1FBQTVDLDZIQUFnQiw4QkFBMEIsSUFBQztRQUFDLGlCQUFtQjtRQUNuRyxtRUFPTTtRQUNWLGlCQUFNO1FBQ1YsaUJBQWM7O1FBcEJnQixlQUFvQjtRQUFwQix1REFBb0I7UUFFVSxlQUFhO1FBQWIsaUNBQWE7UUFRL0MsZUFBaUI7UUFBakIsK0JBQWlCO1FBQzdCLGVBQXFCO1FBQXJCLDBDQUFxQjs7dUZEVHRCLGtCQUFrQjtjQUw5QixTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFdBQVcsRUFBRSw2QkFBNkI7Z0JBQzFDLFNBQVMsRUFBRSxDQUFDLDZCQUE2QixDQUFDO2FBQzdDOztzQkFpQmdCLE1BQU07dUJBQUMsU0FBUzt3QkFiN0IsT0FBTztrQkFETixLQUFLO1lBSU4sU0FBUztrQkFEUixNQUFNO1lBSVAsZ0JBQWdCO2tCQURmLE1BQU07WUFJUCxnQkFBZ0I7a0JBRGYsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTW9kQ29uZmlnIH0gZnJvbSAnLi4vLi4vc3RhdGljL21vZC1jb25maWcuY29uc3QnO1xyXG5pbXBvcnQgeyBNb2RGcmFtZXdvcmtDb25maWcgfSBmcm9tICcuLi8uLi9tb2RlbHMvbW9kLWZyYW1ld29yay1jb25maWcubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ21vZC1oZWFkZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9tb2QtaGVhZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9tb2QtaGVhZGVyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTW9kSGVhZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIEBJbnB1dCgpXG4gICAgYXBwTmFtZTogc3RyaW5nO1xuXG4gICAgQE91dHB1dCgpXG4gICAgbWVudUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICB1c2VyT3B0aW9uU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBoZWxwT3B0aW9uU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICBwdWJsaWMgY29uZmlnOiBNb2RGcmFtZXdvcmtDb25maWc7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KE1vZENvbmZpZykgY29uZmlnOiBNb2RGcmFtZXdvcmtDb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTWVudUNsaWNrKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1lbnVDbGljay5lbWl0KCk7XHJcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Vc2VyT3B0aW9uU2VsZWN0KG9wdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXNlck9wdGlvblNlbGVjdC5lbWl0KG9wdGlvbik7XHJcbiAgICB9XG5cbiAgICBwdWJsaWMgb3B0aW9uU2VsZWN0ZWQob3B0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oZWxwT3B0aW9uU2VsZWN0LmVtaXQob3B0aW9uKTtcclxuICAgIH1cbn1cbiIsIjxtYXQtdG9vbGJhciBjbGFzcz1cIm1vZC1oZWFkZXJcIj5cclxuICAgIDwhLS08YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwib25NZW51Q2xpY2soKVwiPlxyXG4gICAgICAgIDxtYXQtaWNvbj5cclxuICAgICAgICAgICAgbWVudVxyXG4gICAgICAgIDwvbWF0LWljb24+XHJcbiAgICA8L2J1dHRvbj4tLT5cclxuXHJcbiAgICA8YSBjbGFzcz1cImxvZ28tdGV4dC1tYXJrXCIgW3JvdXRlckxpbmtdPVwiWycvJ11cIj5cclxuICAgICAgICA8aW1nIGNsYXNzPVwibW9kLWxvZ29cIiBzcmM9XCIvYXNzZXRzL1VTLU9mZmljZU9mTWFuYWdlbWVudEFuZEJ1ZGdldC1TZWFsLnBuZ1wiIHRhYmluZGV4PVwiLTFcIiAvPlxyXG4gICAgICAgIDxkaXYgdGFiaW5kZXg9XCItMVwiIGFsdD1cIlRleHRtYXJrXCIgY2xhc3M9XCJ0ZXh0LW1hcmtcIj57eyBhcHBOYW1lIH19PC9kaXY+XHJcbiAgICA8L2E+XHJcblxyXG4gICAgPHNwYW4gY2xhc3M9XCJmaWxsLXJlbWFpbmluZy1zcGFjZVwiPlxyXG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuICAgIDwvc3Bhbj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwid2VsY29tZS11c2VyXCI+XHJcbiAgICAgICAgPG1vZC11c2VyLWRpc3BsYXkgW3Nob3dVc2VyXT1cInRydWVcIiAoc2VsZWN0T3B0aW9uKT1cIm9uVXNlck9wdGlvblNlbGVjdCgkZXZlbnQpXCI+PC9tb2QtdXNlci1kaXNwbGF5PlxyXG4gICAgICAgIDxkaXYgKm5nSWY9XCJjb25maWcuc2hvd0hlbHBcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gW21hdE1lbnVUcmlnZ2VyRm9yXT1cIm1lbnVcIiBhcmlhLWxhYmVsPVwiSGVscCBNZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8bWF0LWljb24+aGVscDwvbWF0LWljb24+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8bWF0LW1lbnUgI21lbnU9XCJtYXRNZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1tZW51LWl0ZW0gKm5nRm9yPVwibGV0IG9wdGlvbiBvZiBjb25maWcuaGVscE9wdGlvbnNcIiAoY2xpY2spPVwib3B0aW9uU2VsZWN0ZWQob3B0aW9uKVwiPnt7IG9wdGlvbiB9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L21hdC1tZW51PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvbWF0LXRvb2xiYXI+XHJcbiJdfQ==