const products = [
    {
        id: 1,
        name: "Smart Watch",
        category: "electronics",
        icon: "⌚",
        price: 1999,
        oldPrice: 2499,
        discount: 20,
        offer: "Extra ₹100 OFF + Free Delivery"
    },

    {
        id: 2,
        name: "Wireless Headphones",
        category: "electronics",
        icon: "🎧",
        price: 1699,
        oldPrice: 1999,
        discount: 15,
        offer: "Extra 10% OFF on online payment"
    },

    {
        id: 3,
        name: "Running Sneakers",
        category: "fashion",
        icon: "👟",
        price: 2099,
        oldPrice: 2999,
        discount: 30,
        offer: "Free Delivery + ₹200 Cashback"
    },

    {
        id: 4,
        name: "Sunglasses",
        category: "fashion",
        icon: "🕶️",
        price: 799,
        oldPrice: 999,
        discount: 20,
        offer: "Buy now and get free case"
    },

    {
        id: 5,
        name: "Face Care Kit",
        category: "beauty",
        icon: "💄",
        price: 699,
        oldPrice: 899,
        discount: 22,
        offer: "Extra ₹50 OFF"
    },

    {
        id: 6,
        name: "Desk Lamp",
        category: "home",
        icon: "💡",
        price: 899,
        oldPrice: 1299,
        discount: 30,
        offer: "Free Delivery"
    },

    {
        id: 7,
        name: "Backpack",
        category: "fashion",
        icon: "🎒",
        price: 1199,
        oldPrice: 1499,
        discount: 20,
        offer: "Extra 5% OFF"
    },

    {
        id: 8,
        name: "Bluetooth Speaker",
        category: "electronics",
        icon: "🔊",
        price: 1299,
        oldPrice: 1799,
        discount: 28,
        offer: "Free Delivery + Cashback"
    }
];


let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("shopEaseWishlist")) || [];


const productContainer =
    document.getElementById("productContainer");

const searchInput =
    document.getElementById("searchInput");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const productModal =
    document.getElementById("productModal");

const modalContent =
    document.getElementById("modalContent");

const cartPanel =
    document.getElementById("cartPanel");

const toast =
    document.getElementById("toast");


