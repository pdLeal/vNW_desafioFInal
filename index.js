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