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

function jumpToError() {
  if (window.curindex === undefined) {
    window.curindex = 0;
  }

  if (typeof x === "undefined" || x === null) {
    var x = document.querySelectorAll('a:has(svg[aria-label="Status Failed"])');
  }

  if (x.length == 0) {
    console.log("No failed jobs found");
    return;
  }

  for (i = window.curindex; i < x.length; i++) {
    console.log("current", x[i].innerText, i);
    window.curindex = i;
    x[i]
      .querySelector('svg[aria-label="Status Failed"]')
      .scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
    window.curindex++;
    if (window.curindex == x.length) {
      window.curindex = 0;
    }
    break;
  }
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

    cloneButton(
      notifications.parentElement.parentElement.parentElement.parentElement,
      "jump-to-error",
      "Jump To Error",
      jumpToError,
      "Jump to the next failed job",
    );
  }
}

main();
