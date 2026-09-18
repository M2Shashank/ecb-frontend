function renderFooter() {
    const footerHTML = `
    <div class="footer-row-1">
        <div class="social-media-links">
          <div class="website-logo-white-container">
            <img class="website-logo-white" src="assets/footer-assets/Websitelogo_white.webp" alt="logo">
          </div>
          <div class="social-media-icons-list">
            <img class="link-item" src="assets/footer-assets/facebook-svgrepo-com.svg" alt="fb">
            <img class="link-item" src="assets/footer-assets/twitter-svgrepo-com.svg" alt="fb">
            <img class="link-item" src="assets/footer-assets/instagram-svgrepo-com.svg" alt="fb">
            <img class="link-item" src="assets/footer-assets/youtube-rounded-svgrepo-com.svg" alt="fb">
            <img class="link-item" src="assets/footer-assets/pinterest-svgrepo-com.svg" alt="fb">
          </div>
        </div>
        <div class="footer-list-container">
          <button class="main-button">SHOP</button>
          <ul class="footer-list">
            <li class="footer-list-item">
              <a href="/">BEST SELLERS</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Special Prices</a>
            </li>
            <li class="footer-list-item">
              <a href="/">SpongeBob</a>
            </li>
            <li class="footer-list-item">
              <a href="/">tokidoki</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Disney</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Marvel</a>
            </li>
            <li class="footer-list-item">
              <a href="/">NEW ARRIVALS</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Signature</a>
            </li>
          </ul>
        </div>
        <div class="footer-list-container">
          <button class="main-button">TRENDING</button>
          <ul class="footer-list">
            <li class="footer-list-item">
              <a href="/">ACOSTA Collection</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Anime Collection</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Oversized T-shirt</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Oversized Shirt</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Bottoms for Women</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Bottoms for Men</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Sweatshirts & Hoodies</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Jacket</a>
            </li>
          </ul>
        </div>
        <div class="footer-list-container">
          <button class="main-button">INFO</button>
          <ul class="footer-list">
            <li class="footer-list-item">
              <a href="/">Terms & Conditions</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Stores Near Me</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Blogs</a>
            </li>
            <li class="footer-list-item">
              <a href="/">FAQs</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Contact</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Privacy Policy</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Returns and Exchange Policy</a>
            </li>
            <li class="footer-list-item">
              <a href="/">Offers and Deals</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-row-2">
        <div class="experience-div">
          <img class="mobile-logo" src="assets/footer-assets/mobile-alt-1-svgrepo-com.svg" alt="M">
          EXPERIENCE THE BONKERS CORNER APP
        </div>
        <div class="app-links-container">
          <div class="google-play">
            <img class="app-links" src="assets/footer-assets/play-store.avif" alt="Play Store">
          </div>
          <div class="app-store">
            <img class="app-links" src="assets/footer-assets/app-store.webp" alt="App Store">
          </div>
        </div>
    </div>
    `

    document.querySelector('.footer-container')
        .innerHTML = footerHTML;
}

renderFooter();