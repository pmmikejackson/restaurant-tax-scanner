# Texas Restaurant Tax Scanner

A comprehensive web application for identifying all applicable taxes for restaurant POS configuration across all 254 Texas counties.

## 🚀 Features

- **Complete Texas Coverage**: All 254 counties with thousands of cities
- **Autocomplete Search**: Type-ahead functionality for counties and cities
- **Location Detection**: GPS-based automatic location detection
- **Tax Calculation**: Real-time tax rate calculation and display
- **Export Options**: JSON and CSV export for POS integration
- **Mobile Responsive**: Works on all devices
- **API Key Security**: Obfuscated Google Maps API integration

## 📁 File Structure

The application has been modularized into separate files for better maintainability:

```
restaurant-tax-scanner/
├── main.html          # Main HTML structure and UI
├── styles.css         # All CSS styles and responsive design
├── script.js          # Google Maps API integration and utilities
├── data.js            # County/city mappings and geographical data
├── app.js             # Main application logic and functionality
├── index.html         # Original monolithic file (backup)
└── README.md          # This documentation
```

## 🛠️ Development Setup

### Option 1: Use Modular Structure (Recommended)
Open `main.html` in your browser. This loads the separate CSS and JavaScript files.

### Option 2: Use Original Structure
Open `index.html` for the original single-file version.

## 📋 File Descriptions

### `main.html`
- Clean HTML structure
- References external CSS and JavaScript files
- Contains all 254 Texas counties in alphabetical order
- Autocomplete-enabled input fields

### `styles.css`
- Modern, responsive design
- Gradient backgrounds and animations
- Mobile-first approach
- Professional color scheme

### `script.js`
- Google Maps API integration
- API key obfuscation and security
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

1. **Select Location**: 
   - Type county name for autocomplete suggestions
   - Select city from filtered list
   - Or use "Use My Location" for GPS detection

2. **Scan Taxes**:
   - Click "Scan Taxes" to calculate applicable rates
   - View detailed breakdown of all taxes
   - See total combined rate

3. **Export Data**:
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
