import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../cart.service';
import { AuthService } from '../../../auth/auth.service';
import { CartItem, CartItemAdd, StripeSession } from '../../cart.model';
import { RouterLink } from '@angular/router';
import { ToastService } from '@shared/toast/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  cart: Array<CartItem> = [];
  labelCheckout = 'Login to checkout';
  action: 'login' | 'checkout' = 'login';
  isInitPaymentSessionLoading = false;
  isLoadingCart = false; // Loading state for cart data

  constructor() {
    this.checkUserLoggedIn();
  }

  ngOnInit(): void {
    this.loadCart();
    this.subscribeToCartUpdates(); // Subscribe to cart updates
  }

  // Load cart data from the server
  private loadCart() {
    this.isLoadingCart = true;
    this.cartService.getCartDetail().subscribe({
      next: cart => {
        this.cart = cart.products;
        this.isLoadingCart = false;
      },
      error: () => {
        this.toastService.show('Failed to load cart data', 'ERROR');
        this.isLoadingCart = false;
      },
    });
  }

  // Subscribe to cart updates from the service
  private subscribeToCartUpdates() {
    this.cartService.addedToCart.subscribe(() => {
      this.loadCart(); // Reload cart data when the cart is updated
    });
  }

  // Check if the user is logged in
  private checkUserLoggedIn() {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.labelCheckout = 'Login to checkout';
        this.action = 'login';
      } else {
        this.labelCheckout = 'Checkout';
        this.action = 'checkout';
      }
    });
  }

  // Add quantity to a cart item
  addQuantityToCart(publicId: string) {
    this.cartService.addToCart(publicId, 'add');
  }

  // Remove quantity from a cart item
  removeQuantityToCart(publicId: string, quantity: number) {
    if (quantity > 1) {
      this.cartService.addToCart(publicId, 'remove');
    }
  }

  // Remove an item from the cart
  removeItem(publicId: string) {
    this.cartService.removeFromCart(publicId);
  }

  // Compute the total price of the cart
  computeTotal() {
    return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  // Check if the cart is empty
  checkIfEmptyCart(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return this.cart.length === 0;
    } else {
      return false;
    }
  }

  // Handle checkout
  checkout() {
    if (this.action === 'login') {
      this.authService.login({ email: '', password: '' }); // Provide valid credentials
    } else if (this.action === 'checkout') {
      this.isInitPaymentSessionLoading = true;
      const cartItemsAdd = this.cart.map(
        item =>
          ({ publicId: item.publicId, quantity: item.quantity } as CartItemAdd),
      );

      this.cartService.initPaymentSession(cartItemsAdd).subscribe({
        next: sessionId => this.onSessionCreateSuccess(sessionId),
        error: () => {
          this.isInitPaymentSessionLoading = false;
          this.toastService.show('Failed to initiate payment session', 'ERROR');
        },
      });
    }
  }

  // Handle successful payment session creation
  private onSessionCreateSuccess(sessionId: StripeSession) {
    this.cartService.storeSessionId(sessionId.id);
    this.isInitPaymentSessionLoading = false;
    // Uncomment and configure Stripe integration if needed
    /*this.stripeService
      .redirectToCheckout({ sessionId: sessionId.id })
      .subscribe((results) => {
        this.isInitPaymentSessionLoading = false;
        this.toastService.show(`Order error ${results.error.message}`, 'ERROR');
      });*/
  }
}
