# BigQuery Release Notes Explorer

A premium, modern web dashboard built with **Python Flask** and **Vanilla Web Technologies** (HTML5, JavaScript, and CSS3). This application fetches, parses, filters, and formats the live Atom feed of Google Cloud BigQuery release notes. It also allows you to select single or multiple updates and share them on X / Twitter.

---

## 🚀 Application URL
The local development server is running and accessible at:
👉 **[http://localhost:5001](http://localhost:5001)**

---

## 📂 Project Structure

All application files are located in the [bq-releases-notes](file:///Users/swarna/Desktop/agy-cli-projects/bq-releases-notes) directory:

- 🐍 [app.py](file:///Users/swarna/Desktop/agy-cli-projects/bq-releases-notes/app.py): Flask application server that manages feed retrieval, XML parsing, HTML element cleaning, and serves the JSON API.
- 📦 [requirements.txt](file:///Users/swarna/Desktop/agy-cli-projects/bq-releases-notes/requirements.txt): Lists Python dependencies (`Flask` and `requests`).
- 🌐 [templates/index.html](file:///Users/swarna/Desktop/agy-cli-projects/bq-releases-notes/templates/index.html): Semantic HTML template with full accessibility, SVG icons, filtering layouts, and the Tweet Customizer modal.
- 🎨 [static/css/style.css](file:///Users/swarna/Desktop/agy-cli-projects/bq-releases-notes/static/css/style.css): Custom stylesheet implementing high-end dark mode aesthetics, glassmorphic blur effects, radial gradient glows, responsive card layouts, and button micro-interactions.
- ⚡ [static/js/app.js](file:///Users/swarna/Desktop/agy-cli-projects/bq-releases-notes/static/js/app.js): Core controller handling asynchronous XML API fetching, state management, full-text search, type filtering, multi-card selection, character limit calculations (280-char limit), and Twitter Web Intent integration.

---

## ✨ Features Implemented

### 🔍 Fine-Grained Feed Parsing
Rather than displaying a day's worth of updates as a single block, the backend splits the Atom feed's HTML content by its `<h3>` headings (e.g. *Feature*, *Announcement*, *Issue*, *Deprecation*). This extracts individual updates, permitting users to search, filter, and tweet them independently.

### 🎨 Visual & Aesthetic Design
- **Curated Theme**: Sleek, futuristic dark mode utilizing deep slates, dark indigos, and glowing accents.
- **Glassmorphic Cards**: Cards use semi-transparent backgrounds with a `backdrop-filter: blur(16px)` layer.
- **Micro-Animations**: Smooth scale and color shifts on hovering over cards, buttons, and filters.
- **SVG System**: Fully responsive inline SVGs are used for all UI icons to keep loading fast and self-contained.

### ⚡ Interactive Feeds, Search, & Filters
- **Real-time Search**: Instant full-text search across categories, dates, and update body text.
- **Category Filters**: Filter pills to quickly narrow down updates to *Features*, *Announcements*, *Issues*, or *Deprecations*.
- **Dynamic Counters**: Live counts on categories update automatically based on search inputs and filters.
- **Manual Refresh**: A refresh button with a rotating spinner that disables itself during live feed requests.

### 🐦 Smart X / Twitter Integration
- **Single-Card Tweeting**: Clicking the "Tweet" button on any card pops open a **Tweet Customizer** modal.
- **Multi-Card Tweeting**: Checking the checkboxes on multiple cards highlights them with a glow and triggers a floating action bar at the bottom. Clicking "Tweet Selection" opens the customizer with a compiled summary.
- **Tweet Preview & Editing**: The customizer renders a simulated tweet card, letting you edit the text, shows real-time character counting, and triggers warning colors when approaching or exceeding the 280-character limit.
- **Web Intent**: Seamlessly opens a pre-composed tweet window in a new tab upon confirmation.

---

## 🛠️ Running Locally (If restarted)

If you need to manually launch the app again in the future:
1. Navigate to the project directory:
   ```bash
   cd /Users/swarna/Desktop/agy-cli-projects/bq-releases-notes
   ```
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Start the Flask application:
   ```bash
   python app.py
   ```
