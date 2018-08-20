"use strict";

document.addEventListener("DOMContentLoaded", function(event) {
  updateElWithOrigin('#origin');
  addCloseFeature('#close-window');
  addFooCookieFeature({ actions: { read: '#foo-cookie-read-action', write: '#foo-cookie-write-action' }, result: '#foo-cookie-result' })
});


function updateElWithOrigin(selector) {
  updateDomElementText(document.querySelector(selector), window.origin);
}

function addCloseFeature(selector) {
  document.querySelector(selector).addEventListener('click', function (e) {
    e.preventDefault();
    window.close();
  });
}

// TODO: DRY 😊
function addFooCookieFeature(selectors) {
  const resultElement = document.querySelector(selectors.result);
  udateDomWithCookieVal(resultElement);
  document.querySelector(selectors.actions.read).addEventListener('click', function (e) {
    e.preventDefault();
    udateDomWithCookieVal(resultElement);
  });
  document.querySelector(selectors.actions.write).addEventListener('click', function (e) {
    e.preventDefault();
    writeJsCookie('foo', uuidv4());
    udateDomWithCookieVal(resultElement);
  });
}

function udateDomWithCookieVal(resultElement) {
  updateDomElementText(resultElement, readJsCookie() || 'no value in cookie');
}

// TODO: add a name arg :)
function readJsCookie() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)foo\s*\=\s*([^;]*).*$)|^.*$/, '$1');
}

function writeJsCookie(name, value) {
  const eTldPlusOne = document.location.hostname.replace(/.*\.(.*\..*)/, '$1');
  const cookieString = `${name}=${value};domain=${eTldPlusOne};max-age=${60*60*24*365}`;
  console.log('cookie string about to be assigned to document.cookie: ', cookieString);
  document.cookie = cookieString;
}

function uuidv4 () {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function updateDomElementText(element, text) {
  element.innerHTML = text;
  element.classList.add('updated');
  setTimeout(function () { element.classList.remove('updated'); }, 200);
}
