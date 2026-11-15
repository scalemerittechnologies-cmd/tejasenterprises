import { SchemeDeadline } from '@/components/experience/SchemeDeadline'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { Countdown } from '@/components/experience/Countdown'
import { ShopVideo } from '@/components/experience/ShopVideo'
import { EnergyStory } from '@/components/experience/EnergyStory'
import { EnquiryPopup } from '@/components/enquiry/EnquiryPopup'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Building2,
  Factory,
  Headset,
  House,
  IndianRupee,
  MapPin,
  MessageCircle,
  ShieldCheck,
  PanelsTopLeft,
  Sparkles,
  Sun,
  Wrench,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Hero } from '@/components/hero/Hero'
import { BrandTrustStrip } from '@/components/hero/BrandTrustStrip'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'
import { Navigation } from '@/components/navigation/Navigation'
import { getSiteContent } from '@/lib/site-content'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { SolarCalculator } from '@/components/solar/SolarCalculator'
import { Footer } from '@/components/footer/Footer'
import type { Metadata } from 'next'
import { T } from '@/components/language/LanguageProvider'
import { SitePhoto } from '@/components/ui/SitePhoto'
import { EnquiryTriggerButton } from '@/components/ui/EnquiryTriggerButton'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { AdminTabSessionGuard } from '@/components/admin/AdminTabSessionGuard'
import { defaultEnquirySettings, getEnquirySettings } from '@/lib/enquiry-settings'
import { GOOGLE_BUSINESS_PROFILE_URL } from '@/lib/location'

export const dynamic = 'force-dynamic'
type SolarService = {
  icon: LucideIcon
  title: string
  titleHi: string
  description: string
  descriptionHi: string
  range: string
  rangeHi?: string
  action: string
  actionHi: string
}
const services: SolarService[] = [
  { icon: House, title: 'Residential Solar', titleHi: 'आवासीय सोलर', description: 'On-grid and hybrid rooftop systems, with help navigating eligible subsidy applications.', descriptionHi: 'ऑन-ग्रिड और हाइब्रिड रूफटॉप सिस्टम, पात्र सब्सिडी आवेदन में सहायता के साथ।', range: '1–10 kW', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Building2, title: 'Commercial Solar', titleHi: 'कमर्शियल सोलर', description: 'Efficient solar systems designed for shops, offices, schools and hospitals.', descriptionHi: 'दुकानों, ऑफिस, स्कूलों और अस्पतालों के लिए ऊर्जा-कुशल सोलर सिस्टम।', range: '10–100 kW', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Factory, title: 'Industrial Solar', titleHi: 'इंडस्ट्रियल सोलर', description: 'Custom system planning for factories and larger industrial sites.', descriptionHi: 'फैक्ट्रियों और बड़े औद्योगिक परिसरों के लिए कस्टम सिस्टम योजना।', range: '100 kW–1 MW+', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Sun, title: 'Agricultural Solar', titleHi: 'कृषि सोलर', description: 'Solar pump and irrigation options that can reduce dependence on grid power.', descriptionHi: 'ग्रिड बिजली पर निर्भरता घटाने के लिए सोलर पंप और सिंचाई विकल्प।', range: '3–15 kW', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Zap, title: 'Off-Grid Systems', titleHi: 'ऑफ-ग्रिड सिस्टम', description: 'Independent solar and storage solutions for sites with limited grid access.', descriptionHi: 'जहां ग्रिड की सुविधा सीमित हो, वहां के लिए स्वतंत्र सोलर और स्टोरेज समाधान।', range: '1–50 kW', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: BatteryCharging, title: 'Battery & Storage', titleHi: 'बैटरी और स्टोरेज', description: 'Backup options from compatible brands such as UTL, Luminous and Exide; availability varies.', descriptionHi: 'UTL, Luminous और Exide जैसे संगत ब्रांड के बैकअप विकल्प; उपलब्धता अलग-अलग हो सकती है।', range: 'All capacities', rangeHi: 'सभी क्षमताएं', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Wallet, title: 'PM Surya Ghar Subsidy', titleHi: 'पीएम सूर्य घर सब्सिडी', description: 'Application and document assistance. Subsidy is up to ₹78,000, subject to eligibility and scheme rules.', descriptionHi: 'आवेदन और दस्तावेज़ों में सहायता। पात्रता और योजना के नियमों के अनुसार ₹78,000 तक सब्सिडी।', range: 'Application support', rangeHi: 'आवेदन सहायता', action: 'Apply Now', actionHi: 'आवेदन करें' },
  { icon: Wrench, title: 'AMC & Maintenance', titleHi: 'AMC और मेंटेनेंस', description: 'Cleaning, inspection, repairs and upgrades for existing solar systems.', descriptionHi: 'मौजूदा सोलर सिस्टम की सफाई, जांच, मरम्मत और अपग्रेड।', range: 'All compatible brands', rangeHi: 'संगत ब्रांड', action: 'Book Service', actionHi: 'सर्विस बुक करें' },
]
function serviceWhatsAppMessage({ title, range, action }: SolarService) {
  if (action === 'Apply Now') {
    return 'Hello Tejas Enterprises, I need help with PM Surya Ghar rooftop solar subsidy eligibility and the application process. Please guide me.'
  }
  if (action === 'Book Service') {
    return 'Hello Tejas Enterprises, I would like to book AMC or maintenance for my solar system. Please contact me about a service visit.'
  }
  const capacity = range === 'All capacities' ? '' : ` (${range})`
  return `Hello Tejas Enterprises, I am interested in ${title}${capacity}. Please share a quote and help me plan a site survey.`
}

