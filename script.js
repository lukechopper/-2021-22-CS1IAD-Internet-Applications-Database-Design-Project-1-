//START OF THE MAIN HEADER SECTION
//
//
//

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
 * Based on the currently incumbent media query, this function either expands or contracts our main header, if we are on a larger screen,
   or it floats it out or into view, if we are on a smaller screen.
 *  @var isCollapsed Boolean Determines whether our <header> is in expanded mode or not. Note, this is specifically for the larger
   media queries.
 * @var isFloatedOfScreen Boolean Determines whether our <header> has floated off screen or not. Note, this is specifically for the smaller
   media queries.
 * @returns void
 */
let isCollapsed = false;
let isFloatedOfScreen = false;
const sortOutMainMenu = (function() {
    /**
     * @type int Count the number of times called. Needed for initial load. Don't want to play any animations, either opening or closing,
       on initial document load
     */
    let counter = 0;
    /**
     * The value of this variable is used to calculate our scroll position. Consequently, it is used to trigger our animations.
       As for this variable itself, it contrasts with 'offsetTop', used later on in the main function, to see whether we are either
       scrolling up or down.
     */
    let offsetTopStore = document.body.getBoundingClientRect().top;
    /**
     * Used to animate, when necessary, the header when our larger media query is currently incumbemnt.
     * @param offsetTop Comes directly from 'offsetTop', as declared in the main function.
     * @returns void
     */
    function sortLargerMediaQuery(offsetTop){
        if(offsetTop < 40 && !isCollapsed){
            animateExpandedMainHeader('contract', counter);
            isCollapsed = true;
            return;
        }
        if(offsetTop > 39 && isCollapsed){
            animateExpandedMainHeader('expand');
            isCollapsed = false;
        }
    }
    /**
     * Used to animate, when necessary, the header when our smaller media query is currently incumbemnt.
     * @param offsetTop Comes directly from 'offsetTop', as declared in the main function.
     * @param headerHeight Used for the animation. The amount that our header needs to float up by is based on the height of the header. That is, this parameter.
     * @returns void
     */
    function sortSmallerMediaQuery(offsetTop, headerHeight){
        if(offsetTop < offsetTopStore && !isFloatedOfScreen){
            if(isOpen) return;
            animateSmallerMainHeader('float_off', headerHeight, 0.8);
            return;
        }
        if(offsetTop > offsetTopStore && isFloatedOfScreen){
            animateSmallerMainHeader('float_in', headerHeight, 0.8);
        }
    }

    return function(){
        counter++;
        const offsetTop = document.body.getBoundingClientRect().top;
        if(window.innerWidth < 992){
            if(counter < 2 || isWindowResizing) return;
            sortSmallerMediaQuery(offsetTop, mainHeader.clientHeight);
        }else{
            sortLargerMediaQuery(offsetTop);
        }
        offsetTopStore = offsetTop;
    }
})();
/**
 * Holds the animations relevant to the 'sortOutMainMenu' function when the larger media query is incumbent.
 * @param {'contract', 'expand'} type Defines whether the closing or the opening animation should take place.
 * @param counter Used to detect initial document load. We don't want any animations on initial document load.
 * @param duration  Specifies the duration of the animation.
 * @returns void
 */
function animateExpandedMainHeader(type, counter = 5, duration = 0.25){
    if(type==='contract'){
        gsap.timeline({defaults: {duration: counter>1 ? duration : 0, ease: 'power1'}})
                .to(mainHeader.getElementsByClassName('main-header__title')[0], {
                    fontSize: '2rem'
                }, 0)
                .to(mainHeader.getElementsByClassName('main-header__sub_title')[0], {
                    opacity: 0
                }, 0)
                .to(mainHeader.getElementsByClassName('main-header__left-section')[0], {
                    height: '43px'
                }, 0);
        return;
    }
    if(type==='expand'){
        gsap.timeline({defaults: {duration: duration, ease: 'power1'}})
                .to(mainHeader.getElementsByClassName('main-header__title')[0], {
                    fontSize: '2.5rem'
                }, 0)
                .to(mainHeader.getElementsByClassName('main-header__sub_title')[0], {
                    opacity: 1
                }, 0)
                .to(mainHeader.getElementsByClassName('main-header__left-section')[0], {
                    height: '69px'
                }, 0);
        return;
    }
}
/**
 * Holds the animations relevant to the 'sortOutMainMenu' function when the smaller media query is incumbent.
 * @param {'float_off','float_in'} type  Defines whether the closing or the opening animation should take place.
 * @param {*} headerHeight The amount that our header needs to float up by in the animation is based on the height of the header. That is, this parameter.
 * @param {*} duration Specifies the duration of the animation.
 * @returns 
 */
