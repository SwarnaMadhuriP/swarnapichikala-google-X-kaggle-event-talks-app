import re
import xml.etree.ElementTree as ET
import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def clean_html_tags(html):
    """Strip HTML tags and normalize text for plain-text use (like tweeting)."""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', html)
    # Decode common HTML entities
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_feed():
    """Fetch and parse the BigQuery release notes Atom feed."""
    try:
        response = requests.get(FEED_URL, timeout=10)
        response.raise_for_status()
        
        # Parse XML
        root = ET.fromstring(response.content)
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        
        updates = []
        for entry in root.findall('atom:entry', ns):
            date_str = entry.find('atom:title', ns).text.strip()
            updated_raw = entry.find('atom:updated', ns).text.strip()
            
            link_elem = entry.find('atom:link', ns)
            link = link_elem.attrib.get('href', '') if link_elem is not None else ''
            
            content_elem = entry.find('atom:content', ns)
            content_html = content_elem.text if content_elem is not None else ''
            
            # Split content_html by <h3> tags to separate distinct updates on the same date
            parts = re.split(r'(<h3>.*?</h3>)', content_html)
            
            # If there are no <h3> headings or parts list is too small, treat as a single entry
            if len(parts) < 3:
                content_text = clean_html_tags(content_html)
                updates.append({
                    "id": entry.find('atom:id', ns).text.strip(),
                    "date": date_str,
                    "raw_date": updated_raw,
                    "type": "Announcement",
                    "content_html": content_html,
                    "content_text": content_text,
                    "link": link
                })
                continue
                
            # Parse alternating <h3> tags and their following contents
            item_idx = 0
            for i in range(1, len(parts), 2):
                if i + 1 >= len(parts):
                    break
                type_tag = parts[i]
                body_html = parts[i+1].strip()
                
                # Extract text between <h3> and </h3>
                type_match = re.search(r'<h3>(.*?)</h3>', type_tag)
                update_type = type_match.group(1).strip() if type_match else "Update"
                
                content_text = clean_html_tags(body_html)
                
                entry_id = entry.find('atom:id', ns).text.strip()
                item_id = f"{entry_id}_{update_type}_{item_idx}"
                
                updates.append({
                    "id": item_id,
                    "date": date_str,
                    "raw_date": updated_raw,
                    "type": update_type,
                    "content_html": body_html,
                    "content_text": content_text,
                    "link": link
                })
                item_idx += 1
                
        return updates, None
    except Exception as e:
        return [], str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/notes')
def get_notes():
    updates, error = parse_feed()
    if error:
        return jsonify({"error": error, "updates": []}), 500
    return jsonify({"updates": updates})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
