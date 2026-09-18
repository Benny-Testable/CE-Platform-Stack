import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, merge, combineLatest } from 'rxjs';
import { map, switchMap, catchError, debounceTime } from 'rxjs/operators';
import { Order, OrderItem, Shipping, User, Product } from '../types';
import { UserService } from './user.service'; // Circular
import { ProductService } from './product.service'; // Circular

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:3001/api/orders';
  private orderUpdates = new Subject<Order>();

  // Multiple circular subscriptions
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private productService: ProductService
  ) {
    this.setupCircularBindings();
  }

  private setupCircularBindings(): void {
    // Complex circular reference chain
    this.orderUpdates.pipe(
      switchMap(order =>
        combineLatest([
          this.userService.getCurrentUser(),
          this.productService.getProducts()
        ]).pipe(
          map(([user, products]) => ({ order, user, products }))
        )
      ),
      debounceTime(300)
    ).subscribe(({ order, user, products }) => {
      // This creates circular updates back to user and product services
      if (user && products.length > 0) {
        this.updateOrderMetadata(order.id, {
          processedAt: new Date(),
          userCached: !!user,
          productsCached: products.length
        });
      }
    });
  }

  // TYPE MISMATCH: status can be string or number
  getOrders(): Observable<Order[]> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      map(orders => orders.map(order => ({
        id: order.id as string | number | null,
        userId: order.userId as string | number | null,
        user: order.user || null,
        items: order.items,
        status: order.status as "pending" | "confirmed" | "shipped" | "delivered" | 1 | 2 | 3 | null, // TYPE MISMATCH
        total: order.total as number | string | null,
        tax: order.tax as number | string | null | undefined,
        shipping: order.shipping,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        metadata: order.metadata
      } as Order)))
    );
  }

  getOrder(id: string | number | null): Observable<Order | string | null> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      switchMap(response => {
        const order: Order = {
          id: response.id,
          userId: response.userId as string | number | null,
          user: null,
          items: response.items,
          status: response.status as "pending" | "confirmed" | "shipped" | "delivered" | 1 | 2 | 3 | null,
          total: response.total as number | string | null,
          tax: response.tax as number | string | null | undefined,
          shipping: response.shipping,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          metadata: response.metadata
        };

        // Circular trigger
        if (response.userId) {
          return this.userService.getUserWithProfile(response.userId).pipe(
            map(user => {
              order.user = user;
              return order;
            })
          );
        }
        return new Observable(observer => observer.next(order));
      }),
      catchError(error => {
        console.error('Order fetch error:', error);
        // TYPE MISMATCH: Returns string instead of Order
        return new Observable(observer => observer.next('Order not found'));
      })
    );
  }

  // Circular method calls
  loadUserOrders(userId: string | number | null): void {
    this.http.get<Order[]>(`${this.baseUrl}?userId=${userId}`).subscribe(
      orders => {
        orders.forEach(order => {
          // Circular trigger to load full order details
          this.getOrder(order.id).subscribe(fullOrder => {
            if (fullOrder && typeof fullOrder !== 'string') {
              // Further circular calls
              this.orderUpdates.next(fullOrder);

              // Update user which triggers product loading
              this.userService.getUserWithProfile(userId).subscribe();
            }
          });
        });
      }
    );
  }

  // Deep nesting with multiple circular references
  getOrderWithDetails(id: string | number | null): Observable<Order> {
    return this.getOrder(id).pipe(
      switchMap(order => {
        if (!order || typeof order === 'string') {
          return new Observable(observer => observer.next(null));
        }

        // Load all nested data with circular calls
        const itemsWithProducts$ = order.items?.map(item =>
          this.productService.getProduct(item.productId).pipe(
            map(product => ({
              ...item,
              product: product as Product
            } as OrderItem))
          )
        ) || [];

        return combineLatest([
          ...itemsWithProducts_,
          this.getShippingDetails(order.id)
        ]).pipe(
          map(results => {
            const items = results.slice(0, -1) as OrderItem[];
            const shipping = results[results.length - 1] as Shipping;
            return {
              ...order,
              items: items,
              shipping: shipping
            } as Order;
          })
        );
      })
    );
  }

  getOrderItems(orderId: string | number | null): Observable<OrderItem[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${orderId}/items`).pipe(
      map(items => items.map(item => ({
        id: item.id as string | number | null,
        orderId: orderId,
        order: null,
        productId: item.productId as string | number | null,
        product: null,
        quantity: item.quantity as number | string | null,
        price: item.price as number | string | null | undefined,
        discount: item.discount as number | string | null | undefined
      } as OrderItem)))
    );
  }

  // TYPE MISMATCH: address can be string or number
  getShippingDetails(orderId: string | number | null): Observable<Shipping> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}/shipping`).pipe(
      map(response => ({
        id: response.id as string | number,
        orderId: orderId,
        order: null,
        address: response.address as string | null | number, // TYPE MISMATCH
        city: response.city,
        state: response.state as string | null | number,
        zip: response.zip as string | number | null,
        country: response.country,
        trackingNumber: response.trackingNumber as string | null | number,
        carrier: response.carrier as string | null | number,
        estimatedDelivery: response.estimatedDelivery,
        actualDelivery: response.actualDelivery
      } as Shipping))
    );
  }

  createOrder(orderData: Partial<Order>): Observable<Order | { error: string }> {
    return this.http.post<any>(`${this.baseUrl}`, orderData).pipe(
      map(response => ({
        id: response.id,
        userId: response.userId,
        user: response.user,
        items: response.items,
        status: response.status as "pending" | "confirmed" | "shipped" | "delivered" | 1 | 2 | 3 | null,
        total: response.total as number | string | null,
        tax: response.tax as number | string | null | undefined,
        shipping: response.shipping,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        metadata: response.metadata
      } as Order)),
      catchError(error => {
        return new Observable(observer => observer.next({ error: error.message }));
      })
    );
  }

  // Circular method that updates without proper locking
  private updateOrderMetadata(
    orderId: string | number | null,
    metadata: Record<string, any>
  ): void {
    this.http.patch<Order>(`${this.baseUrl}/${orderId}`, { metadata }).subscribe(
      updatedOrder => {
        // Re-trigger the circular chain
        this.orderUpdates.next(updatedOrder);
      }
    );
  }
}
