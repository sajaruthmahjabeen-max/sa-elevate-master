import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, ArrowRight } from 'lucide-react';

const WHATSAPP_NUMBER = '18568563240';
const DISPLAY_PHONE = '+1 (856) 856-3240';
const SUPPORT_EMAIL = 'support@saconsultantandstaffing.com';

export const StickyBottomBar: React.FC = () => {
  const location = useLocation();

  // Hide on admin routes so it doesn't obstruct dashboard operations
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <aside
      aria-label="Quick Actions and Contact Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#071739] text-white border-t border-white/10 shadow-[0_-4px_25px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Sign Up Highlight */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium shrink-0">
          <span className="bg-amber-500 text-white font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            FREE
          </span>
          <span className="text-white/90 hidden md:inline">
            Ready to grow your business?
          </span>
          <Link
            to="/auth"
            className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 transition-colors group"
          >
            <span>Sign up</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Center: Contact Info (visible on lg+ screens) */}
        <div className="hidden lg:flex items-center gap-4 text-xs sm:text-sm shrink-0">
          {/* Phone */}
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="text-white/95 hover:text-white flex items-center gap-1.5 font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{DISPLAY_PHONE}</span>
          </a>

          <span className="text-white/30">•</span>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/95 hover:text-emerald-400 flex items-center gap-1.5 font-semibold transition-colors"
          >
            <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          <span className="text-white/30">•</span>

          {/* Email */}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-white/90 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[240px]">{SUPPORT_EMAIL}</span>
          </a>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto sm:ml-0 shrink-0">
          {/* Mobile phone/WhatsApp quick icons if screen is smaller than lg */}
          <div className="flex lg:hidden items-center gap-1.5 mr-0.5">
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              aria-label="Call Us"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Us"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#25D366] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>

          {/* Book a Call */}
          <Link
            to="/book"
            className="px-3 sm:px-4 py-1.5 text-xs font-bold rounded-full bg-white text-[#071739] hover:bg-white/90 shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Book a Call
          </Link>

          {/* Career Services */}
          <Link
            to="/career-services"
            className="hidden sm:inline-flex px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-full border border-white/35 text-white hover:bg-white/10 hover:border-white transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Career Services
          </Link>

          {/* Candidate Portal */}
          <Link
            to="/candidate-portal"
            className="px-3 sm:px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Candidate Portal
          </Link>
        </div>

      </div>
    </aside>
  );
};

export default StickyBottomBar;
