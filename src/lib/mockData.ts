export type Hospital = {
  id: string;
  name: string;
  city: string;
  state: string;
  type: "Maternity" | "General" | "Teaching" | "Private Clinic";
  distanceKm: number;
  ambulances: number;
  available: boolean;
  rating: number;
  phone: string;
};

export const HOSPITALS: Hospital[] = [
  { id: "h1", name: "Lagos Island Maternity Hospital", city: "Lagos Island", state: "Lagos", type: "Maternity", distanceKm: 2.4, ambulances: 4, available: true, rating: 4.7, phone: "+234 801 234 5678" },
  { id: "h2", name: "Lagos University Teaching Hospital", city: "Idi-Araba", state: "Lagos", type: "Teaching", distanceKm: 5.1, ambulances: 8, available: true, rating: 4.5, phone: "+234 802 345 6789" },
  { id: "h3", name: "Reddington Multispecialist", city: "Victoria Island", state: "Lagos", type: "Private Clinic", distanceKm: 3.8, ambulances: 2, available: true, rating: 4.8, phone: "+234 803 456 7890" },
  { id: "h4", name: "National Hospital Abuja", city: "Central Area", state: "FCT", type: "General", distanceKm: 6.2, ambulances: 6, available: true, rating: 4.6, phone: "+234 809 111 2222" },
  { id: "h5", name: "Aminu Kano Teaching Hospital", city: "Kano", state: "Kano", type: "Teaching", distanceKm: 4.0, ambulances: 5, available: false, rating: 4.3, phone: "+234 805 222 3333" },
  { id: "h6", name: "UCH Ibadan", city: "Ibadan", state: "Oyo", type: "Teaching", distanceKm: 7.7, ambulances: 7, available: true, rating: 4.4, phone: "+234 806 333 4444" },
];

export const EMERGENCIES = [
  { id: "e1", patient: "Aisha M.", condition: "Severe contractions", status: "In transit", hospital: "Lagos Island Maternity", time: "2 min ago" },
  { id: "e2", patient: "Ngozi O.", condition: "Postpartum bleeding", status: "Hospital accepted", hospital: "LUTH", time: "8 min ago" },
  { id: "e3", patient: "Funmi A.", condition: "High BP / pre-eclampsia", status: "Awaiting ambulance", hospital: "Reddington", time: "12 min ago" },
  { id: "e4", patient: "Hadiza B.", condition: "Routine labor onset", status: "Resolved", hospital: "Aminu Kano TH", time: "1 hr ago" },
];
