function renderProducts() {
    let productsHTML = ``;

    products.forEach((product) => {
        const {images, name, priceRs, discount, sku} = product;
        const afterPrice = (Math.trunc(priceRs - (discount*priceRs)/100)).toFixed(2);
        productsHTML += `
        <div class="product-card">
            <div class="product-img-wrapper">
              <div class="img-relative-wrapper">
                <img class="product-img" src="${images[0]}" alt="img">
                <button class="addtocart-button js-addtocart-button" data-product-sku="${sku}">
                  ADD TO CART
                </button>
                <button class="scroll-right-button">
                  <svg class="arrow-head" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8L14 12L10 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="scroll-left-button">
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
            <div class="wishlist-icon">
              <img class="heart-icon" src="assets/main-assets/heartEmpty_icon.svg" alt="w">
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

document.querySelectorAll('.js-addtocart-button')
    .forEach((button) => {
        button.addEventListener('click', () => {
            let matchingItem = undefined;
            cart.forEach((cartItem) => {
                if(cartItem.productSku === button.dataset.productSku) {
                    matchingItem = cartItem;
                }
            });

            if(matchingItem) {
                matchingItem.quantity += 1;
            }else {
                cart.push({
                    productSku: button.dataset.productSku,
                    quantity: 1
                });
            }
        });
    });
