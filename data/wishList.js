import {products} from './products.js';
export let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [{
    productSku: 11
}];

function saveToStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

export function inWishlist(sku) {
    const item = wishlist.find(item => item.productSku === sku)
    return Boolean(item);
}

export function modifyWishlist(productSku) {
    const product = products.find(product => product.sku === productSku);

    if(inWishlist(product.sku)) {
        const newList = [];
        wishlist.forEach(item => {
            if(item.productSku === productSku) {
                return;
            }

            newList.push(item);
        })
        wishlist = newList;
        console.log('removed from wishlist');
    }else {
        wishlist.push({
            productSku: productSku,
        });
        console.log('Added to wishlist');
    }

    saveToStorage();
    console.log(wishlist);
}