function animateSmallerMainHeader(type, headerHeight, duration){
    if(type==='float_off'){
        gsap.to(mainHeader, {duration, top: '-'+headerHeight+'px',ease:'power1'});
        isFloatedOfScreen = true;
        return;
    }
    if(type==='float_in'){
        gsap.to(mainHeader, {duration, top: '0px',ease:'power1'});
        isFloatedOfScreen = false;
    }
}


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
 * @var isWindowResizing Due to the changing around of elements on the screen. When resizing, our program may think that we are scrolling
   down on the page. Thus, without this Boolean, the smaller media query version of our header may begin to animate inappropriately. But since
   we do have this Boolean, we therefore resolve the problem.
 * @returns void
 */
let isWindowResizing = false;
const windowResize = (function(){
    let windowState = '';
    /**
     * Sets the associated variable to have the correct value in correspondance to our screen width.
     * @var {'large', 'medium', 'small', 'smallest'} windowState String variable that is used to keep track of which media query is currently incumbent.
     * @returns void
     */
    function setWindowState(){
        windowState = 'large';
        if(window.innerWidth < 992){
            windowState = 'medium';
        }
        if(window.innerWidth < 768){
            windowState = 'small';
        }
        if(window.innerWidth < 576){
            windowState = 'smallest';
        }
    }; setWindowState();
    /**
     * Forces the hamburger menu icon into the correct position if the currently incumbent media has changed, thus requiring us to do this.
     * @param {'large', 'small'} type The settings. It relates to what our media query has currently changed to.
     * @returns void
     */
    function animateHamburgerOpenSmallLarge(type){
        if(headerHamburger.getAttribute('open') !== 'true') return;
        if(type === 'large'){
            animateHeaderHamburger('open_large', 0);
        }else if(type === 'small'){
            animateHeaderHamburger('open_small', 0);
        }
    }
    /**
     * Defines what we should do when we change from one incumbent media query to the next. This mainly involves forcing the styles
       of different elements to match what the newly incumbent media query demands.
     * @returns void
     */
    return function(){
        isWindowResizing = true;
        sortOutMainMenu();
        if(windowState === 'large' && window.innerWidth < 992){ //Going from large to anything smaller than large.
            animateExpandedMainHeader('expand', 5, 0);
        }
        if(windowState !== 'large' && window.innerWidth > 991){ //Going from anything smaller than large to large.
            animateSmallerMainHeader('float_in', mainHeader.clientHeight, 0);
            if(isCollapsed){
                animateExpandedMainHeader('contract', 5, 0);
            }
        }
        if(windowState === 'smallest' && window.innerWidth > 575){ //Going from smallest to anything larger than it.
            if(isFloatedOfScreen){
                animateSmallerMainHeader('float_off', mainHeader.clientHeight, 0);
            }
            animateHamburgerOpenSmallLarge('large');
        }
        if(windowState !== 'smallest' && window.innerWidth < 576){ //Going smallest to anything larger than it.
            animateHamburgerOpenSmallLarge('small');
            mainHeader.getElementsByClassName('main-header__left-section')[0].style.height = '';
            mainHeader.getElementsByClassName('main-header__title')[0].style.fontSize = '';
        }
        setWindowState();
        setTimeout(function(){
            isWindowResizing = false;
        }, 10);
    }
})();
addEventListener('resize', windowResize);

/**
 * With the relevant animation, opens and closes the hamburger drop-down menu, as from our main header, when the hamburger icon
   is clicked on.
 * @var isOpen Boolean Determines whether the hamburger menu drop-down is open or not. Used to decide whether we should open or close
       this drop-down menu in the coming function.
 * @returns void
 */
let isOpen = false;
const configureHamburgerHeaderList = (function(){
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
 * @param {'open_small','open_large','close'} type Defines which animation should take place.
 * @param duration Defines how long the animation should take place for.
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
//END OF THE MAIN HEADER SECTION
//
//
//


//Get access to the section marking the start of the 'Home' option in our nav bar.
const aboutEle = document.getElementById('about');
//Get access to the section marking the start of the 'Projects' option in our nav bar.
const projectsEle = document.getElementById('project');
//Get access to our main nav options. I.e., the things in our nav bar that we click on.
const mainHeaderOptions = document.getElementsByClassName('main-header__options');
//Put the start of each section (where we will scroll to when we click on the relevant nav bar options) in an Array.
const startSectionsArray = [aboutEle, projectsEle, projectsEle];
//Put the offset of each section in an Array. This is so we can account for the margin of each section.
const offsetStartSections = [120, 100, 100];
//Loop through our main nav options so that when we click on them, they can actually take us to somewhere on the page.
for(let i = 0; i < mainHeaderOptions.length; i++){
    const options = mainHeaderOptions[i];
    options.onclick = function(){
        const startSection = startSectionsArray[i];
        const offset = offsetStartSections[i];
        const offsetNum = startSection.offsetTop - offset;
            window.scroll({
                top: offsetNum,
                behavior: 'smooth'
            });
    }
}
//Get access to the icon on the left of the nav bar so that when we click on it, we can get it to take us to the main starting section.
const mainHeaderLeftIcon = document.getElementById('main-header__left-icon');
mainHeaderLeftIcon.onclick = function(){
    window.scroll({
        top: startSectionsArray[0],
        left: 0,
        behavior: 'smooth'
    });
}