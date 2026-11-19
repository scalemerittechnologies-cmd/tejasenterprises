import 'server-only'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { commitGithubContent, githubContentConfigured, stageGithubImage, type PendingUpload } from '@/lib/github-content'
import trackedContent from '@/content/site-content.json'

export type Product = { id: string; name: string; category: string; description: string; image: string; detail: string; quote: string; href: string }
export type Solution = { id: string; title: string; description: string; image: string; href: string }
export type ProjectCategory = 'Residential' | 'Commercial' | 'Industrial'
export type Project = { id: string; title: string; description: string; category: ProjectCategory; location: string; capacity: string; image: string }
export type SiteContent = {
  countdown: { enabled: boolean; endsAt: string; messageEn: string; messageHi: string; ctaEn: string; ctaHi: string }
  shopVideo: string
  brand: string
  phone: string
  address: string
  heroEyebrow: string
  heroHeading: string
  heroHighlight: string
  heroDescription: string
  showroomPhoto: string
  showroomTitle: string
  showroomDescription: string
  showroomHref: string
  heroPhoto: string
  projectsHeading: string
  projectsSubheading: string
  projects: Project[]
  solutions: Solution[]
  products: Product[]
  calculator: { rupeesPerUnit: number; monthlyUnitsPerKw: number; panelWatts: number; costPerKwMin: number; costPerKwMax: number }
}

const image = '/images/tejas/powering-homes.webp'
const emptyProjectFallback = (index: number): Project => ({ id: `project-${index + 1}`, title: 'Solar Project', description: '', category: 'Residential', location: '', capacity: '', image })
export const defaultSiteContent: SiteContent = {
  countdown: { enabled: false, endsAt: '', messageEn: 'Site visits & solar consultation', messageHi: 'साइट विज़िट और सोलर परामर्श', ctaEn: 'Enquire', ctaHi: 'पूछताछ करें' },
  shopVideo: '/videos/tejas-shop.mp4',
  brand: 'Tejas Enterprises', phone: '099356 85939', address: '226/71, Banaras Rd, Phaphamau, Uttar Pradesh 211013',
  heroEyebrow: "Prayagraj's Trusted Solar Energy Partner", heroHeading: "PRAYAGRAJ'S TRUSTED SOLAR ENERGY PARTNER", heroHighlight: 'POWER YOUR FUTURE. SAVE MORE EVERY DAY.',
  heroDescription: 'Reliable solar solutions for homes, businesses and industries. From premium solar panels to professional installation, we make clean energy simple and affordable.',
  showroomPhoto: '/images/tejas/office-banner.png', showroomTitle: 'Visit our Prayagraj showroom.', showroomDescription: 'Visit Tejas Enterprises at 226/71, Banaras Road, Phaphamau, Prayagraj to discuss solar panels, rooftop systems and your site requirements.', showroomHref: '/contact', heroPhoto: image,
  projectsHeading: 'Solar Projects',
  projectsSubheading: 'Ask our team about rooftop solar projects and verified installation photos.',
  projects: [],
  solutions: [
    { id: 'homes', title: 'Residential Rooftop Solar', description: 'Complete solar rooftop with Growatt/grid inverters and PM Surya Ghar subsidy assistance.', image, href: '/solar-solutions/residential' },
    { id: 'business', title: 'Commercial & Industrial Solar', description: 'High-capacity solar setups for carpet industries, factories, schools, and commercial premises.', image: '/images/projects/commercial-carpet-bhadohi.jpg', href: '/solar-solutions/commercial' },
    { id: 'institutions', title: 'Institutional Solar Systems', description: 'Solar solutions for colleges, hospitals, and government facilities with maximum uptime.', image: '/images/projects/commercial-carpet-bhadohi.jpg', href: '/solar-solutions/institutional' },
    { id: 'products', title: 'Solar Inverters & Batteries', description: 'Tier-1 Mono PERC panels, smart grid-tied inverters, and advanced battery backup systems.', image, href: '/products' },
  ],
  products: [
    { id: 'panels', name: 'Monocrystalline Solar Panels', category: 'Panels', description: 'High-efficiency Tier-1 bifacial and mono PERC solar modules with 25-year performance warranty.', image: '/images/products/golden-solar-panel-array.webp', detail: 'High power density and superior low-light generation.', quote: '', href: '/products/solar-panels' },
    { id: 'inverters', name: 'Smart Solar Inverters', category: 'Inverters', description: 'Smart grid-tied, hybrid, and off-grid solar inverters with live mobile app generation monitoring.', image: '/images/products/tejas-solar-energy-rooftop-banner.png', detail: 'Advanced MPPT tracking and robust surge protection.', quote: '', href: '/products/inverters' },
    { id: 'batteries', name: 'Lithium & Solar Batteries', category: 'Storage', description: 'Heavy-duty tubular and LiFePO4 solar batteries for 24×7 backup during power outages.', image: '/images/products/solar-battery.svg', detail: 'Long cycle life and fast solar charging compatibility.', quote: '', href: '/products/batteries' },
  ],
  calculator: { rupeesPerUnit: 8, monthlyUnitsPerKw: 120, panelWatts: 540, costPerKwMin: 50000, costPerKwMax: 78000 },
}

