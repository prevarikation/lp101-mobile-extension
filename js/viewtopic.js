// add extra "Return to forum" navigation at top of thread
const returnToForumEl = document.querySelector('[accesskey=r]').cloneNode(true);
returnToForumEl.removeAttribute('accesskey');
returnToForumEl.classList.remove('left-box');
const forumReturnContainingPara = document.createElement('p');
forumReturnContainingPara.style = 'margin: 0.5em 0 0 0';
forumReturnContainingPara.appendChild(returnToForumEl);
document.getElementById('content').prepend(forumReturnContainingPara);

// imgur embeds break smooth shrinking because they have inline styles of style="max-width: 800px;max-height: 800px"
document.querySelectorAll(".postbody .content img").forEach(el => el.style.removeProperty('max-width'));
