//START OF THE MAIN HEADER SECTION
//
//
//

/* GLOBAL Cubic Bezier easing values, used for the transition. */
const easeInOutSine = 'cubic-bezier(0.37, 0, 0.63, 1)';
const easeOutBack = 'cubic-bezier(0.34, 1.60, 0.64, 1)';
const easeInBack = 'cubic-bezier(0.36, 0, 0.64, -0.65)';

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
     * Sort out the global 'isCollapsed' Boolean, when our incumbent media query is a small one, so that we are ready for when our small media
       query transitions back to a larger one again, and hence our main header goes back to its larger mode.
     * @param offsetTop Comes directly from 'offsetTop', as declared in the main function.
     */
    function sortOutIsCollapsed(offsetTop){
        if(offsetTop < 40){
            isCollapsed = true;
        }
        if(offsetTop > 39){
            isCollapsed = false;
        }
    }
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
            sortOutIsCollapsed(offsetTop);
            if(counter < 4 || isWindowResizing || contactModalInAnim){
                offsetTopStore = offsetTop;
                return;
            }
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
        let cDuration = 0;
        if(counter > 2) cDuration = duration;
        transitionElement(mainHeader.getElementsByClassName('main-header__title')[0],cDuration,easeInOutSine,
        [['fontSize','2rem']]);
        transitionElement(mainHeader.getElementsByClassName('main-header__sub_title')[0],cDuration,easeInOutSine,
        [['opacity','0']]);
        transitionElement(mainHeader.getElementsByClassName('main-header__left-section')[0],cDuration,easeInOutSine,
        [['height','43px']]);
        return;
    }
    if(type==='expand'){
        transitionElement(mainHeader.getElementsByClassName('main-header__title')[0],duration,easeInOutSine,
        [['fontSize','2.5rem']]);
        transitionElement(mainHeader.getElementsByClassName('main-header__sub_title')[0],duration,easeInOutSine,
        [['opacity','1']]);
        transitionElement(mainHeader.getElementsByClassName('main-header__left-section')[0],duration,easeInOutSine,
        [['height','69px']]);
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
        transitionElement(mainHeader,duration,easeInOutSine,[['top','-'+headerHeight+'px']]);
        isFloatedOfScreen = true;
        return;
    }
    if(type==='float_in'){
        transitionElement(mainHeader,duration,easeInOutSine,[['top','0px']]);
        isFloatedOfScreen = false;
    }
}


/**
 * The necessary event listeners for 'sortOutMainMenu'. They will execute this function as soon as the document loads and
   whenever we scroll on it. The 'sortOutMainMenu' is also called in the function that is passed into the 'resize' event listener.
   But, here, it is called directly by these event listeners.
 */
