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
  Failed: "#CC4242",
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

function counterElement(buttonDiv, status) {
  let id = `counter-${status}`;
  let element = document.getElementById(id);
  if (element != null) {
    return element;
  }

  var callback = function () {
    jumpToStatus(status);
  };

  var a = document.createElement("a");
  a.style.backgroundColor = colors[status];
  a.style.padding = "10px";
  a.style.borderRadius = "20px";
  a.style.cursor = "pointer";
  a.appendChild(document.createTextNode("0"));
  a.visibility = "hidden";
  a.id = id;
  a.addEventListener("click", callback);

  buttonDiv.insertAdjacentElement("beforebegin", a);
  return a;
}

async function updateCounter(buttonDiv, status) {
  var element = counterElement(buttonDiv, status);
  let result = getStatus(status);
  console.log(`result: ${result.length}, e: ${element}`);
  if (result.length == 0) {
    element.visibility = "hidden";
  } else {
    element.textContent = `${status}: ${result.length}`;
    element.visibility = "visible";
  }
}

async function updateCounters(buttonDiv) {
  updateCounter(buttonDiv, "Passed");
  updateCounter(buttonDiv, "Failed");
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
