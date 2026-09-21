import {addToCart, getCartQuantity} from '../../data/cart.js';
import {inWishlist, modifyWishlist} from '../../data/wishList.js';
import {addToRecentlyViewed} from '../../data/recentlyViewed.js';
import {products} from '../../data/products.js';

export function addListenersToProductCard() {
    document.querySelectorAll('.js-wishlist-heart-icon')
        .forEach((wishlistIcon) => {
            wishlistIcon.addEventListener('click', () => {
                const productSku = Number(wishlistIcon.parentElement.dataset.productSku);
                const product = products.find(product => product.sku === productSku);

                modifyWishlist(productSku);

                let imagePath = '';
                if(inWishlist(product.sku)) {
                    imagePath = "assets/main-assets/heartFilled_icon.svg";
                }else {
                    imagePath = "assets/main-assets/heartEmpty_icon.svg";
                }
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