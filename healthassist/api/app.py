from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# Using OpenStreetMap Nominatim and Overpass API for free healthcare location data
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

def get_nearby_places(lat, lon, radius=5000):
    """
    Fetch nearby healthcare facilities using Overpass API
    radius in meters (default 5km)
    """

    # Overpass query for hospitals, pharmacies, and clinics
    overpass_query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:{radius},{lat},{lon});
      way["amenity"="hospital"](around:{radius},{lat},{lon});
      node["amenity"="pharmacy"](around:{radius},{lat},{lon});
      way["amenity"="pharmacy"](around:{radius},{lat},{lon});
      node["amenity"="clinic"](around:{radius},{lat},{lon});
      way["amenity"="clinic"](around:{radius},{lat},{lon});
      node["amenity"="doctors"](around:{radius},{lat},{lon});
      way["amenity"="doctors"](around:{radius},{lat},{lon});
    );
    out center;
    """

    try:
        response = requests.post(
            OVERPASS_URL,
            data=overpass_query,
            headers={'User-Agent': 'HealthcareLocator/1.0'},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()

        places = []
        for element in data.get('elements', []):
            # Get coordinates
            if 'lat' in element and 'lon' in element:
                place_lat = element['lat']
                place_lon = element['lon']
            elif 'center' in element:
                place_lat = element['center']['lat']
                place_lon = element['center']['lon']
            else:
                continue

            tags = element.get('tags', {})
            amenity_type = tags.get('amenity', 'unknown')

            # Map amenity types to categories
            category = 'clinic'
            if amenity_type == 'hospital':
                category = 'hospital'
            elif amenity_type == 'pharmacy':
                category = 'pharmacy'
            elif amenity_type in ['clinic', 'doctors']:
                category = 'clinic'

            place = {
                'id': element.get('id'),
                'name': tags.get('name', f'Unnamed {category.title()}'),
                'address': format_address(tags),
                'category': category,
                'lat': place_lat,
                'lon': place_lon,
                'phone': tags.get('phone', ''),
                'website': tags.get('website', ''),
                'opening_hours': tags.get('opening_hours', ''),
            }

            places.append(place)

        return places

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

def format_address(tags):
    """Format address from OSM tags"""
    address_parts = []

    if 'addr:housenumber' in tags:
        address_parts.append(tags['addr:housenumber'])
    if 'addr:street' in tags:
        address_parts.append(tags['addr:street'])
    if 'addr:city' in tags:
        address_parts.append(tags['addr:city'])
    if 'addr:postcode' in tags:
        address_parts.append(tags['addr:postcode'])

    address = ', '.join(address_parts) if address_parts else tags.get('addr:full', 'Address not available')
    return address

@app.route('/nearby', methods=['GET', 'POST'])
def nearby_healthcare():
    """
    Endpoint to get nearby healthcare facilities
    Expects: lat, lon, radius (optional, default 5000m)
    Returns: JSON list of healthcare places
    """

    if request.method == 'POST':
        data = request.get_json()
        lat = data.get('lat')
        lon = data.get('lon')
        radius = data.get('radius', 5000)
    else:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        radius = request.args.get('radius', default=5000, type=int)

    # Validate inputs
    if lat is None or lon is None:
        return jsonify({
            'error': 'Missing required parameters: lat and lon'
        }), 400

    if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
        return jsonify({
            'error': 'Invalid coordinates'
        }), 400

    if not (100 <= radius <= 50000):
        return jsonify({
            'error': 'Radius must be between 100 and 50000 meters'
        }), 400

    # Fetch nearby places
    places = get_nearby_places(lat, lon, radius)

    return jsonify({
        'success': True,
        'count': len(places),
        'places': places,
        'center': {'lat': lat, 'lon': lon}
    })

@app.route('/search', methods=['GET'])
def search_location():
    """
    Search for a location by name using Nominatim
    Returns: coordinates and display name
    """
    query = request.args.get('query', '')

    if not query:
        return jsonify({
            'error': 'Missing query parameter'
        }), 400

    try:
        response = requests.get(
            NOMINATIM_URL,
            params={
                'q': query,
                'format': 'json',
                'limit': 5
            },
            headers={'User-Agent': 'HealthcareLocator/1.0'},
            timeout=10
        )
        response.raise_for_status()
        results = response.json()

        locations = []
        for result in results:
            locations.append({
                'name': result.get('display_name'),
                'lat': float(result.get('lat')),
                'lon': float(result.get('lon'))
            })

        return jsonify({
            'success': True,
            'results': locations
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f'Search failed: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)