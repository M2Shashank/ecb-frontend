import {products} from '../data/products.js';
import {addToCart, getCartQuantity} from '../data/cart.js';
import {addToWishlist, getWishlistIndex} from '../data/wishList.js';

function renderProducts() {
    let productsHTML = ``;

    products.forEach((product) => {
        const {images, name, priceRs, discount, sku} = product;
        const afterPrice = (Math.trunc(priceRs - (discount*priceRs)/100)).toFixed(2);
        productsHTML += `
        <div class="product-card">
            <div class="product-img-wrapper">
              <div class="img-relative-wrapper" data-product-sku="${sku}">
                <img class="product-img js-product-img" src="${images[0]}" alt="img">
                <button class="addtocart-button js-addtocart-button">
                  ADD TO CART
                </button>
                <button class="scroll-right-button js-scroll-right-button">
                  <svg class="arrow-head" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8L14 12L10 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="scroll-left-button js-scroll-left-button">
                  <svg class="arrow-head" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8L10 12L14 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
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
                <span class="new-amount">Rs.${afterPrice}</span>
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

    document.querySelector('.js-products-grid')
        .innerHTML = productsHTML;
}

renderProducts();

document.querySelectorAll('.js-wishlist-heart-icon')
    .forEach((wishlistIcon) => {
        wishlistIcon.addEventListener('click', () => {
            const productSku = wishlistIcon.parentElement.dataset.productSku;

            const wishlistItemIndex = getWishlistIndex(productSku);
            let imagePath = '';
            if(wishlistItemIndex !== -1) {
                imagePath = "assets/main-assets/heartEmpty_icon.svg";
            }else {
                imagePath = "assets/main-assets/heartFilled_icon.svg";
            }
            wishlistIcon.setAttribute('src', imagePath);

            addToWishlist(productSku);
        });
    });

document.querySelectorAll('.js-scroll-right-button')
    .forEach((rightButton) => {
        rightButton.addEventListener('click', () => {
            const productSku = Number(rightButton.parentElement.dataset.productSku);
            const product = products.find(product => product.sku === productSku);

            product.imageIndex += 1;
            if(product.imageIndex === product.images.length) {
                product.imageIndex = 0;
            }

            const image = rightButton.parentElement.querySelector('.js-product-img');
            image.setAttribute('src', product.images[product.imageIndex]);
        });
    });

document.querySelectorAll('.js-scroll-left-button')
    .forEach((leftButton) => {
        leftButton.addEventListener('click', () => {
            const productSku = Number(leftButton.parentElement.dataset.productSku);
            const product = products.find(product => product.sku === productSku);

            product.imageIndex -= 1;
            if(product.imageIndex === -1) {
                product.imageIndex = product.images.length - 1;
            }

            const image = leftButton.parentElement.querySelector('.js-product-img');
            image.setAttribute('src', product.images[product.imageIndex]);
        });
    });

document.querySelectorAll('.js-addtocart-button')
    .forEach((button) => {
        button.addEventListener('click', () => {
            const productSku = button.parentElement.dataset.productSku;
            addToCart();

            const cartQuantity = getCartQuantity();
            document.querySelector('.cart-items-count')
                .innerHTML = cartQuantity;
        });
    });
