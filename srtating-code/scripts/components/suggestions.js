import {products, getSimilarProducts} from '../../data/products.js';
import {genProductCard} from './productCard.js';
import {recentlyViewedProducts as viewedProducts} from '../../data/recentlyViewed.js';

function renderList(productList) {
    let viewedProductsHTML = ``;
    productList.forEach((product) => {
        viewedProductsHTML += genProductCard(product, false);
    });
    return viewedProductsHTML;
}

export function genRecomendations(product) {
    const similarProducts = getSimilarProducts(product);

    return renderList(similarProducts);
}

export function genRecentlyViewed() {
    const visitedProducts = viewedProducts.map((item) => {
        const product = products.find(product => product.sku === item.itemSku);
        return product;
    })

    return renderList(visitedProducts);
}