import type { CouncilMember } from '../types/content';

export const councilPresident = 'Dr. Julio Ramírez Paredes';

export const councilMembers: CouncilMember[] = [
  { name: 'Dr. Julio Ramírez Paredes', block: 'Concejo en mayoría', commission: 'Legislación' },
  { name: 'Lic. Ana María Ticona', block: 'Concejo en mayoría', commission: 'Hacienda' },
  { name: 'Ing. Roberto Callejas', block: 'Concejo en mayoría', commission: 'Obras' },
  { name: 'Sra. Elvira Ochoa', block: 'Concejo en oposición', commission: 'Desarrollo Humano' },
  { name: 'Sr. Emilio Fernández', block: 'Concejo en oposición', commission: 'Fiscalización' },
  { name: 'Lic. Carmen Flores', block: 'Concejo en oposición', commission: 'Educación y Cultura' },
];

export const sessionSchedule =
  'Sesiones ordinarias: jueves quincenales, 15:00. Sesiones extraordinarias convocadas por presidencia del concejo (calendario demo).';
