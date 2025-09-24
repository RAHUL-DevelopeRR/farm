// Application Data
const appData = {
  "dashboard_stats": {"total_farms": 15, "active_alerts": 3, "recommendations_today": 12, "soil_tests_pending": 5},
  "soil_health": {"nitrogen": "120 kg/ha", "phosphorus": "55 kg/ha", "potassium": "80 kg/ha", "ph_level": "6.8", "status": "Good", "last_updated": "2025-09-24T14:30:00Z", "moisture": "45%", "organic_matter": "3.2%"},
  "weather": {"current": {"temperature": "28°C", "condition": "Partly Cloudy", "humidity": "65%", "wind_speed": "12 km/h", "location": "Pune, Maharashtra"}, "forecast": [{"day": "Today", "high": "32°C", "low": "22°C", "condition": "Sunny"}, {"day": "Tomorrow", "high": "30°C", "low": "20°C", "condition": "Cloudy"}, {"day": "Thursday", "high": "29°C", "low": "21°C", "condition": "Rain"}]},
  "recent_activity": [{"timestamp": "2025-09-24T11:45:00Z", "type": "soil_test", "message": "Soil test completed for Field A - pH level normal", "status": "success"}, {"timestamp": "2025-09-24T11:30:00Z", "type": "pest_detection", "message": "Aphids detected in cotton crop - treatment recommended", "status": "warning"}]
};

// DOM Elements and State
let currentSection = 'dashboard';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SmartFarm Dashboard - Initializing...');
    
    try {
        initializeNavigation();
        initializeMobileMenu();
        initializeModal();
        initializeFeatureCards();
        initializeButtons();
        updateDateTime();
        
        // Set initial section to dashboard
        showSection('dashboard');
        
        // Update date/time every minute
        setInterval(updateDateTime, 60000);
        
        console.log('SmartFarm Dashboard - Initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
                updateNavigation(section);
                
                // Close mobile menu on navigation
                closeMobileMenu();
            }
        });
    });
}

// Switch between sections
function showSection(sectionName) {
    try {
        // Hide all sections
        const allSections = document.querySelectorAll('.section-content');
        allSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            console.warn(`Section not found: ${sectionName}-section`);
            return;
        }
        
        // Update header
        updateHeader(sectionName);
        
        // Update current section
        currentSection = sectionName;
        
        console.log(`Switched to section: ${sectionName}`);
    } catch (error) {
        console.error('Error switching section:', error);
    }
}

// Update navigation active state
function updateNavigation(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const section = link.getAttribute('data-section');
        if (section === activeSection) {
            link.classList.add('active');
        }
    });
}

// Update header information
function updateHeader(sectionName) {
    const sectionTitles = {
        'dashboard': 'Dashboard',
        'soil': 'Soil Analysis',
        'pest': 'Pest Detection',
        'crops': 'Crop Advisory',
        'market': 'Market Prices',
        'weather': 'Weather',
        'reports': 'Reports',
        'settings': 'Settings'
    };
    
    const title = sectionTitles[sectionName] || 'Dashboard';
    
    const pageTitle = document.getElementById('page-title');
    const currentSection = document.getElementById('current-section');
    
    if (pageTitle) {
        pageTitle.textContent = title;
    }
    
    if (currentSection) {
        currentSection.textContent = title;
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
}

// Close mobile menu
function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.remove('open');
    }
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('expert-modal');
    const closeButton = document.getElementById('close-modal');
    
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Open modal
function openModal() {
    const modal = document.getElementById('expert-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        console.log('Expert modal opened');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('expert-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        console.log('Expert modal closed');
    }
}

// Feature cards functionality
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const section = this.getAttribute('data-section');
            const action = this.getAttribute('data-action');
            
            if (section) {
                showSection(section);
                updateNavigation(section);
                console.log(`Feature card clicked: ${section}`);
            } else if (action === 'expert') {
                openModal();
                console.log('Ask Expert feature card clicked');
            }
        });
    });
}

// Initialize all buttons
function initializeButtons() {
    // Export buttons
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleExport();
        });
    });
    
    // Form submit buttons
    const submitButtons = document.querySelectorAll('.btn');
    submitButtons.forEach(button => {
        if (button.textContent.includes('Submit') || button.textContent.includes('Save')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleFormSubmit();
            });
        }
    });
    
    // Generic button clicks
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Handle export functionality
function handleExport() {
    alert('Export functionality will download reports in CSV/PDF format');
    console.log('Export requested');
}

// Handle form submissions
function handleFormSubmit() {
    alert('Form submitted successfully!');
    closeModal();
    console.log('Form submitted');
}

// Update date and time
function updateDateTime() {
    try {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const dateString = now.toLocaleDateString('en-US', options);
        const dateElement = document.getElementById('current-date');
        
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    } catch (error) {
        console.error('Error updating date/time:', error);
    }
}

// Utility functions
function formatTime(timestamp) {
    try {
        return new Date(timestamp).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'Invalid time';
    }
}

function formatDate(timestamp) {
    try {
        return new Date(timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

// Handle hover effects for interactive elements
function addHoverEffects() {
    const cards = document.querySelectorAll('.card, .stat-card, .feature-card, .price-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt + number keys for quick navigation
        if (e.altKey && e.key >= '1' && e.key <= '8') {
            const sections = ['dashboard', 'soil', 'pest', 'crops', 'market', 'weather', 'reports', 'settings'];
            const index = parseInt(e.key) - 1;
            
            if (sections[index]) {
                showSection(sections[index]);
                updateNavigation(sections[index]);
            }
        }
    });
}

// Error handling
function handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
}

// Simple analytics tracking
function trackUserAction(action, section) {
    console.log(`User action: ${action} in section: ${section}`);
}

// Add event listeners for tracking
function initializeTracking() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link')) {
            const section = e.target.getAttribute('data-section');
            trackUserAction('navigate', section);
        }
        
        if (e.target.closest('.feature-card')) {
            const featureTitle = e.target.closest('.feature-card').querySelector('.feature-title');
            if (featureTitle) {
                trackUserAction('feature_access', featureTitle.textContent);
            }
        }
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    try {
        const performanceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log('Page load time:', entry.loadEventEnd - entry.fetchStart, 'ms');
                }
            }
        });
        
        performanceObserver.observe({entryTypes: ['navigation']});
    } catch (e) {
        console.log('Performance monitoring not available in this browser');
    }
}

// Initialize all components after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        try {
            addHoverEffects();
            initializeKeyboardShortcuts();
            initializeTracking();
            initializePerformanceMonitoring();
            
            console.log('Additional features initialized');
        } catch (error) {
            console.error('Error initializing additional features:', error);
        }
    }, 100);
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    return true;
});

// Prevent default form submissions globally
document.addEventListener('submit', function(e) {
    e.preventDefault();
    return false;
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Ensure functions are available globally for debugging
window.SmartFarmDashboard = {
    showSection,
    updateNavigation,
    openModal,
    closeModal,
    handleExport,
    handleFormSubmit,
    currentSection: () => currentSection,
    appData
};

console.log('SmartFarm Dashboard script loaded successfully');