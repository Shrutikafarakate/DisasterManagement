import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#141720] border-t border-white/5 pt-12 pb-8 text-slate-400">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Main Grid - Reduced vertical spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand & About Column */}
          <div className="md:col-span-1">
            <h3 className="text-3xl font-black text-white tracking-wider mb-5">
              RESCUE<span className="text-red-600">OPS</span>
            </h3>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3">About Us</h4>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              RescueOps is a citizen powered emergency response platform that connects people in distress with authorities, trained volunteers, and critical resources in real time.
            </p>
            <Link
              to="/donate"
              className="inline-block mt-5 px-6 py-3 bg-red-600/10 border border-red-600/30 text-red-400 font-semibold text-sm rounded-lg hover:bg-red-600/20 hover:border-red-500 transition-all duration-300"
            >
              Donate
            </Link>
          </div>

          {/* Quick Links & Contact Us */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Quick Links</h4>
            <div className="space-y-2 mb-8">
              <Link to="/" className="block text-sm hover:text-red-500 transition-colors">Home</Link>
              <a href="/#safety-guidelines" className="block text-sm hover:text-red-500 transition-colors">Safety Guidelines</a>
            </div>

            {/* Contact Us moved here, below Quick Links */}
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Contact Us</h4>
            <div className="space-y-2 text-sm text-slate-400">
             
              <a href="mailto:support@rescueops.org" className="block hover:text-red-500 transition-colors">
                rescueops@email.com
              </a>
            </div>
          </div>

          {/* Support & Helpline */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Support</h4>
            <div className="space-y-2 mb-6">
              <Link to="/admin/login" className="block text-sm hover:text-red-500 transition-colors">Admin Login</Link>
            </div>

            {/* Compact Helpline */}
            <div className="mt-6 bg-gradient-to-r from-red-900/10 to-transparent border border-red-800/30 rounded-lg p-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Emergency Helpline
              </p>
              <p className="text-2xl font-extrabold text-red-500 leading-none">
                108 / 112
              </p>
              <p className="text-xs text-slate-500 mt-1">
                National Disaster: 011-1078
              </p>
            </div>
          </div>
        </div>

        {/* Clean Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
         
          <div className="flex items-center gap-6 mt-3 md:mt-0">
            <span className="flex items-center gap-2">
             
            </span>
            <span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}