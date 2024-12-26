// ==UserScript==
// @name        CircleCI extension
// @namespace   Violentmonkey Scripts
// @match       https://app.circleci.com/*
// @grant       none
// @version     3.1
// @author      -
// @description 20/09/2024, 15:19:45
// ==/UserScript==

const colors = {
  Passed: "#68a078",
  Failed: "#CC4242",
  Running: "#1A66F7",
  "On Hold": "#BC86D2",
};

var savedWorkflowStatus = null;

function askNotificationPermission(buttonDiv) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    return;
  }

  if (document.getElementById("enable-notifications")) {
    return;
  }

  var a = document.createElement("a");

  var callback = function () {
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission:", permission);
      a.style.display = "none";
    });
  };

  a.style.backgroundColor = "#1A66F7";
  a.style.color = "#ffffff";
  a.style.padding = "10px";
  a.style.borderRadius = "20px";
  a.style.cursor = "pointer";
  a.text = "🔔 Enable Notifications";
  a.id = "enable-notifications";
  a.addEventListener("click", callback);

  buttonDiv.insertAdjacentElement("beforebegin", a);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatus(status) {
  return document.querySelectorAll(`svg[aria-label="Status ${status}"]`);
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
  a.style.color = "#ffffff";
  a.style.padding = "10px";
  a.style.borderRadius = "20px";
  a.style.cursor = "pointer";
  a.style.display = "none";
  a.id = id;
  a.addEventListener("click", callback);

  buttonDiv.insertAdjacentElement("beforebegin", a);
  return a;
}

async function updateCounter(buttonDiv, status) {
  var element = counterElement(buttonDiv, status);
  let result = getStatus(status);
  if (result.length == 0) {
    element.style.display = "none";
  } else {
    element.textContent = `${status}: ${result.length}`;
    element.style.display = "block";
  }
}

async function updateCounters(buttonDiv) {
  updateCounter(buttonDiv, "Passed");
  updateCounter(buttonDiv, "Failed");
  updateCounter(buttonDiv, "Running");
  updateCounter(buttonDiv, "On Hold");
}

function setWorkflowStatus(workflow) {
  if (currentWorkflow == workflow) {
    return;
  }

  currentWorkflow = workflow;
}

function getWorkflowStatus() {
  var currentUrl = window.location.href;
  var parts = currentUrl.split("/");
  if (parts[8] != "workflows") {
    return null;
  }

  const mainTag = document.querySelector("main");
  const branch = mainTag?.querySelector("a[href*='branch']")?.textContent;
  const firstHeader = mainTag?.querySelector("header");
  const workflowTitle = firstHeader?.querySelector("h1");
  const firstSpan = firstHeader?.querySelector("span");
  const spanText = firstSpan?.textContent;
  if (workflowTitle == null || spanText == null) {
    return null;
  }

  return { status: spanText, name: workflowTitle.textContent, branch: branch };
}

async function tick() {
  var notifications = document.querySelector('[aria-label="Notifications"]');
  if (notifications == null) {
    return;
  }

  var buttonDiv =
    notifications.parentElement.parentElement.parentElement.parentElement;

  var currentWorkflow = getWorkflowStatus();
  var currentWorkflowStatus = currentWorkflow?.status;
  if (
    savedWorkflowStatus === "Running" &&
    currentWorkflowStatus != null &&
    currentWorkflowStatus != "Running"
  ) {
    new Notification(currentWorkflowStatus, {
      body: currentWorkflow?.name + "\n" + currentWorkflow?.branch,
      icon: "https://d2qm0z2kzhiwa.cloudfront.net/assets/android-chrome-512x512-b0a3962c7ec90ae60cb31f99a3fc37b5.png",
    });
  }
  savedWorkflowStatus = currentWorkflowStatus;

  updateCounters(buttonDiv);
  askNotificationPermission(buttonDiv);
}

async function main() {
  try {
    while (true) {
      await tick();
      await sleep(1000);
    }
  } catch (e) {
    alert("CircieCI extension error");
    console.error(e);
  }
}

main();
