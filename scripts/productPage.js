import {products, getSimilarProducts} from '../data/products.js';
import {sizeChart} from '../data/sizeChart.js';
import {inWishlist, modifyWishlist} from '../data/wishList.js';
import {addToCart, getCartQuantity} from '../data/cart.js';
import {recentlyViewedProducts as viewedProducts} from '../data/recentlyViewed.js';
import {addListenersToProductCard} from './components/productCard.js';

const urlParams = new URLSearchParams(window.location.search);
const sku = Number(urlParams.get('productSku'));
let selectedSize = undefined;
let selectedImage = undefined;
let scrollInterval;

function sizeSectionHTML(category, availableSizes) {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    if(!selectedSize) {
        selectedSize = availableSizes[0];
    }
    const measurements = sizeChart[category][selectedSize];
    const measurementType = category === 'Shirt' ? 'CHEST' : 'WAIST';

    const measurementValue = category === 'Shirt'
        ? measurements.chest
        : measurements.waist;

    const icon = category === 'Shirt'
        ? `
            <svg class="shirt-icon" width="18" height="18"
                 viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 4L3 7L5 12L8 10.5V20H16V10.5L19 12L21 7L15.5 4C14.7 5.2 13.5 6 12 6C10.5 6 9.3 5.2 8.5 4Z"
                      stroke="#484F56"
                      stroke-width="1.3"
                      stroke-linejoin="round"/>
            </svg>
        `
        : `
            <svg class="shirt-icon" width="18" height="18"
            viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4H17L18.5 20H13L12 11L11 20H5.5L7 4Z"
                    stroke="#484F56"
                    stroke-width="1.3"
                    stroke-linejoin="round"/>
                <path d="M7 4H17"
                    stroke="#484F56"
                    stroke-width="1.3"
                    stroke-linecap="round"/>
                <path d="M12 4V11"
                    stroke="#484F56"
                    stroke-width="1.3"
                    stroke-linecap="round"/>
            </svg>
        `;

    const sizeButtons = sizes.map(size => {
        const isAvailable = availableSizes.includes(size);
        const isSelected = size === selectedSize;

        return `
            <button
                class="size-button${!isAvailable ? ' unavailable' : ''}${isSelected ? ' selected' : ''}"
                type="button" data-size="${size}"
            >
                ${size}
            </button>
        `;
    }).join('');

    return `
        <div class="size-section">
            <div class="size-info">
                <span class="size-label">
                    SIZE:
                    <span class="selected-size">
                        ${selectedSize}
                    </span>
                </span>
                <div class="measurements">
                    ${icon}
                    <span>
                        <b>${measurementType}</b>
                        ${measurementValue} INCHES
                    </span>
                    <span class="separator"></span>
                    <span>
                        <b>LENGTH</b>
                        ${measurements.length} INCHES
                    </span>
                </div>

            </div>
            <div class="size-grid">
                ${sizeButtons}
            </div>
        </div>
    `;
}

function renderProductDetails() {
    const product = products.find(product => product.sku === sku);
    const {images, name, priceRs, afterPriceRs, availableSizes} = product;
    const discount = Math.round((priceRs - afterPriceRs)/priceRs * 100);

    if(!selectedImage) {
        selectedImage = images[0];
    }

    let wishlistImage = '';
    if(inWishlist(sku)) {
        wishlistImage = "assets/main-assets/heartFilled_icon.svg";
    }else {
        wishlistImage = "assets/main-assets/heartEmpty_icon.svg";
    }

    const productContentHTML = `
      <div class="image-section">
        <div class="thumbnail-wrapper">
            <button class="thumbnail-button up-button js-up-button" type="button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 7L15 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <div class="thumbnail-container js-thumbnail-container">
                ${images.map((image) => {
                    return `<img class="thumbnail js-thumbnail" src="${image}" alt="img">`
                }).join('\n')}
            </div>

            <button class="thumbnail-button down-button js-down-button" type="button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 8L10 13L15 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <div class="main-image-container">
            <img class="main-display-image js-main-display-image" src=${selectedImage}>
        </div>
      </div>

      <div class="information-section">
        <div class="display-product-details-section">
            <div class="display-product-container">
                <div class="display-product-name">
                    ${name}
                </div>
                <div class="display-wishlist-icon js-display-wishlist-icon">
                    <img class="display-heart-icon js-display-heart-icon" src="${wishlistImage}" alt="w">
                </div>
            </div>
            <div class="display-product-price">
                <del class="display-original-price">
                  <span class="display-old-amount">
                    Rs.${priceRs}
                  </span>
                </del>
                <ins class="display-discounted-price">
                  <span class="display-new-amount">
                    Rs.${afterPriceRs}
                  </span>
                </ins>
                <div class="display-discount-alert">
                  SAVE ${discount}%
                </div>
            </div>
        </div>

        ${sizeSectionHTML(product.category, availableSizes)}

        <div class="final-buttons-section">
            <button class="add-to-cart-button js-add-to-cart-button">
                ADD TO CART
            </button>
            <button class="buy-it-now-button">
                BUY IT NOW
            </button>
        </div>

        <div class="product-description">
            <p>
              ${product.description}
            </p>
        </div>

        <div class="product-information">
            <p>
                <span>
                    <b>Composition:</b> ${product.composition} </br>
                </span>
                    <b>GSM:</b> ${product.gsm} </br>
                </span>
                <span>
                    <b>Color:</b> ${product.color} </br>
                </span>
                <span>
                    <b>Country of production:</b> India </br>
                </span>
                <span>
                    <b>Wash care:</b>
                    Machine wash cold with similar colors. </br>
                    Only non-chlorine. </br>
                    Tumble dry low. </br>
                    Warm Iron if needed. </br>
                </span>
                <span>
                    <b>Sizing:</b> Garment measurement in inches. </br>
                </span>
                <span>
                    Estimated order processing time: 48hours. </br>
                </span>
            </p>
        </div>
      </div>
    `

    document.querySelector('.js-product-content-container')
        .innerHTML = productContentHTML;

    document.querySelector('.js-page-product-name')
        .innerHTML = name;

    addListenersToProductPage();
}

