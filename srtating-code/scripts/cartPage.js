import { products } from '../data/products.js';
import {cart, getCartValue, getCartQuantity, addToCart, removeFromCart} from '../data/cart.js';
import {addListenersToProductCard} from './components/productCard.js';
import {genRecentlyViewed} from './components/suggestions.js'

function renderCartItems()  {
    let cartItemsHTML = ``;

    cart.forEach((cartItem) => {
        const {cartItemSku, size, quantity} = cartItem;
        const product = products.find(product => product.sku === cartItemSku);
        const {images, name, gender, afterPriceRs} = product;

        cartItemsHTML += `
        <div class="cart-item">
            <div class="item-description">
            <div class="item-image-container">
                <img class="item-image" src="${images[0]}" alt="img">
            </div>
            <div class="item-details">
                <span class="item-name">${name}</span>
                <span class="item-gender">
                <span class="item-detail-type">GENDER:</span>
                ${gender}
                </span>
                <span class="item-size">
                <span class="item-detail-type">SIZE:</span>
                ${size}
                </span>
            </div>
            </div>
            <div class="item-quantity-box">
            <div class="item-quantity-div" data-sku=${cartItemSku} data-size=${size}>
                <button class="decrement-button js-minus-button">&minus;</button>
                ${quantity}
                <button class="increment-button js-plus-button">&plus;</button>
            </div>
            </div>
            <div class="item-total-price">
            &#x20B9;${(quantity * afterPriceRs).toFixed(2)}
            </div>
        </div>
        `
    });

    return cartItemsHTML;
}

function renderCartContent() {
    const cartListHTML = `
        <div class="columns-description">
          <div class="item-quantity-heading">QUANTITY</div>
          <div class="item-cost-heading">TOTAL</div>
        </div>

        <div class="cart-items-content">
            ${renderCartItems()}
        </div>

        <div class="cart-table-final-row">
            <div class="checkout-container">
            <div class="subtotal-container">
                <span class="cart-subtotal-title">SUBTOTAL</span>
                <span class="cart-subtotal-amount">
                    &#x20B9; ${getCartValue()}
                </span>
            </div>
            <div class="other-information">Shipping, taxes, and discount codes calulated at checkout</div>
            <div class="checkout-button-container">
                <button class="checkout-button">Check out</button>
            </div>
            </div>
        </div>
    `

    document.querySelector('.js-cart-items-table')
        .innerHTML = cartListHTML;

    setListenersToCartItem();
}


function setListenersToCartItem() {
    document.querySelectorAll('.js-minus-button')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const sku = Number(button.parentElement.dataset.sku);
                const size = button.parentElement.dataset.size;

                removeFromCart(sku, size);
                renderCartContent();

                document.querySelector('.js-header-cart-items-count').innerText = getCartQuantity();
            });
        });

    document.querySelectorAll('.js-plus-button')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const sku = Number(button.parentElement.dataset.sku);
                const size = button.parentElement.dataset.size;

                addToCart(sku, size);
                renderCartContent();

                document.querySelector('.js-header-cart-items-count').innerText = getCartQuantity();
            });
        });
}

function renderSuggestions() {
    const viewedHTML = `
    <div class="recently-viewed-heading">Recently viewed products</div>
    <div class="recently-viewed-products">
        ${genRecentlyViewed()}
    </div>
    `;

    document.querySelector('.js-suggestions-container')
        .innerHTML = viewedHTML;

    addListenersToProductCard();
}

renderCartContent();
renderSuggestions();