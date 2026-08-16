export const DEMO_USERS = [
  // ── Agency Officers ────────────────────────────────────────────────────────
  { email: 'officer@kra.go.ke',     password: 'ipmas2024', userType: 'agency', agencyId: 'KRA',     name: 'John Kariuki',      role: 'Compliance Officer',      title: 'Senior Compliance Officer' },
  { email: 'officer@kebs.go.ke',    password: 'ipmas2024', userType: 'agency', agencyId: 'KEBS',    name: 'Grace Wanjiku',     role: 'Standards Officer',       title: 'Senior Standards Officer' },
  { email: 'officer@aca.go.ke',     password: 'ipmas2024', userType: 'agency', agencyId: 'ACA',     name: 'Peter Mwangi',      role: 'Enforcement Officer',     title: 'Principal Enforcement Officer' },
  { email: 'officer@kephis.go.ke',  password: 'ipmas2024', userType: 'agency', agencyId: 'KEPHIS',  name: 'Susan Achieng',     role: 'Certification Officer',   title: 'Seed Certification Officer' },
  { email: 'officer@ppb.go.ke',     password: 'ipmas2024', userType: 'agency', agencyId: 'PPB',     name: 'Dr. Ali Hassan',    role: 'Registration Officer',    title: 'Pharmaceutical Registration Officer' },
  { email: 'officer@vmd.go.ke',     password: 'ipmas2024', userType: 'agency', agencyId: 'VMD',     name: 'Dr. Jane Muthoni',  role: 'Regulatory Officer',      title: 'Veterinary Regulatory Officer' },
  { email: 'officer@pcpb.go.ke',    password: 'ipmas2024', userType: 'agency', agencyId: 'PCPB',    name: 'George Omondi',     role: 'Technical Officer',       title: 'Senior Technical Officer' },
  { email: 'officer@keproba.go.ke', password: 'ipmas2024', userType: 'agency', agencyId: 'KEPROBA', name: 'Diana Njeri',       role: 'Brand Officer',           title: 'Made in Kenya Brand Officer' },

  // ── Operators / Taxpayers ──────────────────────────────────────────────────
  // Wine importer — excisable product (KRA excise stamp) + conformity assessment (KEBS ISM)
  {
    email: 'compliance@capewines.co.ke', password: 'ipmas2024', userType: 'operator',
    agencyId: 'KRA', operatorId: 'OP-015',
    name: 'David Ochieng', role: 'Compliance Manager',
    company: 'Cape Wines SA — Kenya', operatorType: 'Importer', sector: 'Beverages – Wine & Spirits',
    agencies: ['KRA', 'KEBS'],
    note: 'Imports wine from South Africa — subject to KRA Excise Stamp and KEBS ISM (conformity assessment)',
  },
  // Beverages manufacturer
  {
    email: 'compliance@eabl.co.ke', password: 'ipmas2024', userType: 'operator',
    agencyId: 'KRA', operatorId: 'OP-001',
    name: 'James Mwenda', role: 'Compliance Director',
    company: 'East African Breweries Ltd', operatorType: 'Manufacturer', sector: 'Beverages – Alcohol',
    agencies: ['KRA', 'KEBS'],
    note: 'Brewer of Tusker, White Cap and other brands — requires KRA Excise Stamps',
  },
  // Pharma importer
  {
    email: 'import@pharmakenya.co.ke', password: 'ipmas2024', userType: 'operator',
    agencyId: 'PPB', operatorId: 'OP-005',
    name: 'Dr. Fatuma Omar', role: 'Regulatory Affairs Manager',
    company: 'Pharma Imports Kenya Ltd', operatorType: 'Importer', sector: 'Pharmaceuticals',
    agencies: ['PPB', 'KEBS'],
    note: 'Imports insulin, ARVs, anti-malarials — GS1 serialization labels applied at foreign manufacturer',
  },
  // Seed manufacturer
  {
    email: 'admin@kenyaseed.co.ke', password: 'ipmas2024', userType: 'operator',
    agencyId: 'KEPHIS', operatorId: 'OP-004',
    name: 'James Kamau', role: 'Quality Manager',
    company: 'Kenya Seed Company', operatorType: 'Manufacturer', sector: 'Seeds & Agro-inputs',
    agencies: ['KEPHIS'],
    note: 'Certified hybrid maize and wheat seed — SMS-enabled labels for farmer verification',
  },
  // Pesticide importer
  {
    email: 'director@agrochem.co.ke', password: 'ipmas2024', userType: 'operator',
    agencyId: 'PCPB', operatorId: 'OP-012',
    name: 'Robert Kiprotich', role: 'Operations Director',
    company: 'AgriChemicals Kenya Ltd', operatorType: 'Importer', sector: 'Pest Control Products',
    agencies: ['PCPB', 'KEBS'],
    note: 'Imports pesticides and herbicides — PCPB security label applied at foreign manufacturer',
  },
  // Vet medicine distributor
  {
    email: 'compliance@vetcare.co.ke', password: 'ipmas2024', userType: 'operator',
    agencyId: 'VMD', operatorId: 'OP-013',
    name: 'Dr. Alice Njoroge', role: 'Regulatory Manager',
    company: 'VetCare Supplies Ltd', operatorType: 'Distributor', sector: 'Veterinary Medicines',
    agencies: ['VMD'],
    note: 'Distributes veterinary antibiotics and biologicals — VMD traceability stamps at importer warehouse',
  },
]
