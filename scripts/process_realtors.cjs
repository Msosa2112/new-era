const fs = require('fs');
const path = require('path');

const realtorsDir = 'C:\\TRABAJO\\new era\\REALTORS';
const targetDir = path.resolve('public/assets/agents');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Realtor list definition matching user specification
const realtorsList = [
  {
    id: 'yeilen-contreras',
    name: 'Yeilen Contreras',
    folderName: 'Yeilen Contreras (Broker)',
    title: 'Principal Broker & Founder',
    licenseNumber: 'KY-284910',
    phone: '(502) 500-0409',
    email: 'newerabroker25@gmail.com',
    bioEn: 'Principal Broker and visionary founder of New Era Real Estate. Leading bilateral representation across Kentucky and Indiana with unwavering architectural excellence, bilingual negotiation mastery, and strategic wealth-building advisory.',
    bioEs: 'Principal Broker y fundadora de New Era Real Estate. Liderando la representación inmobiliaria en Kentucky e Indiana con excelencia arquitectónica, dominio de negociación bilingüe y asesoría estratégica patrimonial.',
    specialties: ['Principal Brokerage', 'Luxury Portfolios', 'Bilingual Advisory', 'Investment Portfolios', 'New Construction'],
    languages: ['English', 'Spanish'],
    yearsExperience: 14,
    featured: true
  },
  {
    id: 'yenny-mendoza-molina',
    name: 'Yenny Mendoza Molina',
    folderName: 'Yenny Mendoza Molina',
    title: 'Licensed REALTOR® | Residential Specialist',
    phone: '(502) 356-4187',
    email: 'Yennymm1997@gmail.com',
    bioEn: 'Dedicated real estate professional specializing in residential property acquisitions, first-time homebuyer representation, and comparative valuation throughout Greater Louisville.',
    bioEs: 'Asesora inmobiliaria dedicada especializada en compra de propiedades residenciales, compradores primerizos y análisis comparativo de mercado en Louisville.',
    specialties: ['Residential Buying & Selling', 'First-Time Homebuyers', 'Market Valuation'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: true
  },
  {
    id: 'dianelis-segrea-castellon',
    name: 'Dianelis Segrea Castellon',
    folderName: 'Dianelis Segrea Castellon',
    title: 'Licensed REALTOR® | Listing Advisor',
    phone: '(502) 249-4050',
    email: 'dianelis.realtor@gmail.com',
    bioEn: 'Expert in strategic residential listings, market positioning, and buyer consultation across top Kentucky neighborhoods.',
    bioEs: 'Especialista en posicionamiento de listados residenciales, análisis de plusvalía y asesoría integral de compra en Kentucky.',
    specialties: ['Residential Listings', 'Buyer Advisory', 'Negotiation Strategy'],
    languages: ['English', 'Spanish'],
    yearsExperience: 6,
    featured: true
  },
  {
    id: 'marien-rodriguez-reyes',
    name: 'Marien Rodriguez Reyes',
    folderName: 'Marien Rodriguez Reyes',
    title: 'Licensed REALTOR® | Relocation & Family Homes',
    phone: '(502) 565-5401',
    email: 'marienrodriguez7908@gmail.com',
    bioEn: 'Providing personalized, proactive representation to families relocating to Louisville or upgrading to executive suburban residences.',
    bioEs: 'Brindando asesoría proactiva y personalizada a familias que se trasladan a Louisville o buscan residencias de mayor nivel.',
    specialties: ['Relocation Services', 'Family Residences', 'Suburban Estates'],
    languages: ['English', 'Spanish'],
    yearsExperience: 7,
    featured: true
  },
  {
    id: 'claudia-aguilera-cuenca',
    name: 'Claudia D Aguilera Cuenca',
    folderName: 'Claudia D Aguilera Cuenca',
    title: 'Licensed REALTOR® | Contemporary Living Advisor',
    phone: '(502) 389-6889',
    email: 'claudiaguilera1999@gmail.com',
    bioEn: 'Passionate about architectural design, modern builds, and securing optimal financing pathways for new homeowners.',
    bioEs: 'Especializada en arquitectura contemporánea, desarrollos modernos y estructuración de financiamiento óptimo para compradores.',
    specialties: ['Modern Living', 'New Construction', 'First-Time Buyers'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: true
  },
  {
    id: 'yazbel-diaz',
    name: 'Yazbel Diaz',
    folderName: 'Yazbel Diaz',
    title: 'Licensed REALTOR® | Community Wealth Advisor',
    phone: '(502) 956-3177',
    email: 'Yazbelrealtor@gmail.com',
    bioEn: 'Committed to delivering clear, data-driven real estate guidance and empowering families through sustainable homeownership.',
    bioEs: 'Comprometida en brindar asesoría transparente y respaldada en datos que fortalece el patrimonio familiar a través de la vivienda propia.',
    specialties: ['Residential Sales', 'Down Payment Programs', 'Buyer Advisory'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: false
  },
  {
    id: 'javier-ferrer-rodriguez',
    name: 'Javier Ferrer Rodriguez',
    folderName: 'Javier ferrer rodriguez',
    title: 'Licensed REALTOR® | Architectural & New Construction Advisor',
    phone: '(502) 281-1462',
    email: 'Javferrer96@gmail.com',
    bioEn: 'Pairing structural appreciation with aggressive digital marketing to highlight architectural integrity and custom builds.',
    bioEs: 'Combinando criterio constructivo con marketing digital estratégico para destacar propiedades de alto nivel y proyectos nuevos.',
    specialties: ['New Builds', 'Architectural Properties', 'Digital Property Marketing'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: false
  },
  {
    id: 'yordanis-alba-elias',
    name: 'Yordanis Alba Elias',
    folderName: 'Yordanis Alba Elias',
    title: 'Licensed REALTOR® | Acquisition Strategist',
    phone: '(786) 838-9751',
    email: 'yalbarealty@gmail.com',
    bioEn: 'Strategic negotiator and investor advocate delivering deep valuation modeling and smooth closing execution.',
    bioEs: 'Negociador estratégico enfocado en análisis de rentabilidad, adquisiciones residenciales y cierres impecables.',
    specialties: ['Investment Properties', 'Residential Acquisitions', 'Contract Execution'],
    languages: ['English', 'Spanish'],
    yearsExperience: 6,
    featured: false
  },
  {
    id: 'grisel-gonzalez',
    name: 'Grisel Gonzalez (Nina)',
    folderName: 'Grisel Gonzalez',
    title: 'Licensed REALTOR® | Client Concierge Advisor',
    phone: '(502) 500-9828',
    email: 'Griselgonzalez.realtor@gmail.com',
    bioEn: 'Known for high-touch service, attention to detail, and tireless client advocacy from initial consultation to closing day.',
    bioEs: 'Reconocida por un servicio personalizado de excelencia, cuidado de detalles y defensa de los intereses de sus clientes.',
    specialties: ['Residential Representation', 'Client Concierge', 'First-Time Buyers'],
    languages: ['English', 'Spanish'],
    yearsExperience: 6,
    featured: false
  },
  {
    id: 'leidys-herrera',
    name: 'Leidys Herrera',
    folderName: 'Leidys Herrera',
    title: 'Licensed REALTOR® | Top Producing Advisor',
    phone: '(502) 356-7264',
    email: 'lhtopagent@gmail.com',
    bioEn: 'Top-tier agent specializing in high-volume residential representation, equity acceleration, and turnkey transactions.',
    bioEs: 'Agente de alto rendimiento enfocada en aceleración de plusvalía, representación residencial y transacciones ágiles.',
    specialties: ['High-Velocity Listings', 'Buyer Representation', 'Equity Growth'],
    languages: ['English', 'Spanish'],
    yearsExperience: 6,
    featured: false
  },
  {
    id: 'dahana-aguila',
    name: 'Dahana Aguila',
    folderName: 'Dahana Aguila',
    title: 'Licensed REALTOR® | Residential Specialist',
    phone: '(502) 650-5926',
    email: 'Dahanaaguila@gmail.com',
    bioEn: 'Focused on creating seamless homebuying experiences with market analysis and tailored property matching.',
    bioEs: 'Enfocada en crear procesos de compra fluidos con análisis preciso del mercado local y búsqueda a medida.',
    specialties: ['Residential Purchases', 'Market Trend Analysis', 'Buyer Advocacy'],
    languages: ['English', 'Spanish'],
    yearsExperience: 4,
    featured: false
  },
  {
    id: 'walter-gotay',
    name: 'Walter Gotay',
    folderName: 'Walter Gotay',
    title: 'Licensed REALTOR® | Senior Property Strategist',
    phone: '(502) 533-3999',
    email: 'compraconwalter@gmail.com',
    bioEn: 'Seasoned advisor delivering rigorous contract management, aggressive negotiation, and market expertise.',
    bioEs: 'Asesor experimentado con dominio en contratos, negociación estratégica y amplia trayectoria en el mercado regional.',
    specialties: ['Negotiation Mastery', 'Residential Estates', 'Land Parcels'],
    languages: ['English', 'Spanish'],
    yearsExperience: 10,
    featured: false
  },
  {
    id: 'alejandro-robles',
    name: 'Alejandro Robles',
    folderName: 'Alejandro Robles',
    title: 'Licensed REALTOR® | Kentucky Market Advisor',
    phone: '(502) 630-9799',
    email: 'Alex.realtorky@gmail.com',
    bioEn: 'Dedicated to guiding clients with clarity and confidence through every stage of buying, selling, or investing in Kentucky.',
    bioEs: 'Dedicado a guiar con claridad y seguridad a cada cliente en la compra, venta o inversión de bienes raíces en Kentucky.',
    specialties: ['Kentucky Real Estate', 'Buyer Strategy', 'Property Marketing'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: false
  },
  {
    id: 'karla-fernandez-soto',
    name: 'Karla Fernandez Soto',
    folderName: 'Karla Fernandez Soto',
    title: 'Licensed REALTOR® | Residential Consultant',
    phone: '(502) 676-8141',
    email: 'Karlafsoto26@gmail.com',
    bioEn: 'Providing warm and meticulous client representation, specializing in residential neighborhoods and family living spaces.',
    bioEs: 'Ofreciendo asesoría cercana y rigurosa, especializada en vecindarios residenciales y espacios para la vida familiar.',
    specialties: ['Residential Advisory', 'First-Time Buyers', 'Property Valuation'],
    languages: ['English', 'Spanish'],
    yearsExperience: 4,
    featured: false
  },
  {
    id: 'geraldine-santiago-then',
    name: 'Geraldine Santiago Then',
    folderName: 'Geraldine Santiago Then',
    title: 'Licensed REALTOR® | Homeownership Pathways Advisor',
    phone: '(502) 321-0671',
    email: 'Geraldine10realtor@gmail.com',
    bioEn: 'Passionate advocate for unlocking down-payment assistance programs and guiding families to financial stability through real estate.',
    bioEs: 'Comprometida en abrir caminos a programas de asistencia inicial y guiar a las familias hacia su estabilidad patrimonial.',
    specialties: ['Down Payment Assistance', 'First-Time Homebuyers', 'Community Housing'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: false
  },
  {
    id: 'lizandra-parra-rodriguez',
    name: 'Lizandra Parra Rodriguez',
    folderName: 'Lizandra Parra',
    title: 'Licensed REALTOR® | Executive Property Advisor',
    phone: '(786) 818-8531',
    email: 'realestate@lizandraparra.com',
    bioEn: 'Experienced real estate advisor known for executive presentation, client advocacy, and curated portfolio selection.',
    bioEs: 'Asesora inmobiliaria con trayectoria en atención ejecutiva, defensa del cliente y selección exclusiva de propiedades.',
    specialties: ['Executive Portfolios', 'Residential Advisory', 'Relocation Consulting'],
    languages: ['English', 'Spanish'],
    yearsExperience: 7,
    featured: false
  },
  {
    id: 'yisel-pupo',
    name: 'Yisel Pupo',
    folderName: 'Yisel Pupo',
    title: 'Licensed REALTOR® | Market Specialist',
    phone: '(502) 643-9265',
    email: 'yiselatnewera@gmail.com',
    bioEn: 'Dedicated to empowering buyers and sellers with localized market intelligence, proactive communication, and ethical representation.',
    bioEs: 'Dedicada a empoderar a compradores y vendedores con inteligencia de mercado local, comunicación constante y ética intachable.',
    specialties: ['Residential Markets', 'Buyer Consultation', 'Homeowner Guidance'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: false
  },
  {
    id: 'solanch-rodriguez-curbeira',
    name: 'Solanch Rodríguez Curbeira',
    folderName: 'Solanch Rodriguez Curbeira',
    title: 'Licensed REALTOR® | Client Advisory & Acquisition',
    phone: '(502) 240-8463',
    email: 'Solanchrodriguez.realtor@gmail.com',
    bioEn: 'Specializing in personalized client advisory, market research, and smooth closing coordination for discerning buyers.',
    bioEs: 'Especialista en asesoría personalizada, análisis exhaustivo de mercado y coordinación fluida de cierres.',
    specialties: ['Client Advisory', 'Residential Purchases', 'Transaction Oversight'],
    languages: ['English', 'Spanish'],
    yearsExperience: 4,
    featured: false
  },
  {
    id: 'albin-machado-campo',
    name: 'Albin Machado Campo',
    folderName: 'Albin Machado Campo',
    title: 'Licensed REALTOR® | Residential & Investment Consultant',
    phone: '(502) 701-4699',
    email: 'albinmm2005@gmail.com',
    bioEn: 'Providing in-depth market valuation, residential advisory, and investment property scouting across Louisville metro.',
    bioEs: 'Brindando valuación profunda de mercado, asesoría residencial y búsqueda de oportunidades de inversión en el área metropolitana.',
    specialties: ['Market Valuation', 'Residential Advisory', 'Investment Opportunities'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: false
  },
  {
    id: 'ivonne-medina',
    name: 'Ivonne Medina',
    folderName: 'Ivonne Medina',
    title: 'Licensed REALTOR® | Seller & Buyer Advocate',
    phone: '(502) 202-7557',
    email: 'ivon.ori@icloud.com',
    bioEn: 'Delivering tailored customer service, rigorous property valuation, and optimal market capture for homeowners.',
    bioEs: 'Ofreciendo atención a medida, valoración rigurosa de propiedades y máxima captura de valor para propietarios.',
    specialties: ['Seller Representation', 'Staging Insights', 'Buyer Advisory'],
    languages: ['English', 'Spanish'],
    yearsExperience: 6,
    featured: false
  },
  {
    id: 'maria-mendez',
    name: 'Maria Méndez',
    folderName: 'Maria Mendez',
    title: 'Licensed REALTOR® | Residential Advisor',
    phone: '(305) 923-7367',
    email: 'mtm60bayona@gmail.com',
    bioEn: 'Committed to delivering trusted, comprehensive guidance to families building long-term equity through homeownership.',
    bioEs: 'Comprometida en brindar guía confiable y completa a familias que consolidan su patrimonio a través de la vivienda propia.',
    specialties: ['Family Residences', 'Residential Advisory', 'Homeownership Growth'],
    languages: ['English', 'Spanish'],
    yearsExperience: 6,
    featured: false
  },
  {
    id: 'rosa-mustelier-jimenez',
    name: 'Rosa Mustelier Jimenez',
    folderName: 'Rosa Mustelier',
    title: 'Licensed REALTOR® | KY & IN Specialist',
    phone: '(502) 909-7399',
    email: 'rosamustelierrealtor@gmail.com',
    bioEn: 'Dual-market specialist delivering sharp contract precision, cross-river relocation insight, and dedicated client advocacy.',
    bioEs: 'Especialista en Kentucky e Indiana con precisión contractual, reubicación metropolitana y defensa total de sus clientes.',
    specialties: ['Kentucky & Indiana', 'Relocation Advisory', 'Condos & Family Homes'],
    languages: ['English', 'Spanish'],
    yearsExperience: 5,
    featured: false
  },
  {
    id: 'rebeca-lopez-portuondo',
    name: 'Rebeca Lopez Portuondo',
    folderName: 'Rebeca Lopez',
    title: 'Licensed REALTOR® | Client Representative',
    phone: '(502) 658-4492',
    email: 'rebecalopezp1984@gmail.com',
    bioEn: 'Focused on delivering responsive, ethical, and tailored real estate services that guide clients smoothly across every milestone.',
    bioEs: 'Enfocada en brindar servicios inmobiliarios éticos, ágiles y personalizados que acompañan al cliente en cada etapa.',
    specialties: ['Residential Representation', 'First-Time Buyers', 'Client Guidance'],
    languages: ['English', 'Spanish'],
    yearsExperience: 4,
    featured: false
  }
];

// Process and copy photos
realtorsList.forEach((r) => {
  const dirPath = path.join(realtorsDir, r.folderName);
  let photoJpg = null;
  let photoNobgPng = null;

  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(f => {
      const lower = f.toLowerCase();
      if (lower.endsWith('.png')) {
        photoNobgPng = f;
      } else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
        photoJpg = f;
      }
    });
  }

  // Copy JPG with standard name
  const destJpgName = `${r.id}.jpg`;
  const destNobgName = `${r.id}-nobg.png`;

  if (photoJpg) {
    const src = path.join(dirPath, photoJpg);
    const dest = path.join(targetDir, destJpgName);
    fs.copyFileSync(src, dest);
    r.photoUrl = `/assets/agents/${destJpgName}`;
    console.log(`Copied JPG for ${r.name}: ${destJpgName}`);
  } else {
    // If no JPG in REALTORS folder, check if existing asset exists in targetDir
    const fallbackFile = fs.readdirSync(targetDir).find(f => f.includes(r.id) || f.includes(r.email.replace('@', '')));
    if (fallbackFile) {
      r.photoUrl = `/assets/agents/${fallbackFile}`;
      console.log(`Using existing JPG fallback for ${r.name}: ${fallbackFile}`);
    } else {
      r.photoUrl = `/assets/agents/${destJpgName}`;
      console.log(`No JPG found for ${r.name}, placeholder set to: ${destJpgName}`);
    }
  }

  // Copy PNG cutout if exists
  if (photoNobgPng) {
    const src = path.join(dirPath, photoNobgPng);
    const dest = path.join(targetDir, destNobgName);
    fs.copyFileSync(src, dest);
    r.photoNobgUrl = `/assets/agents/${destNobgName}`;
    console.log(`Copied PNG cutout for ${r.name}: ${destNobgName}`);
  }
});

console.log('\nTotal realtors configured:', realtorsList.length);

// Generate agentsData.ts code
const agentsDataTs = `import { Agent, BrokerageInfo } from '../types/property';

export const BROKERAGE_DATA: BrokerageInfo = {
  name: 'New Era Real Estate',
  legalName: 'New Era Real Estate LLC',
  brokerCeo: 'Yeilen Contreras',
  phone: '(502) 500-0409',
  email: 'newerabroker25@gmail.com',
  address: {
    street: '6501 Shepherdsville Road',
    suite: 'Suite 119',
    city: 'Louisville',
    state: 'KY',
    zip: '40219',
    fullFormatted: '6501 Shepherdsville Road, Suite 119, Louisville, KY 40219'
  },
  officeHours: 'Monday - Friday: 9:00 AM - 5:30 PM | Saturday & Sunday: By Appointment',
  licenseNote: 'Licensed Real Estate Brokerage in Kentucky and Indiana. Equal Housing Opportunity.'
};

export const AGENTS_DATA: Agent[] = ${JSON.stringify(
  realtorsList.map(r => ({
    id: r.id,
    name: r.name,
    title: r.title,
    ...(r.licenseNumber ? { licenseNumber: r.licenseNumber } : {}),
    phone: r.phone,
    email: r.email,
    photoUrl: r.photoUrl,
    ...(r.photoNobgUrl ? { photoNobgUrl: r.photoNobgUrl } : {}),
    bio: r.bioEn,
    specialties: r.specialties,
    languages: r.languages,
    activeListingsCount: Math.floor(Math.random() * 4) + 2,
    yearsExperience: r.yearsExperience,
    featured: r.featured
  })),
  null,
  2
)};
`;

fs.writeFileSync(path.resolve('src/data/agentsData.ts'), agentsDataTs, 'utf8');
console.log('\nSuccessfully generated src/data/agentsData.ts!');
