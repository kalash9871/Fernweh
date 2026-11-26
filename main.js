/**
 * ==============================================================================
 * Fernweh — Multi-Page Frontend Engine (Modern Dark Theme)
 * BCA 5th Semester Web Application Development Project
 * ==============================================================================
 * 
 * Core Modules:
 * 1. Global Navigation & Active Page Detection
 * 2. Authentication & User Session Management (Navbar sync, Login, Register, Logout)
 * 3. Toast Notification System
 * 4. Destination Data Engine & Search/Category Filtering (destinations.html & index.html)
 * 5. Destination Details Modal Controller & Query-Param Prefill
 * 6. Interactive Trip Planner (Flask REST API Integration, Cost Calculations & Accordion)
 * 7. Profile & Settings Management
 */

// ==================== 1. DESTINATIONS DATASET (BUILT-IN FALLBACK & METADATA) ====================
let DESTINATIONS_DATA = {
    ziro: {
        id: "ziro",
        name: "Ziro Valley",
        state: "Arunachal Pradesh",
        category: "mountains",
        tag: "Apatani Cultural Haven",
        image: "ziro.jpg",
        description: "A tranquil valley cradled by pine-clad hills and emerald paddy terraces, home to the indigenous Apatani tribe known for sustainable farming, traditional wooden bamboo houses, and the famed Ziro Music Festival.",
        bestTime: "March to October (Ziro Festival in late Sept)",
        dailyRateText: "₹1,800 - ₹2,600 / day",
        airport: "Donyi Polo Airport, Itanagar (HGI, ~100 km) / Lilabari (IXI)",
        airportQuery: "Donyi+Polo+Airport+Itanagar",
        railway: "Naharlagun Railway Station (NHN, ~95 km)",
        railwayQuery: "Naharlagun+Railway+Station",
        mapQuery: "Ziro+Valley+Arunachal+Pradesh",
        rates: { stay: 1000, food: 650, transport: 600, activity: 400 },
        coordinates: { lat: 27.5600, lng: 93.8300 },
        highlights: [
            "Apatani tribal villages (Hong, Hari, Hija)",
            "Tarin High-Altitude Fish Farm & Pine Groves",
            "Kardo Shiva Lingam (natural rock formation)",
            "Local organic kiwi orchards & rice beer tasting"
        ]
    },
    tawang: {
        id: "tawang",
        name: "Tawang",
        state: "Arunachal Pradesh",
        category: "mountains",
        tag: "Monasteries & High Passes",
        image: "tawang.jpg",
        description: "Perched at an elevation of 10,000 feet near the Indo-Bhutan border, Tawang is renowned for India's largest Buddhist monastery founded in 1681, breathtaking high-altitude mountain passes, and crystal glacial lakes.",
        bestTime: "March to June & September to November",
        dailyRateText: "₹2,200 - ₹3,200 / day",
        airport: "Tezpur Airport (TEZ, ~320 km) / Guwahati (GAU, ~440 km)",
        airportQuery: "Tezpur+Airport",
        railway: "Rangapara North Railway Station (~315 km)",
        railwayQuery: "Rangapara+North+Railway+Station",
        mapQuery: "Tawang+Arunachal+Pradesh",
        rates: { stay: 1200, food: 750, transport: 950, activity: 500 },
        coordinates: { lat: 27.5861, lng: 91.8667 },
        highlights: [
            "Tawang Monastery (Ganden Namgyal Lhatse)",
            "Sela Pass & frozen Sela Lake (13,700 ft)",
            "Madhuri Lake (Sangetsar Tso) mountain bowl",
            "Nuranang Falls (Bap Teng Kang) cascade"
        ]
    },
    majuli: {
        id: "majuli",
        name: "Majuli Island",
        state: "Assam",
        category: "coastal",
        tag: "World's Largest River Island",
        image: "Majuli.jpg",
        description: "Formed by the mighty Brahmaputra River, Majuli is the world's largest inhabited river island and the heart of Assamese Neo-Vaishnavite culture, renowned for ancient Satras, traditional mask making, and peaceful riverbank life.",
        bestTime: "October to March",
        dailyRateText: "₹1,500 - ₹2,300 / day",
        airport: "Jorhat Airport / Rowriah (JRH, ~20 km + Nimati Ghat ferry)",
        airportQuery: "Jorhat+Airport+Rowriah",
        railway: "Jorhat Town Railway Station (JTTN, ~18 km)",
        railwayQuery: "Jorhat+Town+Railway+Station",
        mapQuery: "Majuli+Island+Assam",
        rates: { stay: 850, food: 550, transport: 450, activity: 350 },
        coordinates: { lat: 26.9500, lng: 94.2167 },
        highlights: [
            "Kamalabari & Auniati Neo-Vaishnavite Satras",
            "Traditional Mukha mask-making at Natun Samaguri",
            "Scenic Brahmaputra sunset ferry crossing",
            "Mishing tribal village hospitality and pottery"
        ]
    },
    gokarna: {
        id: "gokarna",
        name: "Gokarna",
        state: "Karnataka",
        category: "coastal",
        tag: "Pristine Arabian Coast",
        image: "Gokarna.jpg",
        description: "A tranquil temple town bordered by rugged Western Ghats cliffs and untouched crescent beaches. Offers serene beach treks, golden sands, and cliffside sunsets without the chaotic crowds of mainstream beach destinations.",
        bestTime: "October to March",
        dailyRateText: "₹1,600 - ₹2,500 / day",
        airport: "Goa Dabolim Airport (GOI, ~140 km) / Mopa (GOX)",
        airportQuery: "Goa+International+Airport+Dabolim",
        railway: "Gokarna Road Railway Station (GOK, ~9 km)",
        railwayQuery: "Gokarna+Road+Railway+Station",
        mapQuery: "Gokarna+Karnataka",
        rates: { stay: 950, food: 650, transport: 450, activity: 350 },
        coordinates: { lat: 14.5479, lng: 74.3188 },
        highlights: [
            "Om Beach, Kudle Beach & Half Moon Beach cliff trek",
            "Ancient Mahabaleshwar Temple & Kotitirtha sacred pond",
            "Cliffside yoga and peaceful Arabian sea sunset views",
            "Historic Mirjan Fort day trip"
        ]
    },
    devprayag: {
        id: "devprayag",
        name: "Devprayag",
        state: "Uttarakhand",
        category: "heritage",
        tag: "Sacred Holy Confluence",
        image: "Devprayag.jpg",
        description: "The mystical mountain town where the gushing turquoise Bhagirathi river meets the calm, silvery Alaknanda river to form the holy River Ganga. Perched dramatically between steep Himalayan river cliffs.",
        bestTime: "Year-Round (Pleasant Oct to April)",
        dailyRateText: "₹1,400 - ₹2,200 / day",
        airport: "Jolly Grant Airport, Dehradun (DED, ~90 km)",
        airportQuery: "Jolly+Grant+Airport+Dehradun",
        railway: "Yog Nagari Rishikesh Railway Station (YNRK, ~70 km)",
        railwayQuery: "Yog+Nagari+Rishikesh+Railway+Station",
        mapQuery: "Devprayag+Uttarakhand",
        rates: { stay: 800, food: 500, transport: 450, activity: 300 },
        coordinates: { lat: 30.1459, lng: 78.5986 },
        highlights: [
            "Confluence (Sangam) of Bhagirathi and Alaknanda",
            "1000-year-old Raghunathji Temple stone architecture",
            "Dramatic pedestrian suspension bridges over the river gorge",
            "Evening riverside aarti along the holy ghats"
        ]
    },
    mawlynnong: {
        id: "mawlynnong",
        name: "Mawlynnong",
        state: "Meghalaya",
        category: "nature",
        tag: "Asia's Cleanest Eco-Village",
        image: "mawlynnong.jpg",
        description: "Renowned as 'God's Own Garden', this eco-conscious Khasi tribal village maintains 100% cleanliness with bamboo waste bins, flowering pathways, nearby bio-engineered living root bridges, and views overlooking Bangladesh.",
        bestTime: "September to May (Lush post-monsoon greenery)",
        dailyRateText: "₹1,700 - ₹2,600 / day",
        airport: "Shillong Airport, Umroi (SHL, ~90 km) / Guwahati (GAU)",
        airportQuery: "Shillong+Airport+Umroi",
        railway: "Guwahati Railway Station (GHY, ~170 km)",
        railwayQuery: "Guwahati+Railway+Station",
        mapQuery: "Mawlynnong+Meghalaya",
        rates: { stay: 1050, food: 600, transport: 700, activity: 400 },
        coordinates: { lat: 25.2017, lng: 91.9056 },
        highlights: [
            "Jingmaham Single Living Root Bridge in neighboring Riwai",
            "Sky Walk 85-foot bamboo canopy watchtower",
            "Natural Balancing Rock geological phenomenon",
            "Dawki Umngot river crystal boating excursion (~30 km)"
        ]
    },
    chopta: {
        id: "chopta",
        name: "Chopta",
        state: "Uttarakhand",
        category: "mountains",
        tag: "Mini Switzerland of India",
        image: "chopta.jpg",
        description: "An untouched alpine meadow (Bugyal) in the Garhwal Himalayas enveloped by dense pine, deodar, and rhododendron forests. Serves as the starting base for trekking to Tungnath (highest Shiva temple) and Chandrashila Summit.",
        bestTime: "April to June (Spring flora) & Sept to Nov (Crisp peaks)",
        dailyRateText: "₹1,800 - ₹2,700 / day",
        airport: "Jolly Grant Airport, Dehradun (DED, ~215 km)",
        airportQuery: "Jolly+Grant+Airport+Dehradun",
        railway: "Rishikesh (YNRK, ~195 km) / Haridwar Junction (HW)",
        railwayQuery: "Haridwar+Railway+Station",
        mapQuery: "Chopta+Uttarakhand",
        rates: { stay: 1000, food: 600, transport: 750, activity: 450 },
        coordinates: { lat: 30.4853, lng: 79.1706 },
        highlights: [
            "Tungnath Temple trek (world's highest Shiva shrine)",
            "Chandrashila Peak 360° summit views (Nanda Devi, Trishul)",
            "Serene Deoria Tal glacial lake forest walk",
            "Stargazing and eco-camping in pristine alpine meadows"
        ]
    },
    orchha: {
        id: "orchha",
        name: "Orchha",
        state: "Madhya Pradesh",
        category: "heritage",
        tag: "Bundela Royal Splendor",
        image: "orchha.jpg",
        description: "A frozen-in-time medieval capital situated along the rocky banks of the Betwa River. Famous for dramatic 16th-century Bundela Rajput architecture, palace fortresses, grand riverside cenotaphs, and ancient murals.",
        bestTime: "October to March",
        dailyRateText: "₹1,500 - ₹2,400 / day",
        airport: "Gwalior Airport (GWL, ~125 km) / Khajuraho (HJR, ~170 km)",
        airportQuery: "Gwalior+Airport",
        railway: "Virangana Lakshmibai Jhansi Junction (VGLJ, ~18 km)",
        railwayQuery: "Virangana+Lakshmibai+Jhansi+Junction",
        mapQuery: "Orchha+Madhya+Pradesh",
        rates: { stay: 900, food: 550, transport: 400, activity: 400 },
        coordinates: { lat: 25.3514, lng: 78.6417 },
        highlights: [
            "Jahangir Mahal & Raja Mahal intricate fresco paintings",
            "14 royal memorial Chhatris reflecting on the Betwa River",
            "Ram Raja Temple (where Lord Rama is revered as king)",
            "Peaceful river rafting / sunset views along Betwa boulders"
        ]
    },
    dhanushkodi: {
        id: "dhanushkodi",
        name: "Dhanushkodi",
        state: "Tamil Nadu",
        category: "coastal",
        tag: "Mystical Edge of India",
        image: "Dhanushkodi.jpg",
        description: "An evocative ghost town on the southeastern tip of Pamban Island, bordered by the turbulent Bay of Bengal on one side and the calm Indian Ocean on the other, at the geographical starting point of Rama Setu.",
        bestTime: "October to March",
        dailyRateText: "₹1,600 - ₹2,500 / day",
        airport: "Madurai International Airport (IXM, ~195 km)",
        airportQuery: "Madurai+Airport",
        railway: "Rameswaram Railway Station (RMM, ~20 km)",
        railwayQuery: "Rameswaram+Railway+Station",
        mapQuery: "Dhanushkodi+Tamil+Nadu",
        rates: { stay: 950, food: 600, transport: 550, activity: 350 },
        coordinates: { lat: 9.1786, lng: 79.4144 },
        highlights: [
            "Submerged 1964 cyclone ruins (Church, Railway Station)",
            "Rama Setu (Adam's Bridge) point & two-ocean confluence",
            "Pamban sea rail bridge crossing experience",
            "Pristine white sandbars and flamingo birdwatching"
        ]
    }
};

