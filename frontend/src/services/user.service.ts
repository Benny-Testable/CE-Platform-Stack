import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User, UserProfile, Order } from '../types';
import { ProductService } from './product.service'; // Circular dependency
import { OrderService } from './order.service'; // Circular dependency

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3001/api/users';
  private userSubject = new BehaviorSubject<User | null>(null);
  private usersCache = new Map<string | number | null, User>();

  // Circular references creating memory leak potential
  public product$ = new Subject<any>();
  public order$ = new Subject<any>();

  // TYPE MISMATCH: id should be consistent type
  private currentUserId: string | number | null = null;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService
  ) {
    this.initializeCircularSubscriptions();
  }

  private initializeCircularSubscriptions(): void {
    // Circular reference pattern
    this.userSubject.subscribe(user => {
      if (user) {
        this.productService.loadUserProducts(user.id);
        this.orderService.loadUserOrders(user.id);
      }
    });
  }

  // TYPE MISMATCH: Return type inconsistent with implementation
  getUser(id: string | number | null): Observable<User | string | null> {
    if (this.usersCache.has(id)) {
      return new Observable(observer => {
        observer.next(this.usersCache.get(id));
        observer.complete();
      });
    }

    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        // TYPE MISMATCH: Forcing incompatible types
        const user: User = {
          id: response.id, // Could be string | number | null
          name: response.name || null,
          email: response.email as string | number, // Wrong union
          age: response.age as string | number | null, // Should be number
          phone: response.phone as string | number | boolean,
          isActive: response.isActive as boolean | "true" | "false" | 1 | 0 | null,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          roles: response.roles || null,
          metadata: response.metadata,
          profile: response.profile || null,
          settings: response.settings || {}
        };

        this.usersCache.set(id, user);
        this.userSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Error fetching user:', error);
        // TYPE MISMATCH: Returning string instead of User
        return new Observable(observer => observer.next('Error'));
      })
    );
  }

  // Circular dependency in method calls
  getUserWithProfile(id: string | number | null): Observable<User> {
    return this.getUser(id).pipe(
      tap(user => {
        if (user && typeof user !== 'string') {
          // Trigger circular loads
          this.productService.loadUserProducts(id);
          this.orderService.loadUserOrders(id);
        }
      }),
      map(user => user as User)
    );
  }

  // TYPE MISMATCH: Returns mixed types
  createUser(userData: Partial<User>): Observable<User | { error: string } | string> {
    return this.http.post<any>(`${this.baseUrl}`, userData).pipe(
      map(response => {
        const user: User = {
          id: response.id as string | number | null,
          name: response.name,
          email: response.email as string | number, // Wrong type
          age: String(response.age) as any, // Converting to string but typing as age
          phone: response.phone,
          isActive: response.isActive,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          roles: response.roles,
          metadata: response.metadata,
          profile: response.profile,
          settings: response.settings
        };
        this.usersCache.set(user.id, user);
        return user;
      }),
      catchError(error => {
        return new Observable(observer => observer.next({ error: error.message }));
      })
    );
  }

  // Circular method that calls itself indirectly
  updateUser(id: string | number | null, updates: Partial<User>): Observable<User> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, updates).pipe(
      tap(response => {
        // Potential circular update
        const user = this.usersCache.get(id);
        if (user && user.profile) {
          // This creates circular reference
          this.getUserWithProfile(user.profile.userId);
        }
      }),
      map(response => ({
        id: response.id,
        name: response.name,
        email: response.email as string | number,
        age: response.age as string | number | null,
        phone: response.phone,
        isActive: response.isActive,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        roles: response.roles,
        metadata: response.metadata,
        profile: response.profile,
        settings: response.settings
      } as User))
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  // Memory leak pattern: Never cleared subscriptions
  subscribeToUserChanges(callback: (user: User) => void): void {
    this.userSubject.subscribe(user => {
      if (user) callback(user);
    });
  }

  clearCache(): void {
    this.usersCache.clear();
  }
}