function displayProducts(list) {

    productContainer.innerHTML = "";

    if (list.length === 0) {

        productContainer.innerHTML =
            "<h2>No products found 😔</h2>";

        return;
    }


    list.forEach(product => {

        const liked =
            wishlist.includes(product.id);


        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <button
                class="wishlist"
                onclick="toggleWishlist(${product.id})"
            >
                ${liked ? "❤️" : "♡"}
            </button>


            <div
                class="product-image"
                onclick="showProduct(${product.id})"
            >
                ${product.icon}
            </div>


            <h3>${product.name}</h3>

            <div class="product-category">
                ${product.category}
            </div>


            <div class="price-row">

                <span class="price">
                    ₹${product.price}
                </span>

                <del class="old-price">
                    ₹${product.oldPrice}
                </del>

            </div>


            <span class="discount-tag">
                ${product.discount}% OFF
            </span>


            <div class="product-buttons">

                <button
                    class="details-btn"
                    onclick="showProduct(${product.id})"
                >
                    View Offer
                </button>

                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})"
                >
                    Add Cart
                </button>

            </div>

        `;


        productContainer.appendChild(card);

    });
}


function showProduct(id) {

    const product =
        products.find(p => p.id === id);


    modalContent.innerHTML = `

        <div class="product-image">
            ${product.icon}
        </div>

        <h2>${product.name}</h2>

        <p class="product-category">
            ${product.category}
        </p>

        <div class="price-row">

            <span class="price">
                ₹${product.price}
            </span>

            <del class="old-price">
                ₹${product.oldPrice}
            </del>

            <span class="discount-tag">
                ${product.discount}% OFF
            </span>

        </div>


        <div class="offer-box">

            <h3>🔥 Special Offer</h3>

            <p>🎁 ${product.offer}</p>

            <p>
                🚚 Free delivery on orders above ₹2,000
            </p>

            <div class="timer" id="timer">
                10:00
            </div>

        </div>


        <button
            class="modal-add"
            onclick="addToCart(${product.id}); closeModal();"
        >
            🛒 Add to Cart
        </button>

    `;


    productModal.classList.add("show");

    startTimer();

}


function closeModal() {

    productModal.classList.remove("show");

}


document
    .getElementById("closeModal")
    .addEventListener("click", closeModal);


productModal.addEventListener("click", function(e) {

    if (e.target === productModal) {
        closeModal();
    }

});


function startTimer() {

    let seconds = 600;

    const timer =
        document.getElementById("timer");


    const interval =
        setInterval(() => {

            if (!document.body.contains(timer)) {

                clearInterval(interval);
                return;

            }


            let minutes =
                Math.floor(seconds / 60);

            let remainingSeconds =
                seconds % 60;


            timer.textContent =
                String(minutes).padStart(2, "0")
                + ":"
                + String(remainingSeconds).padStart(2, "0");


            seconds--;


            if (seconds < 0) {

                clearInterval(interval);

                timer.textContent =
                    "Offer Expired";

            }

        }, 1000);

}


function addToCart(id) {

    const existing =
        cart.find(item => item.id === id);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }


    saveCart();

    updateCart();

    showToast("🎉 Product added to cart!");

}


function saveCart() {

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );

}


function updateCart() {

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
    });


    cartCount.textContent =
        totalItems;


    renderCart();

}


function renderCart() {

    const cartItems =
        document.getElementById("cartItems");


    cartItems.innerHTML = "";


    let subtotal = 0;


    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.id);


        subtotal +=
            product.price * item.quantity;


        const div =
            document.createElement("div");


        div.className = "cart-item";


        div.innerHTML = `

            <div class="cart-item-icon">
                ${product.icon}
            </div>

            <div class="cart-item-info">

                <strong>
                    ${product.name}
                </strong>

                <p>
                    ₹${product.price}
                </p>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${product.id}, -1)"
                    >
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${product.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-btn"
                onclick="removeFromCart(${product.id})"
            >
                🗑️
            </button>

        `;


        cartItems.appendChild(div);

    });


    let discount = 0;


    if (subtotal >= 3000) {

        discount = 300;

    } else if (subtotal >= 2000) {

        discount = 150;

    }


    let delivery =
        subtotal >= 2000 ? 0 : 49;


    let total =
        subtotal - discount + delivery;


    document.getElementById("subtotal")
        .textContent = "₹" + subtotal;


    document.getElementById("cartDiscount")
        .textContent = "-₹" + discount;


    document.getElementById("delivery")
        .textContent =
        delivery === 0 ? "FREE" : "₹49";


    document.getElementById("cartTotal")
        .textContent = "₹" + total;


    const cartOffer =
        document.getElementById("cartOffer");


    if (subtotal < 2000) {

        cartOffer.textContent =
            "🎁 Add ₹" +
            (2000 - subtotal) +
            " more to unlock FREE DELIVERY!";

    } else if (subtotal < 3000) {

        cartOffer.textContent =
            "🎉 FREE DELIVERY unlocked! Add ₹" +
            (3000 - subtotal) +
            " more for ₹300 OFF!";

    } else {

        cartOffer.textContent =
            "🔥 Congratulations! You unlocked ₹300 OFF!";

    }

}


function changeQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== id);

    }


    saveCart();

    updateCart();

}


function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);


    saveCart();

    updateCart();

    showToast("Product removed");

}


function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(item => item !== id);

        showToast("Removed from wishlist");

    } else {

        wishlist.push(id);

        showToast("❤️ Added to wishlist");

    }


    localStorage.setItem(
        "shopEaseWishlist",
        JSON.stringify(wishlist)
    );


    wishlistCount.textContent =
        wishlist.length;


    displayProducts(products);

}


searchInput.addEventListener(
    "input",
    function() {

        const text =
            searchInput.value.toLowerCase();


        const filtered =
            products.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(text)
            );


        displayProducts(filtered);

    }
);


document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".category")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                this.classList.add("active");


                const category =
                    this.dataset.category;


                if (category === "all") {

                    displayProducts(products);

                } else {

                    displayProducts(
                        products.filter(
                            product =>
                                product.category === category
                        )
                    );

                }

            }
        );

    });


document
    .getElementById("cartBtn")
    .addEventListener("click", function() {

        cartPanel.classList.add("show");

    });


document
    .getElementById("closeCart")
    .addEventListener("click", function() {

        cartPanel.classList.remove("show");

    });


document
    .getElementById("exploreBtn")
    .addEventListener("click", function() {

        document
            .getElementById("products")
            .scrollIntoView({
                behavior: "smooth"
            });

    });


document
    .getElementById("themeBtn")
    .addEventListener("click", function() {

        document.body.classList.toggle("dark");


        if (document.body.classList.contains("dark")) {

            this.textContent = "☀️";

        } else {

            this.textContent = "🌙";

        }

    });


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}


wishlistCount.textContent =
    wishlist.length;


updateCart();

displayProducts(products);