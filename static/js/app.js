document.addEventListener('DOMContentLoaded', () => {
    // State management
    let releaseNotes = [];
    let selectedNoteIds = new Set();
    let currentFilter = 'All';
    let searchQuery = '';

    // DOM Elements
    const refreshBtn = document.getElementById('refreshBtn');
    const retryBtn = document.getElementById('retryBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const typeFilters = document.getElementById('typeFilters');
    const lastUpdated = document.getElementById('lastUpdated');
    
    // States
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const emptyState = document.getElementById('emptyState');
    const feedGrid = document.getElementById('feedGrid');
    const errorMessage = document.getElementById('errorMessage');

    // Stats
    const statAll = document.getElementById('statAll');
    const statFeatures = document.getElementById('statFeatures');
    const statAnnouncements = document.getElementById('statAnnouncements');
    const statIssues = document.getElementById('statIssues');
    const statCards = document.querySelectorAll('.stat-card');

    // Floating Action Bar
    const floatingActionBar = document.getElementById('floatingActionBar');
    const selectionCount = document.getElementById('selectionCount');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const tweetSelectedBtn = document.getElementById('tweetSelectedBtn');

    // Modal
    const tweetModal = document.getElementById('tweetModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const sendTweetBtn = document.getElementById('sendTweetBtn');
    const tweetContent = document.getElementById('tweetContent');
    const charCounter = document.getElementById('charCounter');

    // Fetch notes from Flask API
    async function fetchReleaseNotes() {
        showState('loading');
        
        // Spin the refresh button
        const refreshIcon = refreshBtn.querySelector('.refresh-spinner');
        refreshIcon.classList.add('spinning');
        refreshBtn.disabled = true;

        try {
            const response = await fetch('/api/notes');
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Server error while fetching feed');
            }
            const data = await response.json();
            releaseNotes = data.updates || [];
            
            // Clear any invalid selections
            selectedNoteIds.clear();
            updateFloatingActionBar();

            // Update stats
            updateStats();

            // Render feed
            filterAndRender();

            // Update timestamp
            const now = new Date();
            lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } catch (error) {
            console.error('Error fetching release notes:', error);
            errorMessage.textContent = error.message || 'Unable to connect to feed service.';
            showState('error');
        } finally {
            refreshIcon.classList.remove('spinning');
            refreshBtn.disabled = false;
        }
    }

    // Update statistics display
    function updateStats() {
        const counts = {
            All: releaseNotes.length,
            Feature: 0,
            Announcement: 0,
            Issue: 0
        };

        releaseNotes.forEach(note => {
            const type = note.type;
            if (type === 'Feature') counts.Feature++;
            else if (type === 'Announcement') counts.Announcement++;
            else if (type === 'Issue' || type === 'Fix') counts.Issue++;
        });

        // Set counts
        statAll.textContent = counts.All;
        statFeatures.textContent = counts.Feature;
        statAnnouncements.textContent = counts.Announcement;
        statIssues.textContent = counts.Issue;
    }

    // Filter list and trigger render
    function filterAndRender() {
        let filtered = releaseNotes;

        // Apply type filter
        if (currentFilter !== 'All') {
            if (currentFilter === 'Issue') {
                // Group Issues and Fixes together for convenience
                filtered = filtered.filter(note => note.type === 'Issue' || note.type === 'Fix');
            } else {
                filtered = filtered.filter(note => note.type === currentFilter);
            }
        }

        // Apply search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(note => 
                note.type.toLowerCase().includes(query) || 
                note.date.toLowerCase().includes(query) || 
                note.content_text.toLowerCase().includes(query)
            );
        }

        if (filtered.length === 0) {
            showState('empty');
        } else {
            renderFeedGrid(filtered);
            showState('grid');
        }
    }

    // Render feed cards into the grid
    function renderFeedGrid(notes) {
        feedGrid.innerHTML = '';
        
        notes.forEach(note => {
            const isSelected = selectedNoteIds.has(note.id);
            const card = document.createElement('article');
            card.className = `feed-card ${isSelected ? 'selected' : ''}`;
            card.dataset.id = note.id;

            // Map standard icons and colors
            let badgeClass = 'update';
            const lowerType = note.type.toLowerCase();
            if (lowerType === 'feature') badgeClass = 'feature';
            else if (lowerType === 'announcement') badgeClass = 'announcement';
            else if (lowerType === 'issue' || lowerType === 'fix') badgeClass = 'issue';
            else if (lowerType === 'deprecation') badgeClass = 'deprecation';

            card.innerHTML = `
                <div class="card-header">
                    <div class="card-meta">
                        <span class="badge ${badgeClass}">${note.type}</span>
                        <span class="card-date">${note.date}</span>
                    </div>
                    <div class="card-select-trigger">
                        <div class="custom-checkbox" aria-label="Select update card">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="4">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    ${note.content_html}
                </div>
                <div class="card-actions">
                    <a href="${note.link}" target="_blank" rel="noopener noreferrer" class="card-permalink">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                        <span>Release Docs</span>
                    </a>
                    <button class="tweet-btn" data-id="${note.id}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span>Tweet</span>
                    </button>
                </div>
            `;

            // Setup Target _blank for links inside card content
            card.querySelectorAll('.card-body a').forEach(a => {
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
                // Prevent card selection clicking on a link
                a.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });

            // Card body click handler (selecting card)
            card.addEventListener('click', (e) => {
                // If clicked on permalink or tweet button, skip card selection
                if (e.target.closest('.card-actions') || e.target.closest('.tweet-btn')) {
                    return;
                }
                toggleCardSelection(note.id, card);
            });

            // Tweet button click handler
            card.querySelector('.tweet-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openTweetModalForSingle(note);
            });

            feedGrid.appendChild(card);
        });
    }

    // Toggle card selection
    function toggleCardSelection(id, cardElement) {
        if (selectedNoteIds.has(id)) {
            selectedNoteIds.delete(id);
            cardElement.classList.remove('selected');
        } else {
            selectedNoteIds.add(id);
            cardElement.classList.add('selected');
        }
        updateFloatingActionBar();
    }

    // Update floating action bar state
    function updateFloatingActionBar() {
        const count = selectedNoteIds.size;
        if (count > 0) {
            selectionCount.textContent = `${count} update${count > 1 ? 's' : ''} selected`;
            floatingActionBar.classList.add('show');
        } else {
            floatingActionBar.classList.remove('show');
        }
    }

    // Open single Tweet Modal
    function openTweetModalForSingle(note) {
        // Compose initial tweet text
        const typeEmoji = note.type === 'Feature' ? '🚀' : note.type === 'Issue' ? '⚠️' : '📢';
        const typeLabel = note.type.toUpperCase();
        
        let intro = `${typeEmoji} Google BigQuery [${typeLabel}] (${note.date}): `;
        let footer = ` #BigQuery #GoogleCloud\n\nLink: ${note.link}`;
        
        // Calculate max description length
        const maxDescLength = 280 - intro.length - footer.length;
        
        let desc = note.content_text;
        if (desc.length > maxDescLength) {
            desc = desc.substring(0, maxDescLength - 3) + '...';
        }
        
        tweetContent.value = `${intro}${desc}${footer}`;
        updateCharCounter();
        
        // Display Modal
        tweetModal.classList.add('show');
    }

    // Open multi-select Tweet Modal
    function openTweetModalForSelected() {
        const selectedNotes = releaseNotes.filter(n => selectedNoteIds.has(n.id));
        if (selectedNotes.length === 0) return;

        if (selectedNotes.length === 1) {
            openTweetModalForSingle(selectedNotes[0]);
            return;
        }

        // Build composite tweet
        let intro = `📢 BigQuery Releases Summary (${new Date().toLocaleDateString()}):\n`;
        let footer = `\n#BigQuery #GoogleCloud #CloudComputing`;
        
        let items = '';
        selectedNotes.forEach((note, index) => {
            const emoji = note.type === 'Feature' ? '🚀' : note.type === 'Issue' ? '⚠️' : '🔹';
            let line = `${emoji} ${note.type}: ${note.content_text}`;
            // If it exceeds, we truncate early
            items += `${line}\n`;
        });

        // Smart truncate items to fit 280 chars
        const availableLength = 280 - intro.length - footer.length;
        if (items.length > availableLength) {
            items = items.substring(0, availableLength - 4) + '...\n';
        }

        tweetContent.value = `${intro}${items}${footer}`;
        updateCharCounter();
        tweetModal.classList.add('show');
    }

    // Update Tweet Modal Character Counter
    function updateCharCounter() {
        const length = tweetContent.value.length;
        charCounter.textContent = `${length} / 280`;

        // Style warnings
        charCounter.className = 'char-counter';
        if (length > 280) {
            charCounter.classList.add('danger');
        } else if (length > 250) {
            charCounter.classList.add('warning');
        }
    }

    // Show different states in main grid view
    function showState(state) {
        loadingState.style.display = 'none';
        errorState.style.display = 'none';
        emptyState.style.display = 'none';
        feedGrid.style.display = 'none';

        if (state === 'loading') {
            loadingState.style.display = 'flex';
        } else if (state === 'error') {
            errorState.style.display = 'flex';
        } else if (state === 'empty') {
            emptyState.style.display = 'flex';
        } else if (state === 'grid') {
            feedGrid.style.display = 'grid';
        }
    }

    // Event Listeners
    refreshBtn.addEventListener('click', fetchReleaseNotes);
    retryBtn.addEventListener('click', fetchReleaseNotes);
    
    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearch.style.display = 'none';
        
        // Reset filter pills
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        document.querySelector('.filter-pill[data-type="All"]').classList.add('active');
        currentFilter = 'All';
        
        filterAndRender();
    });

    // Search Box Inputs
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        clearSearch.style.display = searchQuery ? 'block' : 'none';
        filterAndRender();
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearch.style.display = 'none';
        filterAndRender();
    });

    // Filter Pill Clicks
    typeFilters.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;

        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        currentFilter = pill.dataset.type;
        filterAndRender();
    });

    // Stats Card clicks to filter directly
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const filterType = card.dataset.filter;
            
            // Set active class in filter pills
            document.querySelectorAll('.filter-pill').forEach(p => {
                if (p.dataset.type === filterType) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });

            currentFilter = filterType;
            filterAndRender();
        });
    });

    // Multi-select actions
    deselectAllBtn.addEventListener('click', () => {
        selectedNoteIds.clear();
        document.querySelectorAll('.feed-card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        updateFloatingActionBar();
    });

    tweetSelectedBtn.addEventListener('click', openTweetModalForSelected);

    // Modal Control listeners
    const closeModal = () => {
        tweetModal.classList.remove('show');
    };

    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    
    tweetContent.addEventListener('input', updateCharCounter);

    // Tweet Send Intent trigger
    sendTweetBtn.addEventListener('click', () => {
        const text = encodeURIComponent(tweetContent.value);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(twitterUrl, '_blank');
        closeModal();
    });

    // Trigger initial fetch
    fetchReleaseNotes();
});