addEventListener('scroll', sortOutMainMenu);
/* Whilst the 'load' event handler does what the above comment said it would do, it is also calling the 
'checkURLFragmentOnInitialPageLoad' method so that, with a URL fragment set, we can immediately jump to the specific part of the 
page that we are meant to be focused on. */
addEventListener('load', function(){
    sortOutMainMenu();
    checkURLFragmentOnInitialPageLoad();
});
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
            /* Related to the contact form at the bottom of the page. If the empty duration error element is already present on the contact form, 
            then, based on how our media queries are changing, we want to reposition it into the right place. */
            repositionEmptyDurationError('expand');
        }
        if(windowState !== 'smallest' && window.innerWidth < 576){ //Going from anything larger than smallest to smallest
            animateHamburgerOpenSmallLarge('small');
            mainHeader.getElementsByClassName('main-header__left-section')[0].style.height = '';
            mainHeader.getElementsByClassName('main-header__title')[0].style.fontSize = '';
            /* Related to the contact form at the bottom of the page. If the empty duration error element is already present on the contact form, 
            then, based on how our media queries are changing, we want to reposition it into the right place. */
            repositionEmptyDurationError('contract');
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
                transitionElement(headerList,0.25,easeInOutSine,[['height','195px']], function(){
                    headerList.classList.add('main-header__list--hamburger-small-open');
                });
                return;
            }
            animateHeaderHamburger('open_large', 0.25);
            transitionElement(headerList,0.25,easeInOutSine,[['height','224px']]);
            return;
        }
        animateHeaderHamburger('close', 0.25);
        transitionElement(headerList,0.25,easeInOutSine,[['height','0px']]);
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
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_top')[0],duration,easeInOutSine,
        [['transform','rotate(-45deg) translate(-10px, 16px)']]);
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_bottom')[0],duration,easeInOutSine,
        [['transform','rotate(45deg) translate(-8px, -16px)']]);
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_center')[0],duration,easeInOutSine,
        [['opacity','0']]);
        headerHamburger.setAttribute('open', 'true');
        return;
    }
    if(type === 'open_large'){
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_top')[0],duration,easeInOutSine,
        [['transform','rotate(-45deg) translate(-15px, 16px)']]);
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_bottom')[0],duration,easeInOutSine,
        [['transform','rotate(45deg) translate(-15px, -16px)']]);
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_center')[0],duration,easeInOutSine,
        [['opacity','0']]);
        headerHamburger.setAttribute('open', 'true');
        return;
    }
    if(type === 'close'){
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_top')[0],duration,easeInOutSine,
        [['transform','rotate(0deg) translate(-0px, 0px)']]);
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_bottom')[0],duration,easeInOutSine,
        [['transform','rotate(0deg) translate(0px, -0px)']]);
        transitionElement(headerHamburger.getElementsByClassName('main-header__hamburger_center')[0],duration,easeInOutSine,
        [['opacity','1']]);
                headerHamburger.setAttribute('open', '');
        return;
    }
}


/**
 * The animation function used for all of our animations. Is essentially a gsap alternative, although is far more primitive, obviously.
 * @param {HTMLDOMElement} element The element that we want to animate.
 * @param {number} duration How long our transition should be.
 * @param {string} ease Our transitions ease. Note, since we are using CSS transitions to create our animations, in order for these eases to work,
   the values of this ease parameter will need to correspond to actual CSS ease values.
 * @param {[[string,string]]} keyValues Defines our animation. Is an Array of Array's, the latter of the 2 must contain 2 String values. The first
   value will correspond to the property that we are targeting for animation, and the latter is the value that we want this property to end up with
   by the time the animation is over.
   @param {function} onComplete An optional callback function that we can activate upon the event of the animation finishing.
 * @returns void
 */
function transitionElement(element, duration, ease, keyValues, onComplete){


    function applyStyles(transEle, keyValues){
        for(let i = 0; i < keyValues.length; i++){
            const keyValue = keyValues[i];
            transEle.style[keyValue[0]] = keyValue[1];
        }
    }

    const transEle = element;
    
    if(duration === 0){
        transEle.style.transition = '';
        applyStyles(transEle, keyValues);
        if(onComplete){
            onComplete();
        }
        return;
    }

    transEle.style.transition = 'all '+duration+'s '+ease;
    applyStyles(transEle, keyValues);
    
    transEle.ontransitionend = function(){
        /* Use 'setTimeout' because, without it, there seems to be an error where our transitions get canceled without our transition actually
        completing yet. */
        setTimeout(function(){transEle.style.transition = '';}, 0);
        if(onComplete){
            onComplete();
        }
    }
}

/**
 * Either add a <style> tag to the <head> of our HTMLDocument, or append further styles to it if this <style> tag already exists.
 * @param {string} styles Written in proper CSS form, as a string, this is the actual styles that we want to insert into our <style> tag.
 * @param {Boolean} overwrite If this is set to true, then we will replace an already existing <style> tag with a new one (so that there can only
   be one <style> tag at a time), containing the same content as the old <style> tag plus any new content that we want to append to it. If it is set
   to false, then we will simply add a <style> tag with some content to our <head>.
 * @returns void
 */
