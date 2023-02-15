function hasScrolled(direction = "vertical") {
    let el = document.getElementsByClassName('bank-main-cont-right-content')[0];
    if (direction == 'vertical') {
        return el.scrollHeight > el.clientHeight;
    }
}
function scrollToTop() {
    let el = document.getElementsByClassName('bank-main-cont-right-content')[0];
    el.scrollTop = 0;
}
export {
    hasScrolled,
    scrollToTop
}