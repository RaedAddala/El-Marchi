import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cart, CartItem, CartItemAdd, StripeSession } from './cart.model';
import { Product } from '@shared/models/product.model';
import { dummyProducts } from '../../dummyData/products';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'mock_cart';
  private readonly SESSION_KEY = 'mock_stripe_session';
  private readonly MOCK_DELAY = 300;

  private cartItems$ = new BehaviorSubject<CartItemAdd[]>([]);
  addedToCart = this.cartItems$.asObservable();

  constructor() {
    const savedCart = this.getStoredCart();
    if (savedCart) {
      this.cartItems$.next(savedCart);
    }
  }

  private getStoredCart(): CartItemAdd[] {
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCart(cart: CartItemAdd[]): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.cartItems$.next(cart);
  }

  private createCartItem(product: Product, quantity: number): CartItem {
    return {
      publicId: product.publicId,
      name: product.name,
      price: product.price,
      brand: product.brand,
      picture: product.pictures[0],
      quantity,
    };
  }

  addToCart(publicId: string, command: 'add' | 'remove'): void {
    const currentCart = this.getStoredCart();
    const product = dummyProducts.find(p => p.publicId === publicId);

    if (!product) return;

    const existingItem = currentCart.find(item => item.publicId === publicId);

    if (existingItem) {
      if (command === 'add' && existingItem.quantity < product.nbInStock) {
        existingItem.quantity++;
      } else if (command === 'remove' && existingItem.quantity > 1) {
        existingItem.quantity--;
      }
    } else if (command === 'add') {
      currentCart.push({ publicId, quantity: 1 });
    }

    this.saveCart(currentCart);
  }

  removeFromCart(publicId: string): void {
    const currentCart = this.getStoredCart();
    const updatedCart = currentCart.filter(item => item.publicId !== publicId);
    this.saveCart(updatedCart);
  }

  getCartDetail(): Observable<Cart> {
    const currentCart = this.getStoredCart();
    const cartItems: CartItem[] = currentCart
      .map(item => {
        const product = dummyProducts.find(p => p.publicId === item.publicId);
        if (!product) return null;
        return this.createCartItem(product, item.quantity);
      })
      .filter((item): item is CartItem => item !== null);

    return of({ products: cartItems }).pipe(delay(this.MOCK_DELAY));
  }

  initPaymentSession(cart: CartItemAdd[]): Observable<StripeSession> {
    const mockSession: StripeSession = {
      id: `mock_session_${Date.now()}`,
    };
    console.log('initPaymentSession', cart);
    return of(mockSession).pipe(delay(this.MOCK_DELAY));
  }

  storeSessionId(sessionId: string): void {
    sessionStorage.setItem(this.SESSION_KEY, sessionId);
  }

  getSessionId(): string {
    return sessionStorage.getItem(this.SESSION_KEY) || '';
  }

  deleteSessionId(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  clearCart(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.cartItems$.next([]);
  }

  // Helper methods for testing
  getMockStock(publicId: string): number {
    const product = dummyProducts.find(p => p.publicId === publicId);
    return product?.nbInStock ?? 0;
  }

  updateMockStock(publicId: string, newStock: number): void {
    const product = dummyProducts.find(p => p.publicId === publicId);
    if (product) {
      product.nbInStock = newStock;
    }
  }
}