function addToHeaderStyle(styles, overwrite){
    const headEle = document.body.parentElement.childNodes[0];
    let strContent = '';
    const prevStyles = headEle.getElementsByTagName('style');
    if(prevStyles.length){
        if(overwrite){
            prevStyles[0].innerHTML = strContent;
        }
        prevStyles[0].remove();
    }
    const styleTag = document.createElement('style');
    styleTag.innerHTML = strContent+styles;
    headEle.appendChild(styleTag);
}
//END OF THE MAIN HEADER SECTION
//
//
//


//START OF OPTIONS SECTION
//
//
//

//Get access to the section marking the start of the 'Home' option in our nav bar.
const aboutEle = document.getElementById('about');
//Get access to the section marking the start of the 'Projects' option in our nav bar.
const projectsEle = document.getElementById('project');
//Get access to the section marking the start of the 'Contact Me' option in our nav bar.
const contactMeEle = document.getElementById('contact-me');
//Get access to our main nav options. I.e., the things in our nav bar that we click on.
const mainHeaderOptions = document.getElementsByClassName('main-header__options');
//Put the start of each section (where we will scroll to when we click on the relevant nav bar options) in an Array.
const startSectionsArray = [aboutEle, projectsEle, contactMeEle];
//Put the offset of each section in an Array. This is so we can account for the margin of each section.
const offsetStartSections = [140, 100, 100];
//Store the URL fragments related to each page secton in an array.
const urlFragments = ['home','projects','contact'];
/**
 * Either with an animation or without, scroll our window to the part of the page that we desire to go to.
 * @param arrayIndex int The array index corresponding to the 'offsetStartSections' and 'startSectionsArray' arrays specifically.
   Specifies which part of the page that we actually want to scroll to.
 * @param {'smooth','auto'} behaviour Specifies whether we want to scroll smoothly, with an animation, or whether we want to suddenly
   jump to the desired part of our page.
 * @returns void
 */
function scrollToPartOfPage(arrayIndex, behavior){
    const urlFragment = urlFragments[arrayIndex];
    location.hash = urlFragment;
    const startSection = startSectionsArray[arrayIndex];
    const offset = offsetStartSections[arrayIndex];
    const offsetNum = startSection.offsetTop - offset;
        window.scroll({
            top: offsetNum,
            behavior
        });
}
//Loop through our main nav options so that when we click on them, they can actually take us to somewhere on the page.
for(let i = 0; i < mainHeaderOptions.length; i++){
    const options = mainHeaderOptions[i];
    options.onclick = function(){
        scrollToPartOfPage(i, 'smooth');
    }
}
//Get access to the icon on the left of the nav bar so that when we click on it, we can get it to take us to the main starting section.
const mainHeaderLeftIcon = document.getElementById('main-header__left-icon');
//Get access to the up chevron in the footer
const upChevron = document.getElementById('footer__chevron');
//Create a function that will automatically scroll up to the top of the page. Will be applied as the 'onclick' event handler for elements.
function scrollUpToHome(){
    scrollToPartOfPage(0, 'smooth');
}
mainHeaderLeftIcon.onclick = scrollUpToHome;
upChevron.onclick = scrollUpToHome;

/**
 * As soon as our page loads, we want to check our URL fragment to see which part of the page we should automatically start on.
 * @returns void
 */
function checkURLFragmentOnInitialPageLoad(){
    let urlFragment = location.hash;
    if(urlFragment === '#home'){
        scrollToPartOfPage(0, 'auto');
    }else if(urlFragment === '#projects'){
        scrollToPartOfPage(1, 'auto');
    }else if(urlFragment === '#contact'){
        scrollToPartOfPage(2, 'auto');
    }
}

//END OF OPTIONS SECTION
//
//
//

//START OF FORM SECTION
//
//
//

