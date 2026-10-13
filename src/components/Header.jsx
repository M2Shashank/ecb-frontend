import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import { asset } from '../utils/assets'
import { getAuthenticatedUser, isAuthenticated, logoutUser, subscribeAuth } from '../utils/auth'
import { useSyncExternalStore } from 'react'

function Header({ cartQuantity }) {
  const [search, setSearch] = useState('')
  const [showLoginNotice, setShowLoginNotice] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const authenticated = useSyncExternalStore(subscribeAuth, isAuthenticated, () => false)
  const user = getAuthenticatedUser()
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

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
            {authenticated ? (
              <div className="profile-menu">
                <button className="profile-initials" type="button" onClick={() => setShowAccountMenu(!showAccountMenu)} aria-label="Open account menu">
                  {initials}
                </button>
                {showAccountMenu && (
                  <div className="account-menu">
                    <span className="account-menu-user">{user?.username || user?.email || 'Signed in'}</span>
                    <button type="button" onClick={async () => {
                      try {
                        await logoutUser()
                        setShowAccountMenu(false)
                        window.location.reload()
                      } catch (error) {
                        setLogoutError(error.message)
                      }
                    }}>LOG OUT</button>
                    {logoutError && <span className="account-menu-error">{logoutError}</span>}
                  </div>
                )}
              </div>
            ) : (
              <Link className="header-icon-button" to="/auth" aria-label="Profile">
                <img src={asset('header-assets/profile-icon.png')} alt="" />
              </Link>
            )}
            {[
              ['wishlist-icon.png', 'Wishlist'],
              ['store-icon.png', 'Store locator'],
            ].map(([icon, label]) => (
              <button className="header-icon-button" type="button" key={label} aria-label={label}>
                <img src={asset(`header-assets/${icon}`)} alt="" />
              </button>
            ))}
            <Link
              className="cart-icon-container"
              to="/cart"
              onClick={(event) => {
                if (!authenticated) {
                  event.preventDefault()
                  setShowLoginNotice(true)
                }
              }}
              aria-label={`Cart, ${cartQuantity} items`}
            >
              <img src={asset('header-assets/cart-icon.png')} alt="" />
              <span className="cart-items-count">{cartQuantity}</span>
            </Link>
          </div>
        </div>
      </nav>
      {showLoginNotice && (
        <div className="cart-login-notice" role="alert">
          <span>Please log in to view your cart.</span>
          <button type="button" onClick={() => setShowLoginNotice(false)} aria-label="Close notification">×</button>
        </div>
      )}
    </header>
  )
}

export default Header