const reasons = [
  { icon: MapPin, number: '01', title: "Prayagraj's Solar Team", titleHi: 'प्रयागराज का अपना सोलर साथी', description: 'Visit our Phaphamau showroom to discuss the right solar system for your property.', descriptionHi: 'अपने घर या व्यवसाय के लिए सही सोलर सिस्टम पर चर्चा करने हमारे फाफामऊ शोरूम आएं।' },
  { icon: BadgeCheck, number: '02', title: 'Local Solar Guidance', titleHi: 'स्थानीय सोलर मार्गदर्शन', description: 'Discuss rooftop solar products, site surveys and PM Surya Ghar application steps with our team.', descriptionHi: 'हमारी टीम से रूफटॉप सोलर, साइट सर्वे और पीएम सूर्य घर आवेदन की प्रक्रिया समझें।' },
  { icon: PanelsTopLeft, number: '03', title: 'Solar Product Options', titleHi: 'सोलर उत्पादों के विकल्प', description: 'Compare panels, inverters and batteries based on your site and availability.', descriptionHi: 'अपनी जगह और उपलब्धता के अनुसार पैनल, इन्वर्टर और बैटरी के विकल्प देखें।' },
  { icon: ShieldCheck, number: '04', title: '25-Year Panel Warranty', titleHi: '25 वर्ष की पैनल वारंटी', description: 'Long-term panel output warranty, as per the manufacturer’s terms.', descriptionHi: 'निर्माता की शर्तों के अनुसार लंबे समय की पैनल आउटपुट वारंटी।' },
  { icon: IndianRupee, number: '05', title: 'Direct Manufacturer Pricing', titleHi: 'निर्माता से सीधी कीमत', description: 'Transparent, project-based pricing on your selected system and equipment.', descriptionHi: 'आपके चुने हुए सिस्टम और उपकरण पर स्पष्ट, प्रोजेक्ट-आधारित कीमत।' },
  { icon: Headset, number: '06', title: 'Service & Support', titleHi: 'सर्विस और सहायता', description: 'Call our team to discuss service visits and maintenance needs.', descriptionHi: 'सर्विस विज़िट और रखरखाव के लिए हमारी टीम को कॉल करें।' },
]

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent()
  return {
    title: `${content.brand} | Premium Solar Energy Solutions in Prayagraj & UP`,
    description: content.heroDescription,
    openGraph: {
      title: `${content.brand} | Solar Solutions in Prayagraj & UP`,
      description: content.heroDescription,
      siteName: content.brand,
    },
  }
}

