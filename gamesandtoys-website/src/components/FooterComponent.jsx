function Footer() {
    return (
      <footer className="bg-[#0d0d0d] text-white mt-12 border-t border-orange-600">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 text-center md:text-start gap-8">
          {/* Brand & Info */}
          <div>
            <h2 className="text-2xl font-bold text-orange-500 mb-2">GamesAndToys</h2>
            <p className="text-gray-400">
              © {new Date().getFullYear()} Games&Toys. <br/>Tutti i diritti riservati.
            </p>
          </div>
  
          {/* Social Links */}
          <div>
            <h3 className="text-orange-400 text-lg font-semibold mb-2">Seguici</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition">Facebook</a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition">Twitter</a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition">Instagram</a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition">GitHub</a>
              </li>
            </ul>
          </div>
  
          {/* Contact & Links */}
          <div>
            <h3 className="text-orange-400 text-lg font-semibold mb-2">Contatti</h3>
            <p className="text-gray-400 text-sm">Email: support@myapp.com</p>
            <p className="text-gray-400 text-sm">Tel: +39 0123 456789</p>
            <div className="mt-4 space-x-4">
              <a href="/terms" className="text-sm hover:text-orange-500 transition">Eventi</a>
              <a href="/privacy" className="text-sm hover:text-orange-500 transition">Info</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  