// Global active user variable
let currentUser = null;
let currentModalDestination = null;
let lastCalculatedPlan = null;

// ==================== 2. APPLICATION INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Check & Sync Authentication State
    await syncAuthState();

    // 2. Setup Global Navigation, Mobile Menu & Active Page Styling
    initGlobalNavigation();

    // 3. Check for Toast Notifications in URL (e.g. ?logged_out=true or ?registered=true)
    checkUrlAlerts();

    // 4. Fetch Destinations from Flask API (if available)
    await fetchDestinationsFromApi();

    // 5. Page-Specific Initializers
    const currentPath = window.location.pathname.toLowerCase();

    // Destinations page or Home preview grid
    if (document.getElementById("destinationsGrid")) {
        initDestinationsView();
    }

    // Modal Controller
    initModal();

    // Planner page logic
    if (document.getElementById("tripPlannerForm")) {
        initPlannerView();
    }

    // Login page logic
    if (document.getElementById("loginForm")) {
        initLoginView();
    }

    // Register page logic
    if (document.getElementById("registerForm")) {
        initRegisterView();
    }

    // Profile page logic
    if (document.getElementById("profileSection")) {
        initProfileView();
    }

    // Settings page logic
    if (document.getElementById("settingsForm")) {
        initSettingsView();
    }

    // Interactive Map (index.html only)
    if (document.getElementById("destinationsMap")) {
        initInteractiveMap();
    }
});

