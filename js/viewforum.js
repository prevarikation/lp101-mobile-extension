// collapse announcements and stickies that are already read
var collapseSelectors = [
    ".forumbg.announcement .topics dl[style*=announce_read]", //announcements
    ".forumbg:not(.announcement) li.row.sticky dl[style*=sticky_read]" //stickies
].join(', ');
Array.from(document.querySelectorAll(collapseSelectors)).forEach(el => el.closest("li.row").classList.add('read'));
Array.from(document.querySelectorAll(".forumbg")).forEach(el => el.classList.add("hide-persistent-read"));

// allow expansion of announcements and stickies (remove class "hide-persistent-new")
Array.from(document.querySelectorAll(".forumbg li.header dt")).forEach(el => el.addEventListener('click', toggleReadThreadDisplay));

// TODO: space out text
// - links (esp. in footer)

function toggleReadThreadDisplay(e) {
    e.target.closest(".forumbg").classList.toggle("hide-persistent-read");
}
function removeElement(el) { el.parentElement.removeChild(el); }