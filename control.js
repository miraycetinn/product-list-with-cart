document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')  // Veri çekmek için fetch kullandık
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            showData(data);
        })
        .catch(function(error) {
            console.error('Veri çekilirken hata oluştu:', error);
        });
});

let cart = {}; // Global sepet nesnesi oluşturduk

function showData(data) {
    let card = document.querySelector('.cards');

    data.forEach(function(item, index) {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'items';

        let imgElement = document.createElement('img');
        imgElement.className = 'thumbnail_card';
        imgElement.alt = 'main_image';
        imgElement.src = item.image.desktop; 

        // İçeriği basitçe innerHTML ile ekledik
        itemDiv.innerHTML = `
      <div class="thumbnail_btn">
        <a class="btn" data-index="${index}">
          <img src="assets/icon-add-to-cart.svg" alt="store" />
          Sepete Ekle
        </a>
      </div>
      <p class="Type">${item.category}</p>
      <h5 class="Title">${item.name}</h5>
      <span class="price">$${item.price}</span>
    `;
        itemDiv.insertBefore(imgElement, itemDiv.firstChild);

        card.appendChild(itemDiv);
    });

    // Sepete ekleme işlemleri
    addToCart(data);
}

function addToCart(data) {
    let buttons = document.querySelectorAll('.btn');

    buttons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            let index = event.target.closest('.btn').getAttribute('data-index');
            let item = data[index];

            // Sepet güncelleme
            if (cart[item.name]) {
                cart[item.name].quantity += 1;
            } else {
                cart[item.name] = {
                    item: item,
                    quantity: 1
                };
            }

            // Buton tıklandıktan sonra görünümünü değiştir
            event.target.textContent = `Sepette ${cart[item.name].quantity}`;
            event.target.parentElement.style.backgroundColor = '#e74c3c';
            event.target.parentElement.style.color = '#fff';

            updateCart();
        });
    });
}

function updateCart() {
    let cartElement = document.querySelector('.cartContent');
    let cartSummary = document.querySelector('.your-cart');
    cartElement.innerHTML = "";
    let total = 0;
    let count = 0;

    for (let key in cart) {
        let cartItem = cart[key];
        let itemTotal = cartItem.item.price * cartItem.quantity;
        total += itemTotal;
        count++;

        let contentDiv = document.createElement('div');
        contentDiv.className = 'cart-item';
        contentDiv.innerHTML = `
      <h5>${cartItem.item.name}</h5>
      <span>${cartItem.quantity}x</span>
      <span>@ $${cartItem.item.price.toFixed(2)}</span>
      <span>$${itemTotal.toFixed(2)}</span>
      <button class="remove-item">Sil</button>
    `;

        cartElement.appendChild(contentDiv);

        // Sepetten ürün silme işlemi
        contentDiv.querySelector('.remove-item').addEventListener('click', function() {
            total -= itemTotal;
            delete cart[key];
            contentDiv.remove();
            updateCart();
        });
    }

    cartSummary.textContent = `Sepetiniz (${count})`;

    let orderElement = document.createElement('div');
    orderElement.className = 'order-total';
    orderElement.innerHTML = `
    <span>Toplam</span>
    <span>$${total.toFixed(2)}</span>
  `;

    cartElement.appendChild(orderElement);
}