// ==================== 3. AUTHENTICATION & SESSION MANAGER ====================
async function syncAuthState() {
    try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
            const data = await res.json();
            if (data.status === "authenticated" && data.user) {
                currentUser = data.user;
                localStorage.setItem("tripcraft_user", JSON.stringify(data.user));
            } else {
                // Check localStorage fallback
                const stored = localStorage.getItem("tripcraft_user");
                if (stored) {
                    try { currentUser = JSON.parse(stored); } catch (e) { currentUser = null; }
                } else {
                    currentUser = null;
                }
            }
        }
    } catch (e) {
        // Fallback to localStorage if offline
        const stored = localStorage.getItem("tripcraft_user");
        if (stored) {
            try { currentUser = JSON.parse(stored); } catch (err) { currentUser = null; }
        }
    }

    updateNavbarAuthState();
}

function updateNavbarAuthState() {
    const authContainer = document.getElementById("navAuthContainer");
    if (!authContainer) return;

    if (currentUser) {
        const initials = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U";
        authContainer.innerHTML = `
            <div class="auth-logged-in">
                <button type="button" class="user-profile-trigger" id="userDropdownTrigger" aria-label="Open user menu">
                    <span class="user-avatar-circle">${initials}</span>
                    <span class="user-name-label">${currentUser.name.split(" ")[0]}</span>
                    <i class="fa-solid fa-chevron-down user-dropdown-icon"></i>
                </button>
                <div class="user-dropdown-menu" id="userDropdownMenu">
                    <div class="dropdown-user-info">
                        <div class="dropdown-user-name">${currentUser.name}</div>
                        <div class="dropdown-user-email">${currentUser.email}</div>
                    </div>
                    <a href="profile.html" class="dropdown-item"><i class="fa-solid fa-user"></i> My Profile</a>
                    <a href="settings.html" class="dropdown-item"><i class="fa-solid fa-gear"></i> Settings</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item logout-link" id="btnLogout"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                </div>
            </div>
        `;

        // User dropdown click toggle
        const trigger = document.getElementById("userDropdownTrigger");
        const menu = document.getElementById("userDropdownMenu");
        if (trigger && menu) {
            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                trigger.classList.toggle("active");
                menu.classList.toggle("show");
            });

            document.addEventListener("click", () => {
                trigger.classList.remove("active");
                menu.classList.remove("show");
            });
        }

        // Logout handler
        const btnLogout = document.getElementById("btnLogout");
        if (btnLogout) {
            btnLogout.addEventListener("click", (e) => {
                e.preventDefault();
                performLogout();
            });
        }
    } else {
        authContainer.innerHTML = `
            <div class="auth-logged-out">
                <a href="login.html" class="btn-nav-login">Login</a>
                <a href="register.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-user-plus"></i> Register</a>
            </div>
        `;
    }
}

async function performLogout() {
    try {
        await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
        console.warn("Backend logout request failed, logging out locally:", e);
    }
    localStorage.removeItem("tripcraft_user");
    currentUser = null;
    showToast("Logged out successfully.", "info");
    setTimeout(() => {
        window.location.href = "index.html?logged_out=true";
    }, 400);
}

// ==================== 4. GLOBAL NAVIGATION & ACTIVE LINK ====================
function initGlobalNavigation() {
    const header = document.getElementById("header");
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            header?.classList.add("scrolled");
        } else {
            header?.classList.remove("scrolled");
        }
    });

    // Mobile Hamburger Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            const isOpen = navMenu.classList.contains("open");
            navToggle.innerHTML = isOpen ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-solid fa-bars"></i>`;
        });
    }

    // Determine current page and apply active styling
    const path = window.location.pathname.toLowerCase();
    const filename = path.substring(path.lastIndexOf("/") + 1) || "index.html";

    navLinks.forEach(link => {
        const href = link.getAttribute("href") ? link.getAttribute("href").toLowerCase() : "";
        link.classList.remove("active");

        if (
            (filename === "" || filename === "index.html") && (href === "index.html" || href === "/" || href === "#home")
        ) {
            link.classList.add("active");
        } else if (filename.includes("destinations") && href.includes("destinations")) {
            link.classList.add("active");
        } else if (filename.includes("planner") && href.includes("planner")) {
            link.classList.add("active");
        } else if (filename.includes("about") && href.includes("about")) {
            link.classList.add("active");
        }
    });
}

function checkUrlAlerts() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("logged_out") === "true") {
        showToast("You have been safely logged out.", "info");
    } else if (urlParams.get("login_required") === "true") {
        showToast("Please log in to view that page.", "error");
    }
}

