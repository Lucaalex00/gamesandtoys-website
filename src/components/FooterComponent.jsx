function Footer() {
    return (
      <footer className="bg-[#0d0d0d] text-white mt-12 border-t border-orange-600">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 text-center md:text-start gap-8">
          {/* Brand & Info */}
          <div className='md:text-start flex flex-col gap-2 '>
            <h2 className="text-2xl font-bold text-orange-500 mb-2">GamesAndToys </h2>
            <p className="text-gray-400">
              © {new Date().getFullYear()} <span className='text-gray-300'>Games & Toys <i className="fa-solid text-xs text-xs fa-trademark"></i> </span> <br/> Tutti i diritti riservati. <i className="fa-solid fa-copyright"></i>
            </p>
          </div>
  
          {/* Social Links */}
          <div className='md:text-center flex flex-col gap-2'>
            <h3 className="text-orange-400 text-lg font-semibold mb-2">Seguici</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.facebook.com/gtcanelli?locale=it_IT" target="_blank" rel="noreferrer" className=" text-gray-300  hover:text-blue-500 transition"> <i className="fa-brands text-lg fa-facebook"></i> Facebook </a>
                
              </li>
              <li>
                <a href="https://www.instagram.com/gamesandtoys_mtg/" target="_blank" rel="noreferrer" className=" text-gray-300 hover:text-pink-400 transition"><i className="fa-brands text-lg fa-instagram"></i> Instagram</a>
              </li>
            </ul>
          </div>
  
          {/* Contact & Links */}
          <div className='md:text-end flex flex-col gap-2'>
            <h3 className="text-orange-400 text-lg font-semibold mb-2">Contatti</h3>
            <p className="text-gray-400 text-xs"> <i className="fa-regular text-gray-300 text-sm fa-envelope-open"></i> <span>Email:  </span>  
              <a
                href="mailto:gamesandtoyscanelli@gmail.com"
                className="text-gray-300 hover:text-orange-400 transition text-xs sm:text-sm"
              >
                Gamesandtoyscanelli@gmail.com
              </a> 
            </p>
            <p className="text-gray-400 text-xs"><i className="fa-solid text-gray-300 text-sm fa-phone"></i> <span>Tel: </span> 
              <a
                href="tel:0141382434"
                className="text-gray-300 hover:text-orange-400 transition"
              >
              0141-382434
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  