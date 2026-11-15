import Link from 'next/link'
import {
  ArrowUp,
  Award,
  BadgeCheck,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { T } from '@/components/language/LanguageProvider'
import { EnquiryTriggerButton } from '@/components/ui/EnquiryTriggerButton'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { GOOGLE_BUSINESS_PROFILE_URL } from '@/lib/location'
import { LocationMapPreview } from '@/components/location/LocationMapPreview'

type FooterProps = { brand: string; phone: string; address: string }

export function Footer({ brand = 'Tejas Enterprises', phone = '099356 85939', address }: FooterProps) {
  const digits = phone.replace(/\D/g, '')

  return (
    <footer className="site-footer" role="contentinfo" id="contact">
      {/* Trust & Guarantee Banner */}
      <div className="footer-trust-strip">
        <div className="trust-strip-inner">
          <div className="trust-strip-item">
            <ShieldCheck size={22} className="text-amber-400" />
            <div>
              <strong><T hi="स्थानीय सोलर टीम">Local Solar Team</T></strong>
              <small><T hi="प्रयागराज में मार्गदर्शन">Guidance in Prayagraj</T></small>
            </div>
          </div>
          <div className="trust-strip-item">
            <Award size={22} className="text-blue-400" />
            <div>
              <strong><T hi="25 वर्ष पैनल वारंटी">25-Year Panel Warranty</T></strong>
              <small><T hi="टियर-1 मोनोक्रिस्टलाइन पैनल्स">Tier-1 Guaranteed Generation</T></small>
            </div>
          </div>
          <div className="trust-strip-item">
            <CheckCircle2 size={22} className="text-emerald-400" />
            <div>
              <strong><T hi="प्रयागराज में स्थानीय सेवा">Local Solar Support</T></strong>
              <small><T hi="फाफामऊ में हमारा शोरूम">Showroom in Phaphamau</T></small>
            </div>
          </div>
          <div className="trust-strip-item">
            <Zap size={22} className="text-amber-400" />
            <div>
              <strong><T hi="90% तक बिजली बिल बचत">Up to 90% Bill Savings</T></strong>
              <small><T hi="स्मार्ट नेट-मीटरिंग तकनीक">Smart Net-Metering Tech</T></small>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="footer-main-grid">
        {/* Col 1: Brand & Bio */}
        <div className="footer-col brand-col">
          <Link href="/" className="footer-brand-link" aria-label={`${brand} home`}>
            <img
              src="/images/tejas/logo.jpeg"
              alt="Tejas Enterprises Logo"
              className="footer-brand-logo-img"
              width={68}
              height={68}
            />
            <span className="footer-brand-wordmark">TEJAS <small>ENTERPRISES</small></span>
          </Link>
          <p className="footer-bio-text">
            <T hi="प्रयागराज और पूर्वांचल का विश्वसनीय सोलर समाधान प्रदाता। हम आवासीय छतों, वाणिज्यिक कारखानों और संस्थानों के लिए उच्च गुणवत्ता वाले सोलर प्लांट्स स्थापित करते हैं।">
              Solar products and rooftop solutions from our showroom in Phaphamau, Prayagraj. Talk with us about your property, equipment options and available scheme guidance.
            </T>
          </p>
          <div className="footer-hours-box">
            <Clock size={15} className="text-blue-400 flex-none" />
            <div>
              <strong>Visit our office:</strong> Please call ahead
            </div>
          </div>
        </div>

        {/* Col 2: Solar Solutions */}
        <div className="footer-col">
          <h3><T hi="सोलर समाधान">Solar Solutions</T></h3>
          <ul className="footer-link-list">
            <li>
              <Link href="/#service-residential">
                <T hi="आवासीय रूफटॉप सोलर">Residential Rooftop Solar</T>
              </Link>
            </li>
            <li>
              <Link href="/#service-commercial">
                <T hi="कमर्शियल एवं इंडस्ट्रियल सोलर">Commercial & Factory Solar</T>
              </Link>
            </li>
            <li>
              <Link href="/#pm-surya-ghar">
                <span className="subsidy-tag">₹78k Subsidy</span>
                <T hi="पीएम सूर्य घर योजना">PM Surya Ghar Yojana</T>
              </Link>
            </li>
            <li>
              <Link href="/#calculator">
                <T hi="सोलर बचत कैलकुलेटर">Solar Bill Calculator</T>
              </Link>
            </li>
            <li>
              <Link href="/#solutions">
                <T hi="सोलर वाटर पंप (कृषि)">Solar Water Pumps</T>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Hardware & Products */}
        <div className="footer-col">
          <h3><T hi="उपकरण एवं उत्पाद">Hardware & Tech</T></h3>
          <ul className="footer-link-list">
            <li>
              <Link href="/#product-panels">
                <T hi="मोनोक्रिस्टलाइन सोलर पैनल्स">Mono PERC Solar Panels</T>
              </Link>
            </li>
            <li>
              <Link href="/#product-inverters">
                <T hi="ग्रिवाट एवं स्मार्ट इन्वर्टर्स">Growatt Smart Inverters</T>
              </Link>
            </li>
            <li>
              <Link href="/#product-batteries">
                <T hi="सोलर लिथियम एवं ट्यूबलर बैटरी">Solar Batteries & Storage</T>
              </Link>
            </li>
            <li>
              <Link href="/#projects-showcase">
                <T hi="पूर्ण प्रोजेक्ट गैलरी">Installation Gallery</T>
              </Link>
            </li>
            <li>
              <Link href="/#about">
                <T hi="हमारे बारे में">About Our Company</T>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Quick Contact & Direct Action */}
        <div className="footer-col contact-col">
          <h3><T hi="संपर्क एवं सहायता">Connect with Us</T></h3>
          <address className="footer-address">
            <MapPin size={17} className="text-amber-400 flex-none" />
            <span><a className="footer-address-link" href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer">{address}</a>
              <a className="footer-map-link" href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} aria-hidden="true" />
                <T hi="गूगल पर हमारी लोकेशन देखें">Find us on Google</T>
              </a>
            </span>
          </address>

          <div className="footer-actions">
            <a href={`tel:${digits}`} className="footer-action-call">
              <Phone size={16} />
              <div>
                <small><T hi="कॉल करें">Call Solar Engineer</T></small>
                <strong>{phone}</strong>
              </div>
            </a>

            <a
              href={getWhatsAppUrl(
                'Hello! I would like to get a free solar quote for my property.'
              )}
              target="_blank"
              rel="noreferrer"
              className="footer-action-wa"
            >
              <MessageCircle size={17} />
              <span><T hi="WhatsApp पर चैट करें">Chat on WhatsApp</T></span>
            </a>

            <EnquiryTriggerButton className="footer-action-quote">
              <Zap size={15} />
              <span><T hi="मुफ्त साइट सर्वे बुक करें">Book Free Site Survey</T></span>
            </EnquiryTriggerButton>
          </div>
        </div>
      </div>

      <section className="footer-location-panel" aria-label="Tejas Enterprises location">
        <div className="footer-location-copy">
          <span className="footer-location-eyebrow">OUR SHOWROOM · PHAPHAMAU</span>
          <h2>Visit Tejas Enterprises</h2>
          <p>Find us near Banaras Road, Prayagraj. Tap the map or address for our exact location.</p>
          <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="footer-location-address"><MapPin size={20} aria-hidden="true" />{address}</a>
          <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="footer-location-directions">Open in Maps <ExternalLink size={16} aria-hidden="true" /></a>
        </div>
        <LocationMapPreview className="footer-map-preview" />
      </section>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="bottom-bar-inner">
          <p>© {new Date().getFullYear()} Tejas Enterprises. <T>All rights reserved.</T></p>
          <div className="footer-legal-links">
            <Link href="/privacy-policy"><T>Privacy Policy</T></Link>
            <span className="dot">•</span>
            <Link href="/terms"><T>Terms of Service</T></Link>
            <span className="dot">•</span>
            <Link href="/admin/login"><T>Admin Login</T></Link>
          </div>
          <a href="#main-content" className="back-to-top-btn" aria-label="Back to top">
            <span><T>Back to top</T></span>
            <ArrowUp size={15} />
          </a>
        </div>
      </div>
    </footer>
  )
}
