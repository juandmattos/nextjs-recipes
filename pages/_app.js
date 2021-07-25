// This page is our entire app
import Link from 'next/link'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <nav className='header'>
        <div>
          <Link href='/'>
            <a>JD's Kitchen 🍍</a>
          </Link>
        </div>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