//Get access to our main form element.
const contactForm = document.getElementById('contact__form');

//The function that we will use to quickly generate error messages
function generateErrorMessages(errorMsg, id=''){
    const ele = document.createElement('div');
    ele.classList.add('contact__form-error');
    ele.setAttribute('id', id);
    ele.textContent = errorMsg;
    return ele;
}
//Create the empty start date error message.
const emptyStartDate = generateErrorMessages('Cannot have an empty start date');
// Start date needs to be at least one day ahead error
const incorrectStartDate = generateErrorMessages('Start date needs to be at least one day in the future');
//Create the error message where they haven't entered a duration.
const emptyDurationError = generateErrorMessages('Cannot have an empty duration', 'empty-duration-error');
//Create the error message where they haven't entered a forename.
const emptyForenameError = generateErrorMessages('Cannot have an empty forename');
//Create the error message where the user hasn't chosen a contact method.
const contactMethodError = generateErrorMessages('Need to choose a contact method');
//Create the necessary errors for the first email input.
const firstEmailEmptyError = generateErrorMessages('Cannot have an empty email'); const secondEmailEmptyError = generateErrorMessages('Please enter an actual email');
//Create the necessary errors for the second email input.
const thirdEmailEmptyError = generateErrorMessages('Cannot have an empty email'); const fourthEmailEmptyError = generateErrorMessages('Please enter an actual email');
//Create the error informing that emails need to match
const matchingEmailsError = generateErrorMessages('Emails need to match');
//Create the error informing that the phone input is empty
const emptyPhoneNumberError = generateErrorMessages('Cannot have an empty phone number');
//Create the error informing that the phone input doesn't represent an actual phone number
const incorrectPhoneNumberError = generateErrorMessages('This input can only take in numbers and hyphens');
//Create the error infroming that the message is empty
const emptyMessageError = generateErrorMessages('Cannot have an empty message');

/**
 * Sort out our contact method <select> tag so that based on what the user has set its value to be, the relevant inputs on the form 
   will become required.
 * @var contactMethodOption Keep track of the current value of the contact method
 * @param e The onchange event.
 * @returns void
 */
let contactMethodOption = contactForm.contactMethod.value;
contactForm.contactMethod.onchange = function(e){
    let selectedOption = e.target.value;
    contactMethodOption = selectedOption;
}

/**
 * Do the standard error checking for the 2 email inputs
 * @param {Boolean} shouldEmailCheck We should check our email inputs unless we have set phone to be our preferred contact method
   and have both email inputs set to be empty, or if we just have our preferred contacts set to none. If this is the case, 
   then this Boolean will inform us as such, allowing us to not run the checks as a result.
 * @returns Boolean
 */
function emailInputsErrorChecking(emailInput, emailError1, emailError2, shouldEmailCheck){
    let firstError = false;
    //Display error if they have chosen email as their contact method but haven't entered anything for the first email input.
    if(emailInput.value === '' && shouldEmailCheck){
        contactForm.insertBefore(emailError1, emailInput);
        firstError = true;
    }else{
        emailError1.remove();
    }
    //Display error if they haven't entered a proper email.
    let emailMatch = emailInput.value.match(/([a-z]|[A-Z]|[0-9])+@([a-z]|[A-Z]|[0-9])+\.([a-z]|[A-Z]|[0-9])+/g);
    if(!emailMatch && !firstError && shouldEmailCheck){
        contactForm.insertBefore(emailError2, emailInput);
        firstError = true;
    }else{
        emailError2.remove();
    }
    return firstError;
}

/**
 * Check that emails need to match.
 * @param currError Boolean Is the current error state from the main error checking function. If this is already set to be true, then
   since our main error Boolean will be set to be the value of a local error Boolean from this function, to not mess things up, if our
   main error Boolean, as determined by this parameter, is already set to be true, then we want to set the local error Boolean to be true
   as well.
 * @param hasEmailError Boolean Checks to see whether there has already been an error associated with any of the email inputs prior to
   this function being called. If there has, then we don't want to add an error message here.
 * @returns Boolean
 */
