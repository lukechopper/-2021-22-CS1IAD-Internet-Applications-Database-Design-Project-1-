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
 * These next 3 lines call the 'sortOutMainMenu' function when it is required. I.e., on document load, when the window size is changed
   and when we scroll our window.
 */
addEventListener('scroll', sortOutMainMenu);
addEventListener('load', sortOutMainMenu);
addEventListener('resize', sortOutMainMenu);

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
        if(isOpen){
            if(window.innerWidth < 576){
                gsap.to(headerList, {height: '159px', duration: 0.25, ease: 'power1'});
                return;
            }
            gsap.to(headerList, {height: '165px', duration: 0.25, ease: 'power1'});
            return;
        }
        gsap.to(headerList, {height: '0px', duration: 0.25, ease: 'power1'});
    }
})();
/**
 * Triggers the function which, via an animation, will either open or close the hamburger drop-down menu when the hamburger icon is 
   clicked on.
 */
headerHamburger.onclick = configureHamburgerHeaderList;