// for current/last login times
const timeListing = document.querySelector('#content > p:first-child');
timeListing.classList.add('time-listing');
if (timeListing.nextElementSibling.tagName === "P") {
	timeListing.nextElementSibling.classList.add('time-listing');
}

// for programmatic toggling of extended info
var largeViewMediaQuery = window.matchMedia("screen and (min-width: 867px)");
largeViewMediaQuery.addEventListener('change', toggleDescriptionsOnResize);
var shouldShowDetails = largeViewMediaQuery.matches;

// condense forum descriptions
var forumTitles = document.querySelectorAll(".forumtitle");
// forum descriptions are unwrapped text nodes
var forumDescEls = Array.from(forumTitles).forEach(function(el) {
	var details = document.createElement("details");
	// if we're wide enough, show descriptions by default
	if (shouldShowDetails) {
		details.setAttribute('open', '');
	}
	var summary = document.createElement("summary");
	summary.innerText = "More info";
	summary.addEventListener('click', changedDescriptionVisibility);
	details.appendChild(summary);

	// markup is now <a>forum link</a>[forum desc]<span>BOLD TEXT</span>
	var sibling = el.nextSibling;
	while (sibling) {
		if (sibling.nodeType === document.TEXT_NODE) {
			sibling.data = sibling.data.replace(/^[\s]*/, "").replace(/[\s]*$/, "");
			details.appendChild(sibling);
		}
		sibling = sibling.nextSibling;
	}

	if (el.nextSibling) {
		el.parentElement.insertBefore(details, el.nextSibling);
	} else {
		el.parentElement.appendChild(details);
	}
});

// allow filtering by unread forums only
var filterUnreadForums = document.createElement("div");
filterUnreadForums.innerHTML = "<label class='only-unread'><input type='checkbox' id='showOnlyUnreadForums'> Only forums with unread posts</label>";
document.querySelector("ul.linklist").after(filterUnreadForums);

document.getElementById("showOnlyUnreadForums").addEventListener('change', function(e){
	var hiddenClass = "hidden";
	var readForums = Array.from(document.querySelectorAll("dl.icon[style*=forum_read]")).map(el => el.closest("li.row"));
	if (e.target.checked) {
		readForums.forEach(el => el.classList.add(hiddenClass));
	} else {
		readForums.forEach(el => el.classList.remove(hiddenClass));
	}
});

///// AUXILIARY FUNCTIONS
function changedDescriptionVisibility() {
	this.closest("details").dataset.intentionalChange = true;
}

function toggleDescriptionsOnResize() {
	Array.from(document.querySelectorAll(".forumtitle ~ details")).forEach(function(el) {
		if (!el.dataset.intentionalChange) {
			el.toggleAttribute('open');
		}
	});
}

function removeElement(el) { el.parentElement.removeChild(el); }