// ==================== 5. TOAST NOTIFICATION SYSTEM ====================
function showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconClass = "fa-circle-info";
    if (type === "success") iconClass = "fa-circle-check";
    if (type === "error") iconClass = "fa-circle-exclamation";

    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <div>${message}</div>
    `;

    container.appendChild(toast);

    // Trigger enter animation
    setTimeout(() => toast.classList.add("show"), 50);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ==================== 6. DESTINATIONS VIEW & FILTERING ====================
async function fetchDestinationsFromApi() {
    try {
        const res = await fetch("/api/destinations");
        if (res.ok) {
            const data = await res.json();
            if (data.status === "success" && Array.isArray(data.destinations)) {
                const map = {};
                data.destinations.forEach(d => {
                    map[d.id] = {
                        id: d.id,
                        name: d.name,
                        state: d.state,
                        category: d.category,
                        tag: d.tag,
                        image: d.image,
                        description: d.description,
                        bestTime: d.best_time,
                        dailyRateText: d.daily_rate_text,
                        airport: d.airport,
                        airportQuery: d.airport_query,
                        railway: d.railway,
                        railwayQuery: d.railway_query,
                        mapQuery: d.map_query,
                        rates: d.rates,
                        highlights: d.highlights,
                        coordinates: d.coordinates   // ← required for map markers
                    };
                });
                DESTINATIONS_DATA = map;
            }
        }
    } catch (e) {
        console.warn("Using local destinations dataset:", e);
    }
}

function initDestinationsView() {
    const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname === "";
    
    // Render all or top 3 if on home page preview
    renderDestinationCards("all", isHomePage ? 3 : null);

    // Filter Buttons
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const cat = btn.getAttribute("data-category");
            renderDestinationCards(cat);
        });
    });

    // Search bar (on destinations.html)
    const searchInput = document.getElementById("destSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            renderDestinationCards("all", null, query);
        });
    }
}

function renderDestinationCards(category = "all", limit = null, searchQuery = "") {
    const grid = document.getElementById("destinationsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    let keys = Object.keys(DESTINATIONS_DATA);

    // Filter by search query
    if (searchQuery) {
        keys = keys.filter(k => {
            const dest = DESTINATIONS_DATA[k];
            return dest.name.toLowerCase().includes(searchQuery) ||
                   dest.state.toLowerCase().includes(searchQuery) ||
                   dest.description.toLowerCase().includes(searchQuery);
        });
    }

    // Filter by Category
    if (category !== "all") {
        keys = keys.filter(k => {
            const dest = DESTINATIONS_DATA[k];
            if (dest.category === category) return true;
            if (category === "nature" && (k === "ziro" || k === "chopta")) return true;
            if (category === "heritage" && (k === "devprayag" || k === "orchha" || k === "dhanushkodi")) return true;
            return false;
        });
    }

    if (keys.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 2.2rem; margin-bottom: 12px; color: var(--primary);"></i>
                <h3 style="color: var(--text-main);">No destinations found</h3>
                <p>Try searching with another keyword or selecting a different category filter.</p>
            </div>
        `;
        return;
    }

    if (limit && typeof limit === "number") {
        keys = keys.slice(0, limit);
    }

    keys.forEach(key => {
        const dest = DESTINATIONS_DATA[key];
        const card = document.createElement("div");
        card.className = "dest-card";
        card.innerHTML = `
            <div class="dest-card-media">
                <img src="${dest.image}" alt="${dest.name}" class="dest-card-img" loading="lazy">
                <span class="dest-card-badge">${dest.tag}</span>
                <span class="dest-card-state"><i class="fa-solid fa-location-dot"></i> ${dest.state}</span>
            </div>
            <div class="dest-card-body">
                <h3 class="dest-card-title">${dest.name}</h3>
                <p class="dest-card-desc">${dest.description}</p>
                <div class="dest-card-highlights">
                    <span class="dest-pill"><i class="fa-solid fa-star"></i> ${dest.highlights[0]}</span>
                    <span class="dest-pill"><i class="fa-solid fa-compass"></i> ${dest.highlights[1]}</span>
                </div>
                <div class="dest-card-footer">
                    <span class="dest-rate-tag">Est: <strong>${dest.dailyRateText}</strong></span>
                    <button class="btn btn-primary btn-sm btn-explore" data-id="${dest.id}">
                        <i class="fa-solid fa-arrow-right"></i> Explore
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Attach click events
    document.querySelectorAll(".btn-explore").forEach(btn => {
        btn.addEventListener("click", () => {
            const destId = btn.getAttribute("data-id");
            openDestinationModal(destId);
        });
    });
}

// ==================== 7. DETAILS MODAL CONTROLLER ====================
function openDestinationModal(destId) {
    const dest = DESTINATIONS_DATA[destId];
    if (!dest) return;

    currentModalDestination = destId;
    const modal = document.getElementById("destinationModal");
    if (!modal) return;

    document.getElementById("modalImg").src = dest.image;
    document.getElementById("modalCategory").textContent = dest.tag;
    document.getElementById("modalState").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${dest.state}`;
    document.getElementById("modalTitle").textContent = `${dest.name}, ${dest.state}`;
    document.getElementById("modalDescription").textContent = dest.description;
    document.getElementById("modalBestTime").textContent = dest.bestTime;
    document.getElementById("modalDailyRate").textContent = dest.dailyRateText;
    document.getElementById("modalAirport").textContent = dest.airport;
    document.getElementById("modalRailway").textContent = dest.railway;

    const hl = document.getElementById("modalHighlights");
    hl.innerHTML = "";
    dest.highlights.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        hl.appendChild(li);
    });

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeDestinationModal() {
    const modal = document.getElementById("destinationModal");
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function initModal() {
    const closeBtn = document.getElementById("modalCloseBtn");
    const modal = document.getElementById("destinationModal");
    const planHereBtn = document.getElementById("modalBtnPlanHere");

    if (closeBtn) closeBtn.addEventListener("click", closeDestinationModal);

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeDestinationModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal?.classList.contains("show")) {
            closeDestinationModal();
        }
    });

    if (planHereBtn) {
        planHereBtn.addEventListener("click", () => {
            if (currentModalDestination) {
                closeDestinationModal();
                // If on planner page, prefill immediately
                const destSelect = document.getElementById("destinationSelect");
                if (destSelect) {
                    destSelect.value = currentModalDestination;
                    document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
                } else {
                    // Redirect to dedicated planner page with query param
                    window.location.href = `planner.html?dest=${currentModalDestination}`;
                }
            }
        });
    }
}

