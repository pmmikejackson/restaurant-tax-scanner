# Texas Restaurant Tax Scanner

A modern web application that helps restaurant owners identify all applicable taxes for their POS configuration in Texas, with optional GPS location services.

## Features

- 🍽️ **Restaurant-focused**: Specifically designed for food service businesses
- 📍 **Smart Location**: GPS-based location detection with Google Maps integration
- 💰 **Comprehensive**: Shows state, county, local, and special district taxes
- 📊 **Export ready**: Download tax configurations as JSON or CSV for POS setup
- 📱 **Mobile friendly**: Responsive design works on all devices
- ⚡ **Fast**: Modular architecture with clean separation of concerns

## Quick Start

### Option 1: Without Location Services
1. Open `index.html` in your browser
2. Manually select county and city
3. Scan taxes and export results

### Option 2: With GPS Location Services
1. **Get a Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project and enable the "Geocoding API"
   - Create an API key with domain restrictions

2. **Configure the Application**:
   ```bash
   cp config.example.js config.js
   # Edit config.js and add your API key
   ```

3. **Open the Application**:
   - Open `index.html` in your browser
   - Click "Use My Location" for automatic detection

## File Structure

```
restaurant-tax-scanner/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles and responsive design
├── script.js           # Application logic and Google Maps integration
├── config.js           # Your API configuration (create from example)
├── config.example.js   # Example configuration file
├── netlify.toml        # Netlify deployment configuration
├── .gitignore          # Prevents API keys from being committed
└── README.md           # This documentation
```

## How to Use

1. **Select Location**: 
   - Use "Use My Location" for GPS detection (requires API key)
   - Or manually select county and city from dropdowns

2. **Scan Taxes**:
   - Click "Scan Taxes" to calculate applicable rates
   - View detailed breakdown of all taxes
   - See total combined rate

3. **Export Data**:
   - Export as JSON for API integration
   - Export as CSV for spreadsheet analysis

## Tax Types Covered

- **State Sales Tax**: Texas statewide 6.25% rate
- **County Tax**: County-level sales tax rates
- **Local Tax**: City and municipal tax rates  
- **Special Districts**: Transit authority and other special district taxes

## Security & API Key Management

### Setting Up Google Maps API
1. **Create API Key**: Get one from [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable Services**: Enable "Geocoding API"
3. **Secure Your Key**: 
   - Add domain restrictions
   - Limit to Geocoding API only
   - Monitor usage and set quotas

### Configuration
- Copy `config.example.js` to `config.js`
- Add your API key to `config.js`
- **Never commit `config.js`** (it's in `.gitignore`)

## Deployment

### Netlify (Recommended)
1. Push your code to GitHub (config.js will be ignored)
2. Connect repository to Netlify
3. Add your API key as an environment variable (optional)
4. Deploy automatically

### Other Static Hosts
Upload all files except `config.js` to any static web host.

## Technical Details

- **Pure HTML/CSS/JavaScript**: No build process required
- **Modular Architecture**: Separate files for HTML, CSS, and JavaScript
- **Progressive Enhancement**: Works without API key, enhanced with location services
- **Responsive Design**: Mobile-first approach
- **Modern Browser Support**: ES6+ features

## Development

### Local Development
```bash
# Start a local server
python3 -m http.server 8000
# Open http://localhost:8000
```

### File Descriptions

- **`index.html`**: Clean HTML structure with semantic markup
- **`styles.css`**: Modern CSS with gradients, animations, and responsive design
- **`script.js`**: Application logic, Google Maps integration, and tax calculations
- **`config.js`**: Your API configuration (create from example, not in git)
- **`config.example.js`**: Template for API configuration

## Tax Data

Tax rates are based on current Texas state and local tax information. For the most up-to-date rates, consult the Texas Comptroller's office or your local tax authority.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - see LICENSE file for details.
