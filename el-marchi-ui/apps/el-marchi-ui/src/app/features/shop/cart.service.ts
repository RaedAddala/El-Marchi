import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Cart, CartItemAdd, StripeSession } from './cart.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  platformId = inject(PLATFORM_ID);
  http = inject(HttpClient);

  private keyCartStorage = 'cart';
  private keySessionId = 'stripe-session-id';

  private addedToCart$ = new BehaviorSubject<Array<CartItemAdd>>([]);
  addedToCart = this.addedToCart$.asObservable();

  constructor() {
    const cartFromLocalStorage = this.getCartFromLocalStorage();
    this.addedToCart$.next(cartFromLocalStorage);
  }

  private getCartFromLocalStorage(): Array<CartItemAdd> {
    const cartProducts = localStorage.getItem(this.keyCartStorage);
    if (cartProducts) {
      return JSON.parse(cartProducts) as CartItemAdd[];
    } else {
      return [];
    }
  }


  addToCart(publicId: string, command: 'add' | 'remove'): void {
      const itemToAdd: CartItemAdd = { publicId, quantity: 1 };
      const cartFromLocalStorage = this.getCartFromLocalStorage();
      if (cartFromLocalStorage.length !== 0) {
        const productExist = cartFromLocalStorage.find(
          (item) => item.publicId === publicId
        );
        if (productExist) {
          if (command === 'add') {
            productExist.quantity++;
          } else if (command === 'remove') {
            productExist.quantity--;
          }
        } else {
          cartFromLocalStorage.push(itemToAdd);
        }
      } else {
        cartFromLocalStorage.push(itemToAdd);
      }
      localStorage.setItem(
        this.keyCartStorage,
        JSON.stringify(cartFromLocalStorage)
      );
      this.addedToCart$.next(cartFromLocalStorage);

  }

  removeFromCart(publicId: string): void {
      const cartFromLocalStorage = this.getCartFromLocalStorage();
      const productExist = cartFromLocalStorage.find(
        (item) => item.publicId === publicId
      );
      if (productExist) {
        cartFromLocalStorage.splice(
          cartFromLocalStorage.indexOf(productExist),
          1
        );
        localStorage.setItem(
          this.keyCartStorage,
          JSON.stringify(cartFromLocalStorage)
        );
        this.addedToCart$.next(cartFromLocalStorage);
      }

  }

  getCartDetail(): Observable<Cart> {
    const cartFromLocalStorage = this.getCartFromLocalStorage();
    const publicIdsForURL = cartFromLocalStorage.reduce(
      (acc, item) => `${acc}${acc.length > 0 ? ',' : ''}${item.publicId}`,
      ''
    );
    return this.http
      .get<Cart>(`${environment.apiUrl}/orders/get-cart-details`, {
        params: { productIds: publicIdsForURL },
      })
      .pipe(map((cart) => this.mapQuantity(cart, cartFromLocalStorage)));
  }

  private mapQuantity(
    cart: Cart,
    cartFromLocalStorage: Array<CartItemAdd>
  ): Cart {
    for (const cartItem of cartFromLocalStorage) {
      const foundProduct = cart.products.find(
        (item) => item.publicId === cartItem.publicId
      );
      if (foundProduct) {
        foundProduct.quantity = cartItem.quantity;
      }
    }
    return cart;
  }

  initPaymentSession(cart: Array<CartItemAdd>): Observable<StripeSession> {
    return this.http.post<StripeSession>(
      `${environment.apiUrl}/orders/init-payment`,
      cart
    );
  }

  storeSessionId(sessionId: string) {
      localStorage.setItem(this.keySessionId, sessionId);

  }

  getSessionId(): string {
      const stripeSessionId = localStorage.getItem(this.keySessionId);
      if (stripeSessionId) {
        return stripeSessionId;
      }

    return '';
  }

  deleteSessionId(): void {
      localStorage.removeItem(this.keySessionId);

  }

  clearCart() {
      localStorage.removeItem(this.keyCartStorage);
      this.addedToCart$.next([]);

  }
}
