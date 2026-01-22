import { ProductEdit } from './product-edit';

describe('ProductEdit Component', () => {
  let component: ProductEdit;

  beforeEach(() => {
    component = new ProductEdit({} as any, {} as any, {} as any, {} as any);
  });

  it('formatDate should return yyyy-MM-dd', () => {
    const result = component['formatDate']('2026-01-21T00:00:00.000Z');
    expect(result).toBe('2026-01-21');
  });

  it('toLocalISO should return ISO string', () => {
    const result = component['toLocalISO']('2026-01-21');
    expect(result).toContain('2026-01-21T');
  });

  it('onReset should clear the form', () => {
    component.form = { reset: jest.fn() } as any;
    component.onReset();
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('onBack should navigate to products list', () => {
    const mockRouter = { navigate: jest.fn() };
    component['router'] = mockRouter as any;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('onSubmit should mark form as touched if invalid', () => {
    component.form = {
      valid: false,
      markAllAsTouched: jest.fn(),
      get: jest.fn().mockReturnValue({ value: '' }),
    } as any;
    component.onSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });
});
