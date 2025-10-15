import { HealthFacility } from '../types';

export const getNearbyFacilities = (lat: number, lon: number): Promise<HealthFacility[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const facilities: HealthFacility[] = [
                { id: '1', name: 'City General Hospital', address: '123 Main St, Cityville', type: 'Hospital', distance: '1.2 km', isOpen: true },
                { id: '2', name: 'Community Clinic', address: '456 Oak Ave, Cityville', type: 'Clinic', distance: '2.5 km', isOpen: true },
                { id: '3', name: 'HealthFirst Pharmacy', address: '789 Pine Ln, Cityville', type: 'Pharmacy', distance: '0.8 km', isOpen: false },
                { id: '4', name: 'Central Medical Center', address: '101 Center Rd, Cityville', type: 'Hospital', distance: '3.1 km', isOpen: true },
                { id: '5', name: 'WellCare Pharmacy', address: '212 Elm St, Cityville', type: 'Pharmacy', distance: '1.5 km', isOpen: true },
            ];
            resolve(facilities);
        }, 2000);
    });
};