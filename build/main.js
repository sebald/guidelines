!(function () {
    var OPEN_ATTRIBUTE = 'is-open';
    
    var toggle = document.querySelector('page-menu-toggle'),
        body = document.querySelector('body'),
        backdrop = document.querySelector('page-menu-backdrop');
    
    
    // Toggle navigation menu
    toggle.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

   backdrop = document.querySelector('page-menu-backdrop') 
    function toggleMenu () {
        if ( body.hasAttribute(OPEN_ATTRIBUTE) ) {
            body.removeAttribute(OPEN_ATTRIBUTE);
        } else {
            body.setAttribute(OPEN_ATTRIBUTE, '');
        }
    }
})();