const products = [
            {
                id: 1,
                title: "DONUTS ORIGINAL",
                category: "DONUTS ORI",
                description: "Buket bunga mawar merah segar dengan packaging eksklusif, cocok untuk anniversary atau ungkapan cinta.",
                price: 9000, // Harga diskon
                original_price: 11000, // Harga asli (dicoret)
                image: "polosa.png"
            },
            {
                id: 2,
                title: "DONUTS DANCOW",
                category: "DONUTS RASA",
                description: "Donut ini memiliki rasa dancow,rasa manis,gurih dan lembut.",
                price: 10000, // Harga diskon
                original_price: 12000, // Harga asli (dicoret)
                image: "ko.jpg"
            },
            {
                id: 3,
                title: "donut coklate",
                category: "DONUTS RASA",
                description: "Donut yang memiliki rasa manis,gurih dengan isian coklat yang elegan",
                price: 10000, // Harga diskon
                original_price: 12000, 
                image: "ko.jpg"
            },
            {
                id: 4,
                title: "Donut strawberry ",
                category: "DONUTS RASA",
                price: 10000, // Harga diskon
                original_price: 12000, // Harga asli (dicoret)
                image: "c60a726a-16bc-49e4-aee7-9cfe4c8e1b8f.png"
            },
            {
                id: 5,
                title: "Donut Macha",
                category: "DONUTS RASA",
                description: "Rasa macha yang manis dengan dalamnya isi coklat",
                price: 10000, // Harga diskon
                original_price: 12000, // Harga asli (dicoret)
                image: "mavc.png"
            },
            {
                id: 6,
                title: "Paket promo",
                category: "paket",
                description: "beli 2 yang rasa dancow dengan isian coklat yang gurih",
                price: 16500, // Harga diskon
                original_price: 18000,
                image: "ko.jpg"
            },
            {
                id: 7,
                title: "SPECIA ISI 3 DONUT",
                category: "semua",
                description: "donuts rasa dancow dengan isian cokolate,TIRAMISU,DAN BISA REQUEST",                
                price: 30876, // Harga diskon
                original_price: 35000, // Harga asli (dicoret)
                image: "PAKETN3.png"
            },
            {
    id: 8,
    title: "10 paket isi campur",
    category: "paket",
    description: "10 paket donut isi campur yang lezat dan bervariasi.",
    price: 165999, // Harga diskon
    original_price: 240000, // Harga asli (dicoret)
    image: "OP.png"
},
        ];

        let cart = [];

        const productGrid = document.getElementById('product-grid');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cartIcon = document.getElementById('cart-icon');
        const cartCount = document.querySelector('.cart-count');
        const cartModal = document.getElementById('cart-modal');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const continueShoppingBtn = document.getElementById('continue-shopping');
        const checkoutBtn = document.getElementById('checkout-btn');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        const orderModal = document.getElementById('order-modal');
        const orderForm = document.getElementById('order-form');
        const orderProducts = document.getElementById('order-products');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mainNav = document.getElementById('main-nav');

        function displayProducts(filter = 'all') {
            productGrid.innerHTML = '';
            
            const filteredProducts = filter === 'all' 
                ? products 
                : products.filter(product => product.category === filter);
            
            if (filteredProducts.length === 0) {
                productGrid.innerHTML = '<p class="no-products">Tidak ada produk yang tersedia dalam kategori ini.</p>';
                return;
            }
            
            filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">
                    ${product.original_price ? 
                        `<s>${formatPrice(product.original_price)}</s>` : 
                        ''
                    }
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.original_price ? 
                        `<span class="discount-badge">Hemat ${formatPrice(product.original_price - product.price)}</span>` : 
                        ''
                    }
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Tambah ke Keranjang</button>
                    <button class="btn btn-secondary quick-order" data-id="${product.id}">Pesan Langsung</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
            
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', addToCart);
            });
            
            document.querySelectorAll('.quick-order').forEach(btn => {
                btn.addEventListener('click', quickOrder);
            });
        }
        function getCategoryName(category) {
            const names = {
                'bunga': 'Buket Bunga',
                'snack': 'Buket Snack',
                'uang': 'Buket Uang',
                'boneka': 'Buket Boneka'
            };
            return names[category] || category;
        }

        function formatPrice(price) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
        }

        function addToCart(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCart();
            
            showNotification(`${product.title} telah ditambahkan ke keranjang`);
        }

        function quickOrder(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            cart = [{
                ...product,
                quantity: 1
            }];
            
            updateCart();
            openOrderModal();
        }

        function updateCart() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart-message">Keranjang belanja Anda kosong.</p>';
                cartTotal.textContent = 'Rp 0';
                return;
            }
            
            cartItems.innerHTML = '';
            let totalPrice = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <p class="cart-item-price">${formatPrice(item.price)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            cartTotal.textContent = formatPrice(totalPrice);
            
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', decreaseQuantity);
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', increaseQuantity);
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', updateQuantity);
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', removeItem);
            });
        }

        function decreaseQuantity(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            
            if (item.quantity > 1) {
                item.quantity -= 1;
                updateCart();
            }
        }

        function increaseQuantity(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            
            item.quantity += 1;
            updateCart();
        }

        function updateQuantity(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity > 0) {
                item.quantity = newQuantity;
                updateCart();
            } else {
                e.target.value = item.quantity;
            }
        }

        function removeItem(e) {
            const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        function openCartModal() {
            cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function openOrderModal() {
            orderProducts.innerHTML = '';
            
            if (cart.length === 0) return;
            
            const list = document.createElement('ul');
            list.style.listStyle = 'none';
            list.style.padding = '0';
            
            cart.forEach(item => {
                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                li.style.paddingBottom = '10px';
                li.style.borderBottom = '1px solid #eee';
                li.textContent = `${item.title} - ${item.quantity} x ${formatPrice(item.price)}`;
                list.appendChild(li);
            });
            
            orderProducts.appendChild(list);
            
            const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const totalEl = document.createElement('p');
            totalEl.style.marginTop = '10px';
            totalEl.style.fontWeight = 'bold';
            totalEl.textContent = `Total: ${formatPrice(totalPrice)}`;
            orderProducts.appendChild(totalEl);
            
            cartModal.style.display = 'none';
            orderModal.style.display = 'block';
        }

        function closeModal() {
            cartModal.style.display = 'none';
            orderModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                displayProducts(filter);
                
                document.getElementById('products').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        document.getElementById('message-form').addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
            this.reset();
        });

        document.getElementById('newsletter-form').addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Terima kasih telah berlangganan newsletter kami!');
            this.reset();
        });

        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('order-name').value;
            const phone = document.getElementById('order-phone').value;
            const purpose = document.getElementById('order-purpose').value;
            const address = document.getElementById('order-address').value;
            const note = document.getElementById('order-note').value;
            
            let message = `Halo, saya ingin memesan:\n\n`;
            
            cart.forEach(item => {
                message += `- ${item.title} (${item.quantity} x ${formatPrice(item.price)})\n`;
            });
            
            const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            message += `\nTotal: ${formatPrice(totalPrice)}\n\n`;
            message += `Atas nama: ${name}\n`;
            message += `No. HP: ${phone}\n`;
            message += `Keperluan: ${purpose}\n`;
            
            if (address) {
                message += `Alamat pengiriman: ${address}\n`;
            }
            
            if (note) {
                message += `Catatan tambahan: ${note}\n`;
            }
            
            const encodedMessage = encodeURIComponent(message);
            
            window.open(`https://wa.me/6285710785244?text=${encodedMessage}`, '_blank');
            
            closeModal();
            
            showNotification('Pesanan Anda telah dikirim via WhatsApp!');
        });

        cartIcon.addEventListener('click', openCartModal);
        continueShoppingBtn.addEventListener('click', closeModal);
        checkoutBtn.addEventListener('click', openOrderModal);
        
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === cartModal || e.target === orderModal) {
                closeModal();
            }
        });

        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                }
            });
        });

        

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href') !== '#') {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

       // Di file p.js atau sebelum </body>
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    if (slider && prevBtn && nextBtn) {
        const itemWidth = document.querySelector('.testimonial-item').offsetWidth;
        const gap = 30;
        
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: itemWidth + gap,
                behavior: 'smooth'
            });
        });
        
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: -(itemWidth + gap),
                behavior: 'smooth'
            });
        });
    }
});

displayProducts();

const style = document.createElement('style');
style.textContent = `
    .notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--primary);
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                z-index: 3000;
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .notification.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
