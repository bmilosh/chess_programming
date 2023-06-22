/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./assets/src/timer-worker.js ***!
  \************************************/
var whiteTime = {
  min: 0,
  secs: 2,
  running: false,
  milSecs: 0,
  shouldSetMil: true
};
var blackTime = {
  min: 0,
  secs: 17,
  running: false,
  milSecs: 0,
  shouldSetMil: true
};
var isGameOver = false;

// function startTimer(colour) {
//     const interval = setInterval(() => {
//       if  (colour === 'black') {} // do stuff
//       else if (colour === 'white') {} // do other stuff
//     }, 1000)}

// self.onmessage = function (e) {
//     console.log("message from main thread:", e.data)
//     if (e.data.white) { startTimer('white')}
//     else if (e.data.black) { startTimer('black')}}

var timerIntervals = null;
var countInterval = 1000;
var miliTimerIntervalId = null;
function startMiliTimer(colour) {
  // console.log("starting militimer for", colour)
  clearInterval(miliTimerIntervalId);
  miliTimerIntervalId = setInterval(function () {
    if (colour === 'white') {
      if (whiteTime.milSecs > 0) {
        whiteTime.milSecs -= 1;
      } else {
        if (whiteTime.shouldSetMil) whiteTime.milSecs = 9;else {
          isGameOver = true;
          console.log("Game over. White lost on time");
          postMessage("Game over. White lost on time");
          clearInterval(miliTimerIntervalId);
        }
      }
    } else if (colour === 'black') {
      if (blackTime.milSecs > 0) {
        blackTime.milSecs -= 1;
      } else {
        if (blackTime.shouldSetMil) blackTime.milSecs = 9;else {
          isGameOver = true;
          console.log("Game over. Black lost on time");
          postMessage("Game over. Black lost on time");
          clearInterval(miliTimerIntervalId);
        }
      }
    }
    self.postMessage({
      whiteTime: whiteTime,
      blackTime: blackTime
    });
  }, 100);
}
function startTimer(colour) {
  // console.log("timerintervals is:", timerIntervals)
  clearInterval(timerIntervals);
  timerIntervals = setInterval(function () {
    // console.log("statuses: black -> ", blackTime.running, ", white -> ", whiteTime.running, "colour ->", colour)
    if (colour === 'black') {
      // console.log("is game over from black's perspective?", isGameOver)
      // console.log("black time from worker:", blackTime)
      if (isGameOver) {
        clearInterval(timerIntervals);
        return;
      }
      if (blackTime.secs) {
        blackTime.secs -= 1;
        if (!blackTime.secs && !blackTime.min) {
          isGameOver = true;
          console.log("isgameover has been set to", isGameOver);
          console.log("Game over. Black lost on time");
          postMessage("Game over. Black lost on time");
          clearInterval(timerIntervals);
        }
      } else {
        if (blackTime.min) {
          blackTime.min -= 1;
          blackTime.secs = 59;
        } else {
          if (blackTime.shouldSetMil) {
            // blackTime.milSecs = 9
            blackTime.shouldSetMil = false;
            clearInterval(timerIntervals);
          } else {
            blackTime.running = false;
            // colour = 'white'
            isGameOver = true;
            console.log("isgameover has been set to", isGameOver);
            console.log("Game over. Black lost on time");
            postMessage("Game over. Black lost on time");
            clearInterval(timerIntervals);
          }
        }
      }
    } else if (colour === "white") {
      // console.log("white time from worker:", whiteTime)
      if (isGameOver) {
        clearInterval(timerIntervals);
        return;
      }
      // if (whiteTime.milSecs) {
      //     whiteTime.milSecs -= 100
      // }
      // else {
      if (whiteTime.secs) {
        whiteTime.secs -= 1;
      } else {
        if (whiteTime.min) {
          whiteTime.min -= 1;
          whiteTime.secs = 59;
        } else {
          if (whiteTime.shouldSetMil) {
            // whiteTime.milSecs = 9
            // startMiliTimer("white")
            whiteTime.shouldSetMil = false;
            // countInterval = 100
            clearInterval(timerIntervals);
          } else {
            whiteTime.running = false;
            // colour = "black"
            isGameOver = true;
            console.log("isgameover has been set to", isGameOver);
            console.log("Game over. White lost on time");
            postMessage("Game over. White lost on time");
          }
          clearInterval(timerIntervals);
          // }
        }
      }
    }

    // Send the updated time remaining back to the main thread
    // console.log("countinterval is:", countInterval)
    self.postMessage({
      whiteTime: whiteTime,
      blackTime: blackTime
    });
  }, countInterval);
}

