// knock out extraneous line breaks
Array.from(document.querySelectorAll("a.topictitle ~ br, a.forumtitle ~ br")).forEach(removeElement);

// increase hit area for last post by unhiding <dfn> and wrapping "Last post" in link
Array.from(document.querySelectorAll("li.row dd.lastpost dfn")).forEach(function(el) {
    var link = el.parentElement.querySelector("dfn ~ a:not(.username-coloured)").cloneNode(false);
    link.innerText = el.innerText;
    el.innerHTML = link.outerHTML;
});

function removeElement(el) { el.parentElement.removeChild(el); }