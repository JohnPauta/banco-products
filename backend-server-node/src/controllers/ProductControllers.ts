import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  QueryParams,
  NotFoundError,
  BadRequestError,
} from "routing-controllers";
import { ProductDTO } from "../dto/Product";
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";
import * as fs from "fs";

const FILE = "./products.json";

function loadProducts(): ProductInterface[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function saveProducts(products: ProductInterface[]) {
  fs.writeFileSync(FILE, JSON.stringify(products, null, 2));
}

function normalizeProduct(product: ProductInterface): ProductInterface {
  return {
    ...product,
    id: product.id?.trim(),
    name: product.name?.trim(),
    description: product.description?.trim(),
    logo: product.logo?.trim(),
    date_release: new Date(product.date_release),
    date_revision: new Date(product.date_revision),
  };
}

@JsonController("/products")
export class ProductController {
  products: ProductInterface[] = loadProducts().map(normalizeProduct);

  @Get("")
  getAll(@QueryParams() query: any) {
    const page = parseInt(query.page) || 1;
    const size = parseInt(query.size) || 5;
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedItems = this.products.slice(start, end);
    return { items: paginatedItems, total: this.products.length };
  }

  @Get("/search")
  search(@QueryParams() query: any) {
    const term = (query.term || "").toLowerCase();
    const page = parseInt(query.page) || 1;
    const size = parseInt(query.size) || 5;
    const start = (page - 1) * size;
    const end = start + size;

    const filtered = this.products.filter(
      (p) =>
        p.id.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );

    const paginatedItems = filtered.slice(start, end);

    return {
      items: paginatedItems,
      total: filtered.length,
    };
  }

  @Get("/verification/:id")
  verifyIdentifier(@Param("id") id: number | string) {
    const cleanId = String(id).trim();
    return this.products.some((product) => product.id === cleanId);
  }

  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const cleanId = String(id).trim();
    const index = this.findIndex(cleanId);

    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return this.products[index];
  }

  @Post("") createItem(@Body({ validate: true }) productItem: ProductDTO) {
    const cleanProduct: ProductInterface = normalizeProduct({
      id: productItem.id,
      name: productItem.name,
      description: productItem.description,
      logo: productItem.logo,
      date_release: new Date(productItem.date_release),
      date_revision: new Date(productItem.date_revision),
    });
    const index = this.findIndex(cleanProduct.id);
    if (index !== -1) {
      throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
    }
    this.products.push(cleanProduct);
    saveProducts(this.products);
    return { message: "Product added successfully", data: cleanProduct };
  }

  @Put("/:id")
  put(@Param("id") id: number | string, @Body() productItem: ProductInterface) {
    const cleanId = String(id).trim();
    const index = this.findIndex(cleanId);

    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    const updatedProduct = normalizeProduct({
      ...this.products[index],
      ...productItem,
      id: cleanId, // aseguramos que el id quede limpio
    });

    this.products[index] = updatedProduct;
    saveProducts(this.products);

    return {
      message: "Product updated successfully",
      data: updatedProduct,
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const cleanId = String(id).trim();
    const index = this.findIndex(cleanId);

    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    this.products = this.products.filter((product) => product.id !== cleanId);
    saveProducts(this.products);
    return {
      message: "Product removed successfully",
    };
  }

  private findIndex(id: number | string) {
    const cleanId = String(id).trim();
    return this.products.findIndex((product) => product.id === cleanId);
  }
}
