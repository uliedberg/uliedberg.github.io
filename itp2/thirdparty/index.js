"use strict";

document.addEventListener('DOMContentLoaded', function(event) {
  updateElWithOrigin('#origin');
  addHasStorageAcessOnLoad({ result: '#storage-access-on-load-result' });
  addRequestStorageAccess({ action: '#storage-access-request-action', result: '#storage-access-request-result', cookieResult: '#document-cookie-value' });
  addFooCookieFeature({ action: '#foo-cookie-action', result: '#document-cookie-value' })
  addReloadListenter({ action: '#reload-iframe'});
});


function updateElWithOrigin(selector) {
  updateDomElementText(document.querySelector(selector), window.origin);
}

function addHasStorageAcessOnLoad(selectors) {
  if (!document.hasStorageAccess) {
    console.log('document.hasStorageAccess not available - bailing')
    return;
  }
  const resultElement = document.querySelector(selectors.result);
  document.hasStorageAccess().then(
    function successful (hasAccess) {
      console.log('hasStorageAccess successful, has access:', hasAccess);
      updateDomElementText(resultElement, `successful: ${hasAccess}`);
    },
    function rejected (reason) {
      console.log('hasStorageAccess rejected, reason: ', reason);
      updateDomElementText(resultElement, `rejected: ${reason}`);
    }
  )
}

function addRequestStorageAccess(selectors) {
  if (!document.requestStorageAccess) {
    console.log('document.requestStorageAccess not available - bailing')
    return;
  }

  const resultElement = document.querySelector(selectors.result);
  const cookieResultElement = document.querySelector(selectors.cookieResult);
  document.querySelector(selectors.action).addEventListener('click', function (e) {
    e.preventDefault();
    document.requestStorageAccess().then(
      function () {
        console.log('requestStorageAccess successful');
        updateDomElementText(resultElement, 'resolved successfully');
        // TODO: auto-popup if no document.cookie values to test if that makes a difference?
        console.log(`trying to read cookie in successful resolved request... document.cookie: ${document.cookie}`);
        udateDomWithCookieVal(cookieResultElement);
      },
      function () {
        console.log('requestStorageAccess rejected');
        updateDomElementText(resultElement, 'rejected');
      }
    )
  });
}

function addFooCookieFeature(selectors) {
  const resultElement = document.querySelector(selectors.result);
  udateDomWithCookieVal(resultElement);
  document.querySelector(selectors.action).addEventListener('click', function (e) {
    e.preventDefault();
    udateDomWithCookieVal(resultElement);
  });
}

function addReloadListenter(selectors) {
  document.querySelector(selectors.action).addEventListener('click', function (e) {
    e.preventDefault();
    location.reload();
  });
}

function udateDomWithCookieVal(resultElement) {
  updateDomElementText(resultElement, (document.cookie || 'no value in cookie'));
}

function updateDomElementText(element, text) {
  element.innerHTML = text;
  element.classList.add('updated');
  setTimeout(function () { element.classList.remove('updated'); }, 200);
}

function uuidv4 () {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
