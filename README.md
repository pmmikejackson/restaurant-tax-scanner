# Texas Restaurant Tax Scanner

⚠️ **SECURITY NOTICE**: This repository previously contained an exposed Google Maps API key. The key has been removed and should be revoked immediately. See the [Security Setup](#security-setup) section below for proper configuration.

A comprehensive web application for identifying all applicable taxes for restaurant POS configuration across all 254 Texas counties.

## 🔒 Security Setup

**IMPORTANT**: Before using this application, you must set up your own Google Maps API key securely.

### Step 1: Get a Google Maps API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API** and **Geocoding API**
4. Go to **APIs & Services** → **Credentials**
5. Click **+ CREATE CREDENTIALS** → **API key**

### Step 2: Secure Your API Key
**Immediately after creating the key:**
1. Click on the key to edit it
2. Add **Application restrictions**:
   - For websites: Add your domain(s) to HTTP referrers
   - For development: Add `localhost` and your local domains
3. Add **API restrictions**:
   - Select "Restrict key"
   - Choose only: "Maps JavaScript API" and "Geocoding API"
4. Save the restrictions

### Step 3: Configure the Application
1. Copy `config.example.js` to `config.js`
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key
3. **Never commit `config.js` to version control** (it's already in `.gitignore`)

```bash
cp config.example.js config.js
# Edit config.js and add your API key
```

### Step 4: For Production Deployment
For production environments, consider:
- Using environment variables instead of client-side configuration
- Implementing a server-side proxy for API calls
- Using domain restrictions on your API key
- Monitoring API usage and setting quotas

## 🚀 Features

- **Complete Texas Coverage**: All 254 counties with thousands of cities
- **Autocomplete Search**: Type-ahead functionality for counties and cities
- **Location Detection**: GPS-based automatic location detection
- **Tax Calculation**: Real-time tax rate calculation and display
- **Export Options**: JSON and CSV export for POS integration
- **Mobile Responsive**: Works on all devices
- **Secure API Integration**: Proper API key management

## 📁 File Structure

The application has been modularized into separate files for better maintainability:

```
restaurant-tax-scanner/
├── main.html          # Main HTML structure and UI
├── styles.css         # All CSS styles and responsive design
├── script.js          # Google Maps API integration and utilities
├── data.js            # County/city mappings and geographical data
├── app.js             # Main application logic and functionality
├── config.example.js  # Example configuration file
├── config.js          # Your actual configuration (create from example)
├── index.html         # Original monolithic file (backup)
├── .gitignore         # Prevents API keys from being committed
└── README.md          # This documentation
```

## 🛠️ Development Setup

### Option 1: Use Modular Structure (Recommended)
1. Set up your API key (see [Security Setup](#security-setup))
2. Open `main.html` in your browser

### Option 2: Use Original Structure
1. Set up your API key in the script section of `index.html`
2. Open `index.html` in your browser

## 📋 File Descriptions

### `main.html`
- Clean HTML structure
- References external CSS and JavaScript files
- Contains all 254 Texas counties in alphabetical order
- Autocomplete-enabled input fields

### `config.js` (You create this)
- Contains your Google Maps API key
- **Never commit this file to version control**
- Created from `config.example.js`

### `styles.css`
- Modern, responsive design
- Gradient backgrounds and animations
- Mobile-first approach
- Professional color scheme

### `script.js`
- Google Maps API integration
- Secure API key loading
- Geolocation services
- Error handling

### `data.js`
- Complete county-to-cities mapping
- County name normalization
- Alphabetically sorted data
- Comprehensive geographical coverage

### `app.js`
- Main application logic
- Tax calculation engine
- Export functionality
- User interface interactions

## 🎯 Usage

1. **Setup**: 
   - Configure your API key (see [Security Setup](#security-setup))
   - Open `main.html` in your browser

2. **Select Location**: 
   - Type county name for autocomplete suggestions
   - Select city from filtered list
   - Or use "Use My Location" for GPS detection

3. **Scan Taxes**:
   - Click "Scan Taxes" to calculate applicable rates
   - View detailed breakdown of all taxes
   - See total combined rate

4. **Export Data**:
   - Export as JSON for API integration
   - Export as CSV for spreadsheet analysis

## 🔧 Technical Details

### Dependencies
- Google Maps JavaScript API (Geocoding)
- Modern browser with ES6+ support
- No external frameworks required

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### API Integration
- Secure API key handling
- Fallback mechanisms
- Error recovery

## 🌟 Benefits of Modular Structure

### For Developers:
- **Separation of Concerns**: HTML, CSS, and JavaScript in separate files
- **Easier Maintenance**: Modify styles without touching logic
- **Better Collaboration**: Multiple developers can work on different files
- **Code Reusability**: CSS and JS can be reused in other projects
- **Debugging**: Easier to locate and fix issues
- **Version Control**: Better diff tracking for changes

### For Performance:
- **Caching**: Browsers can cache CSS/JS files separately
- **Parallel Loading**: Files can load simultaneously
- **Minification**: Each file type can be optimized independently

### For Scalability:
- **Modular Development**: Add new features without affecting existing code
- **Testing**: Unit test individual components
- **Documentation**: Each file has a clear purpose

## 🚀 Future Enhancements

- Add more detailed tax information
- Implement real-time tax rate updates
- Add support for special tax districts
- Include restaurant-specific tax exemptions
- Add multi-language support

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Note**: The original `index.html` file is preserved as a backup. Use `main.html` for the new modular structure.
