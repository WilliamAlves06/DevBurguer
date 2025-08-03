// Elementos do DOM
const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItensContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCount = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const spanitems = document.getElementById('data-span');

// Estado do carrinho
let cart = [];

// Abrir modal do carrinho
cartBtn.addEventListener('click', function () {
    cartModal.style.display = 'flex';
});

// Fechar modal do carrinho
closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none';
});

// Adicionar item ao carrinho pelo menu
menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest('.add-to-cart-btn');
    if (parentButton) {
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price'));
        addToCart(name, price);
        updateCart();
    }
});

// Função para adicionar item ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
        return;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
}

// Atualiza o carrinho na tela
function updateCart() {
    cartItensContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between ">
            <div>
                <p class="font-ligh">${item.name}</p>
                <p>qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-item" data-name="${item.name}">Remover</button>
            </div>
        </div>
        `;
        total += item.price * item.quantity;
        cartItensContainer.appendChild(cartItemElement);
    });
    cartTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    cartCount.textContent = cart.length;
}

// Remover item do carrinho
cartItensContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-item')) {
        const name = event.target.getAttribute('data-name');
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
            return;
        } else {
            cart.splice(index, 1);
            updateCart();
            return;
        }
    }
}

// Validação do endereço
addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;
    if (inputValue !== '') {
        addressWarn.classList.add('hidden');
        addressInput.classList.remove('border-red-500');
    }
});

// Finalizar pedido
checkoutBtn.addEventListener('click', function () {
    if (!checkrestaurant()) {
        alert('O restaurante está fechado no momento. Por favor, volte mais tarde.');
        return;
    }
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add('border-red-500');
        return;
    }
    const cartItems = cart.map(item => {
        return `item:${item.name} - ${item.quantity}\n por ${item.price * item.quantity} \n\n`;
    }).join('');
    const mensage = encodeURIComponent(cartItems);
    const phoneNumber = '11972159241'; // Substitua pelo número de telefone desejado
    console.log(cartItems);
    window.open(`https://wa.me/${phoneNumber}?text=${mensage} \n\n\nEndereço: ${addressInput.value}`, '_blank');
    cart = [];
    updateCart();
});

// Verifica se restaurante está aberto
function checkrestaurant() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

// Atualiza status do restaurante
function updateRestaurantStatus() {
    const isOpen = checkrestaurant();
    if (spanitems) {
        if (isOpen) {
            spanitems.classList.add('bg-green-600');
            spanitems.classList.remove('bg-red-600');
        } else {
            spanitems.classList.remove('bg-green-600');
            spanitems.classList.add('bg-red-600');
        }
    }
}

updateRestaurantStatus();