// ==================== 8. TRIP PLANNER CONTROLLER ====================
function initPlannerView() {
    const form = document.getElementById("tripPlannerForm");
    const destSelect = document.getElementById("destinationSelect");
    const errorMsg = document.getElementById("formErrorMsg");

    // Check if URL has ?dest=xyz query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const destParam = urlParams.get("dest");
    if (destParam && DESTINATIONS_DATA[destParam] && destSelect) {
        destSelect.value = destParam;
    }

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const destKey = destSelect.value;
        const days = parseInt(document.getElementById("tripDays").value, 10);
        const budget = parseInt(document.getElementById("budgetPerPerson").value, 10);
        const travellers = parseInt(document.getElementById("numTravellers").value, 10);
        const preference = document.getElementById("travelPreference").value;
        const submitBtn = document.getElementById("btnSubmitPlan");

        errorMsg.style.display = "none";
        errorMsg.textContent = "";

        // Client validation
        if (!destKey) {
            showPlannerError("Please select a destination from the list.");
            return;
        }
        if (isNaN(days) || days < 1 || days > 14) {
            showPlannerError("Please enter travel days between 1 and 14.");
            return;
        }
        if (isNaN(budget) || budget < 1000) {
            showPlannerError("Please enter a realistic budget per person (minimum ₹1,000).");
            return;
        }
        if (isNaN(travellers) || travellers < 1 || travellers > 20) {
            showPlannerError("Please enter travellers count between 1 and 20.");
            return;
        }

        // Loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Calculating Plan...`;
        }

        try {
            const res = await fetch("/api/plan-trip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destination: destKey,
                    days: days,
                    budget_per_person: budget,
                    travellers: travellers,
                    preference: preference
                })
            });

            const result = await res.json();
            if (res.ok && result.status === "success" && result.data) {
                lastCalculatedPlan = result.data;
                displayPlanResults(result.data);
            } else {
                showPlannerError(result.message || "Failed to calculate plan.");
            }
        } catch (err) {
            console.warn("Flask API call error, using local calculation fallback:", err);
            const fallback = calculateLocalPlan(destKey, days, budget, travellers, preference);
            lastCalculatedPlan = fallback;
            displayPlanResults(fallback);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Itinerary & Cost Plan`;
            }
        }
    });

    // Save trip button handler (if present in results)
    const btnSavePlan = document.getElementById("btnSavePlan");
    if (btnSavePlan) {
        btnSavePlan.addEventListener("click", async () => {
            if (!currentUser) {
                showToast("Please log in to save this trip to your profile.", "error");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1200);
                return;
            }

            if (!lastCalculatedPlan) return;

            try {
                const res = await fetch("/api/auth/save-trip", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        destination: lastCalculatedPlan.destination.id,
                        destination_name: lastCalculatedPlan.destination.name,
                        state: lastCalculatedPlan.destination.state,
                        days: lastCalculatedPlan.parameters.days,
                        travellers: lastCalculatedPlan.parameters.travellers,
                        preference: lastCalculatedPlan.parameters.preference,
                        estimated_per_person: lastCalculatedPlan.budget.total_estimated_per_person,
                        total_group_cost: lastCalculatedPlan.budget.total_estimated_group
                    })
                });

                if (res.ok) {
                    showToast("Trip plan saved to your profile!", "success");
                    btnSavePlan.innerHTML = `<i class="fa-solid fa-circle-check"></i> Saved to Profile`;
                    btnSavePlan.disabled = true;
                }
            } catch (err) {
                showToast("Saved locally to your session.", "success");
            }
        });
    }
}

function showPlannerError(msg) {
    const errorMsg = document.getElementById("formErrorMsg");
    if (errorMsg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = "block";
    }
}

function displayPlanResults(data) {
    const emptyState = document.getElementById("resultsEmptyState");
    const content = document.getElementById("resultsContent");
    if (emptyState) emptyState.style.display = "none";
    if (content) content.style.display = "block";

    const dest = data.destination;
    const params = data.parameters;
    const budget = data.budget;
    const itinerary = data.itinerary;
    const transit = data.transit_links;

    document.getElementById("planDestState").textContent = dest.state;
    document.getElementById("planDestTitle").textContent = `${dest.name}, ${dest.state}`;

    const prefLabels = {
        nature: "Nature & Scenic Trails",
        adventure: "Adventure & Trekking",
        cultural: "Cultural & Heritage",
        relaxation: "Relaxation & Serenity"
    };
    document.getElementById("planMetaText").textContent = `${params.days} Days • ${params.travellers} ${params.travellers === 1 ? 'Traveller' : 'Travellers'} • ${prefLabels[params.preference] || 'Custom'}`;

    // Feasibility status
    const statusPill = document.getElementById("planStatusPill");
    const alertBox = document.getElementById("feasibilityAlert");

    if (budget.is_sufficient) {
        statusPill.className = "plan-status-pill feasible";
        statusPill.innerHTML = `<i class="fa-solid fa-circle-check"></i> Budget Sufficient`;

        alertBox.className = "feasibility-alert success";
        alertBox.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <div>
                <strong>Budget Sufficient & Feasible:</strong> Your budget of <strong>₹${budget.user_budget_per_person.toLocaleString('en-IN')}</strong> per person comfortably covers the estimated cost of <strong>₹${budget.total_estimated_per_person.toLocaleString('en-IN')}</strong>. 
                <br>Estimated buffer: <strong>₹${budget.budget_difference.toLocaleString('en-IN')}</strong> per person for shopping and contingencies.
            </div>
        `;
    } else {
        statusPill.className = "plan-status-pill warning";
        statusPill.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Budget Warning`;

        const shortfall = Math.abs(budget.budget_difference);
        alertBox.className = "feasibility-alert warning";
        alertBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>
                <strong>Budget Warning (Insufficient Funds):</strong> Your entered budget of <strong>₹${budget.user_budget_per_person.toLocaleString('en-IN')}</strong> is lower than the realistic baseline estimate of <strong>₹${budget.total_estimated_per_person.toLocaleString('en-IN')}</strong> per person. 
                <br>Shortfall: <strong>₹${shortfall.toLocaleString('en-IN')}</strong> per person. Consider shortening duration or increasing budget.
            </div>
        `;
    }

    // 4 Metrics
    document.getElementById("valPerPerson").textContent = `₹${budget.total_estimated_per_person.toLocaleString('en-IN')}`;
    document.getElementById("subPerPerson").textContent = `Entered: ₹${budget.user_budget_per_person.toLocaleString('en-IN')}`;
    document.getElementById("valDailyCost").textContent = `₹${budget.daily_estimated_per_person.toLocaleString('en-IN')}`;
    document.getElementById("valGroupTotal").textContent = `₹${budget.total_estimated_group.toLocaleString('en-IN')}`;
    document.getElementById("subGroupTravellers").textContent = `Total for ${params.travellers} ${params.travellers === 1 ? 'traveller' : 'travellers'}`;
    document.getElementById("valGroupBudget").textContent = `₹${budget.total_budget_group.toLocaleString('en-IN')}`;

    const diffEl = document.getElementById("subBudgetDiff");
    if (budget.is_sufficient) {
        diffEl.textContent = `+₹${(budget.budget_difference * params.travellers).toLocaleString('en-IN')} remaining buffer`;
        diffEl.style.color = "var(--success)";
    } else {
        diffEl.textContent = `-₹${(Math.abs(budget.budget_difference) * params.travellers).toLocaleString('en-IN')} deficit`;
        diffEl.style.color = "var(--danger)";
    }

    // Breakdown Bars
    const total = budget.total_estimated_per_person || 1;
    const pAccom = Math.round((budget.breakdown.accommodation / total) * 100);
    const pFood = Math.round((budget.breakdown.food / total) * 100);
    const pTrans = Math.round((budget.breakdown.transport / total) * 100);
    const pAct = Math.round((budget.breakdown.activity / total) * 100);

    document.getElementById("catAccomCost").textContent = `₹${budget.breakdown.accommodation.toLocaleString('en-IN')} (${pAccom}%)`;
    document.getElementById("catAccomBar").style.width = `${pAccom}%`;
    document.getElementById("catFoodCost").textContent = `₹${budget.breakdown.food.toLocaleString('en-IN')} (${pFood}%)`;
    document.getElementById("catFoodBar").style.width = `${pFood}%`;
    document.getElementById("catTransportCost").textContent = `₹${budget.breakdown.transport.toLocaleString('en-IN')} (${pTrans}%)`;
    document.getElementById("catTransportBar").style.width = `${pTrans}%`;
    document.getElementById("catActivityCost").textContent = `₹${budget.breakdown.activity.toLocaleString('en-IN')} (${pAct}%)`;
    document.getElementById("catActivityBar").style.width = `${pAct}%`;

    // Transit Links
    document.getElementById("linkGoogleMaps").href = transit.destination_map_url;
    document.getElementById("txtMapsDest").textContent = transit.destination_label;
    document.getElementById("linkAirport").href = transit.airport_map_url;
    document.getElementById("txtAirport").textContent = transit.airport_name;
    document.getElementById("linkRailway").href = transit.railway_map_url;
    document.getElementById("txtRailway").textContent = transit.railway_name;

    // Render Accordion
    renderAccordion(itinerary);

    // Reset save button if exists
    const btnSavePlan = document.getElementById("btnSavePlan");
    if (btnSavePlan) {
        btnSavePlan.innerHTML = `<i class="fa-solid fa-bookmark"></i> Save Trip to Profile`;
        btnSavePlan.disabled = false;
    }

    if (window.innerWidth < 900) {
        content.scrollIntoView({ behavior: "smooth" });
    }
}

