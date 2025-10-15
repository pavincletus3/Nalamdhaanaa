# Nearby Health Integration Setup

This document explains how the Location project functionality has been integrated into the HealthAssist application.

## What's Been Integrated

The Location project's healthcare locator functionality has been successfully integrated into the HealthAssist app's "Nearby Health" section. This includes:

- Interactive map with healthcare facility markers
- Real-time location detection
- Search functionality for different locations
- Filtering by facility type (hospitals, pharmacies, clinics)
- Adjustable search radius
- Detailed facility information with contact details
- Direct links to Google Maps for directions

## Files Added/Modified

### New Files:

- `components/NearbyHealthcareLocator.tsx` - Main map component
- `api/app.py` - Flask backend API for healthcare data
- `api/requirements.txt` - Python dependencies

### Modified Files:

- `package.json` - Added leaflet and react-leaflet dependencies
- `pages/Nearby.tsx` - Updated to use new map component
- `index.tsx` - Added leaflet CSS import

## Dependencies Added

The following npm packages were added:

- `leaflet` - Map library
- `react-leaflet` - React wrapper for Leaflet
- `@types/leaflet` - TypeScript definitions

React version was downgraded from 19.2.0 to 18.3.1 for compatibility with react-leaflet.

## Backend API (Optional)

A Flask API has been included that provides real healthcare data using OpenStreetMap:

### To run the backend API:

1. Install Python dependencies:

   ```bash
   cd api
   pip install -r requirements.txt
   ```

2. Run the Flask server:
   ```bash
   python app.py
   ```

The API will run on `http://localhost:5000` and provides:

- `/nearby` - Get healthcare facilities near coordinates
- `/search` - Search for locations by name
- `/health` - Health check endpoint

### API Features:

- Uses OpenStreetMap Overpass API for real healthcare data
- Supports hospitals, pharmacies, clinics, and doctor offices
- Configurable search radius (100m to 50km)
- Returns facility details including phone, website, hours

## Fallback Mode

If the backend API is not running, the component automatically falls back to mock data for demonstration purposes.

## Usage

1. Navigate to the "Nearby Health" section in the HealthAssist app
2. Click "My Location" to find facilities near your current location
3. Or search for a specific location using the search bar
4. Use the category filters to show only hospitals, pharmacies, or clinics
5. Adjust the search radius using the slider
6. Click on map markers to see facility details
7. Use "Get Directions" to open Google Maps

## Styling

The component uses the existing HealthAssist design system with:

- Primary color scheme matching the app
- Consistent button and card styling
- Responsive design for mobile and desktop
- Loading states and error handling

## Future Enhancements

Potential improvements:

- Integration with HealthAssist user preferences
- Favorite facilities functionality
- Appointment booking integration
- Reviews and ratings
- Insurance network filtering
- Real-time availability status
