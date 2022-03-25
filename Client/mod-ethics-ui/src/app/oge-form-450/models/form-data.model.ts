
import { OgeForm450 } from '@shared/models/oge-form-450.model';
import { FormStatus } from '@shared/static/form-status.const';
import { Helper } from '@shared/static/helper.funcs';
import { Widget } from '@shared/models/widget.model';

export class FormData {
    form: OgeForm450 = new OgeForm450();
    forms: OgeForm450[] = [];

    daysDueWidget: Widget = new Widget();
    currentFilingWidget: Widget = new Widget();

    setStatus(): void {

        this.currentFilingWidget.text = this.form.formStatus;
        this.currentFilingWidget.title = this.form.year.toString();

        if (this.form.formStatus == FormStatus.NOT_STARTED) {
            this.currentFilingWidget.actionText = "click to start filing";
            this.currentFilingWidget.color = "danger";
        }
        else if (this.form.formStatus == FormStatus.SUBMITTED || this.form.formStatus == FormStatus.RE_SUBMITTED) {
            this.currentFilingWidget.actionText = "click to view";
            this.currentFilingWidget.color = "primary";
        }
        else if (this.form.formStatus == FormStatus.CERTIFIED) {
            this.currentFilingWidget.actionText = "click to view";
            this.currentFilingWidget.color = "success";
        }
        else if (this.form.formStatus == FormStatus.DRAFT) {
            this.currentFilingWidget.actionText = "click to edit";
            this.currentFilingWidget.color = "info";
        }
        else if (this.form.formStatus == FormStatus.MISSING_INFORMATION) {
            this.currentFilingWidget.actionText = "click to edit";
            this.currentFilingWidget.color = "warning";
        }
        else {
            this.currentFilingWidget.actionText = "click to view";
            this.currentFilingWidget.color = "danger";
        }


        if (this.form.formStatus == FormStatus.CERTIFIED || this.form.formStatus == FormStatus.SUBMITTED || this.form.formStatus == FormStatus.RE_SUBMITTED || this.form.formStatus == FormStatus.CANCELED) {
            this.daysDueWidget.visible = false;
        } else {
            this.daysDueWidget.text = "due on " + Helper.formatDate(new Date(this.form.dueDate));
            this.daysDueWidget.actionText = "click to request extension";

            var dueDate = new Date(this.form.dueDate);
            var today = new Date();
            if (dueDate < today) {
                this.daysDueWidget.title = "Overdue";
                this.daysDueWidget.color = "danger";
            }
            else {
                var days = Helper.daysBetween(today, dueDate);

                if (days > 14) {
                    this.daysDueWidget.color = "info";
                }
                else {
                    this.daysDueWidget.color = "warning";
                }

                this.daysDueWidget.title = days.toString() + " days";
            }
        }
    }
}
