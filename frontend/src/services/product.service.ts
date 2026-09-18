import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { Product, Category, ProductVariant } from '../types';
import { UserService } from './user.service'; // Circular dependency
import { OrderService } from './order.service'; // Circular dependency

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3001/api/products';
  private productsCache = new ReplaySubject<Product[]>(1);
  private categoriesCache = new Map<string | number | null, Category>();

  // Circular dependencies
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private orderService: OrderService
  ) {}

  // TYPE MISMATCH: Product.name can be string | null | 0 | false
  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      map(items => items.map(item => ({
        id: item.id as string | number | null,
        name: item.name as string | null | 0 | false, // TYPE MISMATCH
        price: item.price as string | number | null | undefined,
        quantity: item.quantity as number | string | null, // TYPE MISMATCH
        description: item.description,
        manufacturer: item.manufacturer,
        categories: item.categories,
        tags: item.tags,
        variants: item.variants,
        metadata: item.metadata,
        inventory: item.inventory
      } as Product))),
      shareReplay(1)
    );
  }

  // TYPE MISMATCH: Returns mixed types
  getProduct(id: string | number | null): Observable<Product | null | string> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        const product: Product = {
          id: response.id,
          name: response.name as string | null | 0 | false,
          price: response.price as string | number | null | undefined,
          quantity: String(response.quantity) as any, // Converting to string
          description: response.description,
          manufacturer: response.manufacturer,
          categories: response.categories,
          tags: response.tags,
          variants: response.variants,
          metadata: response.metadata,
          inventory: response.inventory
        };
        return product;
      }),
      catchError(error => {
        console.error('Product error:', error);
        // TYPE MISMATCH: Returning string instead of Product
        return new Observable(observer => observer.next('Not found'));
      }),
      shareReplay(1)
    );
  }

  // Circular method calling back to user/order services
  loadUserProducts(userId: string | number | null): void {
    this.http.get<Product[]>(`${this.baseUrl}?userId=${userId}`).subscribe(
      products => {
        // Circular call - triggers user service update
        this.productsCache.next(products);
        this.userService.getCurrentUser().subscribe(user => {
          if (user) {
            // This creates a circular reference pattern
            this.orderService.loadUserOrders(user.id);
          }
        });
      }
    );
  }

  // Deep nesting with type mismatches
  getProductVariants(productId: string | number | null): Observable<ProductVariant[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${productId}/variants`).pipe(
      map(variants => variants.map(v => ({
        id: v.id as string | number | null,
        productId: productId,
        product: null,
        sku: v.sku as string | null | number,
        size: v.size as string | null | number | boolean, // TYPE MISMATCH
        color: v.color,
        weight: v.weight as number | string | null,
        price: v.price as string | number | null | undefined,
        stock: v.stock as number | string | null
      } as ProductVariant)))
    );
  }

  // Self-referential category loading
  getCategories(parentId?: string | number | null): Observable<Category[]> {
    const url = parentId ? `${this.baseUrl}/categories?parent=${parentId}` : `${this.baseUrl}/categories`;
    return this.http.get<any[]>(url).pipe(
      map(categories => categories.map(cat => ({
        id: cat.id as string | number | null,
        name: cat.name,
        parent: cat.parent as Category | null, // Circular self-reference
        children: cat.children as Category[] | null, // Circular self-reference
        products: cat.products,
        metadata: cat.metadata
      } as Category))),
      shareReplay(1)
    );
  }

  // Potential infinite loop in recursive category fetch
  getCategoryTree(categoryId: string | number | null): Observable<Category> {
    return this.getCategories(categoryId).pipe(
      map(cats => {
        if (cats.length > 0) {
          const cat = cats[0];
          // Recursive call without proper termination condition
          if (cat.children && cat.children.length > 0) {
            cat.children.forEach(child => {
              // This could cause infinite recursion
              this.getCategoryTree(child.id).subscribe();
            });
          }
          return cat;
        }
        return null as any;
      })
    );
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<any>(`${this.baseUrl}`, productData).pipe(
      map(response => ({
        id: response.id,
        name: response.name as string | null | 0 | false,
        price: response.price as string | number | null | undefined,
        quantity: response.quantity as number | string | null,
        description: response.description,
        manufacturer: response.manufacturer,
        categories: response.categories,
        tags: response.tags,
        variants: response.variants,
        metadata: response.metadata,
        inventory: response.inventory
      } as Product))
    );
  }
}