function renderAccordion(itinerary) {
    const container = document.getElementById("itineraryAccordion");
    if (!container) return;
    container.innerHTML = "";

    itinerary.forEach((item, index) => {
        const isOpen = index === 0;
        const div = document.createElement("div");
        div.className = `accordion-item ${isOpen ? 'active' : ''}`;
        div.innerHTML = `
            <button type="button" class="accordion-header" aria-expanded="${isOpen}">
                <div class="accordion-header-left">
                    <span class="day-badge">Day ${item.day}</span>
                    <span class="day-theme-title">${item.theme}</span>
                </div>
                <i class="fa-solid fa-chevron-down accordion-icon"></i>
            </button>
            <div class="accordion-content">
                <div class="day-timeline">
                    <div class="timeline-slot">
                        <span class="slot-time"><i class="fa-solid fa-sun"></i> Morning</span>
                        <h5 class="slot-title">Kickstart & Exploration</h5>
                        <p class="slot-desc">${item.morning}</p>
                    </div>
                    <div class="timeline-slot">
                        <span class="slot-time"><i class="fa-solid fa-cloud-sun"></i> Afternoon</span>
                        <h5 class="slot-title">Immersion & Flavors</h5>
                        <p class="slot-desc">${item.afternoon}</p>
                    </div>
                    <div class="timeline-slot">
                        <span class="slot-time"><i class="fa-solid fa-moon"></i> Evening</span>
                        <h5 class="slot-title">Sunset & Relaxation</h5>
                        <p class="slot-desc">${item.evening}</p>
                    </div>
                </div>
                <div class="day-pro-tip">
                    <i class="fa-solid fa-lightbulb"></i>
                    <span><strong>Pro-Tip:</strong> ${item.tip}</span>
                </div>
            </div>
        `;
        container.appendChild(div);

        const headerBtn = div.querySelector(".accordion-header");
        headerBtn.addEventListener("click", () => {
            const isActive = div.classList.contains("active");
            document.querySelectorAll(".accordion-item").forEach(other => {
                if (other !== div) other.classList.remove("active");
            });
            div.classList.toggle("active", !isActive);
            headerBtn.setAttribute("aria-expanded", !isActive);
        });
    });
}

function calculateLocalPlan(destKey, days, budget, travellers, preference) {
    const dest = DESTINATIONS_DATA[destKey];
    const mults = {
        adventure: { stay: 1.0, food: 1.05, transport: 1.15, activity: 1.25 },
        cultural: { stay: 1.05, food: 1.0, transport: 1.0, activity: 1.20 },
        relaxation: { stay: 1.20, food: 1.15, transport: 1.05, activity: 0.90 },
        nature: { stay: 1.0, food: 1.0, transport: 1.05, activity: 1.05 }
    };
    const m = mults[preference] || mults.nature;

    const roomRate = Math.round(dest.rates.stay * 1.6 * m.stay);
    const numRooms = Math.ceil(travellers / 2);
    const lodgingTotal = roomRate * numRooms * Math.max(1, days - 1);
    const lodgingPP = Math.round(lodgingTotal / travellers);

    const foodPP = Math.round(dest.rates.food * m.food) * days;
    const baseCab = Math.round(dest.rates.transport * 2.2 * m.transport);
    const transTotal = baseCab * Math.ceil(travellers / 4) * days;
    const transPP = Math.round(transTotal / travellers);
    const actPP = Math.round(dest.rates.activity * m.activity) * days;

    const estPP = lodgingPP + foodPP + transPP + actPP;

    return {
        destination: {
            id: dest.id,
            name: dest.name,
            state: dest.state,
            category: dest.category,
            tag: dest.tag,
            image: dest.image,
            description: dest.description,
            best_time: dest.bestTime,
            daily_rate_text: dest.dailyRateText,
            airport: dest.airport,
            railway: dest.railway
        },
        parameters: { days, travellers, preference, user_budget_per_person: budget },
        budget: {
            user_budget_per_person: budget,
            total_budget_group: budget * travellers,
            total_estimated_per_person: estPP,
            daily_estimated_per_person: Math.round(estPP / days),
            total_estimated_group: estPP * travellers,
            budget_difference: budget - estPP,
            is_sufficient: budget >= estPP,
            breakdown: { accommodation: lodgingPP, food: foodPP, transport: transPP, activity: actPP }
        },
        itinerary: [
            {
                day: 1,
                theme: `Day 1: Arrival & Orientation`,
                morning: `Arrival at ${dest.name} base. Check in to local homestay.`,
                afternoon: `Local neighborhood orientation walk and regional lunch.`,
                evening: `Sunset watching and briefing on local customs.`,
                tip: `Keep local cash currency on hand.`
            }
        ],
        transit_links: {
            destination_map_url: `https://www.google.com/maps/search/?api=1&query=${dest.mapQuery}`,
            destination_label: `${dest.name}, ${dest.state}`,
            airport_name: dest.airport,
            airport_map_url: `https://www.google.com/maps/search/?api=1&query=${dest.airportQuery}`,
            railway_name: dest.railway,
            railway_map_url: `https://www.google.com/maps/search/?api=1&query=${dest.railwayQuery}`
        }
    };
}

