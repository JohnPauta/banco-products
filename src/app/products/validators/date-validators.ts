// src/app/products/validators/date-validators.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function releaseDateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const release = new Date(control.value);
    return release >= today ? null : { releaseDateInvalid: true };
}

export function revisionDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) return null;
    const release = new Date(control.parent.get('date_release')?.value);
    const revision = new Date(control.value);
    const expected = new Date(release);
    expected.setFullYear(expected.getFullYear() + 1);
    return revision.getTime() === expected.getTime() ? null : { revisionDateInvalid: true };
}
