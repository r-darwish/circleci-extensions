// ==UserScript==
// @name        CircleCI extension
// @namespace   Violentmonkey Scripts
// @match       https://app.circleci.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 20/09/2024, 15:19:45
// ==/UserScript==

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jumpToStatus(status) {
  if (window[status] === undefined) {
    window[status] = 0;
  }

  if (typeof x === "undefined" || x === null) {
    var x = document.querySelectorAll(
      `a:has(svg[aria-label="Status ${status}"])`,
    );
  }

  if (x.length == 0) {
    console.log("No failed jobs found");
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

function jumpToError() {
  return jumpToStatus("Failed");
}

function jumpToRunning() {
  return jumpToStatus("Running");
}

function cloneButton(div, id, text, callback) {
  if (document.getElementById(id) != null) {
    return;
  }

  var button = document.createElement("button");
  button.appendChild(document.createTextNode(text));
  button.id = id;
  button.addEventListener("click", callback);

  div.insertAdjacentElement("beforebegin", button);
}

async function main() {
  while (true) {
    await sleep(1000);
    var notifications = document.querySelector('[aria-label="Notifications"]');
    if (notifications == null) {
      continue;
    }

    var buttonDiv =
      notifications.parentElement.parentElement.parentElement.parentElement;

    cloneButton(buttonDiv, "jump-to-error", "Next Error", jumpToError);
    cloneButton(buttonDiv, "jump-to-running", "Next Running", jumpToRunning);
  }
}

main();
