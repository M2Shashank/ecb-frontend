import {products} from '../data/products.js';
import {addListenersToProductCard} from './components/productCard.js';
import {inWishlist} from '../data/wishList.js';

function renderProducts() {
    let productsHTML = ``;

    products.forEach((product) => {
        const {images, name, priceRs, afterPriceRs, sku} = product;
        const discount = (((priceRs - afterPriceRs)/priceRs)*100).toFixed(0);

        let wishlistImage = '';
        if(inWishlist(sku)) {
            wishlistImage = "assets/main-assets/heartFilled_icon.svg";
        }else {
            wishlistImage = "assets/main-assets/heartEmpty_icon.svg";
        }

        productsHTML += `
        <div class="product-card">
            <div class="product-img-wrapper">
              <div class="img-relative-wrapper js-img-relative-wrapper" data-product-sku="${sku}">
                <div class="product-images-wrapper js-product-images-wrapper">
                    ${images.map(image => `
                        <img class="product-img js-product-img" src="${image}" alt="img">
                    `).join('')}
                </div>
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
                <span class="new-amount">Rs.${afterPriceRs}</span>
              </ins>
            </div>
            <div class="wishlist-icon" data-product-sku="${sku}">
              <img class="heart-icon js-wishlist-heart-icon" src="${wishlistImage}" alt="w">
            </div>
            <div class="discount-alert">
              SAVE ${discount}%
            </div>
        </div>
        `
    });

    document.querySelector('.js-products-grid')
        .innerHTML = productsHTML;

    addListenersToProductCard();
}

renderProducts();