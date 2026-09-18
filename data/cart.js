export const cart = [{
    productSku: 4,
    quantity: 1
}];

export function addToCart(productSku) {
    let matchingItem = undefined;
    cart.forEach((cartItem) => {
        if(cartItem.productSku === productSku) {
            matchingItem = cartItem;
        }
    });

    if(matchingItem) {
        matchingItem.quantity += 1;
    }else {
        cart.push({
            productSku: productSku,
            quantity: 1
        });
    }
}

export function getCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    })
    return cartQuantity;
}