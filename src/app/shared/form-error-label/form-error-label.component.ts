import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
})
export class FormErrorLabelComponent {

  //TODO AbstractControl envia todo el objeto del formulario, incluso los errores
  control = input.required<AbstractControl>()


  get errorMessage() {
    const errors:ValidationErrors = this.control().errors || {}

    //TODO si el campo está tocado y hay errores
    return this.control().touched && Object.keys(errors).length > 0
    //TODO obtener el mensaje de error
      ? FormUtils.getTextError(errors)
    //TODO o el objeto vacío
      : null;
  }
}
