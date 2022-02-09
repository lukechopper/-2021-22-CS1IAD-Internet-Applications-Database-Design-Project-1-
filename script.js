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
    let isSmall = false; //isSmall used to see if we are inside a certain diminutive media query or not. Allows for cohesion with the css of the main header.

    return function(){
        if(window.innerWidth < 992){
            isSmall = true;
            return;
        }
        if(isSmall){
            mainHeader.classList.add('main-header--no_transition');
            setTimeout(() => {
                mainHeader.classList.remove('main-header--no_transition');
            }, 5);
            isSmall = false;
        }
        const offsetTop = document.body.getBoundingClientRect().top;
        if(offsetTop < 40 && !mainHeader.classList.contains('main-header--small')){
            mainHeader.classList.add('main-header--small');
            return;
        }
        if(offsetTop > 39 && mainHeader.classList.contains('main-header--small')){
            mainHeader.classList.remove('main-header--small');
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
     * @var isOpen determines whether the hamburger menu drop-down is open or not. Used to decide whether we should open or close
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