export default async function HomePage() {
  const content = await getSiteContent()
  const enquirySettings = await getEnquirySettings().catch(() => defaultEnquirySettings)
  const canEditProjects = await isAdminAuthenticated()
  const localVideoExists = await access(path.join(process.cwd(), 'public/videos/tejas-shop.mp4'))
    .then(() => true)
    .catch(() => false)

  return (
    <>
      {canEditProjects && <AdminTabSessionGuard />}
      <Countdown settings={content.countdown} />
      <EnquiryPopup phone={content.phone} copy={enquirySettings.popup} />
      <Navigation brand={content.brand} phone={content.phone} address={content.address} />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: content.brand,
              telephone: content.phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: '226/71, Banaras Rd, Phaphamau',
                addressLocality: 'Prayagraj',
                addressRegion: 'Uttar Pradesh',
                postalCode: '211013',
                addressCountry: 'IN',
              },
            }).replace(/</g, '\\u003c'),
          }}
        />

        {/* Hero Section */}
        <Hero content={content} />

        <BrandTrustStrip />

        <SchemeDeadline />

        <ProjectShowcase projects={content.projects} heading={content.projectsHeading} subheading={content.projectsSubheading} canEdit={canEditProjects} />

        {/* Solar Solutions Grid */}
        <section id="solutions" className="solutions-section" aria-labelledby="solutions-heading">
          <div className="section-heading">
            <span className="eyebrow"><T hi="⚙️ हमारी सेवाएं">OUR SERVICES</T></span>
            <h2 id="solutions-heading"><T hi="Complete Solar Solutions">Complete Solar Solutions</T></h2>
            <p><T hi="घर से लेकर उद्योग तक — हर जगह के लिए सोलर समाधान। नीचे दी गई क्षमता अनुमानित है; सही सिस्टम साइट सर्वे के बाद तय होगा।">From homes to industry, solar solutions for every site. Capacity ranges are indicative; final system sizing follows a site survey.</T></p>
          </div>
          <div className="services-grid">
            {services.map((service) => {
              const { icon: Icon, title, titleHi, description, descriptionHi, range, rangeHi, action } = service
              const whatsappAction = action === 'Apply Now' ? 'Apply via WhatsApp' : action === 'Book Service' ? 'Book via WhatsApp' : 'WhatsApp Quote'
              const whatsappActionHi = action === 'Apply Now' ? 'व्हाट्सऐप पर आवेदन' : action === 'Book Service' ? 'व्हाट्सऐप पर बुक करें' : 'व्हाट्सऐप पर कोटेशन'
              return (
                <article
                  className="service-card"
                  id={title === 'Residential Solar' ? 'service-residential' : title === 'Commercial Solar' ? 'service-commercial' : title === 'Industrial Solar' ? 'service-industrial' : title === 'PM Surya Ghar Subsidy' ? 'pm-surya-ghar' : undefined}
                  key={title}
                >
                  <div className="service-card-icon"><Icon size={22} strokeWidth={2} aria-hidden="true" /></div>
                  <h3><T hi={titleHi}>{title}</T></h3>
                  <p><T hi={descriptionHi}>{description}</T></p>
                  <span className="service-card-range"><T hi={rangeHi ?? range}>{range}</T></span>
                  <a
                    className="service-card-cta"
                    href={getWhatsAppUrl(serviceWhatsAppMessage(service))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="service-card-cta-label">
                      <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
                      <T hi={whatsappActionHi}>{whatsappAction}</T>
                      <span className="sr-only"> — <T hi={titleHi}>{title}</T></span>
                    </span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </a>
                </article>
              )
            })}
          </div>
        </section>

        <section className="why-tejas-section" aria-labelledby="why-tejas-heading">
          <div className="section-heading">
            <span className="eyebrow"><T hi="तेजस एंटरप्राइजेज़ ही क्यों?">WHY TEJAS ENTERPRISES?</T></span>
            <h2 id="why-tejas-heading"><T hi="सोलर के लिए तेजस को चुनें">Why Choose Tejas Enterprises?</T></h2>
            <p><T hi="स्थानीय अनुभव, सही उत्पाद और इंस्टॉलेशन के बाद भी साथ देने वाली टीम।">Local experience, well-matched products and a team that stays available after installation.</T></p>
          </div>
          <div className="why-tejas-grid">
            {reasons.map(({ icon: Icon, number, title, titleHi, description, descriptionHi }) => (
              <article className="why-tejas-card" key={number}>
                <div className="why-tejas-card-top">
                  <span>{number}</span>
                  <Icon size={25} strokeWidth={1.9} aria-hidden="true" />
                </div>
                <h3><T hi={titleHi}>{title}</T></h3>
                <p><T hi={descriptionHi}>{description}</T></p>
              </article>
            ))}
          </div>
        </section>

        {/* In-person consultation at the Prayagraj office */}
        <section className="local-team-section" id="about" aria-labelledby="team-heading">
          <div className="local-team-grid">
            <figure className="local-team-photo-wrap">
              <SitePhoto
                src="/images/tejas/office-wide-new.jpg"
                alt="Inside the Tejas Enterprises solar showroom in Phaphamau"
                sizes="(max-width: 768px) 90vw, 42vw"
                className="consultation-photo"
              />
              <figcaption>
                <MapPin size={15} />
                <T hi="तेजस एंटरप्राइजेज़ का शोरूम • फाफामऊ, प्रयागराज">
                  Tejas Enterprises showroom • Phaphamau, Prayagraj
                </T>
              </figcaption>
            </figure>

            <div className="local-team-copy">
              <span className="eyebrow">
                <Sparkles size={14} className="text-amber-500 inline mr-1" />
                <T hi="प्रयागराज का अपना सोलर ब्रांड • स्थानीय विशेषज्ञता">
                  PRAYAGRAJ&apos;S TRUSTED SOLAR ENERGY PARTNER
                </T>
              </span>
              <h2 id="team-heading">
                <T hi="प्रयागराज की मिट्टी से जुड़े।">Rooted in Prayagraj.</T>
                <br />
                <span><T hi="हर छत को रोशन करने का संकल्प।">Powering Purvanchal with Clean Solar Energy.</T></span>
              </h2>
              <p>
                <T hi="तेजस एंटरप्राइजेज़ फाफामऊ, प्रयागराज में सोलर समाधान और उत्पादों के लिए आपका स्थानीय संपर्क है। हमारी टीम से अपनी छत, बिजली की ज़रूरत, सोलर उपकरण और पीएम सूर्य घर योजना के आवेदन के बारे में बात करें।">
                  Tejas Enterprises is your local contact for solar solutions and products in Phaphamau, Prayagraj. Visit our showroom to discuss your roof, electricity needs, equipment options and the PM Surya Ghar application process.
                </T>
              </p>

              <div className="team-badges-row">
                <div className="team-badge-item">
                  <ShieldCheck size={20} className="text-blue-600" />
                  <div>
                    <strong><T hi="स्थानीय सोलर मार्गदर्शन">Local Solar Guidance</T></strong>
                    <small><T hi="योजना की प्रक्रिया में मार्गदर्शन">Guidance on scheme applications</T></small>
                  </div>
                </div>
                <div className="team-badge-item">
                  <Wrench size={20} className="text-blue-600" />
                  <div>
                    <strong><T hi="फाफामऊ में हमारा शोरूम">Visit Our Showroom</T></strong>
                    <small><T hi="सोलर उत्पाद और सेवाओं की जानकारी">Discuss products and services</T></small>
                  </div>
                </div>
              </div>

              <div className="team-actions">
                <EnquiryTriggerButton className="primary-cta">
                  <T hi="हमारे ऑफिस आएं या परामर्श लें">Meet Our Team / Book Site Visit</T>
                  <ArrowRight size={17} />
                </EnquiryTriggerButton>
                <a href={`tel:${content.phone.replace(/\D/g, '')}`} className="secondary-cta">
                  <T hi="कॉल करें">Call</T> {content.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="tejas-gallery" aria-labelledby="tejas-gallery-heading">
          <div className="section-heading">
            <span className="eyebrow"><T hi="हमारा शोरूम">OUR SHOWROOM</T></span>
            <h2 id="tejas-gallery-heading"><T hi="तेजस एंटरप्राइजेज़ की एक झलक">A look inside Tejas Enterprises</T></h2>
            <p><T hi="फाफामऊ, प्रयागराज स्थित हमारे ऑफिस की वास्तविक तस्वीरें।">Photos from our office in Phaphamau, Prayagraj.</T></p>
          </div>
          <div className="tejas-gallery-grid">
            <figure><img src="/images/tejas/office-wide-new.jpg" alt="Tejas Enterprises office with solar panel displays and customer seating" loading="lazy" /><figcaption><T hi="हमारा ऑफिस">Our office</T></figcaption></figure>
            <figure><img src="/images/tejas/awards-wall.png" alt="Solar panel mural and certificates at Tejas Enterprises" loading="lazy" /><figcaption><T hi="सोलर डिस्प्ले और प्रमाणपत्र">Solar display and certificates</T></figcaption></figure>
            <figure><img src="/images/tejas/office-banner.png" alt="Tejas Enterprises solar office banner" loading="lazy" /><figcaption><T hi="तेजस एंटरप्राइजेज़ बैनर">Tejas Enterprises banner</T></figcaption></figure>
            <figure><img src="/images/tejas/consultation-office.webp" alt="Consultation seating and solar panel displays inside Tejas Enterprises" loading="lazy" /><figcaption><T hi="सोलर परामर्श कार्यालय">Solar consultation office</T></figcaption></figure>
            <figure><img src="/images/tejas/enterprise-office.webp" alt="Tejas Enterprises office with solar panels, seating and product displays" loading="lazy" /><figcaption><T hi="हमारा सोलर शोरूम">Our solar showroom</T></figcaption></figure>
          </div>
        </section>

        {/* Video Reel Experience */}
        <ShopVideo content={content} localVideoExists={localVideoExists} />

        {/* Energy Story with High Contrast */}
        <EnergyStory />

        {/* Products Section */}
        <section className="products-section" id="products">
          <div className="section-heading">
            <span className="eyebrow"><T>TIER-1 SOLAR HARDWARE</T></span>
            <h2>
              <T>Choose the right products for your</T> <span><T>solar setup.</T></span>
            </h2>
            <p><T>Tested for extreme temperatures, high durability and guaranteed 25-year performance.</T></p>
          </div>
          <div className="product-grid">
            {content.products.map((product) => (
              <article className="public-product-card" id={`product-${product.id}`} key={product.id}>
                <div className="public-product-image">
                  <SitePhoto
                    src={product.image}
                    alt=""
                    sizes="(max-width: 600px) 90vw, (max-width: 920px) 45vw, (max-width: 1250px) 30vw, 350px"
                  />
                  <span><T>{product.category}</T></span>
                </div>
                <div className="public-product-copy">
                  <h3><T>{product.name}</T></h3>
                  <p><T>{product.description}</T></p>
                  <Link href="#contact">
                    <T>View details / enquiry</T> <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Process Section with High-Contrast Royal Navy Blue Theme */}
        <section className="process-section" id="process" aria-labelledby="process-heading">
          <div className="process-inner">
            <div className="process-intro">
              <span className="process-eyebrow">
                <Sun size={15} className="inline mr-1" />
                <T hi="सोलर की ओर कदम">THE SOLAR JOURNEY</T>
              </span>
              <h2 id="process-heading">
                <T hi="सोलर अपनाना हुआ बेहद आसान।">A Crystal-Clear Path to Solar.</T>
              </h2>
              <p>
                <T hi="हर छत और बिजली खपत का पैटर्न अलग होता है। हम आपकी ज़रूरत को समझकर सब्सिडी आवेदन से लेकर ग्रिड मीटरिंग तक का पूरा काम संभालते हैं।">
                  Every site and power load is unique. From free rooftop feasibility analysis to seamless net-metering approvals and subsidy credit, we handle everything end-to-end.
                </T>
              </p>
              <EnquiryTriggerButton className="process-cta-btn">
                <T hi="अपनी योजना पर बात करें">Discuss Your Project</T> <ArrowRight size={17} />
              </EnquiryTriggerButton>
            </div>

            <div className="process-steps">
              <article className="process-step-card">
                <span className="step-num">01</span>
                <div className="step-body">
                  <h3><T hi="नि:शुल्क साइट सर्वे">Free Roof Feasibility Survey</T></h3>
                  <p>
                    <T hi="हम आपकी छत का छाया-मुक्त क्षेत्र, बिजली का लोड और वार्षिक सौर क्षमता मापते हैं।">
                      Our engineers evaluate shadow-free area, existing monthly electricity bills, and optimal panel tilt.
                    </T>
                  </p>
                </div>
              </article>

              <article className="process-step-card">
                <span className="step-num">02</span>
                <div className="step-body">
                  <h3><T hi="सब्सिडी एवं सिस्टम डिज़ाइन">Custom Design & Subsidy Approval</T></h3>
                  <p>
                    <T hi="पीएम सूर्य घर योजना के तहत ₹78,000 तक की सब्सिडी का आवेदन और 3D लेआउट तैयार करना।">
                      Get full transparency on equipment selection, ROI timeline, and government subsidy registration.
                    </T>
                  </p>
                </div>
              </article>

              <article className="process-step-card">
                <span className="step-num">03</span>
                <div className="step-body">
                  <h3><T hi="इंस्टॉलेशन एवं नेट-मीटरिंग">Rapid Installation & Net-Metering</T></h3>
                  <p>
                    <T hi="प्रमाणित सोलर स्ट्रक्चर इंस्टॉलेशन, UPPCL बायो-डायरेक्शनल मीटर टेस्टिंग और लाइफटाइम सपोर्ट।">
                      Complete rooftop mounting within 48 hours, net-metering commissioning, and app synchronization.
                    </T>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Solar Calculator */}
        <section id="calculator" className="home-calculator">
          <div className="home-calculator-intro">
            <span className="eyebrow"><T>PLAN YOUR SOLAR SYSTEM</T></span>
            <h2>
              <T>Start with your</T> <span><T>monthly bill.</T></span>
            </h2>
            <p>
              <T hi="अपने मासिक बिजली बिल से सिस्टम की अनुमानित क्षमता, पैनलों की संख्या और लागत जानें।">
                Use your monthly bill to get an initial estimate of system size, panel count and cost.
              </T>
            </p>
            <Link href="#pm-surya-ghar" className="text-link">
              <T>Read about PM Surya Ghar</T> <ArrowRight size={16} />
            </Link>
          </div>
          <SolarCalculator assumptions={content.calculator} />
        </section>

        {/* Service Strip */}
        <section className="service-strip">
          <div>
            <Wrench />
            <span>
              <b><T>Installation guidance</T></b>
              <small><T>Planned for your site</T></small>
            </span>
          </div>
          <div>
            <Sun />
            <span>
              <b><T>Solar consultation</T></b>
              <small><T>Options for your needs</T></small>
            </span>
          </div>
          <div>
            <MapPin />
            <span>
              <b><T>Based in Prayagraj</T></b>
              <small><a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer">{content.address}</a></small>
            </span>
          </div>
          <EnquiryTriggerButton className="service-strip-cta">
            <T hi="साइट विज़िट बुक करें">Book Site Visit</T> <ArrowRight size={15} />
          </EnquiryTriggerButton>
        </section>

        {/* FAQ Section */}
        <section className="faq-section" id="faq" aria-labelledby="home-faq-heading">
          <div>
            <span className="eyebrow"><T hi="अक्सर पूछे जाने वाले सवाल">FREQUENTLY ASKED QUESTIONS</T></span>
            <h2 id="home-faq-heading">
              <T hi="सोलर के बारे में सवाल?">Got Questions About Solar?</T>
            </h2>
            <p>
              <T hi="सही विकल्प आपकी जगह और बिजली की ज़रूरतों पर निर्भर करता है। हम समझने में आपकी पूरी मदद करेंगे।">
                The right choice depends on your site and electricity needs. Our Prayagraj team is always ready to guide you.
              </T>
            </p>
            <EnquiryTriggerButton className="text-link">
              <T hi="हमारे सोलर इंजीनियर से पूछें">Ask our solar engineer</T> <ArrowRight size={16} />
            </EnquiryTriggerButton>
          </div>
          <div className="faq-list">
            <details>
              <summary>
                <T hi="पीएम सूर्य घर योजना में कितनी सब्सिडी मिलती है?">
                  How much subsidy is provided under PM Surya Ghar Yojana?
                </T>
              </summary>
              <p>
                <T hi="1kW के लिए ₹30,000, 2kW के लिए ₹60,000, और 3kW या अधिक के लिए ₹78,000 की सीधी केंद्र सरकारी सब्सिडी सीधे आपके बैंक खाते में ट्रांसफर की जाती है।">
                  Under PM Surya Ghar, eligible residential installations receive up to ₹30,000 for 1kW, ₹60,000 for 2kW, and ₹78,000 for 3kW and above, credited directly to the beneficiary&apos;s bank account.
                </T>
              </p>
            </details>
            <details>
              <summary>
                <T hi="क्या रात में या बादल होने पर भी बिजली मिलेगी?">
                  Will I have electricity during night time or cloudy weather?
                </T>
              </summary>
              <p>
                <T hi="हाँ! ग्रिड-टाइड सिस्टम नेट-मीटरिंग के माध्यम से दिन में अतिरिक्त बिजली ग्रिड को भेजता है और रात में वहीं से वापस लेता है। वहीं हाइब्रिड सिस्टम में बैटरी बैकअप रहता है जिससे 24 घंटे निर्बाध बिजली मिलती है।">
                  Yes. Grid-tied systems export surplus daytime solar to UPPCL grid via net-metering and draw it back at night. Hybrid systems feature lithium/tubular batteries for seamless 24×7 backup during power cuts.
                </T>
              </p>
            </details>
            <details>
              <summary>
                <T hi="सोलर पैनल की लाइफ और वारंटी कितनी होती है?">
                  What is the operational lifespan and warranty of solar panels?
                </T>
              </summary>
              <p>
                <T hi="हमारे सभी टियर-1 मोनोक्रिस्टलाइन पैनल्स पर 25 साल की लीनियर परफॉर्मेंस वारंटी और इन्वर्टर पर 5-10 साल की मैन्युफैक्चरर वारंटी मिलती है।">
                  All our Tier-1 Mono PERC / Bifacial panels come with a 25-year performance warranty ensuring consistent generation, while inverters carry 5 to 10 years manufacturer warranty.
                </T>
              </p>
            </details>
          </div>
        </section>
      </main>

      <Footer brand={content.brand} phone={content.phone} address={content.address} />
    </>
  )
}
