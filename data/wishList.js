export const wishlist = [];

export function getWishlistIndex(productSku) {
    let wishlistItemIndex = -1;
    wishlist.forEach((wishlistItem, index) => {
        if(wishlistItem.productSku === productSku) {
            wishlistItemIndex = index;
        }
    })
    return wishlistItemIndex;
}

export function addToWishlist(productSku) {
    const wishlistItemIndex = getWishlistIndex(productSku);

    if(wishlistItemIndex !== -1) {
        wishlist.splice(wishlistItemIndex, 1);
        console.log('removed from wishlist');
    }else {
        wishlist.push({
            productSku: productSku,
        });
        console.log('Added to wishlist');
    }
    console.log(wishlist);
}