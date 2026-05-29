/* ==========================================================================
   BLUSH & BUFF NAIL STUDIO - CLIENT INTERACTIVITY & SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --------------------------------------------------------------------------
    // 01. Sticky Header Scroll Effect
    // --------------------------------------------------------------------------
    const mainHeader = document.querySelector('.main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    };
    
    // Run on init and scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // --------------------------------------------------------------------------
    // 02. Mobile Navigation Menu Toggle
    // --------------------------------------------------------------------------
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        const isOpen = navMenu.classList.contains('open');
        navMenu.classList.toggle('open');
        mobileNavToggle.classList.toggle('open');
        mobileNavToggle.setAttribute('aria-expanded', !isOpen);
        
        // Prevent body scroll when menu is open
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    
    const closeMenu = () => {
        navMenu.classList.remove('open');
        mobileNavToggle.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    
    mobileNavToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when resizing screen beyond mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // --------------------------------------------------------------------------
    // 03. Premium Gallery Category Filter (Animated)
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-item-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            galleryCards.forEach(card => {
                // Step 1: Start shrink & fade-out animation
                card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.92) translateY(10px)';
                
                setTimeout(() => {
                    const cardCategories = card.getAttribute('data-category').split(' ');
                    
                    if (filterValue === 'all' || cardCategories.includes(filterValue)) {
                        // Step 2: Show matching cards by removing hidden class
                        card.classList.remove('hidden');
                        
                        // Force a tiny layout reflow to ensure transition registers
                        void card.offsetHeight;
                        
                        // Step 3: Fade-in and scale-up animation
                        card.style.transition = 'opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    } else {
                        // Hide non-matching cards
                        card.classList.add('hidden');
                    }
                }, 250); // Timeout matches the duration of fade-out transition
            });
        });
    });

    // --------------------------------------------------------------------------
    // 04. Smooth Anchor Link Scrolling
    // --------------------------------------------------------------------------
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Skip pure placeholder links
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Account for sticky header offset on mobile/desktop
                const headerOffset = window.innerWidth > 768 ? 70 : 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --------------------------------------------------------------------------
    // 05. Simple Active State Scroll Highlight for Nav Links
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollY = window.pageYOffset;
        const headerOffset = 90; // Trigger slightly early for better visual timing
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - headerOffset;
            const sectionId = current.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (correspondingNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingNavLink.classList.add('active-nav-link');
                } else {
                    correspondingNavLink.classList.remove('active-nav-link');
                }
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Run once initially
});
