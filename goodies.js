// Goodies Module Functionality
class GoodiesModule {
    constructor() {
        this.goodies = [
            {
                id: 1,
                name: 'Dark Chocolate',
                price: 150,
                image: 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400&h=400&fit=crop&crop=center'
            },
            {
                id: 2,
                name: 'Milk Chocolate',
                price: 120,
                image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop&crop=center'
            },
            {
                id: 3,
                name: 'Cookies',
                price: 80,
                image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&crop=center'
            },
            {
                id: 4,
                name: 'Ice Cream',
                price: 120,
                image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&crop=center'
            },
            {
                id: 5,
                name: 'Cake',
                price: 250,
                image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&crop=center'
            },
            {
                id: 6,
                name: 'Sanitary Pads',
                price: 180,
                image: './assets/images/pads.jpg'
            },
            {
                id: 7,
                name: 'Tampons',
                price: 200,
                image: './assets/images/tampons.jpg'
            },
            {
                id: 8,
                name: 'Menstrual Cup',
                price: 350,
                image: './assets/images/menstrual-cup.jpg'
            },
            {
                id: 10,
                name: 'Surprise Kit',
                price: 599,
                image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop&crop=center',
                special: true,
                description: 'Pads, Perfume, Scrunchies & Cookies'
            }
        ];

        this.cart = {};
        this.init();
    }

    init() {
        this.renderGoodies();
        this.setupEventListeners();
        this.updateCart();
    }

    renderGoodies() {
        const grid = document.getElementById('goodiesGrid');
        grid.innerHTML = this.goodies.map(goodie => `
            <div class="goodie-item ${goodie.special ? 'surprise' : ''}" onclick="goodiesModule.addToCart(${goodie.id}, event)">
                ${goodie.special ? '<div class="surprise-kit-badge">⭐ Special</div>' : ''}
                <img src="${goodie.image}" alt="${goodie.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Product+Image'">
                <h3>${goodie.name}</h3>
                ${goodie.description ? `<p style="font-size: 11px; margin: 5px 0; opacity: 0.9;">${goodie.description}</p>` : ''}
                <p class="price">₹${goodie.price}</p>
            </div>
        `).join('');
    }

    setupEventListeners() {
        document.getElementById('placeOrder').addEventListener('click', () => {
            this.placeOrder();
        });
    }

    addToCart(id, event) {
        const clickedElement = event.currentTarget;
        const rect = clickedElement.getBoundingClientRect();
        const goodie = this.goodies.find(g => g.id === id);
       
        // Create flying animation
        this.createFlyingItem(goodie.image, rect);
       
        // Add haptic feedback (vibration on mobile)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
       
        // Update cart
        if (this.cart[id]) {
            this.cart[id].quantity++;
        } else {
            this.cart[id] = { ...goodie, quantity: 1 };
        }
       
        setTimeout(() => {
            this.updateCart();
        }, 500);
    }

    createFlyingItem(imageUrl, startRect) {
        const flyingItem = document.createElement('div');
        flyingItem.className = 'flying-item';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '10px';
        flyingItem.appendChild(img);
        flyingItem.style.left = startRect.left + startRect.width / 2 + 'px';
        flyingItem.style.top = startRect.top + startRect.height / 2 + 'px';
       
        document.body.appendChild(flyingItem);
       
        const cartSection = document.getElementById('cartSection');
        const cartRect = cartSection.getBoundingClientRect();
       
        const endX = cartRect.left + cartRect.width / 2 - startRect.left - startRect.width / 2;
        const endY = cartRect.top + 50 - startRect.top - startRect.height / 2;
        const midX = endX / 2;
        const midY = endY / 2 - 100;
       
        flyingItem.style.setProperty('--endX', endX + 'px');
        flyingItem.style.setProperty('--endY', endY + 'px');
        flyingItem.style.setProperty('--midX', midX + 'px');
        flyingItem.style.setProperty('--midY', midY + 'px');
       
        setTimeout(() => {
            flyingItem.remove();
        }, 1000);
    }

    updateQuantity(id, change) {
        if (this.cart[id]) {
            this.cart[id].quantity += change;
            if (this.cart[id].quantity <= 0) {
                delete this.cart[id];
            }
            this.updateCart();
        }
    }

    updateCart() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const totalAmount = document.getElementById('totalAmount');
        const checkoutSection = document.getElementById('checkoutSection');

        const items = Object.values(this.cart);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartCount.textContent = totalItems;
        cartCount.style.animation = 'none';
        setTimeout(() => {
            cartCount.style.animation = 'pulse 0.3s ease';
        }, 10);

        if (items.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛍️</div>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotal.style.display = 'none';
            checkoutSection.style.display = 'none';
        } else {
            cartItems.innerHTML = items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60?text=Product'">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="price">₹${item.price}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="goodiesModule.updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="goodiesModule.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');
            cartTotal.style.display = 'flex';
            checkoutSection.style.display = 'block';
            totalAmount.textContent = `₹${total}`;
        }
    }

    placeOrder() {
        const address1 = document.getElementById('addressLine1').value.trim();
        const address2 = document.getElementById('addressLine2').value.trim();
        const city = document.getElementById('city').value.trim();
        const pincode = document.getElementById('pincode').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!address1 || !address2 || !city || !pincode || !phone) {
            alert('⚠️ Please fill in all address fields to proceed with your order.');
            return;
        }

        if (pincode.length !== 6 || isNaN(pincode)) {
            alert('⚠️ Please enter a valid 6-digit pincode.');
            return;
        }

        if (phone.length !== 10 || isNaN(phone)) {
            alert('⚠️ Please enter a valid 10-digit phone number.');
            return;
        }

        // Show success modal
        document.getElementById('successModal').classList.add('show');
       
        // Reset cart
        this.cart = {};
        this.updateCart();
       
        // Clear form
        document.getElementById('addressLine1').value = '';
        document.getElementById('addressLine2').value = '';
        document.getElementById('city').value = '';
        document.getElementById('pincode').value = '';
        document.getElementById('phone').value = '';
    }
}

// Global function to close modal
function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}

// Initialize goodies module when DOM is loaded
let goodiesModule;
document.addEventListener('DOMContentLoaded', () => {
    goodiesModule = new GoodiesModule();
});