// Listen for messages from the main thread
self.onmessage = function (event) {
  // console.log("message from main thread:", event.data)
  if (event.data.initial) {
    console.log("we have an initial message");
    var w = event.data.whiteTime;
    whiteTime.min = w.min;
    whiteTime.secs = w.secs;
    whiteTime.milSecs = w.milSecs;
    var b = event.data.blackTime;
    blackTime.min = b.min;
    blackTime.secs = b.secs;
    blackTime.milSecs = b.milSecs;
  } else {
    if (!isGameOver) {
      if (event.data.startWhiteTimer) {
        startTimer("white");
        // startMiliTimer("white")
      } else {
        startTimer("black");
        // startMiliTimer("black")
      }
    }
  }
  // clearInterval(timerIntervals)
  // if ("startWhiteTimer" in event.data) startTimer("white")
  // else if ("startBlackTimer" in event.data) startTimer("black")
  //   if (event.data.startWhiteTimer) {
  //       blackTime.running = false
  //     whiteTime.running = true
  //     // whiteTime.min = event.data.whiteTime.min
  //     // whiteTime.secs = event.data.whiteTime.secs
  //     console.log("black should no longer run")
  //     // clearInterval(set)
  //     startTimer("white");
  // } else if (event.data.startBlackTimer) {
  //     whiteTime.running = false
  //     blackTime.running = true
  //     // blackTime.min = event.data.blackTime.min
  //     // blackTime.secs = event.data.blackTime.secs
  //     console.log("white should no longer run")
  //     startTimer("black");
  //   }
};
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzX3NyY190aW1lci13b3JrZXJfanMtX2NkMGEwLmluZGV4LWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQUlBLFNBQVMsR0FBRztFQUFFQyxHQUFHLEVBQUUsQ0FBQztFQUFFQyxJQUFJLEVBQUUsQ0FBQztFQUFFQyxPQUFPLEVBQUUsS0FBSztFQUFFQyxPQUFPLEVBQUUsQ0FBQztFQUFFQyxZQUFZLEVBQUU7QUFBSyxDQUFDO0FBQ25GLElBQUlDLFNBQVMsR0FBRztFQUFFTCxHQUFHLEVBQUUsQ0FBQztFQUFFQyxJQUFJLEVBQUUsRUFBRTtFQUFFQyxPQUFPLEVBQUUsS0FBSztFQUFFQyxPQUFPLEVBQUUsQ0FBQztFQUFFQyxZQUFZLEVBQUU7QUFBSyxDQUFDO0FBQ3BGLElBQUlFLFVBQVUsR0FBRyxLQUFLOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUlDLGNBQWMsR0FBRyxJQUFJO0FBQ3pCLElBQUlDLGFBQWEsR0FBRyxJQUFJO0FBQ3hCLElBQUlDLG1CQUFtQixHQUFHLElBQUk7QUFFOUIsU0FBU0MsY0FBY0EsQ0FBQ0MsTUFBTSxFQUFFO0VBQzVCO0VBQ0FDLGFBQWEsQ0FBQ0gsbUJBQW1CLENBQUM7RUFDbENBLG1CQUFtQixHQUFHSSxXQUFXLENBQUMsWUFBTTtJQUNwQyxJQUFJRixNQUFNLEtBQUssT0FBTyxFQUFFO01BQ3BCLElBQUlaLFNBQVMsQ0FBQ0ksT0FBTyxHQUFHLENBQUMsRUFBRztRQUN4QkosU0FBUyxDQUFDSSxPQUFPLElBQUksQ0FBQztNQUMxQixDQUFDLE1BQU07UUFDSCxJQUFJSixTQUFTLENBQUNLLFlBQVksRUFBRUwsU0FBUyxDQUFDSSxPQUFPLEdBQUcsQ0FBQyxNQUM1QztVQUNMRyxVQUFVLEdBQUcsSUFBSTtVQUNqQlEsT0FBTyxDQUFDQyxHQUFHLENBQUMsK0JBQStCLENBQUM7VUFDNUNDLFdBQVcsQ0FBQywrQkFBK0IsQ0FBQztVQUM1Q0osYUFBYSxDQUFDSCxtQkFBbUIsQ0FBQztRQUNsQztNQUNKO0lBQ0osQ0FBQyxNQUFNLElBQUlFLE1BQU0sS0FBSyxPQUFPLEVBQUU7TUFDM0IsSUFBSU4sU0FBUyxDQUFDRixPQUFPLEdBQUcsQ0FBQyxFQUFHO1FBQ3hCRSxTQUFTLENBQUNGLE9BQU8sSUFBSSxDQUFDO01BQzFCLENBQUMsTUFBTTtRQUNILElBQUlFLFNBQVMsQ0FBQ0QsWUFBWSxFQUFFQyxTQUFTLENBQUNGLE9BQU8sR0FBRyxDQUFDLE1BQzVDO1VBQ0xHLFVBQVUsR0FBRyxJQUFJO1VBQ2pCUSxPQUFPLENBQUNDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQztVQUM1Q0MsV0FBVyxDQUFDLCtCQUErQixDQUFDO1VBQzVDSixhQUFhLENBQUNILG1CQUFtQixDQUFDO1FBQ2xDO01BQ0o7SUFDQTtJQUNSUSxJQUFJLENBQUNELFdBQVcsQ0FBQztNQUFFakIsU0FBUyxFQUFUQSxTQUFTO01BQUVNLFNBQVMsRUFBVEE7SUFBVSxDQUFDLENBQUM7RUFDMUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUNYO0FBR0EsU0FBU2EsVUFBVUEsQ0FBQ1AsTUFBTSxFQUFFO0VBQ3hCO0VBQ0FDLGFBQWEsQ0FBQ0wsY0FBYyxDQUFDO0VBRS9CQSxjQUFjLEdBQUdNLFdBQVcsQ0FBQyxZQUFNO0lBQ2pDO0lBQ0EsSUFBS0YsTUFBTSxLQUFLLE9BQU8sRUFBRTtNQUNyQjtNQUNBO01BQ0EsSUFBSUwsVUFBVSxFQUFFO1FBQ1pNLGFBQWEsQ0FBQ0wsY0FBYyxDQUFDO1FBQzdCO01BQ0o7TUFDQSxJQUFJRixTQUFTLENBQUNKLElBQUksRUFBRTtRQUNoQkksU0FBUyxDQUFDSixJQUFJLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUNJLFNBQVMsQ0FBQ0osSUFBSSxJQUFJLENBQUNJLFNBQVMsQ0FBQ0wsR0FBRyxFQUFFO1VBQ25DTSxVQUFVLEdBQUcsSUFBSTtVQUNqQlEsT0FBTyxDQUFDQyxHQUFHLENBQUMsNEJBQTRCLEVBQUVULFVBQVUsQ0FBQztVQUNyRFEsT0FBTyxDQUFDQyxHQUFHLENBQUMsK0JBQStCLENBQUM7VUFDNUNDLFdBQVcsQ0FBQywrQkFBK0IsQ0FBQztVQUM1Q0osYUFBYSxDQUFDTCxjQUFjLENBQUM7UUFDakM7TUFDRixDQUFDLE1BQU07UUFDTCxJQUFJRixTQUFTLENBQUNMLEdBQUcsRUFBRTtVQUNqQkssU0FBUyxDQUFDTCxHQUFHLElBQUksQ0FBQztVQUNsQkssU0FBUyxDQUFDSixJQUFJLEdBQUcsRUFBRTtRQUNyQixDQUFDLE1BQU07VUFDSCxJQUFJSSxTQUFTLENBQUNELFlBQVksRUFBRTtZQUN4QjtZQUNBQyxTQUFTLENBQUNELFlBQVksR0FBRyxLQUFLO1lBQzlCUSxhQUFhLENBQUNMLGNBQWMsQ0FBQztVQUNqQyxDQUFDLE1BQ0Q7WUFDSUYsU0FBUyxDQUFDSCxPQUFPLEdBQUcsS0FBSztZQUN6QjtZQUNBSSxVQUFVLEdBQUcsSUFBSTtZQUNqQlEsT0FBTyxDQUFDQyxHQUFHLENBQUMsNEJBQTRCLEVBQUVULFVBQVUsQ0FBQztZQUNyRFEsT0FBTyxDQUFDQyxHQUFHLENBQUMsK0JBQStCLENBQUM7WUFDNUNDLFdBQVcsQ0FBQywrQkFBK0IsQ0FBQztZQUM1Q0osYUFBYSxDQUFDTCxjQUFjLENBQUM7VUFDakM7UUFDSjtNQUNGO0lBQ04sQ0FBQyxNQUFNLElBQUlJLE1BQU0sS0FBSyxPQUFPLEVBQUc7TUFDNUI7TUFDQSxJQUFJTCxVQUFVLEVBQUU7UUFDWk0sYUFBYSxDQUFDTCxjQUFjLENBQUM7UUFDN0I7TUFDSjtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0ksSUFBSVIsU0FBUyxDQUFDRSxJQUFJLEVBQUU7UUFDcEJGLFNBQVMsQ0FBQ0UsSUFBSSxJQUFJLENBQUM7TUFDckIsQ0FBQyxNQUFNO1FBQ0wsSUFBSUYsU0FBUyxDQUFDQyxHQUFHLEVBQUU7VUFDakJELFNBQVMsQ0FBQ0MsR0FBRyxJQUFJLENBQUM7VUFDbEJELFNBQVMsQ0FBQ0UsSUFBSSxHQUFHLEVBQUU7UUFDckIsQ0FBQyxNQUFNO1VBQ0gsSUFBSUYsU0FBUyxDQUFDSyxZQUFZLEVBQUU7WUFDeEI7WUFDQTtZQUNBTCxTQUFTLENBQUNLLFlBQVksR0FBRyxLQUFLO1lBQzlCO1lBQ0FRLGFBQWEsQ0FBQ0wsY0FBYyxDQUFDO1VBQ2pDLENBQUMsTUFDSTtZQUFDUixTQUFTLENBQUNHLE9BQU8sR0FBRyxLQUFLO1lBQy9CO1lBQ0FJLFVBQVUsR0FBRyxJQUFJO1lBQ2pCUSxPQUFPLENBQUNDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRVQsVUFBVSxDQUFDO1lBQ3JEUSxPQUFPLENBQUNDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQztZQUM1Q0MsV0FBVyxDQUFDLCtCQUErQixDQUFDO1VBQUE7VUFDNUNKLGFBQWEsQ0FBQ0wsY0FBYyxDQUFDO1VBQ2pDO1FBQ0Y7TUFBQztJQUNQOztJQUVBO0lBQ0E7SUFDQVUsSUFBSSxDQUFDRCxXQUFXLENBQUM7TUFBRWpCLFNBQVMsRUFBVEEsU0FBUztNQUFFTSxTQUFTLEVBQVRBO0lBQVUsQ0FBQyxDQUFDO0VBQzVDLENBQUMsRUFBRUcsYUFBYSxDQUFDO0FBQ25COztBQUVBO0FBQ0FTLElBQUksQ0FBQ0UsU0FBUyxHQUFHLFVBQVVDLEtBQUssRUFBRTtFQUM5QjtFQUNBLElBQUlBLEtBQUssQ0FBQ0MsSUFBSSxDQUFDQyxPQUFPLEVBQUU7SUFDcEJSLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLDRCQUE0QixDQUFDO0lBQ3pDLElBQU1RLENBQUMsR0FBR0gsS0FBSyxDQUFDQyxJQUFJLENBQUN0QixTQUFTO0lBQzlCQSxTQUFTLENBQUNDLEdBQUcsR0FBR3VCLENBQUMsQ0FBQ3ZCLEdBQUc7SUFDckJELFNBQVMsQ0FBQ0UsSUFBSSxHQUFHc0IsQ0FBQyxDQUFDdEIsSUFBSTtJQUN2QkYsU0FBUyxDQUFDSSxPQUFPLEdBQUdvQixDQUFDLENBQUNwQixPQUFPO0lBRTdCLElBQU1xQixDQUFDLEdBQUdKLEtBQUssQ0FBQ0MsSUFBSSxDQUFDaEIsU0FBUztJQUM5QkEsU0FBUyxDQUFDTCxHQUFHLEdBQUd3QixDQUFDLENBQUN4QixHQUFHO0lBQ3JCSyxTQUFTLENBQUNKLElBQUksR0FBR3VCLENBQUMsQ0FBQ3ZCLElBQUk7SUFDdkJJLFNBQVMsQ0FBQ0YsT0FBTyxHQUFHcUIsQ0FBQyxDQUFDckIsT0FBTztFQUNqQyxDQUFDLE1BQ0k7SUFBQyxJQUFJLENBQUNHLFVBQVUsRUFBRTtNQUNuQixJQUFJYyxLQUFLLENBQUNDLElBQUksQ0FBQ0ksZUFBZSxFQUFFO1FBQzVCUCxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ25CO01BQ0osQ0FBQyxNQUNJO1FBQ0RBLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDbkI7TUFDSjtJQUNKO0VBQUM7RUFDRDtFQUNBO0VBQ0E7RUFDSjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUNBLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NoZXNzX3Byb2dyYW1taW5nLy4vYXNzZXRzL3NyYy90aW1lci13b3JrZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHdoaXRlVGltZSA9IHsgbWluOiAwLCBzZWNzOiAyLCBydW5uaW5nOiBmYWxzZSwgbWlsU2VjczogMCwgc2hvdWxkU2V0TWlsOiB0cnVlIH07XHJcbmxldCBibGFja1RpbWUgPSB7IG1pbjogMCwgc2VjczogMTcsIHJ1bm5pbmc6IGZhbHNlLCBtaWxTZWNzOiAwLCBzaG91bGRTZXRNaWw6IHRydWUgfTtcclxubGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcclxuXHJcbi8vIGZ1bmN0aW9uIHN0YXJ0VGltZXIoY29sb3VyKSB7XHJcbi8vICAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuLy8gICAgICAgaWYgIChjb2xvdXIgPT09ICdibGFjaycpIHt9IC8vIGRvIHN0dWZmXHJcbi8vICAgICAgIGVsc2UgaWYgKGNvbG91ciA9PT0gJ3doaXRlJykge30gLy8gZG8gb3RoZXIgc3R1ZmZcclxuLy8gICAgIH0sIDEwMDApfVxyXG5cclxuLy8gc2VsZi5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xyXG4vLyAgICAgY29uc29sZS5sb2coXCJtZXNzYWdlIGZyb20gbWFpbiB0aHJlYWQ6XCIsIGUuZGF0YSlcclxuLy8gICAgIGlmIChlLmRhdGEud2hpdGUpIHsgc3RhcnRUaW1lcignd2hpdGUnKX1cclxuLy8gICAgIGVsc2UgaWYgKGUuZGF0YS5ibGFjaykgeyBzdGFydFRpbWVyKCdibGFjaycpfX1cclxuXHJcbmxldCB0aW1lckludGVydmFscyA9IG51bGw7XHJcbmxldCBjb3VudEludGVydmFsID0gMTAwMDtcclxubGV0IG1pbGlUaW1lckludGVydmFsSWQgPSBudWxsXHJcblxyXG5mdW5jdGlvbiBzdGFydE1pbGlUaW1lcihjb2xvdXIpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwic3RhcnRpbmcgbWlsaXRpbWVyIGZvclwiLCBjb2xvdXIpXHJcbiAgICBjbGVhckludGVydmFsKG1pbGlUaW1lckludGVydmFsSWQpXHJcbiAgICBtaWxpVGltZXJJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmIChjb2xvdXIgPT09ICd3aGl0ZScpIHtcclxuICAgICAgICAgICAgaWYgKHdoaXRlVGltZS5taWxTZWNzID4gMCApIHtcclxuICAgICAgICAgICAgICAgIHdoaXRlVGltZS5taWxTZWNzIC09IDFcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aGl0ZVRpbWUuc2hvdWxkU2V0TWlsKSB3aGl0ZVRpbWUubWlsU2VjcyA9IDlcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXNHYW1lT3ZlciA9IHRydWVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBvdmVyLiBXaGl0ZSBsb3N0IG9uIHRpbWVcIilcclxuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlKFwiR2FtZSBvdmVyLiBXaGl0ZSBsb3N0IG9uIHRpbWVcIilcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwobWlsaVRpbWVySW50ZXJ2YWxJZClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29sb3VyID09PSAnYmxhY2snKSB7XHJcbiAgICAgICAgICAgIGlmIChibGFja1RpbWUubWlsU2VjcyA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBibGFja1RpbWUubWlsU2VjcyAtPSAxXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxhY2tUaW1lLnNob3VsZFNldE1pbCkgYmxhY2tUaW1lLm1pbFNlY3MgPSA5XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgb3Zlci4gQmxhY2sgbG9zdCBvbiB0aW1lXCIpXHJcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZShcIkdhbWUgb3Zlci4gQmxhY2sgbG9zdCBvbiB0aW1lXCIpXHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKG1pbGlUaW1lckludGVydmFsSWQpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7IHdoaXRlVGltZSwgYmxhY2tUaW1lIH0pO1xyXG4gICAgfSwgMTAwKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHN0YXJ0VGltZXIoY29sb3VyKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcInRpbWVyaW50ZXJ2YWxzIGlzOlwiLCB0aW1lckludGVydmFscylcclxuICAgIGNsZWFySW50ZXJ2YWwodGltZXJJbnRlcnZhbHMpXHJcbiAgICBcclxuICB0aW1lckludGVydmFscyA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwic3RhdHVzZXM6IGJsYWNrIC0+IFwiLCBibGFja1RpbWUucnVubmluZywgXCIsIHdoaXRlIC0+IFwiLCB3aGl0ZVRpbWUucnVubmluZywgXCJjb2xvdXIgLT5cIiwgY29sb3VyKVxyXG4gICAgaWYgIChjb2xvdXIgPT09ICdibGFjaycpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzIGdhbWUgb3ZlciBmcm9tIGJsYWNrJ3MgcGVyc3BlY3RpdmU/XCIsIGlzR2FtZU92ZXIpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJibGFjayB0aW1lIGZyb20gd29ya2VyOlwiLCBibGFja1RpbWUpXHJcbiAgICAgICAgaWYgKGlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFscylcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChibGFja1RpbWUuc2Vjcykge1xyXG4gICAgICAgICAgICBibGFja1RpbWUuc2VjcyAtPSAxO1xyXG4gICAgICAgICAgICBpZiAoIWJsYWNrVGltZS5zZWNzICYmICFibGFja1RpbWUubWluKSB7XHJcbiAgICAgICAgICAgICAgICBpc0dhbWVPdmVyID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc2dhbWVvdmVyIGhhcyBiZWVuIHNldCB0b1wiLCBpc0dhbWVPdmVyKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIG92ZXIuIEJsYWNrIGxvc3Qgb24gdGltZVwiKVxyXG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoXCJHYW1lIG92ZXIuIEJsYWNrIGxvc3Qgb24gdGltZVwiKVxyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFscylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGJsYWNrVGltZS5taW4pIHtcclxuICAgICAgICAgICAgICBibGFja1RpbWUubWluIC09IDE7XHJcbiAgICAgICAgICAgICAgYmxhY2tUaW1lLnNlY3MgPSA1OTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChibGFja1RpbWUuc2hvdWxkU2V0TWlsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmxhY2tUaW1lLm1pbFNlY3MgPSA5XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhY2tUaW1lLnNob3VsZFNldE1pbCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFscylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBibGFja1RpbWUucnVubmluZyA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29sb3VyID0gJ3doaXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc2dhbWVvdmVyIGhhcyBiZWVuIHNldCB0b1wiLCBpc0dhbWVPdmVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBvdmVyLiBCbGFjayBsb3N0IG9uIHRpbWVcIilcclxuICAgICAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZShcIkdhbWUgb3Zlci4gQmxhY2sgbG9zdCBvbiB0aW1lXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFscylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChjb2xvdXIgPT09IFwid2hpdGVcIiApIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndoaXRlIHRpbWUgZnJvbSB3b3JrZXI6XCIsIHdoaXRlVGltZSlcclxuICAgICAgICBpZiAoaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWxzKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgKHdoaXRlVGltZS5taWxTZWNzKSB7XHJcbiAgICAgICAgLy8gICAgIHdoaXRlVGltZS5taWxTZWNzIC09IDEwMFxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHdoaXRlVGltZS5zZWNzKSB7XHJcbiAgICAgICAgICAgIHdoaXRlVGltZS5zZWNzIC09IDE7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAod2hpdGVUaW1lLm1pbikge1xyXG4gICAgICAgICAgICAgIHdoaXRlVGltZS5taW4gLT0gMTtcclxuICAgICAgICAgICAgICB3aGl0ZVRpbWUuc2VjcyA9IDU5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdoaXRlVGltZS5zaG91bGRTZXRNaWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aGl0ZVRpbWUubWlsU2VjcyA9IDlcclxuICAgICAgICAgICAgICAgICAgICAvLyBzdGFydE1pbGlUaW1lcihcIndoaXRlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpdGVUaW1lLnNob3VsZFNldE1pbCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY291bnRJbnRlcnZhbCA9IDEwMFxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXJJbnRlcnZhbHMpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHt3aGl0ZVRpbWUucnVubmluZyA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAvLyBjb2xvdXIgPSBcImJsYWNrXCJcclxuICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzZ2FtZW92ZXIgaGFzIGJlZW4gc2V0IHRvXCIsIGlzR2FtZU92ZXIpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgb3Zlci4gV2hpdGUgbG9zdCBvbiB0aW1lXCIpXHJcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZShcIkdhbWUgb3Zlci4gV2hpdGUgbG9zdCBvbiB0aW1lXCIpfVxyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFscylcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgfX1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTZW5kIHRoZSB1cGRhdGVkIHRpbWUgcmVtYWluaW5nIGJhY2sgdG8gdGhlIG1haW4gdGhyZWFkXHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImNvdW50aW50ZXJ2YWwgaXM6XCIsIGNvdW50SW50ZXJ2YWwpXHJcbiAgICBzZWxmLnBvc3RNZXNzYWdlKHsgd2hpdGVUaW1lLCBibGFja1RpbWUgfSk7XHJcbiAgfSwgY291bnRJbnRlcnZhbClcclxufVxyXG5cclxuLy8gTGlzdGVuIGZvciBtZXNzYWdlcyBmcm9tIHRoZSBtYWluIHRocmVhZFxyXG5zZWxmLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJtZXNzYWdlIGZyb20gbWFpbiB0aHJlYWQ6XCIsIGV2ZW50LmRhdGEpXHJcbiAgICBpZiAoZXZlbnQuZGF0YS5pbml0aWFsKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ3ZSBoYXZlIGFuIGluaXRpYWwgbWVzc2FnZVwiKVxyXG4gICAgICAgIGNvbnN0IHcgPSBldmVudC5kYXRhLndoaXRlVGltZVxyXG4gICAgICAgIHdoaXRlVGltZS5taW4gPSB3Lm1pblxyXG4gICAgICAgIHdoaXRlVGltZS5zZWNzID0gdy5zZWNzXHJcbiAgICAgICAgd2hpdGVUaW1lLm1pbFNlY3MgPSB3Lm1pbFNlY3NcclxuXHJcbiAgICAgICAgY29uc3QgYiA9IGV2ZW50LmRhdGEuYmxhY2tUaW1lXHJcbiAgICAgICAgYmxhY2tUaW1lLm1pbiA9IGIubWluXHJcbiAgICAgICAgYmxhY2tUaW1lLnNlY3MgPSBiLnNlY3NcclxuICAgICAgICBibGFja1RpbWUubWlsU2VjcyA9IGIubWlsU2Vjc1xyXG4gICAgfVxyXG4gICAgZWxzZSB7aWYgKCFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEuc3RhcnRXaGl0ZVRpbWVyKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0VGltZXIoXCJ3aGl0ZVwiKVxyXG4gICAgICAgICAgICAvLyBzdGFydE1pbGlUaW1lcihcIndoaXRlXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzdGFydFRpbWVyKFwiYmxhY2tcIilcclxuICAgICAgICAgICAgLy8gc3RhcnRNaWxpVGltZXIoXCJibGFja1wiKVxyXG4gICAgICAgIH1cclxuICAgIH19XHJcbiAgICAvLyBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWxzKVxyXG4gICAgLy8gaWYgKFwic3RhcnRXaGl0ZVRpbWVyXCIgaW4gZXZlbnQuZGF0YSkgc3RhcnRUaW1lcihcIndoaXRlXCIpXHJcbiAgICAvLyBlbHNlIGlmIChcInN0YXJ0QmxhY2tUaW1lclwiIGluIGV2ZW50LmRhdGEpIHN0YXJ0VGltZXIoXCJibGFja1wiKVxyXG4vLyAgIGlmIChldmVudC5kYXRhLnN0YXJ0V2hpdGVUaW1lcikge1xyXG4vLyAgICAgICBibGFja1RpbWUucnVubmluZyA9IGZhbHNlXHJcbi8vICAgICB3aGl0ZVRpbWUucnVubmluZyA9IHRydWVcclxuLy8gICAgIC8vIHdoaXRlVGltZS5taW4gPSBldmVudC5kYXRhLndoaXRlVGltZS5taW5cclxuLy8gICAgIC8vIHdoaXRlVGltZS5zZWNzID0gZXZlbnQuZGF0YS53aGl0ZVRpbWUuc2Vjc1xyXG4vLyAgICAgY29uc29sZS5sb2coXCJibGFjayBzaG91bGQgbm8gbG9uZ2VyIHJ1blwiKVxyXG4vLyAgICAgLy8gY2xlYXJJbnRlcnZhbChzZXQpXHJcbi8vICAgICBzdGFydFRpbWVyKFwid2hpdGVcIik7XHJcbi8vIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdGFydEJsYWNrVGltZXIpIHtcclxuLy8gICAgIHdoaXRlVGltZS5ydW5uaW5nID0gZmFsc2VcclxuLy8gICAgIGJsYWNrVGltZS5ydW5uaW5nID0gdHJ1ZVxyXG4vLyAgICAgLy8gYmxhY2tUaW1lLm1pbiA9IGV2ZW50LmRhdGEuYmxhY2tUaW1lLm1pblxyXG4vLyAgICAgLy8gYmxhY2tUaW1lLnNlY3MgPSBldmVudC5kYXRhLmJsYWNrVGltZS5zZWNzXHJcbi8vICAgICBjb25zb2xlLmxvZyhcIndoaXRlIHNob3VsZCBubyBsb25nZXIgcnVuXCIpXHJcbi8vICAgICBzdGFydFRpbWVyKFwiYmxhY2tcIik7XHJcbi8vICAgfVxyXG59O1xyXG4iXSwibmFtZXMiOlsid2hpdGVUaW1lIiwibWluIiwic2VjcyIsInJ1bm5pbmciLCJtaWxTZWNzIiwic2hvdWxkU2V0TWlsIiwiYmxhY2tUaW1lIiwiaXNHYW1lT3ZlciIsInRpbWVySW50ZXJ2YWxzIiwiY291bnRJbnRlcnZhbCIsIm1pbGlUaW1lckludGVydmFsSWQiLCJzdGFydE1pbGlUaW1lciIsImNvbG91ciIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImNvbnNvbGUiLCJsb2ciLCJwb3N0TWVzc2FnZSIsInNlbGYiLCJzdGFydFRpbWVyIiwib25tZXNzYWdlIiwiZXZlbnQiLCJkYXRhIiwiaW5pdGlhbCIsInciLCJiIiwic3RhcnRXaGl0ZVRpbWVyIl0sInNvdXJjZVJvb3QiOiIifQ==