function addListenersToProductPage() {
    document.querySelector('.js-display-wishlist-icon')
        .addEventListener('click', () => {
            modifyWishlist(sku);

            let imagePath = '';
            if(inWishlist(sku)) {
                imagePath = "assets/main-assets/heartFilled_icon.svg";
            }else {
                imagePath = "assets/main-assets/heartEmpty_icon.svg";
            }

            document.querySelector('.js-display-heart-icon')
                .setAttribute('src', imagePath);
        });

    document.querySelectorAll('.js-thumbnail')
        .forEach((image) => {
            image.addEventListener('click', () => {
                selectedImage = image.src;

                document.querySelector('.js-main-display-image')
                    .setAttribute('src', image.src);
            })
        });

    document.querySelectorAll('.size-button')
        .forEach((button) => {
            button.addEventListener('click', () => {
                if (button.classList.contains('unavailable')) {
                    return;
                }

                selectedSize = button.dataset.size;

                renderProductDetails();
            });
        });

    addListenersToScroll();
}

function addListenersToScroll() {
    function startScrolling(direction) {
        const container = document.querySelector('.thumbnail-container');

        scrollInterval = setInterval(() => {
            container.scrollBy({
                top: direction * 2,
                behavior: 'auto'
            });
        }, 5);
    }

    function stopScrolling() {
        clearInterval(scrollInterval);
    }

    document.querySelector('.js-add-to-cart-button')
        .addEventListener('click', () => {
            addToCart(sku, selectedSize);

            const cartQuantity = getCartQuantity();
            document.querySelector('.cart-items-count')
                .innerHTML = cartQuantity;
        })

    document.querySelector('.up-button').addEventListener('mousedown', () => {
        startScrolling(-1);
    });

    document.querySelector('.down-button').addEventListener('mousedown', () => {
        startScrolling(1);
    });

    document.querySelector('.up-button').addEventListener('mouseup', stopScrolling);
    document.querySelector('.down-button').addEventListener('mouseup', stopScrolling);

    document.querySelector('.up-button').addEventListener('mouseleave', stopScrolling);
    document.querySelector('.down-button').addEventListener('mouseleave', stopScrolling);
}

renderProductDetails();


function renderList(productList) {
    let viewedProductsHTML = ``;
    productList.forEach((product) => {
        const {sku, images, name, priceRs, afterPriceRs} = product;
        const discount = (((priceRs - afterPriceRs)/priceRs)*100).toFixed(0);

        let wishlistImage = '';
        if(inWishlist(sku)) {
            wishlistImage = "../assets/main-assets/heartFilled_icon.svg";
        }else {
            wishlistImage = "../assets/main-assets/heartEmpty_icon.svg";
        }

        viewedProductsHTML += `
        <div class="product-card">
            <div class="product-img-wrapper">
              <div class="img-relative-wrapper js-img-relative-wrapper" data-product-sku="${sku}">
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
              <img class="heart-icon js-wishlist-heart-icon" src="${wishlistImage}" alt="w">
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
    const product = products.find(p => p.sku === sku);
    const similarProducts = getSimilarProducts(product);
    const visitedProducts = viewedProducts.map((item) => {
        const product = products.find(product => product.sku === item.itemSku);
        return product;
    })

    const viewedHTML = `
    <div class="recomendations-row related-products">
        <div class="recomended-heading">
            YOU MAY ALSO LIKE
        </div>
        <div class="related-product-cards">
            ${renderList(similarProducts)}
        </div>
    </div>

    <div class="recomendations-row recently-viewed">
        <div class="recomended-heading">
            Recently viewed products
        </div>
        <div class="related-product-cards">
            ${renderList(visitedProducts)}
        </div>
	</div>
    `

    document.querySelector('.js-recomendations')
        .innerHTML = viewedHTML;

    addListenersToProductCard();
}

renderSuggestions();