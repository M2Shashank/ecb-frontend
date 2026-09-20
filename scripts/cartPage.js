import {recentlyViewedProducts as viewedProducts} from '../data/recentlyViewed.js';
import {products} from '../data/products.js';
import {cart, getCartValue, getCartQuantity, addToCart, removeFromCart} from '../data/cart.js';
import {addListenersToProductCard} from './components/productCard.js';


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

                document.querySelector('.js-cart-items-count').innerText = getCartQuantity();
            });
        });

    document.querySelectorAll('.js-plus-button')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const sku = Number(button.parentElement.dataset.sku);
                const size = button.parentElement.dataset.size;

                addToCart(sku, size);
                renderCartContent();

                document.querySelector('.js-cart-items-count').innerText = getCartQuantity();
            });
        });
}







function renderViewedList() {
    let viewedProductsHTML = ``;
    viewedProducts.forEach((sku) => {
        let product = products.find(product => product.sku === sku);

        const {images, name, priceRs, afterPriceRs} = product;
        const discount = (((priceRs - afterPriceRs)/priceRs)*100).toFixed(0);

        viewedProductsHTML += `
        <div class="product-card">
            <div class="product-img-wrapper">
              <div class="img-relative-wrapper" data-product-sku="${sku}">
                <div class="product-images-wrapper js-product-images-wrapper">
                    <img class="product-img js-product-img" src="${images[0]}" alt="img">
                </div>
                <button class="addtocart-button js-addtocart-button">
                  ADD TO CART
                </button>
              </div>
            </div>
            <div class="product-name">
              ${name.toUpperCase()}
            </div>
            <div class="product-price">
              <del class="original-price">
                <span class="old-amount">Rs.${(priceRs).toFixed(2)}</span>
              </del>
              <ins class="discounted-price">
                <span class="new-amount">Rs.${afterPriceRs}</span>
              </ins>
            </div>
            <div class="wishlist-icon" data-product-sku="${sku}">
              <img class="heart-icon js-wishlist-heart-icon" src="assets/main-assets/heartEmpty_icon.svg" alt="w">
              <!---
              <img class="heart-icon" src="assets/main-assets/heartFilled_icon.svg" alt="w">
              -->
            </div>
            <div class="discount-alert">
              SAVE ${discount}%
            </div>
        </div>
        `
    });
    return viewedProductsHTML;
}

function renderSuggestions() {
    const viewedHTML = `
    <div class="recently-viewed-heading">Recently viewed products</div>
    <div class="recently-viewed-products">
        ${renderViewedList()}
    </div>
    `;

    document.querySelector('.js-suggestions-container')
        .innerHTML = viewedHTML;

    addListenersToProductCard();
}

renderCartContent();
renderSuggestions();
