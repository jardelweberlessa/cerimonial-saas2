import '../styles/globals.css'
import Nav from '../components/Nav'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 container py-6">
        <Component {...pageProps} />
      </main>
      <footer className="py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Cerimonial SaaS (MVP)</footer>
    </div>
  )
}