function matchingEmailsChecker(emailInput1, emailInput2, hasEmailError){
    let hasError = false;
    if(emailInput1.value !== emailInput2.value && !hasEmailError){
        contactForm.insertBefore(matchingEmailsError, emailInput1);
        hasError = true;
    }else{
        matchingEmailsError.remove();
    }
    return hasError;
}

//Check that start date is a day ahead
function startDateProperDayChecker(startDateEle){
    let hasError = false;
    let chosenDate = new Date(startDateEle.value);
    let currentDate = new Date();
    if(currentDate.getTime() >= chosenDate.getTime()){
        removeElements(emptyStartDate, emptyDurationError);
        contactForm.insertBefore(incorrectStartDate, document.getElementById('start-and-end-date'));
        hasError = true;
    }
    if(!hasError && chosenDate.getDate() <= currentDate.getDate()){
        removeElements(emptyStartDate, emptyDurationError);
        contactForm.insertBefore(incorrectStartDate, document.getElementById('start-and-end-date'));
        hasError = true;
    }
    if(!hasError) incorrectStartDate.remove();
    return hasError;
}

//Check that duration isn't empty
function emptyDurationChecker(){
    let isError = false;
    if(!contactForm.endDate.value){
        removeElements(incorrectStartDate, emptyStartDate);
        if(window.innerWidth < 576){
            document.getElementById('start-and-end-date').insertBefore(emptyDurationError, document.getElementById('contact__form-end-date'));
        }else{
            emptyDurationError.classList.add('contact__form-error-duration-large');
            contactForm.insertBefore(emptyDurationError, document.getElementById('start-and-end-date'));
        }
        
        isError = true;
    }else{
        emptyDurationError.remove();
    }
    return isError;
}

/**
 * Do the proper checks for the phone number input
 * @param {Boolean} shouldPhoneCheck We should check our phone input unless we have set our preferred contact method to be email
   and have not entered in anything for our phone input, or if we just have our preferred contacts set to none. If this is the case, 
   then this Boolean will inform us as such, allowing us to not run the checks as a result.
 * @returns Boolean
 */
function phoneInputChecker(shouldPhoneCheck){
    let isError = false;
    //Create the error where the phone number is empty.
    if(!contactForm.phoneNumber.value && shouldPhoneCheck){
        contactForm.insertBefore(emptyPhoneNumberError, contactForm.phoneNumber);
        isError = true;
    }else{
        emptyPhoneNumberError.remove();
    }
    //Create the error where the phone number isn't in the format of an actual phone number
    let matchPhone = contactForm.phoneNumber.value.match(/([0-9]|-)+/g);
    if(!isError && !matchPhone && shouldPhoneCheck){
        contactForm.insertBefore(incorrectPhoneNumberError, contactForm.phoneNumber);
        isError = true;
    }else{
        incorrectPhoneNumberError.remove();
    }
    return isError;
}

/*Remove elements that need to be removed to make way for new element. Unlike the other functions in this section, this is essentially
just a util function. */
function removeElements(){
    let argumentsArray = Array.prototype.slice.call(arguments);
    for(let i = 0; i < argumentsArray.length; i++){
        let ele = argumentsArray[i];
        ele.remove();
    }
}

/**
 * When we click on the submit button which isn't necessarily the same as submitting the form. Hence, this is where we will be 
   doing error checking.
 * @returns void
 */
