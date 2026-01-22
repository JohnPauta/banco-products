import {
    IsString,
    IsNotEmpty,
    Length,
    IsDateString,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsRevisionOneYearLater', async: false })
export class IsRevisionOneYearLaterConstraint implements ValidatorConstraintInterface {
    validate(date_revision: string, args: ValidationArguments) {
        const object: any = args.object;
        const release = new Date(object.date_release);
        const revision = new Date(date_revision);

        // Fecha esperada = fecha de liberación + 1 año
        const expected = new Date(release);
        expected.setFullYear(expected.getFullYear() + 1);

        // Comparar solo YYYY-MM-DD
        return revision.toISOString().slice(0, 10) === expected.toISOString().slice(0, 10);
    }

    defaultMessage(args: ValidationArguments) {
        return 'La fecha de revisión debe ser exactamente un año después de la fecha de liberación.';
    }
}

@ValidatorConstraint({ name: 'IsReleaseNotPast', async: false })
export class IsReleaseNotPastConstraint implements ValidatorConstraintInterface {
    validate(date_release: string) {
        const release = new Date(date_release);
        const today = new Date();

        // Comparar solo YYYY-MM-DD
        return release.toISOString().slice(0, 10) >= today.toISOString().slice(0, 10);
    }

    defaultMessage(args: ValidationArguments) {
        return 'La fecha de liberación no puede ser anterior a hoy.';
    }
}

export class ProductDTO {
    @IsString()
    @Length(3, 10)
    id!: string;

    @IsString()
    @Length(5, 100)
    name!: string;

    @IsString()
    @Length(10, 200)
    description!: string;

    @IsString()
    @IsNotEmpty()
    logo!: string;

    @IsDateString()
    @Validate(IsReleaseNotPastConstraint)
    date_release!: string;

    @IsDateString()
    @Validate(IsRevisionOneYearLaterConstraint)
    date_revision!: string;
}
