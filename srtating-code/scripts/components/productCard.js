import {addToCart, getCartQuantity} from '../../data/cart.js';
import {getWishlistIconPath, modifyWishlist} from '../../data/wishList.js';
import {addToRecentlyViewed} from '../../data/recentlyViewed.js';
import {products} from '../../data/products.js';

export function genProductCard(product, imagesPresent = true) {
    const {images, name, priceRs, afterPriceRs, sku} = product;
    const discount = (((priceRs - afterPriceRs)/priceRs)*100).toFixed(0);

    const wishlistImage = getWishlistIconPath(sku);

    const imagesHTML = imagesPresent 
        ? images.map(image => `
                <img class="product-img js-product-img" src="${image}" alt="img">
            `).join('')
        :  `<img class="product-img js-product-img" src="${images[0]}" alt="img"></img>`;

    const productCardHTML = `
        <div class="product-card">
          <div class="product-img-wrapper">
            <div class="img-relative-wrapper js-img-relative-wrapper" data-product-sku="${sku}">
                <div class="product-images-wrapper js-product-images-wrapper">
                    ${imagesHTML}
                </div>
                <button class="addtocart-button js-addtocart-button">
                    ADD TO CART
                </button>
                ${imagesPresent ?   `
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
                `   : ` `}
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
    return productCardHTML;
}

export function addListenersToProductCard() {
    document.querySelectorAll('.js-wishlist-heart-icon')
        .forEach((wishlistIcon) => {
            wishlistIcon.addEventListener('click', () => {
                const productSku = Number(wishlistIcon.parentElement.dataset.productSku);
                const product = products.find(product => product.sku === productSku);

                modifyWishlist(productSku);

                const imagePath = getWishlistIconPath(product.sku);
                wishlistIcon.setAttribute('src', imagePath);
            });
        });

    document.querySelectorAll('.js-scroll-right-button')
        .forEach((rightButton) => {
            rightButton.addEventListener('click', () => {
                const productSku = Number(rightButton.parentElement.dataset.productSku);
                const product = products.find(product => product.sku === productSku);

                product.imageIndex = Math.min(3, product.imageIndex + 1);

                const imagesWrapper =
                    rightButton.parentElement
                        .querySelector('.js-product-images-wrapper');

                imagesWrapper.style.transform =
                    `translateX(-${product.imageIndex * 100}%)`;
            });
        });

    document.querySelectorAll('.js-scroll-left-button')
        .forEach((leftButton) => {
            leftButton.addEventListener('click', () => {
                const productSku = Number(leftButton.parentElement.dataset.productSku);
                const product = products.find(product => product.sku === productSku);

                product.imageIndex = Math.max(0, product.imageIndex - 1);

                const imagesWrapper =
                    leftButton.parentElement
                        .querySelector('.js-product-images-wrapper');

                imagesWrapper.style.transform =
                    `translateX(-${product.imageIndex * 100}%)`;
            });
        });

    document.querySelectorAll('.js-addtocart-button')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const productSku = button.parentElement.dataset.productSku;
                const product = products.find(product => product.sku === Number(productSku));
                
                const size = product.availableSizes[0];
                addToCart(product.sku, size);

                const cartQuantity = getCartQuantity();
                document.querySelector('.cart-items-count')
                    .innerHTML = cartQuantity;
            });
        });

    document.querySelectorAll('.js-img-relative-wrapper')
    .forEach((element) => {
        element.addEventListener('click', (event) => {
            const productSku = element.dataset.productSku;
            if (
                event.target.closest('.js-addtocart-button') ||
                event.target.closest('.js-scroll-right-button') ||
                event.target.closest('.js-scroll-left-button')
            ) {
                return;
            }

            addToRecentlyViewed(productSku);

            window.open(
                `product.html?productSku=${productSku}`, '_blank'
            );
        });
    });
}