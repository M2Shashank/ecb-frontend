import {getCartQuantity} from '../../data/cart.js';

function renderHeader() {
    let headerHTML = `
	<div class="header-grid">
		<div class="menu-list"> 
		<div class="menu-list-item"> WOMEN </div>
		<div class="menu-list-item"> MEN </div>
		<div class="menu-list-item"> ACCESSORIES </div>
		</div>
		<div class="website-logo-container">
		<img class="website-logo" src="assets/header-assets/Bonkers_Websitelogo.png" alt="Logo">
		</div>
		<div class="user-icons-container">
		<div class="search-box-container">
			<input class="search-box" type="text" placeholder="Search...">
			<img class="search-icon" src="assets/header-assets/search-icon.jpg" alt="find">
		</div>
		<div class="user-icons">
			<div class="profile-icon-container">
			<img class="profile-icon-header" src="assets/header-assets/profile-icon.png" alt="icon">
			</div>
			<div class="wishlist-icon-container">
			<img class="wishlist-icon-header" src="assets/header-assets/wishlist-icon.png" alt="wishlist">
			</div>
			<div class="store-icon-container">
			<img class="store-icon-header" src="assets/header-assets/store-icon.png" alt="storelocator">
			</div>
			<div class="cart-icon-container">
				<a class="cart-page-link" href="cart.html" target="_blank">
					<img class="cart-icon-header" src="assets/header-assets/cart-icon.png" alt="cart">
					<span class="cart-items-count js-cart-items-count">
						${getCartQuantity()}
					</span>
				</a>
			</div>
		</div>
		</div>
	</div>
    `

    document.querySelector('.header-container')
        .innerHTML = headerHTML;
}

renderHeader();