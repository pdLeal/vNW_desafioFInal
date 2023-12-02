// SEARCH 
const h4s = document.querySelectorAll("h4");
const searchInput = document.querySelector(".search-input");
const suggestions = document.querySelector(".suggestions");

const nav = document.querySelector('nav');
const searchBar = document.querySelector('.search-bar');

const products = [];

h4s.forEach(product => {
    products.push(product.textContent);
});

function findMatches(wordToMatch, products) {
    return products.filter(product => {
        const regex = new RegExp(wordToMatch, "gi");
        return product.match(regex);
    });
}

function displayMatches() {
    const matchArray = findMatches(this.value, products);

    const html = matchArray.map(product => {
        const regex = new RegExp(this.value, "gi");
        const productName = product.replace(regex, `<span class="hl">${this.value}</span>`);

        return `
            <li>
                ${productName}
            </li>
        `
    }).join("");

    suggestions.innerHTML = html;

    if (searchInput.value.length === 0) {
        suggestions.textContent = "";
    }
}

function checkSearchWidth() {
    const navWidth = nav.offsetWidth;
    const searchBarWidth = searchBar.offsetWidth;
    const percentage = (searchBarWidth / navWidth) * 100;

    if (percentage < 50) {
        suggestions.textContent = "";
        searchInput.value = "";
    }
}

searchInput.addEventListener("input", displayMatches);
window.addEventListener("click", function () {
    setTimeout(checkSearchWidth, 500);
});

// BANNER SCROLL
const scrollers = document.querySelectorAll(".scroller");
const outer1 = document.querySelector(".scroller");
const inner1 = document.querySelector(".inner-scroller");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    while (inner1.offsetWidth < (2 * outer1.offsetWidth)) {
        addAnimation();
    }
}

function addAnimation() {
    scrollers.forEach(scroller => {
        scroller.setAttribute("data-animated", true);

        const innerScroller = scroller.querySelector(".inner-scroller");
        const scrollerContent = Array.from(innerScroller.children);

        scrollerContent.forEach(item => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            innerScroller.appendChild(duplicatedItem);
        });
    });
}

window.addEventListener("resize", function () {
    if (inner1.offsetWidth < (2 * outer1.offsetWidth)) addAnimation();
});

// CART
const cartIcon = document.querySelector(".cart-icon");
const cart = document.querySelector(".cart");
const cartList = document.querySelector(".cart-list");
const closeBtn = document.querySelector(".close");
const buyBtns = document.querySelectorAll(".buy");
const cartIconSpan = document.querySelector(".cart-icon span");

let listProducts = [];
let cartItens = [];

const initApp = () => {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            listProducts = data;

            // pegar carrinho da memória local
            if (localStorage.getItem("cart")) {
                cartItens = JSON.parse(localStorage.getItem("cart"));
                addCartToHtml();
            }
        });
}
initApp();

function showCartList() {
    cart.classList.add("show-cart");
}

function hideCartList() {
    cart.classList.remove("show-cart");
}


function addToCart() {
    const productId = this.parentElement.dataset.id;
    const checkProductInCart = cartItens.findIndex(product => product.productId == productId);

    if (cartItens.length <= 0) {
        cartItens = [{
            productId: productId,
            quantity: 1
        }];
    } else if (checkProductInCart < 0) {
        cartItens.push({
            productId: productId,
            quantity: 1
        });
    } else {
        cartItens[checkProductInCart].quantity += 1;
    }
    addCartToHtml();
    addCartToMemory();
}

function addCartToHtml() {
    cartList.innerHTML = "";
    let totalQuantity = 0;

    if (cartItens.length > 0) {
        cartItens.forEach(item => {
            totalQuantity += item.quantity;

            const newItem = document.createElement("div");
            newItem.classList.add("cart-item");
            newItem.dataset.id = item.productId;

            const positionProduct = listProducts.findIndex(product => product.id == item.productId);
            const infos = listProducts[positionProduct];

            newItem.innerHTML = `
                <img src="${infos.image}" alt="">
                <p class="product-name">${infos.name}</p>
                <p class="product-price">R$${infos.price * item.quantity},00</p>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            cartList.appendChild(newItem);
        })
    }
    cartIconSpan.innerText = totalQuantity;
}

function addCartToMemory() {
    localStorage.setItem("cart", JSON.stringify(cartItens));
}
function checkType(event) {
    const clickPosition = event.target;

    if (clickPosition.classList.contains("minus") || clickPosition.classList.contains("plus")) {
        const productId = clickPosition.parentElement.parentElement.dataset.id;
        let type = "minus";
        if (clickPosition.classList.contains("plus")) {
            type = "plus";
        }
        changeQuantity(productId, type);
    }
}

function changeQuantity(id, type) {
    const positionInCart = cartItens.findIndex(item => item.productId == id);

    if (positionInCart >= 0) {
        switch(type) {
            case "plus":
                cartItens[positionInCart].quantity += 1;
                break;
            case "minus": 
                const changedValue = cartItens[positionInCart].quantity - 1;

                if (changedValue > 0) {
                    cartItens[positionInCart].quantity = changedValue;
                } else {
                    cartItens.splice(positionInCart, 1);
                }
        }
    }
    addCartToHtml();
    addCartToMemory();
}

cartIcon.addEventListener("click", showCartList);
closeBtn.addEventListener("click", hideCartList);
buyBtns.forEach(buyBtn => buyBtn.addEventListener("click", addToCart));

cartList.addEventListener("click", checkType);