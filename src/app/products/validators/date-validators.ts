import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Convierte un string en formato yyyy-MM-dd a un objeto Date local,
 * evitando problemas de zona horaria.
 */
function parseLocalDate(value: string): Date {
    if (!value) return new Date(NaN);
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day); // mes es base 0
}

/**
 * Validador para la fecha de liberación:
 * Debe ser igual o mayor a la fecha actual.
 */
export function releaseDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const today = new Date();
    const release = parseLocalDate(control.value);

    // Normalizar ambas fechas a medianoche
    today.setHours(0, 0, 0, 0);

    return release.getTime() >= today.getTime() ? null : { releaseDateInvalid: true };
}

/**
 * Validador para la fecha de revisión:
 * Debe ser exactamente un año después de la fecha de liberación.
 */
export function revisionDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.parent || !control.value) return null;

    const release = parseLocalDate(control.parent.get('date_release')?.value);
    const revision = parseLocalDate(control.value);

    // Calcular fecha esperada (exactamente un año después)
    const expected = new Date(release);
    expected.setFullYear(expected.getFullYear() + 1);

    return revision.getTime() === expected.getTime() ? null : { revisionDateInvalid: true };
}
