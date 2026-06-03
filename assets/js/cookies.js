
/* this checks the localStorage if it already has the variable saved */
function checkAcceptCookies() {
  if(localStorage.acceptCookies == 'true'){
    gdpr.style.display = 'none';
  }
}

/* here we store the variable that has been
accepted the use of cookies so we will not show
the message again */
function acceptCookies() {
  localStorage.acceptCookies = 'true';
  gdpr.style.display = 'none';
}

/* send the user to the privacy policy page */
function privacyPolicy() {
  window.location.href = 'privacy-policy.html';
  return false;
}

/* this runs when the web is loaded */
$(document).ready(function () {
  checkAcceptCookies();
});


/* checklang */
var setCookie = function(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

var getCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
if(!getCookie('lang')) {
    try {
      var userLang = navigator.language || navigator.userLanguage;
      console.log(setCookie('lang', userLang, 10000));
    }
    catch(err) {
      console.log("error getting browser language");
    }
}