
import { FormViewComponent } from "../views/form-view/form-view.component";

export class PreventUnsavedChangesGuard  {
    canDeactivate(component: FormViewComponent) {
        var override = localStorage.getItem('dirtyOvervide') ? localStorage.getItem('dirtyOvervide') == "1" : false;

        if (component.ogeForm450 && component.ogeForm450.canSave() && !override && component.ogeForm450.isDirty()) {
            $('#confirm-close').modal();
            return false;
        }

        return true;
    }
}
