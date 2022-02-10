/**
 * The actual <header> element of the document.
 */
const mainHeader = document.getElementById('main-header');
/**
 * Hamburger icon of the <header> element. Only appears, visually, on smaller screen sizes.
 */
const headerHamburger = mainHeader.getElementsByClassName('main-header__hamburger')[0];
/**
 * The <ul> containing the different options of the main header. E.g., home, projects, contact me, etc.
 */
const headerList = mainHeader.getElementsByClassName('main-header__list')[0];
/**
 * sets our main header to animate into minimised mode if we are scrolled far down enough. Sets it to do the reverse of this 
   if we have scrolled up to the top.
 * @returns void
 */
const sortOutMainMenu = (function() {
    /**
     * @type Boolean Determines whether our <header> is in expanded mode or not. Needed for the animation in the forthcoming image.
       This animation needs to know whether to expand the <header>, as it is already open, or collapse it.
     */
    let isCollapsed = false;
    /**
     * @type int Count the number of times called. Needed for initial load. Don't want to play any animations, either opening or closing,
       on initial document load
     */
    let counter = 0;

    return function(){
        if(window.innerWidth < 992){
            return;
        }
        counter++;
        const offsetTop = document.body.getBoundingClientRect().top;
        if(offsetTop < 40 && !isCollapsed){
            gsap.timeline({defaults: {duration: counter>1 ? 0.25 : 0, ease: 'power1'}})
                .to(mainHeader.getElementsByClassName('main-header__title')[0], {
                    fontSize: '2rem'
                }, 0)
                .to(mainHeader.getElementsByClassName('main-header__sub_title')[0], {
                    opacity: 0
                }, 0)
                .to(mainHeader.getElementsByClassName('main-header__left-section')[0], {
                    height: '43px'
                }, 0);
            isCollapsed = true;
            return;
        }
        if(offsetTop > 39 && isCollapsed){
            gsap.timeline({defaults: {duration: 0.25, ease: 'power1'}})
                .to(mainHeader.getElementsByClassName('main-header__title')[0], {
                    fontSize: '2.5rem'
                }, 0)
                .to(mainHeader.getElementsByClassName('main-header__sub_title')[0], {
                    opacity: 1
                }, 0)
                .to(mainHeader.getElementsByClassName('main-header__left-section')[0], {
                    height: '69px'
                }, 0);
            isCollapsed = false;
        }
    }
})();
/**
 * The necessary event listeners for 'sortOutMainMenu'. They will execute this function as soon as the document loads and
   whenever we scroll on it. The 'sortOutMainMenu' is also called in the function that is passed into the 'resize' event listener.
   But, here, it is called directly by these event listeners.
 */
addEventListener('scroll', sortOutMainMenu);
addEventListener('load', sortOutMainMenu);
/**
 * The function that is made to be the callback of the 'resize' event listener. Is used to resolve errors relating to animations, 
   styling, etc, hence why it is called whenever we resize our browser: so that when the incumbent media query changes, we can
   respond to it changing here.
 * @returns void
 */
const windowResize = (function(){
    let windowState = '';//String variable that is used to keep track of which media query is currently incumbent.
    function setWindowState(){
        if(window.innerWidth < 576){
            windowState = 'smallest';
        }else if(window.innerWidth > 575){
            windowState = 'small';
        }
    }; setWindowState();

    function animateHamburgerOpenSmallLarge(type){
        if(headerHamburger.getAttribute('open') !== 'true') return;
        if(type === 'large'){
            animateHeaderHamburger('open_large', 0);
        }else if(type === 'small'){
            animateHeaderHamburger('open_small', 0);
        }
    }
    
    return function(){
        sortOutMainMenu();
        if(windowState === 'smallest' && window.innerWidth > 575){
            animateHamburgerOpenSmallLarge('large');
        }else if(windowState === 'small' && window.innerWidth < 576){
            animateHamburgerOpenSmallLarge('small');
        }
        setWindowState();
    }
})();
addEventListener('resize', windowResize);

/**
 * With the relevant animation, opens and closes the hamburger drop-down menu, as from our main header, when the hamburger icon
   is clicked on.
 * @returns void
 */
const configureHamburgerHeaderList = (function(){
    /** 
     * @type Boolean Determines whether the hamburger menu drop-down is open or not. Used to decide whether we should open or close
       this drop-down menu in the coming function.
    */
    let isOpen = false;
    return function(){
        isOpen = !isOpen;
        headerList.classList.remove('main-header__list--hamburger-small-open');
        if(isOpen){
            if(window.innerWidth < 576){
                animateHeaderHamburger('open_small', 0.25);
                gsap.to(headerList, {height: '195px', duration: 0.25, ease: 'power1', onComplete: function(){
                    headerList.classList.add('main-header__list--hamburger-small-open');
                }});
                return;
            }
            animateHeaderHamburger('open_large', 0.25);
            gsap.to(headerList, {height: '224px', duration: 0.25, ease: 'power1'});
            return;
        }
        animateHeaderHamburger('close', 0.25);
        gsap.to(headerList, {height: '0px', duration: 0.25, ease: 'power1'});
    }
})();
/**
 * Triggers the function which, via an animation, will either open or close the hamburger drop-down menu when the hamburger icon is 
   clicked on.
 */
headerHamburger.onclick = configureHamburgerHeaderList;
/**
 * Animates the header hamburger icon open and closed for 2 different media queries, hence why there are 3 different animations in total. 
   This only animates the icon and not the drop-down menu associated with it.
 * @returns void
 */
function animateHeaderHamburger(type, duration){
    if(type === 'open_small'){
        gsap.timeline({defaults: {duration: duration, ease: 'power1'}})
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_top')[0], {
                    transform: 'rotate(-45deg) translate(-10px, 16px)'
                }, 0)
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_bottom')[0], {
                    transform: 'rotate(45deg) translate(-8px, -16px)'
                }, 0)
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_center')[0], {
                    opacity: '0'
                }, 0);
        headerHamburger.setAttribute('open', 'true');
        return;
    }
    if(type === 'open_large'){
        gsap.timeline({defaults: {duration: duration, ease: 'power1'}})
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_top')[0], {
                    transform: 'rotate(-45deg) translate(-15px, 16px)'
                }, 0)
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_bottom')[0], {
                    transform: 'rotate(45deg) translate(-15px, -16px)'
                }, 0)
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_center')[0], {
                    opacity: '0'
                }, 0);
        headerHamburger.setAttribute('open', 'true');
        return;
    }
    if(type === 'close'){
        gsap.timeline({defaults: {duration: duration, ease: 'power1'}})
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_top')[0], {
                    transform: 'rotate(0deg) translate(-0px, 0px)'
                }, 0)
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_bottom')[0], {
                    transform: 'rotate(0deg) translate(0px, -0px)'
                }, 0)
                .to(headerHamburger.getElementsByClassName('main-header__hamburger_center')[0], {
                    opacity: '1'
                }, 0);
                headerHamburger.setAttribute('open', '');
        return;
    }
}