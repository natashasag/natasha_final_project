import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Leaf, Heart } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Decorative top border */}
      <div className="h-1 hero-gradient"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="Footprints" className="h-10 w-10" />
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">Footprints</span>
                <Leaf className="h-6 w-6 text-accent ml-1" />
              </div>
            </div>
            <p className="text-secondary-foreground/80 mb-6 leading-relaxed">
              Calculate, track, and reduce your carbon footprint with our professional 
              web application. Join the fight against climate change with data-driven insights.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center 
                           hover:bg-primary hover:scale-110 transition-all duration-300 group"
                >
                  <Icon className="h-5 w-5 text-white group-hover:text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-accent"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Calculator', href: '/calculator' },
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' }
              ].map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-accent transition-colors 
                             duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-accent rounded-full mr-3 opacity-0 
                                   group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-accent"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                <span className="text-secondary-foreground/80">
                  Mumbai, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-secondary-foreground/80">xxxxxxxxxx</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-secondary-foreground/80">gundayenatasha12@gmail.com</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Business Hours</h4>
              <div className="text-secondary-foreground/80 text-sm space-y-1">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-accent"></span>
            </h3>
            <p className="text-secondary-foreground/80 mb-4">
              Get eco-tips and updates delivered to your inbox.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 
                         text-white placeholder-white/60 focus:outline-none focus:ring-2 
                         focus:ring-accent focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="w-full bg-accent text-accent-foreground px-4 py-3 rounded-lg 
                         font-medium hover:bg-accent/90 transition-all duration-200 
                         hover:scale-105 active:scale-95"
              >
                Subscribe Now
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-secondary-foreground/80">
                🌱 <strong className="text-white">Eco Tip:</strong> Small changes in daily 
                habits can reduce your carbon footprint by up to 30%!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-foreground/60 text-sm">
              © {new Date().getFullYear()} Footprints. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;