// ==================== 9. LOGIN & REGISTRATION CONTROLLER ====================
function initLoginView() {
    const form = document.getElementById("loginForm");
    const demoBtn = document.getElementById("btnFillDemoLogin");
    const togglePass = document.getElementById("togglePassword");
    const passInput = document.getElementById("loginPassword");
    const errorBox = document.getElementById("authErrorMsg");

    if (demoBtn) {
        demoBtn.addEventListener("click", () => {
            document.getElementById("loginEmail").value = "explorer@tripcraft.in";
            document.getElementById("loginPassword").value = "password123";
            showToast("Demo credentials filled!", "info");
        });
    }

    if (togglePass && passInput) {
        togglePass.addEventListener("click", () => {
            const isText = passInput.type === "text";
            passInput.type = isText ? "password" : "text";
            togglePass.innerHTML = isText ? `<i class="fa-solid fa-eye"></i>` : `<i class="fa-solid fa-eye-slash"></i>`;
        });
    }

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = passInput.value;
        const submitBtn = document.getElementById("btnSubmitLogin");

        errorBox.style.display = "none";

        if (!email || !password) {
            errorBox.textContent = "Please enter both email and password.";
            errorBox.style.display = "block";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Logging in...`;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok && data.status === "success") {
                currentUser = data.user;
                localStorage.setItem("tripcraft_user", JSON.stringify(data.user));
                showToast("Login successful! Welcome back.", "success");
                setTimeout(() => {
                    window.location.href = "profile.html";
                }, 600);
            } else {
                errorBox.textContent = data.message || "Invalid credentials.";
                errorBox.style.display = "block";
            }
        } catch (err) {
            // Local fallback login for demo
            if (email === "explorer@tripcraft.in" && password === "password123") {
                const demoUser = {
                    name: "Aarav Sharma",
                    email: "explorer@tripcraft.in",
                    home_city: "New Delhi",
                    travel_style: "nature",
                    saved_trips: []
                };
                currentUser = demoUser;
                localStorage.setItem("tripcraft_user", JSON.stringify(demoUser));
                showToast("Demo login successful!", "success");
                setTimeout(() => { window.location.href = "profile.html"; }, 600);
            } else {
                errorBox.textContent = "Unable to connect to server. Check your connection.";
                errorBox.style.display = "block";
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Sign In`;
        }
    });
}

function initRegisterView() {
    const form = document.getElementById("registerForm");
    const errorBox = document.getElementById("authErrorMsg");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("regConfirmPassword").value;
        const homeCity = document.getElementById("regHomeCity").value.trim();
        const travelStyle = document.getElementById("regTravelStyle").value;
        const submitBtn = document.getElementById("btnSubmitRegister");

        errorBox.style.display = "none";

        if (password !== confirmPassword) {
            errorBox.textContent = "Passwords do not match.";
            errorBox.style.display = "block";
            return;
        }

        if (password.length < 6) {
            errorBox.textContent = "Password must be at least 6 characters long.";
            errorBox.style.display = "block";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...`;

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    home_city: homeCity,
                    travel_style: travelStyle
                })
            });

            const data = await res.json();
            if (res.ok && data.status === "success") {
                currentUser = data.user;
                localStorage.setItem("tripcraft_user", JSON.stringify(data.user));
                showToast("Account created successfully!", "success");
                setTimeout(() => {
                    window.location.href = "profile.html";
                }, 600);
            } else {
                errorBox.textContent = data.message || "Registration failed.";
                errorBox.style.display = "block";
            }
        } catch (err) {
            errorBox.textContent = "Unable to connect to server.";
            errorBox.style.display = "block";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i> Create Account`;
        }
    });
}

// ==================== 10. PROFILE VIEW CONTROLLER ====================
function initProfileView() {
    if (!currentUser) {
        // Redirect to login if user not logged in
        window.location.href = "login.html?login_required=true";
        return;
    }

    // Populate user profile info
    const nameEl = document.getElementById("profileUserName");
    const emailEl = document.getElementById("profileUserEmail");
    const avatarEl = document.getElementById("profileAvatarCircle");
    const cityEl = document.getElementById("profileUserCity");
    const styleEl = document.getElementById("profileUserStyle");
    const bioEl = document.getElementById("profileUserBio");

    if (nameEl) nameEl.textContent = currentUser.name;
    if (emailEl) emailEl.textContent = currentUser.email;
    if (avatarEl) avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();
    if (cityEl) cityEl.textContent = currentUser.home_city || "India";
    if (styleEl) styleEl.textContent = (currentUser.travel_style || "Nature").toUpperCase();
    if (bioEl) bioEl.textContent = currentUser.bio || "Avid traveler exploring India's secret gems.";

    // Render Saved Trips
    renderProfileSavedTrips();
}

