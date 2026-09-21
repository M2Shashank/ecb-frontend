export const recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [{
    itemSku: 9
}, {
    itemSku: 11
}];

function loadToStorage() {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewedProducts));
}

export function addToRecentlyViewed(productSku) {
    const l = Math.min(3, recentlyViewedProducts.length);
    for(let i = 0; i < l; i++) {
        if(recentlyViewedProducts[i].itemSku === Number(productSku)) {
            return;
        }
    }

    recentlyViewedProducts.unshift({
        itemSku: Number(productSku)
    })

    while(recentlyViewedProducts.length > 4) {
        recentlyViewedProducts.pop();
    }

    loadToStorage();
}