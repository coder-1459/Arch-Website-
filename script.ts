// Portfolio Website TypeScript

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // @ts-ignore - AOS is loaded from CDN
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize all components
    initializeNavigation();
    initializeCategoryFilters();
    initializeContactForm();
    initializeModals();
    initializeSmoothScrolling();
    initializeParallaxEffects();
    initializeLoadMore();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.innerHTML = mobileMenu.classList.contains('hidden') 
                ? '<i class="fas fa-bars text-xl"></i>' 
                : '<i class="fas fa-times text-xl"></i>';
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenu && !mobileMenu.classList.contains('hidden') && mobileMenuButton) {
                        mobileMenu.classList.add('hidden');
                        mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                    }
                }
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = (section as HTMLElement).offsetTop;
            const sectionHeight = (section as HTMLElement).offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('text-purple-400'));
                if (navLink) navLink.classList.add('text-purple-400');
            }
        });
    });
}

// Category filtering functionality
function initializeCategoryFilters() {
    const categoryFilters = document.querySelectorAll('.category-filter');

    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedCategory = filter.getAttribute('data-category');
            if (selectedCategory) {
                // Update active filter
                categoryFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                // Filter projects
                filterProjects(selectedCategory);
            }
        });
    });
}

// Filter projects based on category
function filterProjects(category: string) {
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projects-grid');
    
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardElement = card as HTMLElement;
        
        if (category === 'all' || cardCategory === category) {
            cardElement.style.display = 'block';
            cardElement.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
            cardElement.style.display = 'none';
        }
    });
    
    // Update grid layout
    if (projectsGrid) {
        setTimeout(() => {
            (projectsGrid as HTMLElement).style.display = 'grid';
        }, 100);
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: (document.getElementById('contact-name') as HTMLInputElement)?.value || '',
                email: (document.getElementById('contact-email') as HTMLInputElement)?.value || '',
                subject: (document.getElementById('contact-subject') as HTMLInputElement)?.value || '',
                message: (document.getElementById('contact-message') as HTMLTextAreaElement)?.value || ''
            };

            // Validate form
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// Modal functionality
function initializeModals() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            closeModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            closeModal();
        });
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// View project details
function viewProject(projectId: string) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    // Get project data
    const projectData = getProjectData(projectId);
    
    modalTitle.textContent = projectData.name;
    modalBody.innerHTML = `
        <div class="space-y-6">
            <div class="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg overflow-hidden">
                <img src="${projectData.imageUrl}" alt="${projectData.name}" class="w-full h-full object-cover">
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-2 text-purple-400">Description</h4>
                <p class="text-gray-300">${projectData.description}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <h4 class="text-lg font-semibold mb-2 text-purple-400">Technologies</h4>
                    <div class="flex flex-wrap gap-2">
                        ${projectData.technologies.map(tech => 
                            `<span class="tag">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-2 text-purple-400">Features</h4>
                    <ul class="text-gray-300 space-y-1">
                        ${projectData.features.map(feature => 
                            `<li class="flex items-center"><i class="fas fa-check text-green-400 mr-2"></i>${feature}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
            <div class="grid md:grid-cols-3 gap-4 text-center">
                <div class="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-purple-400">${projectData.year}</div>
                    <div class="text-sm text-gray-400">Year</div>
                </div>
                <div class="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-pink-400">${projectData.rating}</div>
                    <div class="text-sm text-gray-400">Rating</div>
                </div>
                <div class="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-blue-400">${projectData.category}</div>
                    <div class="text-sm text-gray-400">Category</div>
                </div>
            </div>
            <div class="flex gap-4">
                <button onclick="downloadFile('${projectId}', 'pdf')" class="btn-secondary">
                    <i class="fas fa-file-pdf mr-2"></i>Download Documentation
                </button>
                <button onclick="downloadFile('${projectId}', 'apk')" class="btn-primary">
                    <i class="fab fa-android mr-2"></i>Download APK
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Download files
function downloadFile(projectId: string, fileType: string) {
    // Simulate file download
    const link = document.createElement('a');
    link.href = fileType === 'pdf' ? '#' : '#';
    link.download = fileType === 'pdf' ? 'documentation.pdf' : 'app.apk';
    link.click();
    
    showNotification(`${fileType.toUpperCase()} download started!`, 'success');
}

// Project data interface
interface ProjectData {
    name: string;
    description: string;
    technologies: string[];
    features: string[];
    imageUrl: string;
    year: string;
    rating: string;
    category: string;
}

// Get project data
function getProjectData(projectId: string): ProjectData {
    const projects: Record<string, ProjectData> = {
        'ecommerce': {
            name: 'E-Commerce Platform',
            description: 'A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and secure payment processing.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            features: ['Real-time inventory', 'Secure payments', 'Admin dashboard', 'Mobile responsive'],
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            year: '2024',
            rating: '4.8',
            category: 'Web Development'
        },
        'fitness': {
            name: 'Fitness Tracker App',
            description: 'A comprehensive fitness tracking application with workout planning, progress monitoring, and social features.',
            technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
            features: ['Workout tracking', 'Progress monitoring', 'Social features', 'Offline support'],
            imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            year: '2024',
            rating: '4.9',
            category: 'Mobile App'
        },
        'task': {
            name: 'Task Management System',
            description: 'A collaborative task management platform with real-time updates, team collaboration, and project tracking.',
            technologies: ['Vue.js', 'Socket.io', 'Express', 'PostgreSQL'],
            features: ['Real-time updates', 'Team collaboration', 'Project tracking', 'File sharing'],
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            year: '2024',
            rating: '4.7',
            category: 'Web Development'
        },
        'music': {
            name: 'Music Player App',
            description: 'A feature-rich desktop music player with playlist management, audio visualization, and cross-platform support.',
            technologies: ['Electron', 'React', 'Node.js', 'Web Audio API'],
            features: ['Playlist management', 'Audio visualization', 'Cross-platform', 'Custom themes'],
            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            year: '2024',
            rating: '4.6',
            category: 'Desktop App'
        },
        'ai-chat': {
            name: 'AI Chat Bot',
            description: 'An intelligent chatbot powered by machine learning with natural language processing capabilities.',
            technologies: ['Python', 'TensorFlow', 'NLP', 'Flask'],
            features: ['Natural language processing', 'Machine learning', 'Multi-language support', 'API integration'],
            imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            year: '2024',
            rating: '4.9',
            category: 'AI/ML'
        },
        'weather': {
            name: 'Weather App',
            description: 'A beautiful weather application with real-time forecasts, location tracking, and interactive weather maps.',
            technologies: ['Flutter', 'Dart', 'OpenWeather API', 'Google Maps'],
            features: ['Real-time forecasts', 'Location tracking', 'Interactive maps', 'Weather alerts'],
            imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            year: '2024',
            rating: '4.8',
            category: 'Mobile App'
        }
    };
    
    return projects[projectId] || projects['ecommerce'];
}

// Load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Simulate loading more projects
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
            (loadMoreBtn as HTMLButtonElement).disabled = true;
            
            setTimeout(() => {
                showNotification('More projects will be added soon!', 'info');
                loadMoreBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Load More Projects';
                (loadMoreBtn as HTMLButtonElement).disabled = false;
            }, 2000);
        });
    }
}

// Smooth scrolling initialization
function initializeSmoothScrolling() {
    // Add smooth scrolling behavior to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Parallax effects
function initializeParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Notification system
function showNotification(message: string, type: string = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-600' : 
        type === 'error' ? 'bg-red-600' : 
        'bg-blue-600'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'} mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        (notification as HTMLElement).style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        (notification as HTMLElement).style.transform = 'translateX(full)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Utility functions
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const optimizedScrollHandler = debounce(() => {
    // Handle scroll events efficiently
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Export functions for global access
(window as any).viewProject = viewProject;
(window as any).downloadPDF = (projectId: string) => downloadFile(projectId, 'pdf');
(window as any).downloadAPK = (projectId: string) => downloadFile(projectId, 'apk');
(window as any).closeModal = closeModal; 

// Enhanced scroll animations
function initializeEnhancedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Add staggered animation for child elements
                const animatedChildren = entry.target.querySelectorAll('.animate-child');
                animatedChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('in-view');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Floating particles interaction
function initializeParticleInteraction() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle) => {
        particle.addEventListener('mouseenter', () => {
            (particle as HTMLElement).style.transform = 'scale(1.5)';
            (particle as HTMLElement).style.filter = 'brightness(1.5)';
        });
        
        particle.addEventListener('mouseleave', () => {
            (particle as HTMLElement).style.transform = 'scale(1)';
            (particle as HTMLElement).style.filter = 'brightness(1)';
        });
    });
}

// Smooth scrolling for navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Comparison table animations
function initializeComparisonTable() {
    const tableRows = document.querySelectorAll('.comparison-table tbody tr');
    
    const tableObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('table-row-visible');
            }
        });
    }, { threshold: 0.3 });

    tableRows.forEach(row => {
        tableObserver.observe(row);
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced scroll animations
    initializeEnhancedScrollAnimations();
    
    // Initialize particle interactions
    initializeParticleInteraction();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize comparison table animations
    initializeComparisonTable();
    
    // Typewriter animation
    initializeTypewriter();
});

// Typewriter animation for Schedule Planner : To-Do App
function initializeTypewriter() {
    var el = document.getElementById('typewriter-text');
    if (!el) return;
    
    var text = 'Made by Riju Ranjan Singh';
    var i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            el.classList.add('done');
        }
    }
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
}

// Performance optimization: Throttle scroll events
function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations can be added here
}, 16)); // ~60fps 