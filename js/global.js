// actual inner content is <div>-based, so we hoist everything inside
// td.contentMain into a <div> and retain styling. (seems to work so far.)
// then headers, LH menu, etc. are scraped, and we can generate a new HTML
// fragment with same options and replace the <table> structure with it.

var originalContainer = document.querySelector('body > table');
originalContainer.style.display = 'none';

// parse search link URI
var searchURI = document.querySelector('.topLink a[href^="./search.php?"]').href;
// create new header
var header = document.createElement('div');
header.id = "header";
header.innerHTML = `
    <div id="header-content-row">
	<img id="header-img-1" src="https://www.lockpicking101.com/images/header_1.gif" alt="">
        <div class="title-content">
            <h2 class="maintitle">Lock Picking 101 Forum</h2>
            <span class="genmed">A community dedicated to the fun and ethical hobby of lock picking.</span>
        </div>
        <ul class="header-links" style="">
            <li class="topLink" style=""><a href="https://www.lockpicking101.com/" class="navtop" style="">Forum Home</a></li>
            <li class="topLink"><a href="https://www.lockpicking101.com/viewtopic.php?f=2&amp;t=715" target="_blank" class="navtop">Forum Rules</a></li>
            <li class="topLink"><a id="top-menu-search" href="${searchURI}" target="_blank" class="navtop">SEARCH</a></li>
            <li class="topLink" style=""><a href="https://www.facebook.com/LockPicking101" target="_blank" class="navtop">Social Media</a></li>
            <li class="topLink" style=""><a href="https://www.lockpicking101.com/viewtopic.php?f=2&amp;t=64483" target="_blank" class="navtop">Contact Us</a></li>
        </ul>
    </div>
    <div class="header-mid-spacer" style=""></div>
    <div class="header-bottom-spacer">
        <img class="header-side-background" src="https://www.lockpicking101.com/images/back.gif" alt=""><div class="header-bottom-spacer-span"><img id="header-img-3" src="https://www.lockpicking101.com/images/header_3.gif" alt=""></div><img class="header-side-background" src="https://www.lockpicking101.com/images/back.gif" alt="">
    </div>
`;
document.body.appendChild(header);

// create custom div where content will be moved after processing
var container = document.createElement('div');
container.classList.add('hidden');
container.id = "container";
container.innerHTML = `
<div id="side-menu"></div>
<div id="content"></div>
`;
document.body.appendChild(container);

// parse side menu
var menu = document.querySelector("body > table div[align=center] td[width='166'] td[valign=top]");
var menuItems = menu.querySelectorAll("span.navHeader, .snav");
var convertedItems = [];
var dropdownItems = [];
for (var item of Array.from(menuItems)) {
    if (item.classList.contains('navHeader')) {
        var ulHeader = document.createElement('h4');
        ulHeader.classList.add('navHeader');
        ulHeader.innerHTML = item.innerHTML;

        convertedItems.push(ulHeader);
        convertedItems.push( document.createElement('ul') );

        dropdownItems.push({
            name: item.innerText.trim(),
            isOptgroup: true
        });
    } else if (item.classList.contains('snav')) {
        var lastConverted = convertedItems[convertedItems.length-1];
        if (lastConverted.tagName === "UL") {
            var li = document.createElement('li');
            li.innerHTML = item.outerHTML;
            lastConverted.appendChild(li);
        }

        if (item.href) {
            dropdownItems.push({
                name: item.innerText.trim(),
                uri: item.href,
                isLink: true
            } );
        }
    }
}
var sideMenu = document.getElementById("side-menu");
for (var item of convertedItems) {
    sideMenu.appendChild(item);
}

// create dropdown container
var dropdownContainer = document.createElement('div');
dropdownContainer.id = 'menu-dropdown';
dropdownContainer.innerHTML = `
<select id="side-menu-jumpbox" name="side-menu-jumpbox">
    <option value="#">Jump to destination:</option>
</select>
`;
sideMenu.appendChild(dropdownContainer);

// populate dropdown menu
var dropdown = document.getElementById("side-menu-jumpbox");
for (var item of dropdownItems) {
    if (item.isOptgroup) {
        var group = document.createElement('optgroup');
        group.label = item.name;
        dropdown.appendChild(group);
    } else if (item.isLink) {
        var option = document.createElement('option');
        option.innerText = item.name;
        option.value = item.uri;
        // assumes an optgroup is always last
        dropdown.lastElementChild.appendChild(option);
    }
}
dropdown.addEventListener('change', function(){
    var selected = this.options[this.selectedIndex].value;
    if (selected !== "#") {
        window.location.assign(selected);
    }
});

// move actual page content into custom div
var content = document.getElementById("content");
for (var el of Array.from(document.querySelector('td.contentMain').childNodes)) {
    content.appendChild(el);
}

// remove the <table>-based headers and menus
removeElement(originalContainer);

// add mobile meta el
const mobileViewportSupportId = "mobile-viewport-support";
const meta = document.createElement("meta");
meta.setAttribute("id", mobileViewportSupportId);
meta.setAttribute("name", "viewport");
// maximum scale is set to control bug when page zooms on reload
meta.setAttribute("content", "width=device-width, maximum-scale=1");//, initial-scale=1");
document.head.appendChild(meta);
// undo maximum scale so user can zoom
document.getElementById(mobileViewportSupportId).setAttribute("content", "width=device-width");

// done processing, show custom div
container.classList.remove('hidden');

// Solve? issues returning to anchor when loaded
if (document.readyState === 'complete') {
	jumpToAnchor();
} else {
	document.addEventListener('load', jumpToAnchor);
}

function removeElement(el) { el.parentElement.removeChild(el); }
function jumpToAnchor() { document.querySelector(window.location.hash).scrollIntoView(); }
