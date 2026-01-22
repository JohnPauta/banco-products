import { ProductController } from "./ProductControllers";
import { BadRequestError, NotFoundError } from "routing-controllers";

describe("ProductController", () => {
    let controller: ProductController;

    beforeEach(() => {
        controller = new ProductController();
        controller["products"] = [
            {
                id: "abc",
                name: "Test",
                description: "Desc",
                logo: "logo.png",
                date_release: new Date(),
                date_revision: new Date(),
            },
        ];
    });

    //Test del metodo getAll
    it("should return paginated products", () => {
        controller["products"] = Array.from({ length: 10 }, (_, i) => ({
            id: `p${i}`,
            name: `Product ${i}`,
            description: "Desc",
            logo: "logo.png",
            date_release: new Date(),
            date_revision: new Date(),
        }));
        const result = controller.getAll({ page: 2, size: 5 });
        expect(result.items.length).toBe(5);
        expect(result.total).toBe(10);
    });

    //Test del metodo search
    it("should filter products by search term", () => {
        controller["products"] = [
            {
                id: "visa",
                name: "Visa Card",
                description: "Credit",
                logo: "",
                date_release: new Date(),
                date_revision: new Date(),
            },
            {
                id: "master",
                name: "MasterCard",
                description: "Debit",
                logo: "",
                date_release: new Date(),
                date_revision: new Date(),
            },
        ];
        const result = controller.search({ term: "visa" });
        expect(result.items.length).toBe(1);
    });

    //Test del metodo verifyIdentifier
    it("should verify identifier existence", () => {
        controller["products"] = [
            {
                id: "abc",
                name: "",
                description: "",
                logo: "",
                date_release: new Date(),
                date_revision: new Date(),
            },
        ];
        expect(controller.verifyIdentifier("abc")).toBe(true);
        expect(controller.verifyIdentifier("xyz")).toBe(false);
    });

    //Test del metodo createItem
    it('should create a new product', () => {
        const dto = {
            id: 'new',
            name: 'Nuevo',
            description: 'Desc',
            logo: 'logo.png',
            date_release: '2026-01-21',
            date_revision: '2027-01-21',
        };
        const result = controller.createItem(dto);
        expect(result.message).toContain('added');
    });

    it('should throw error for duplicate ID', () => {
        controller['products'] = [{ id: 'dup', name: '', description: '', logo: '', date_release: new Date(), date_revision: new Date() }];
        const dto = { ...controller['products'][0], date_release: '2026-01-21', date_revision: '2027-01-21' };
        expect(() => controller.createItem(dto)).toThrow(BadRequestError);
    });

    //Test del metodo put
    it('should update existing product', () => {
        controller['products'] = [{ id: 'upd', name: 'Old', description: '', logo: '', date_release: new Date(), date_revision: new Date() }];
        const updated = { ...controller['products'][0], name: 'Updated' };
        const result = controller.put('upd', updated);
        expect(result.data.name).toBe('Updated');
    });

    it('should throw error if product not found for update', () => {
        expect(() => controller.put('missing', {} as any)).toThrow(NotFoundError);
    });

    //Test del metodo remove
    it('should remove product by id', () => {
        controller['products'] = [{ id: 'del', name: '', description: '', logo: '', date_release: new Date(), date_revision: new Date() }];
        const result = controller.remove('del');
        expect(result.message).toContain('removed');
        expect(controller['products'].length).toBe(0);
    });

    it('should throw error if product not found for deletion', () => {
        expect(() => controller.remove('missing')).toThrow(NotFoundError);
    });

    //Test del metodo findIndex
    it('should find correct index', () => {
        controller['products'] = [{ id: 'findme', name: '', description: '', logo: '', date_release: new Date(), date_revision: new Date() }];
        expect(controller['findIndex']('findme')).toBe(0);
        expect(controller['findIndex']('missing')).toBe(-1);
    });

    
});
