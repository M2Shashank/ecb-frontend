import {products} from '../data/products.js';
import {addListenersToProductCard, genProductCard} from './components/productCard.js';

function renderProducts() {
    let productsHTML = ``;

    products.forEach((product) => {
        productsHTML += genProductCard(product);
    });

    document.querySelector('.js-products-grid')
        .innerHTML = productsHTML;

    addListenersToProductCard();
}

renderProducts();