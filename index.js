document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const emailTo = 'jt_jd@hotmail.com';

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const orderButton = document.getElementById('order-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const size = card.querySelector('select[name="size"]').value;
            const quantity = parseInt(card.querySelector('input[name="quantity"]').value);
            
            const existingItemIndex = cart.findIndex(item => item.id === id && item.size === size);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({ id, name, price, size, quantity });
            }

            updateCart();
        });
    });

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            orderButton.disabled = true;
        } else {
            cart.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <div class="cart-item-details">
                        <strong>${item.name}</strong> (${item.size})<br>
                        ${item.quantity} x $${item.price.toFixed(2)}
                    </div>
                    <button class="cart-item-remove" data-index="${index}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemEl);
                total += item.price * item.quantity;
            });

            // Add event listeners to remove buttons
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', (e) => {
                    const indexToRemove = parseInt(e.target.dataset.index);
                    cart.splice(indexToRemove, 1);
                    updateCart();
                });
            });

            orderButton.disabled = false;
        }
        
        totalPriceEl.textContent = total.toFixed(2);
    }

    orderButton.addEventListener('click', () => {
        if (cart.length === 0) return;

        const subject = 'New Merchandise Order';
        let body = 'Hello,\n\nI would like to place an order for the following items:\n\n';
        
        cart.forEach(item => {
            body += `- ${item.name} (${item.size}) - Quantity: ${item.quantity}\n`;
        });

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        body += `\nTotal: $${total.toFixed(2)}\n\n`;
        body += 'Please let me know the next steps.\n\n';
        body += 'My shipping address is:\n\n[Please fill in your full shipping address here]\n\n';
        body += 'Thank you!';

        window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
});

