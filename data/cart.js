import {products} from '../data/products.js';

export let cart = JSON.parse(localStorage.getItem('cart')) || [
    {
        cartItemSku: 4,
        quantity: 1,
        size: 'L'
    }, {
        cartItemSku: 4,
        quantity: 1,
        size: 'M'
    }
];

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productSku, size) {
    let matchingItem = undefined;
    cart.forEach((cartItem) => {
        if(cartItem.cartItemSku === productSku && cartItem.size === size) {
            matchingItem = cartItem;
        }
    });

    if(matchingItem) {
        matchingItem.quantity += 1;
    }else {
        cart.push({
            cartItemSku: productSku,
            quantity: 1,
            size: size
        });
    }

    saveToStorage();
}

export function removeFromCart(sku, size) {
    let newCart = [];

    cart.forEach(cartItem => {
        if(cartItem.cartItemSku === sku && cartItem.size === size) {
            if(cartItem.quantity === 1) return;

            cartItem.quantity -= 1;
        }

        newCart.push(cartItem);
    })

    cart = newCart;
    saveToStorage();
}

export function getCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    })
    return cartQuantity;
}

export function getCartValue() {
    let cartCost = 0;
    cart.forEach((cartItem) => {
        const product = products.find(product => product.sku === cartItem.cartItemSku);

        cartCost += cartItem.quantity * product.afterPriceRs;
    })
    return cartCost.toFixed(2);
}