contactForm.submit.onclick = function(){
    let hasBeenError = false;
    //Display error if they haven't entered a start date
    if(!contactForm.startDate.value){
        removeElements(incorrectStartDate, emptyDurationError);
        contactForm.insertBefore(emptyStartDate, document.getElementById('start-and-end-date'));
        hasBeenError = true;
    }else{
        emptyStartDate.remove();
    }

    //Display an error if start date isn't a day ahead
    if(!hasBeenError){
        hasBeenError = startDateProperDayChecker(contactForm.startDate);
    }

    //Display an error message if there is no duration
    if(!hasBeenError){
        hasBeenError = emptyDurationChecker();
    }
    
    //Display error if they haven't entered a forename
    if(!contactForm.forename.value){
        contactForm.insertBefore(emptyForenameError, contactForm.forename);
        hasBeenError = true;
    }else{
        emptyForenameError.remove();
    }

    //Display error if they haven't chosen a contact method
    if(contactMethodOption === 'none'){
        contactForm.insertBefore(contactMethodError, document.getElementById('contactMethodLabel'));
        hasBeenError = true;
    }else{
        contactMethodError.remove();
    }
    /* Get the record of whether there has been an email error or not. If there has, then we will set our main error Boolean, 'hasBeenError', to be true
    and we will also be able to check to see whether the emails match each other or not. But, thanks to this Boolean, we will only do 
    that if there isn't an individual problem with any of the email inputs first and foremost. */
    let emailError = false;
    /* Check the individual email inputs for errors unless we have set our preferred contact method to be phone and have left both of
    our email inputs to be empty, or if we just haven't set a preferred contact method yet */
    let shouldEmailCheck = true;
    if(contactMethodOption === 'phone' && contactForm.email.value === '' && contactForm.confirmEmail.value === '' || contactMethodOption === 'none') shouldEmailCheck = false;

    /*Do the proper email checking for both emails. Note, inside the function, we automatically check to see that the 'contactMethodOption'
    is set to the correct value, that is 'string', which is why we aren't checking for that outside of the function here.*/
    emailError = emailInputsErrorChecking(contactForm.email, firstEmailEmptyError, secondEmailEmptyError, shouldEmailCheck);
    /* If the previous email input did have an error, then run the checker on the next email input, automatically making it ignore whatever
    errors this latter email input may have, and forcing it to just clear all its errors. If this isn't the case, then just run the error
    checker function like normal. */
    if(emailError){
        emailInputsErrorChecking(contactForm.confirmEmail, thirdEmailEmptyError, fourthEmailEmptyError, false);
    }else{
        emailError = emailInputsErrorChecking(contactForm.confirmEmail, thirdEmailEmptyError, fourthEmailEmptyError, shouldEmailCheck);
    }
    
    
    if(emailError) hasBeenError = true;


    //Display error if both emails don't match
    let matchingEmailsError = false;
    matchingEmailsError = matchingEmailsChecker(contactForm.email, contactForm.confirmEmail, emailError);
    if(matchingEmailsError) hasBeenError = true;

    /* See if there was a phone error or not. If there was, then we will set our main 'hasError' Boolean to be true. If there wasn't, then
    we won't do anything. */
    let phoneError = false;
    /* Check the phone input errors unless we have set our preferred contact method to be email and have left our phone input completely
    empty, or if we just haven't set a preferred contact method yet */
    let shouldPhoneCheck = true;
    if(contactMethodOption === 'email' && contactForm.phoneNumber.value === '' || contactMethodOption === 'none') shouldPhoneCheck = false;
    
    phoneError = phoneInputChecker(shouldPhoneCheck);
    
    if(phoneError) hasBeenError = true;

    //Check to see that there is actually a message
    if(!contactForm.extraComments.value){
        contactForm.insertBefore(emptyMessageError, document.getElementById('extra-comments-label'));
        hasBeenError = true;
    }else{
        emptyMessageError.remove();
    }


    //Since there hasn't been any errors up to this point, insert the confirmation modal now.
    if(!hasBeenError){
        insertContactModal();
    }
}

//Prevent our page from automatically reloading when we click to submit our form.
contactForm.onsubmit = function(e){
    e.preventDefault();
}

