# BigQuery Release Notes Explorer & Share

A premium, modern web dashboard built with **Python Flask** and **Vanilla Web Technologies** (HTML5, JavaScript, and CSS3) that fetches, parses, filters, and shares Google Cloud BigQuery release notes.

## 🚀 Features

-   **Fine-Grained Parsing**: Splits the Atom feed content by individual update headings (e.g. *Feature*, *Announcement*, *Issue*, *Deprecation*) so they can be read, searched, and shared independently.
-   **High-End Dark Mode UI**: Built with a gorgeous aesthetic featuring deep slates, dark indigos, glowing borders, glassmorphic cards (`backdrop-filter`), and smooth hover micro-animations.
-   **Search & Category Filters**: Quickly find updates via live full-text search or Category Pills (All, Features, Announcements, Issues, Deprecations) with dynamic matching counters.
-   **Manual Feed Refresh**: A refresh button with a spinning sync loader icon that requests the live Atom feed asynchronously.
-   **Smart Twitter / X Integration**:
    -   *Single-Update Tweet*: Quick action button on each card to share a single note.
    -   *Multi-Update Summary*: Checkboxes to select multiple notes, activating a bottom action bar to compile a multi-update summary.
    -   *Tweet Customizer Modal*: Edit the generated tweet body, view a real-time character count, and receive alerts if exceeding the 280-character limit.
    -   *Web Intent*: Safely redirect to X / Twitter's official tweet intent window to post.

---

## 📂 Project Structure

```text
bq-releases-notes/
├── app.py                 # Flask server with Atom XML parser & API endpoint
├── requirements.txt       # Python package requirements
├── templates/
│   └── index.html         # Frontend index template (structure & modals)
├── static/
│   ├── css/
│   │   └── style.css      # Custom stylesheet (glassmorphic layout & styles)
│   └── js/
│       └── app.js         # Frontend controller (fetch, filter, state, tweet intents)
└── README.md              # Project documentation
```

---

## 🛠️ Getting Started & Local Run

### Prerequisites
Make sure you have Python 3 installed.

### 1. Clone the repository
```bash
git clone https://github.com/SwarnaMadhuriP/swarnapichikala-google-X-kaggle-event-talks-app.git
cd swarnapichikala-google-X-kaggle-event-talks-app
```

### 2. Set up virtual environment & install requirements
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the development server
```bash
python app.py
```

The application will start running on **[http://localhost:5001](http://localhost:5001)**.
