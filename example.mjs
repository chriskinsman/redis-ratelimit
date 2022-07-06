import slidingWindow from "./lib/slidingwindow.mjs";
import timers from "timers/promises";

for (let count = 0; count < 10; count++) {
  let limited = await slidingWindow.check("counter", 10, 2);
  if (limited) {
    // Don't do anything, wait some amount of time
    // and check rate limit again
    console.log("Rate limited");
    await timers.setTimeout(1000 * 5);
  } else {
    // Do work!
    console.log("Doing work");
  }
}

process.exit(0);
