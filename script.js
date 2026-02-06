// ========== Global Variables ==========
let cart = [];

// ========== Sakura Petals Animation ========== 
function createSakuraPetals() {
    const petals = ['🌸', '🌷'];
    const container = document.body;

    for (let i = 0; i < 5; i++) {
        const sakura = document.createElement('div');
        sakura.className = `sakura petal${i + 1}`;
        sakura.textContent = petals[Math.floor(Math.random() * petals.length)];
        sakura.style.left = Math.random() * window.innerWidth + 'px';
        container.appendChild(sakura);
    }
}

// Initialize sakura petals
createSakuraPetals();

// ========== Navigation ===========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ========== Menu Filtering ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // Filter menu items
        menuItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
                item.classList.add('fade-in');
            } else {
                const category = item.getAttribute('data-category');
                if (category === filter) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            }
        });
    });
});

// ========== Shopping Cart ==========
function addToCart(itemName, price) {
    cart.push({
        id: Date.now(),
        name: itemName,
        price: price
    });

    updateCart();
    
    // Show a toast notification with animation
    showNotification(`✓ เพิ่ม ${itemName} ลงในตะกร้า`);

    // Add pop-in animation to cart button
    const cartBtn = document.getElementById('cartButton');
    cartBtn.classList.add('pop-in');
    setTimeout(() => cartBtn.classList.remove('pop-in'), 400);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">ตะกร้าว่าง</p>';
        totalPrice.textContent = '฿0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item-row">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">฿${item.price}</span>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">ลบ</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPrice.textContent = `฿${total}`;

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function openCart() {
    document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('โปรดเลือกอาหารก่อน', 'warning');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const items = cart.map(item => `${item.name} (฿${item.price})`).join('\n');
    
    alert(`สั่งอาหารของท่าน:\n\n${items}\n\nรวมทั้งหมด: ฿${total}\n\nขอบคุณที่เลือกร้าน Nijuni!`);
    
    // Clear cart
    cart = [];
    updateCart();
    closeCart();
}

// Close modal when clicking outside
document.getElementById('cartModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCart();
    }
});

// ========== Notifications ==========
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#ffc107'};
        color: ${type === 'success' ? 'white' : '#333'};
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        font-size: 14px;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== Contact Form ==========
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;

    showNotification(`ขอบคุณ ${name} ที่ติดต่อเรา เราจะตอบกลับในเร็วๆ นี้`, 'success');

    // Reset form
    this.reset();
});

// ========== Load Cart from LocalStorage ==========
window.addEventListener('load', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
});

// ========== Smooth Scroll Enhancement ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== Scroll Animations ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe menu items for animation
document.querySelectorAll('.menu-item, .gallery-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px) scale(0.95)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
});

// ========== Active Navigation Link ==========
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========== Lazy Loading Images (if added in future) ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ========== Mobile Menu Close on Scroll ==========
window.addEventListener('scroll', () => {
    if (window.innerWidth < 768) {
        navLinks.classList.remove('active');
    }
});

// ========== Touch-friendly Improvements for Mobile ==========
if ('ontouchstart' in window) {
    // Add touch feedback
    document.querySelectorAll('.btn, .filter-btn, .menu-item, .gallery-item').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });

    // Disable double-tap zoom
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, false);
}

// ========== Add Active Style to Current Nav Link ==========
const style2 = document.createElement('style');
style2.textContent = `
    .nav-link.active {
        color: var(--gold-color);
    }

    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style2);

// ========== Prevent Default Form Submission ==========
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const message = this.querySelector('textarea').value;

            // Show success message
            showNotification(`ขอบคุณ ${name} ที่ติดต่อเรา! เรากำลังตรวจสอบข้อมูลของท่าน`, 'success');

            // Reset form
            this.reset();
        });
    }
});

// ========== Add Keyboard Support ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
    }
});

console.log('%c🍜 ยินดีต้อนรับสู่ Nijuni Restaurant! 🍜', 'font-size: 20px; color: #ea0018; font-weight: bold;');
console.log('%cเสิร์ฟความอร่อยทุกจาน', 'font-size: 14px; color: #2672a0; font-style: italic;');
