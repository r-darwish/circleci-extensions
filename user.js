// ==UserScript==
// @name        CircleCI extension
// @namespace   Violentmonkey Scripts
// @match       https://app.circleci.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 20/09/2024, 15:19:45
// ==/UserScript==

const colors = {
  Passed: "#94E5AB",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatus(status) {
  return document.querySelectorAll(`a:has(svg[aria-label="Status ${status}"])`);
}

function jumpToStatus(status) {
  if (window[status] === undefined) {
    window[status] = 0;
  }

  if (typeof x === "undefined" || x === null) {
    var x = getStatus(status);
  }

  if (x.length == 0) {
    return;
  }

  if (window[status] >= x.length) {
    window[status] = 0;
  }
  x[window[status]]
    .querySelector(`svg[aria-label="Status ${status}"]`)
    .scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
  window[status]++;
}

async function counterElement(buttonDiv, status) {
  let id = `counter-${status}`;
  let element = document.getElementById(id);
  if (element != null) {
    return element;
  }

  var callback = function () {
    jumpToStatus(status);
  };

  var div = document.createElement("a");
  div.style.backgroundColor = colors[status];
  div.style.padding = "5px";
  div.style.borderRadius = "5px";
  div.appendChild(document.createTextNode("0"));
  div.id = id;
  div.addEventListener("click", callback);

  buttonDiv.insertAdjacentElement("beforebegin", div);
}

async function updateCounter(buttonDiv, status) {
  var element = counterElement(buttonDiv, status);
}

async function updateCounters(buttonDiv) {
  updateCounter(buttonDiv, "Passed");
}

async function tick() {
  var notifications = document.querySelector('[aria-label="Notifications"]');
  if (notifications == null) {
    return;
  }

  var buttonDiv =
    notifications.parentElement.parentElement.parentElement.parentElement;

  updateCounters(buttonDiv);
}

async function main() {
  while (true) {
    await tick();
    await sleep(1000);
  }
}

main();
