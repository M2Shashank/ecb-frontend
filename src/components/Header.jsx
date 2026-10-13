import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import { asset } from '../utils/assets'

function Header({ cartQuantity }) {
  const [search, setSearch] = useState('')

  return (
    <header className="site-header">
      <nav className="header-grid" aria-label="Main navigation">
        <div className="menu-list">
          {['WOMEN', 'MEN', 'ACCESSORIES'].map((item) => (
            <a className="menu-list-item" href="/" key={item}>{item}</a>
          ))}
        </div>
        <Link className="header-logo-link" to="/" aria-label="Bonkers Corner home">
          <img className="website-logo" src={asset('header-assets/Bonkers_Websitelogo.png')} alt="Bonkers Corner" />
        </Link>
        <div className="user-icons-container">
          <form className="search-box-container" onSubmit={(event) => event.preventDefault()}>
            <input
              className="search-box"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              aria-label="Search products"
            />
            <button className="search-button" type="submit" aria-label="Search">
              <img className="search-icon" src={asset('header-assets/search-icon.jpg')} alt="" />
            </button>
          </form>
          <div className="user-icons">
            {[
              ['profile-icon.png', 'Profile'],
              ['wishlist-icon.png', 'Wishlist'],
              ['store-icon.png', 'Store locator'],
            ].map(([icon, label]) => (
              <button className="header-icon-button" type="button" key={label} aria-label={label}>
                <img src={asset(`header-assets/${icon}`)} alt="" />
              </button>
            ))}
            <Link className="cart-icon-container" to="/cart" aria-label={`Cart, ${cartQuantity} items`}>
              <img src={asset('header-assets/cart-icon.png')} alt="" />
              <span className="cart-items-count">{cartQuantity}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
