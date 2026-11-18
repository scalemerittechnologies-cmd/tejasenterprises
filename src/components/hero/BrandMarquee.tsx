import { T } from '@/components/language/LanguageProvider'
import styles from './BrandMarquee.module.css'

const brands = [
  { name: 'Tata Power Solar', logo: '/images/brands/tata-power-solar.jpg', width: 182, height: 27 },
  { name: 'Microtek', logo: '/images/brands/microtek.svg', width: 144, height: 50 },
  { name: 'Polycab', logo: '/images/brands/polycab.png', width: 150, height: 34 },
  { name: 'Luminous', logo: '/images/brands/luminous.svg', width: 739, height: 159 },
  { name: 'GoodWe', logo: '/images/brands/goodwe.svg', width: 57, height: 57 },
  { name: 'Growatt', logo: '/images/brands/growatt.png', width: 182, height: 31 },
] as const

export function BrandMarquee() {
  return (
    <section className={styles.strip} aria-labelledby="brands-we-sell-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}><T hi="तेजस एंटरप्राइजेज़ में उपलब्ध">AVAILABLE AT TEJAS</T></span>
          <h2 id="brands-we-sell-heading"><T hi="हम ये ब्रांड बेचते हैं">Brands we sell</T></h2>
          <p><T hi="सोलर और पावर उत्पादों के भरोसेमंद नाम।">Trusted names in solar and power products.</T></p>
        </div>

        <div className={styles.viewport}>
          <div className={styles.track}>
            {[0, 1].map((copy) => (
              <ul className={styles.group} aria-hidden={copy === 1 ? true : undefined} key={copy}>
                {brands.map((brand) => (
                  <li className={styles.brand} key={brand.name}>
                    <img
                      className={brand.name === 'GoodWe' ? styles.iconLogo : styles.logo}
                      src={brand.logo}
                      alt=""
                      width={brand.width}
                      height={brand.height}
                      decoding="async"
                    />
                    <span>{brand.name}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