/**
 * If it has been added to the form, then reposition the empty duration error form element whenever our incumbent media query changes, thus
   compelling us to put this element in its right place.
 * @param {'expand','contract'} type Based on what our incumbent media query has changed to, this parameter will specify how we should reposition
   our empty duration error element.
 */
function repositionEmptyDurationError(type){
    const durEle = document.getElementById('empty-duration-error');
    if(!durEle) return;
    if(type === 'expand'){
        durEle.remove();
        durEle.classList.add('contact__form-error-duration-large');
        contactForm.insertBefore(durEle, document.getElementById('start-and-end-date'));
        return;
    }
    if(type === 'contract'){
        durEle.remove();
        durEle.classList.remove('contact__form-error-duration-large');
        document.getElementById('start-and-end-date').insertBefore(durEle, document.getElementById('contact__form-end-date'));
        return;
    }
}
//END OF FORM SECTION
//
//
//



//START OF CONTACT MODAL SECTION
//
//
//

//Get access to the <main> element of our page so that we can insert our contact modal as the very last child of it
const mainEle = document.getElementById('main');

//Create the main contact modal <section> element. Both it's id and class will be exactly that: 'contact-modal'.
function createContactModalEle(){
    const contactModalEle = document.createElement('section');
    contactModalEle.setAttribute('class', 'contact-modal');
    contactModalEle.setAttribute('id', 'contact-modal');
    return contactModalEle;
}

/**
 * The event handler for when the exit btn of the contact modal is clicked on. When this happens, we want this function to close down
   the associated contact modal.
 * @var contactModalInAnim Boolean If our contact modal is in mid animation, then this Boolean will prevent us from closing our modal 
   until it has finished animating.
 * @returns void
 */
let contactModalInAnim = false;
function closeContactModal(){
    //If our contact modal is already animating, then we don't want to be able to close it
    if(contactModalInAnim) return;

    //Add the ability to scroll back to our page since our contact modal should now be closed.
    document.body.parentElement.style.overflow = '';
    /* Get access to the actual <section> element that serves as the root element for our entire modal */
    const contactModalEle = document.getElementById('contact-modal');
    if(!contactModalEle) return;

    /* Get access to the main part of the contact modal so that we can animate it */
    const contactModalMainEle = document.getElementById('contact-modal__main');
    animateMainModalElement(contactModalMainEle, 'up', contactModalEle);
}

/* Used when creating the contact modal. If input is empty, then output 'N/A'. If it isn't, then output the actual contents of the 
specific input passed in. */
function handleContactModalEmptyInput(inputEleValue){
    let returnString = 'N/A';

    if(inputEleValue) returnString = inputEleValue;

    return returnString;
}

/**
 * Animate the main part of the contact modal element. That is, animate it opening and closing.
 * @param {'down','up'} direction Configures how we are animating the main part of our contact modal. That is, whether we are going to
   animate it either up or down.
   @param contactModalMainEle The main element from the contact modal that is actually going to be animated.
   @param contactModalEle Only used for the 'up' animation. Used to remove the contact modal completely from the screen when the 'up'
   animation is over.
 * @returns void
 */
function animateMainModalElement(contactModalMainEle, direction, contactModalEle){
    //Set the 'contactModalInAnim' Boolean to its appropriate value once the animation is over
    function animationIsComplete(){
        contactModalInAnim = false;
    };

    /* Calculate the height by which we should offset the top of our contact modal main section by. This offset will be done in pixels
    and by prefacing the output of this calculation with a minus. This is done so that if the main part of our contact modal
    starts from this offset, then it will be just off the top edge of the screen, relative to the size of the screen, and ready to 
    animate down.*/
    let animHeight = contactModalMainEle.offsetHeight+contactModalMainEle.offsetTop;

    if(direction === 'down'){
        contactModalInAnim = true;
        addToHeaderStyle('.contact-modal__main{ \
            transform: translateY(-'+animHeight+'px);'+'\
        }', false);
        /* Use setTimeout so that the styles applied above, necessary for the animation to even work, have time to actually be applied. Thus,
        our animation can transition from the styles applied above to the ones applied here. */
        setTimeout(() => {
            transitionElement(contactModalMainEle,0.6,easeOutBack,[['transform','translateY(0px)']],animationIsComplete);
        }, 0);
        return;
    }
    if(direction === 'up' && contactModalEle){
        contactModalInAnim = true;
        transitionElement(contactModalMainEle,0.6,easeInBack,[['transform','translateY(-'+animHeight+'px)']],function(){
            contactModalInAnim = false;
            contactModalEle.remove();
        });
        return;
    }
}