const dataDir = path.join(process.cwd(), 'data')
const contentPath = path.join(dataDir, 'site-content.json')

// Upgrade only the original starter photos; preserve all custom admin uploads.
const starterPhotos: Record<string, string> = {
  '/photo-1509391366360-2e959784a276': image,
  '/photo-1600585154340-be6161a56a0c': '/images/india/indian-solar-rooftops.webp',
  '/photo-1486406146926-c627a92ad1ab': '/images/tejas/office-banner.png',
  '/photo-1562774053-701939374585': '/images/india/etawah-school.webp',
  '/photo-1592833159155-c62df1b65634': '/images/products/solar-inverter.svg',
  '/photo-1621905251918-48416bd8575a': '/images/products/solar-battery.svg',
}
function currentPhoto(src: string) {
  const replacedBrandPhoto: Record<string, string> = {
    '/images/projects/residential-rooftop-growatt.jpg': image,
    '/images/tejas/showroom.jpeg': '/images/tejas/office-banner.png',
    '/images/tejas/certificates.jpeg': '/images/tejas/awards-wall.png',
    '/images/tejas/office-wide.jpeg': '/images/tejas/office-wide-new.jpg',
    '/images/tejas/office-seating.jpeg': '/images/tejas/office-wide-new.jpg',
    '/images/tejas/office-panels.jpeg': '/images/tejas/office-banner.png',
  }
  if (replacedBrandPhoto[src]) return replacedBrandPhoto[src]
  try {
    const url = new URL(src)
    return url.hostname === 'images.unsplash.com' ? starterPhotos[url.pathname] ?? src : src
  } catch { return src }
}

function normalizeContent(stored: Partial<SiteContent>): SiteContent {
  const solutions = (Array.isArray(stored.solutions) ? stored.solutions : defaultSiteContent.solutions).map((item, index) => {
    const merged = { ...defaultSiteContent.solutions[index % defaultSiteContent.solutions.length], ...item }
    return { ...merged, image: currentPhoto(merged.image) }
  })
  const products = (Array.isArray(stored.products) ? stored.products : defaultSiteContent.products).map((item, index) => {
    const merged = { ...defaultSiteContent.products[index % defaultSiteContent.products.length], ...item, quote: item.quote ?? '', href: item.href ?? `/products/${item.id}` }
    return { ...merged, image: currentPhoto(merged.image) }
  })
  const storedProjects = Array.isArray(stored.projects) ? stored.projects : null
  const projects = storedProjects
    ? storedProjects.map((saved, index) => {
      const fallback = emptyProjectFallback(index)
      const merged = saved && typeof saved === 'object' ? { ...fallback, ...saved } : fallback
      return { ...merged, image: currentPhoto(merged.image ?? '') }
    })
    : defaultSiteContent.projects
  return { ...defaultSiteContent, ...stored, countdown: { ...defaultSiteContent.countdown, ...stored.countdown }, showroomPhoto: currentPhoto(stored.showroomPhoto ?? defaultSiteContent.showroomPhoto), heroPhoto: currentPhoto(stored.heroPhoto ?? defaultSiteContent.heroPhoto), projects, solutions, products, calculator: { ...defaultSiteContent.calculator, ...stored.calculator } }
}

export async function getSiteContent(): Promise<SiteContent> {
  if (githubContentConfigured()) return normalizeContent(trackedContent as Partial<SiteContent>)
  if (process.env.NODE_ENV === 'production') return normalizeContent(trackedContent as Partial<SiteContent>)
  try {
    const stored = JSON.parse(await readFile(contentPath, 'utf8')) as Partial<SiteContent>
    return normalizeContent(stored)
  } catch { return normalizeContent(trackedContent as Partial<SiteContent>) }
}

export async function saveSiteContent(content: SiteContent, uploads: PendingUpload[] = []) {
  if (githubContentConfigured()) return commitGithubContent(content, uploads)
  if (process.env.NODE_ENV === 'production') throw new Error('Admin publishing needs GitHub content credentials.')
  await mkdir(dataDir, { recursive: true })
  const tempPath = `${contentPath}.${process.pid}.tmp`
  await writeFile(tempPath, JSON.stringify(content, null, 2), { mode: 0o600 })
  await rename(tempPath, contentPath)
  return { mode: 'local' as const }
}

export async function saveUploadedImage(filename: string, content: Buffer) {
  if (githubContentConfigured()) return stageGithubImage(filename, content)
  if (process.env.NODE_ENV === 'production') throw new Error('Photo publishing needs GitHub content credentials.')
  const directory = path.join(dataDir, 'uploads')
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, filename), content, { flag: 'wx', mode: 0o600 })
  return { url: `/api/media/${filename}` }
}
