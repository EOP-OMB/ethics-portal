
import { EventRequestFormComponent } from "../components/event-request-form/event-request-form.component";

export class PreventUnsavedChangesGuard  {
    canDeactivate(component: EventRequestFormComponent) {
        var override = localStorage.getItem('dirtyOvervide') ? localStorage.getItem('dirtyOvervide') == "1" : false;

        if (component.canSave() && !override && component.isDirty()) {
            $('#confirm-close').modal();
            return false;
        }

        return true;
    }
}
