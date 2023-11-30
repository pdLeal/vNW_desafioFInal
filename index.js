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
window.addEventListener("click", function() {
    setTimeout(checkSearchWidth, 500);
});