/**
 * Since the form has been submitted without any errors, use this function to add the confirmation modal to our page, summarising
   the users form input and allowing them to accept it for the final time.
 * @returns void
 */
function insertContactModal(){
    const contactModalEle = createContactModalEle();

    let contactModalEleString = '<div class="contact-modal__main" id="contact-modal__main"> \
    <div class="contact-modal__exit-btn" id="contact-modal__exit-btn">X</div> \
    <h1 class="title contact-modal__title">Confirm</h1> \
    <div class="underline contact-modal__title-underline"></div> \
    <div class="contact-modal__row"> \
        <h2 class="contact-modal__header">To:</h2> \
        <p>200126984@aston.ac.uk</p> \
    </div> \
    <div class="contact-modal__row"> \
        <h2 class="contact-modal__header">Start Date:</h2> \
        <p>'+contactForm.startDate.value+'</p> \
    </div> \
    <div class="contact-modal__row"> \
        <h2 class="contact-modal__header">Duration:</h2> \
        <p>'+contactForm.endDate.value+'</p> \
    </div> \
    <div class="contact-modal__row"> \
        <h2 class="contact-modal__header">Forename:</h2> \
        <p>'+contactForm.forename.value+'</p> \
    </div> \
    <div class="contact-modal__row"> \
        <h2 class="contact-modal__header">Email:</h2> \
        <p>'+handleContactModalEmptyInput(contactForm.email.value)+'</p> \
    </div> \
    <div class="contact-modal__row"> \
        <h2 class="contact-modal__header">Phone:</h2> \
        <p>'+handleContactModalEmptyInput(contactForm.phoneNumber.value)+'</p> \
    </div> \
    <div class="contact-modal__row"> \
        <h2 class="contact-modal__header">Message:</h2> \
        <p>'+contactForm.extraComments.value+'</p> \
    </div> \
    <button class="contact-modal__send-btn" id="contact-modal__send-btn">Send</button> \
    </div>';

    contactModalEle.innerHTML = contactModalEleString;
    mainEle.appendChild(contactModalEle);

    /* Add the appropriate event handlers to the exit btn and the send btn of our contact form. In other words, by adding the event 
    handlers, make our contact form close when we click on these things. */
    const exitBtn = document.getElementById('contact-modal__exit-btn');
    exitBtn.onclick = closeContactModal;
    const sendBtn = document.getElementById('contact-modal__send-btn');
    sendBtn.onclick = closeContactModal;
    /* Make it so that we close the exit modal when we click on the background (transparent gray part) of the contact modal.
    Due to event propogation, we need to be extra careful that this is the element that we are actually clicking on here.*/
    contactModalEle.onclick = function(e){
        const ele = e.target;
        if(ele.getAttribute('id') !== 'contact-modal') return;
        closeContactModal();
    }

    /* Since our modal is now open, we will now remove scroll from the main page, only to add it back again once our modal 
    is closed. */
    document.body.parentElement.style.overflow = 'hidden';

    /* Get access to the main part of the contact modal so that we can animate it */
    const contactModalMainEle = document.getElementById('contact-modal__main');
    animateMainModalElement(contactModalMainEle, 'down');
}