function renderProfileSavedTrips() {
    const list = document.getElementById("profileSavedTripsList");
    const countEl = document.getElementById("savedTripsCount");
    if (!list) return;

    const trips = (currentUser && currentUser.saved_trips) ? currentUser.saved_trips : [];
    if (countEl) countEl.textContent = trips.length;

    if (trips.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-map-location-dot" style="font-size: 2rem; color: var(--primary); margin-bottom: 12px;"></i>
                <h4>No saved trips yet</h4>
                <p style="font-size: 0.9rem; margin-bottom: 18px;">Create a personalized trip plan and click "Save Trip to Profile".</p>
                <a href="planner.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-plus"></i> Plan a Trip Now</a>
            </div>
        `;
        return;
    }

    list.innerHTML = "";
    trips.forEach(trip => {
        const item = document.createElement("div");
        item.className = "saved-trip-item";
        item.innerHTML = `
            <div class="saved-trip-info">
                <h4><i class="fa-solid fa-location-dot" style="color: var(--primary); margin-right: 6px;"></i> ${trip.destination_name}, ${trip.state}</h4>
                <p>${trip.days} Days • ${trip.travellers} Travellers • ${trip.preference.toUpperCase()}</p>
            </div>
            <div class="saved-trip-meta">
                <span class="saved-trip-budget">₹${(trip.estimated_per_person || 0).toLocaleString('en-IN')} / person</span>
                <a href="planner.html?dest=${trip.destination}" class="btn btn-outline btn-sm"><i class="fa-solid fa-eye"></i> View</a>
            </div>
        `;
        list.appendChild(item);
    });
}

// ==================== 11. SETTINGS VIEW CONTROLLER ====================
function initSettingsView() {
    if (!currentUser) {
        window.location.href = "login.html?login_required=true";
        return;
    }

    // Prefill form
    const nameInput = document.getElementById("settingsName");
    const emailInput = document.getElementById("settingsEmail");
    const phoneInput = document.getElementById("settingsPhone");
    const cityInput = document.getElementById("settingsCity");
    const bioInput = document.getElementById("settingsBio");
    const styleInput = document.getElementById("settingsStyle");

    if (nameInput) nameInput.value = currentUser.name || "";
    if (emailInput) emailInput.value = currentUser.email || "";
    if (phoneInput) phoneInput.value = currentUser.phone || "+91 98765 43210";
    if (cityInput) cityInput.value = currentUser.home_city || "New Delhi";
    if (bioInput) bioInput.value = currentUser.bio || "";
    if (styleInput && currentUser.travel_style) styleInput.value = currentUser.travel_style;

    const form = document.getElementById("settingsForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById("btnSaveSettings");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving Changes...`;

        const updateData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            home_city: cityInput.value.trim(),
            bio: bioInput.value.trim(),
            travel_style: styleInput.value
        };

        const newPass = document.getElementById("settingsNewPass")?.value;
        if (newPass && newPass.length >= 6) {
            updateData.new_password = newPass;
        }

        try {
            const res = await fetch("/api/auth/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });

            if (res.ok) {
                const result = await res.json();
                currentUser = result.user;
                localStorage.setItem("tripcraft_user", JSON.stringify(result.user));
                updateNavbarAuthState();
                showToast("Profile settings saved successfully!", "success");
            } else {
                showToast("Failed to update settings.", "error");
            }
        } catch (err) {
            // Local fallback
            Object.assign(currentUser, updateData);
            localStorage.setItem("tripcraft_user", JSON.stringify(currentUser));
            updateNavbarAuthState();
            showToast("Settings updated locally.", "success");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Profile Settings`;
        }
    });
}


// ==================== 10. INTERACTIVE DESTINATIONS MAP (Leaflet.js + OpenStreetMap) ====================
/**
 * initInteractiveMap()
 * Renders a full interactive Leaflet.js map on index.html with:
 * - CartoDB Dark tile layer (matches site's dark theme)
 * - 9 custom animated pin markers (one per destination)
 * - Popups with image, name, description, and action buttons
 * - Quick-jump filter chips for each destination
 */
function initInteractiveMap() {
    const mapContainer = document.getElementById("destinationsMap");
    if (!mapContainer) return;

    // Show error message if Leaflet failed to load (e.g., integrity hash mismatch)
    if (typeof L === "undefined") {
        mapContainer.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:14px;padding:40px;text-align:center;">
                <i class="fa-solid fa-map-location-dot" style="font-size:3rem;color:#9470E8;opacity:0.6;"></i>
                <p style="color:#BDB5CE;font-size:0.95rem;">Map could not load. Please check your internet connection and refresh the page.</p>
            </div>`;
        return;
    }

    // --- 1. Initialise the Leaflet map centred on India ---
    const map = L.map("destinationsMap", {
        center: [22.5, 82.5],
        zoom: 5,
        scrollWheelZoom: false,   // prevent accidental scroll-zoom on the page
        zoomControl: true
    });

    // --- 2. Dark tile layer from CartoDB (consistent with dark theme) ---
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/" target="_blank">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
    }).addTo(map);

    // --- 3. Custom DivIcon factory ---
    function createMarkerIcon(color) {
        color = color || "#36BFC0";
        return L.divIcon({
            className: "custom-map-marker",
            html: `<div class="custom-marker-pin" style="background:${color};box-shadow:0 0 0 4px ${color}33"></div><div class="custom-marker-pulse" style="background:${color}33;border:2px solid ${color}66"></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -46]
        });
    }

    // Category → accent colour mapping (purple/lavender theme)
    const categoryColors = {
        mountains: "#B69CFF",   // soft lavender
        coastal:   "#D8C5FF",   // light lavender
        heritage:  "#9470E8",   // deep purple
        nature:    "#a78bfa"    // violet
    };

    // Store markers so chips can reference them
    const markerMap = {};
    const chipsContainer = document.getElementById("mapChipsContainer");

    // --- 4. Add one marker + popup per destination ---
    Object.values(DESTINATIONS_DATA).forEach(function(dest) {
        if (!dest.coordinates) return;

        const { lat, lng } = dest.coordinates;
        const color = categoryColors[dest.category] || "#36BFC0";
        const icon  = createMarkerIcon(color);

        // Use dest.image (set from API or fallback dataset — already points to  folder)
        const imgSrc = dest.image || ("ziro.jpg");

        const popupHTML = `
            <div class="map-popup-card">
                <div class="map-popup-thumb-wrap">
                    <img class="map-popup-thumb" src="${imgSrc}" alt="${dest.name}" loading="lazy"
                         onerror="this.src='almaty.jpg'">
                    <span class="map-popup-tag">${dest.tag}</span>
                </div>
                <div class="map-popup-body">
                    <div class="map-popup-title">${dest.name}</div>
                    <div class="map-popup-state">
                        <i class="fa-solid fa-location-dot"></i> ${dest.state}
                    </div>
                    <p class="map-popup-desc">${dest.description.substring(0, 110)}…</p>
                    <div class="map-popup-actions">
                        <a href="destinations.html?dest=${dest.id}" class="map-popup-btn map-popup-btn-primary">
                            <i class="fa-solid fa-compass"></i> Explore
                        </a>
                        <a href="planner.html?dest=${dest.id}" class="map-popup-btn map-popup-btn-secondary">
                            <i class="fa-solid fa-route"></i> Plan Trip
                        </a>
                    </div>
                </div>
            </div>`;

        const marker = L.marker([lat, lng], { icon: icon })
            .addTo(map)
            .bindPopup(popupHTML, {
                maxWidth: 270,
                className: "dark-popup"
            });

        markerMap[dest.id] = { marker, lat, lng };

        // --- 5. Quick-jump chip ---
        if (chipsContainer) {
            const chip = document.createElement("button");
            chip.className = "map-chip";
            chip.innerHTML = `<i class="fa-solid fa-map-pin" style="color:${color}"></i> ${dest.name}`;
            chip.setAttribute("title", dest.state);
            chip.addEventListener("click", function() {
                // Remove active from siblings
                chipsContainer.querySelectorAll(".map-chip").forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                // Fly to destination and open popup
                map.flyTo([lat, lng], 10, { duration: 1.4 });
                setTimeout(function() { marker.openPopup(); }, 1500);
            });
            chipsContainer.appendChild(chip);
        }
    });

    // --- 6. Enable scroll-wheel zoom only when user clicks on the map ---
    mapContainer.addEventListener("click", function() {
        map.scrollWheelZoom.enable();
    });
    mapContainer.addEventListener("mouseleave", function() {
        map.scrollWheelZoom.disable();
    });
}
