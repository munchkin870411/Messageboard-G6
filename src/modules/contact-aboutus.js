// contact-aboutus.js
console.log("contact-aboutus.js loaded");

// Detect which page we're on by checking the URL or the body class
const page = window.location.pathname.includes('contact') ? 'contact' :
             window.location.pathname.includes('about') ? 'about' :
             null;

if (page) {
    console.log(`${page} page script is running`);
}

// Hamburger Menu functionality (common for both pages)
const hamburger = document.querySelector('.hamburger');
const mobileHeader = document.querySelector('.mobile-header');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileHeader && mobileNav) {
    // Toggle the 'active' class on hamburger click to open/close the menu
    hamburger.addEventListener('click', () => {
        mobileHeader.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close the menu if the user clicks anywhere outside of it
    document.addEventListener('click', (event) => {
        if (!mobileHeader.contains(event.target) && !hamburger.contains(event.target)) {
            mobileNav.classList.remove('active');
            mobileHeader.classList.remove('active');
        }
    });
}

// Page-specific logic
if (page === 'contact') {
    // Contact page specific logic
    console.log("This is the Contact page.");
    // Add specific functionality for the Contact page (e.g., form handling, etc.)
    
    const contactForm = document.querySelector("#contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            // Handle contact form submission here
            alert("Contact form submitted!");
        });
    }
}

if (page === 'about') {
    // About page specific logic
    console.log("This is the About page.");
    // Add specific functionality for the About page
}