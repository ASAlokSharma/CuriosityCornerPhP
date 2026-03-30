// ============================================================
//  script.js — Curiosity Corner
// ============================================================

// ── Category Click → Show Topic Section ─────────────────────
const categoryCards   = document.querySelectorAll('.category-card[data-target]');
const categoriesSection = document.getElementById('categoriesSection');
const backBtnWrap     = document.getElementById('backBtnWrap');
const backBtn         = document.getElementById('backBtn');
const allTopicSections = document.querySelectorAll('.topic-section');

function showCategory(targetId) {
    // Hide categories grid
    categoriesSection.classList.add('hidden');
    backBtnWrap.style.display = 'block';

    // Hide all topic sections first
    allTopicSections.forEach(sec => {
        sec.classList.remove('visible');
        sec.style.display = 'none';
    });

    // Show the target section with animation
    const target = document.getElementById(targetId);
    if (target) {
        target.style.display = 'block';
        // Small timeout lets the display:block paint before opacity transition
        setTimeout(() => target.classList.add('visible'), 10);
        // Scroll to top of content smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Mark active card
    categoryCards.forEach(card => card.classList.remove('active'));
    const activeCard = document.querySelector(`.category-card[data-target="${targetId}"]`);
    if (activeCard) activeCard.classList.add('active');
}

function showCategories() {
    // Hide all topic sections
    allTopicSections.forEach(sec => {
        sec.classList.remove('visible');
        sec.style.display = 'none';
    });

    // Show categories grid
    categoriesSection.classList.remove('hidden');
    backBtnWrap.style.display = 'none';

    // Remove active state from all cards
    categoryCards.forEach(card => card.classList.remove('active'));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Attach click handlers to category cards
categoryCards.forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        showCategory(this.dataset.target);
    });
});

// Back button
if (backBtn) {
    backBtn.addEventListener('click', showCategories);
}


// ── Search: works across all topic sections ──────────────────
const searchBox = document.getElementById('searchBox');
if (searchBox) {
    searchBox.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();
        const explanationCards = document.querySelectorAll('.explanation-card');

        if (searchTerm === '') {
            // If user clears search, go back to categories view
            showCategories();
            return;
        }

        // Show all topic sections so we can search across them
        categoriesSection.classList.add('hidden');
        backBtnWrap.style.display = 'block';
        allTopicSections.forEach(sec => {
            sec.style.display = 'block';
            setTimeout(() => sec.classList.add('visible'), 10);
        });

        // Filter cards
        explanationCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            card.style.display = cardText.includes(searchTerm) ? 'block' : 'none';
        });

        // Hide topic sections that have no visible cards
        allTopicSections.forEach(sec => {
            const visibleCards = sec.querySelectorAll('.explanation-card[style*="display: block"], .explanation-card:not([style*="display: none"])');
            const anyVisible = Array.from(sec.querySelectorAll('.explanation-card'))
                .some(c => c.style.display !== 'none');
            sec.style.display = anyVisible ? 'block' : 'none';
        });
    });
}


// ── Form Validation ──────────────────────────────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        const name     = document.getElementById('name').value.trim();
        const email    = document.getElementById('email').value.trim();
        const topic    = document.getElementById('topic').value.trim();
        const category = document.getElementById('category').value;

        if (name === '') {
            alert('Name cannot be empty');
            document.getElementById('name').focus();
            e.preventDefault(); return;
        }

        if (!/^[A-Za-z\s]+$/.test(name)) {
            alert('Name should contain only letters and spaces');
            document.getElementById('name').focus();
            e.preventDefault(); return;
        }

        if (email === '') {
            alert('Email cannot be empty');
            document.getElementById('email').focus();
            e.preventDefault(); return;
        }

        const atpos = email.indexOf('@');
        const dotpos = email.lastIndexOf('.');
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
            alert('Invalid email format. Please enter a valid email address');
            document.getElementById('email').focus();
            e.preventDefault(); return;
        }

        if (topic.length < 3) {
            alert('Topic should be at least 3 characters long');
            document.getElementById('topic').focus();
            e.preventDefault(); return;
        }

        if (category === '') {
            alert('Please select a category');
            document.getElementById('category').focus();
            e.preventDefault(); return;
        }
    });
}

console.log('Curiosity Corner loaded!');