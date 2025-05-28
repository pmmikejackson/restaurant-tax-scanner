# Texas Restaurant Tax Scanner

A simple, fast web application that helps restaurant owners identify all applicable taxes for their POS configuration in Texas.

## Features

- 🍽️ **Restaurant-focused**: Specifically designed for food service businesses
- 📍 **Location-based**: Enter county and city to get accurate tax rates
- 💰 **Comprehensive**: Shows state, county, local, and special district taxes
- 📊 **Export ready**: Download tax configurations as JSON or CSV for POS setup
- 📱 **Mobile friendly**: Responsive design works on all devices
- ⚡ **Fast**: No external dependencies, loads instantly

## How to Use

1. Select your restaurant's county from the dropdown
2. Choose your city (auto-populated based on county)
3. Optionally enter your ZIP code
4. Click "Scan Taxes" to see all applicable rates
5. Export the results for your POS system configuration

## Tax Types Covered

- **State Sales Tax**: Texas statewide 6.25% rate
- **County Tax**: County-level sales tax rates
- **Local Tax**: City and municipal tax rates  
- **Special Districts**: Transit authority and other special district taxes

## Deployment

This is a static web application that can be deployed to any static hosting service:

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Set publish directory to `.` (root)
3. Deploy automatically

### Other Static Hosts
Simply upload the `index.html` file and `netlify.toml` to any static web host.

## Technical Details

- **Pure HTML/CSS/JavaScript**: No build process required
- **No external APIs**: All tax data is embedded for fast loading
- **No dependencies**: Self-contained single file application
- **Responsive design**: Works on desktop, tablet, and mobile

## Tax Data

Tax rates are based on current Texas state and local tax information. For the most up-to-date rates, consult the Texas Comptroller's office or your local tax authority.

## License

MIT License - see LICENSE file for details.
