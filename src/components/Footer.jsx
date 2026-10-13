import './Footer.css'
import { asset } from '../utils/assets'
const footerGroups = {
  SHOP: ['BEST SELLERS', 'Special Prices', 'SpongeBob', 'tokidoki', 'Disney', 'Marvel', 'NEW ARRIVALS', 'Signature'],
  TRENDING: ['ACOSTA Collection', 'Anime Collection', 'Oversized T-shirt', 'Oversized Shirt', 'Bottoms for Women', 'Bottoms for Men', 'Sweatshirts & Hoodies', 'Jacket'],
  INFO: ['Terms & Conditions', 'Stores Near Me', 'Blogs', 'FAQs', 'Contact', 'Privacy Policy', 'Returns and Exchange Policy', 'Offers and Deals'],
}

function Footer() {
  const socialIcons = ['facebook-svgrepo-com.svg', 'twitter-svgrepo-com.svg', 'instagram-svgrepo-com.svg', 'youtube-rounded-svgrepo-com.svg', 'pinterest-svgrepo-com.svg']

  return (
    <footer className="site-footer">
      <div className="footer-row-1">
        <div className="social-media-links">
          <img className="website-logo-white" src={asset('footer-assets/Websitelogo_white.webp')} alt="Bonkers Corner" />
          <div className="social-media-icons-list">
            {socialIcons.map((icon) => <a href="/" key={icon} aria-label={icon.split('-')[0]}><img src={asset(`footer-assets/${icon}`)} alt="" /></a>)}
          </div>
        </div>
        {Object.entries(footerGroups).map(([title, links]) => (
          <div className="footer-list-container" key={title}>
            <h2 className="footer-heading">{title}</h2>
            <ul className="footer-list">
              {links.map((link) => <li className="footer-list-item" key={link}><a href="/">{link}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-row-2">
        <div className="experience-div">
          <img src={asset('footer-assets/mobile-alt-1-svgrepo-com.svg')} alt="" />
          EXPERIENCE THE BONKERS CORNER APP
        </div>
        <div className="app-links-container">
          <img src={asset('footer-assets/play-store.avif')} alt="Get it on Google Play" />
          <img src={asset('footer-assets/app-store.webp')} alt="Download on the App Store" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
