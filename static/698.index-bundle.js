(()=>{var e={min:0,secs:2,running:!1,milSecs:0,shouldSetMil:!0,milTimerRunning:!1},s={min:0,secs:17,running:!1,milSecs:0,shouldSetMil:!0,milTimerRunning:!1},i=!1,t="",a=0,n=null;function l(a){clearInterval(n),n=setInterval((function(){if("black"===a){if(i)return void clearInterval(n);s.secs?(s.secs-=1,s.secs||s.min||(i=!0,t="Black lost on time.",postMessage("Game over. Black lost on time."),clearInterval(n))):s.min?(s.min-=1,s.secs=59):(i=!0,t="Black lost on time.",postMessage("Game over. Black lost on time."),clearInterval(n))}else if("white"===a){if(i)return void clearInterval(n);e.secs?(e.secs-=1,e.secs||e.min||(i=!0,t="White lost on time.",postMessage("Game over. White lost on time."),clearInterval(n))):e.min?(e.min-=1,e.secs=59):(i=!0,t="White lost on time.",postMessage("Game over. White lost on time."),clearInterval(n))}self.postMessage({whiteTime:e,blackTime:s,gameTerminationReason:t,isGameOver:i})}),1e3)}self.onmessage=function(t){if("kill"===t.data)clearInterval(n);else if(t.data.initial){var c=t.data.whiteTime;e.min=c.min,e.secs=c.secs,e.milSecs=c.milSecs;var m=t.data.blackTime;s.min=m.min,s.secs=m.secs,s.milSecs=m.milSecs,a=t.data.increment}i||(t.data.startWhiteTimer?(s.min+=Math.floor((s.secs+a)/60),s.secs=(s.secs+a)%60,l("white")):t.data.startBlackTimer&&(e.min+=Math.floor((e.secs+a)/60),e.secs=(e.secs+a)%60,l("black")))}})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNjk4LmluZGV4LWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiTUFFQSxJQUFJQSxFQUFZLENBQUVDLElBQUssRUFBR0MsS0FBTSxFQUFHQyxTQUFTLEVBQU9DLFFBQVMsRUFBR0MsY0FBYyxFQUFNQyxpQkFBaUIsR0FDaEdDLEVBQVksQ0FBRU4sSUFBSyxFQUFHQyxLQUFNLEdBQUlDLFNBQVMsRUFBT0MsUUFBUyxFQUFHQyxjQUFjLEVBQU1DLGlCQUFpQixHQUNqR0UsR0FBYSxFQUNiQyxFQUF3QixHQUN4QkMsRUFBbUIsRUFHbkJDLEVBQWlCLEtBSXJCLFNBQVNDLEVBQVdDLEdBQ2hCQyxjQUFjSCxHQUVoQkEsRUFBaUJJLGFBQVksV0FDM0IsR0FBZ0IsVUFBWEYsRUFBb0IsQ0FDckIsR0FBSUwsRUFFQSxZQURBTSxjQUFjSCxHQUdkSixFQUFVTCxNQUNWSyxFQUFVTCxNQUFRLEVBQ2JLLEVBQVVMLE1BQVNLLEVBQVVOLE1BQzlCTyxHQUFhLEVBQ2JDLEVBQXdCLHNCQUN4Qk8sWUFBWSxrQ0FDWkYsY0FBY0gsS0FHZEosRUFBVU4sS0FDWk0sRUFBVU4sS0FBTyxFQUNqQk0sRUFBVUwsS0FBTyxLQUVYTSxHQUFhLEVBQ2JDLEVBQXdCLHNCQUN4Qk8sWUFBWSxrQ0FDWkYsY0FBY0gsR0FHOUIsTUFBTyxHQUFlLFVBQVhFLEVBQXFCLENBQzVCLEdBQUlMLEVBRUEsWUFEQU0sY0FBY0gsR0FHZFgsRUFBVUUsTUFDVkYsRUFBVUUsTUFBUSxFQUNiRixFQUFVRSxNQUFTRixFQUFVQyxNQUM5Qk8sR0FBYSxFQUNiQyxFQUF3QixzQkFDeEJPLFlBQVksa0NBQ1pGLGNBQWNILEtBR2RYLEVBQVVDLEtBQ1pELEVBQVVDLEtBQU8sRUFDakJELEVBQVVFLEtBQU8sS0FFWE0sR0FBYSxFQUNiQyxFQUF3QixzQkFDeEJPLFlBQVksa0NBQ1pGLGNBQWNILEdBSTlCLENBR0FNLEtBQUtELFlBQVksQ0FBRWhCLFVBQUFBLEVBQVdPLFVBQUFBLEVBQVdFLHNCQUFBQSxFQUF1QkQsV0FBQUEsR0FDbEUsR0FBRyxJQUNMLENBR0FTLEtBQUtDLFVBQVksU0FBVUMsR0FFdkIsR0FBbUIsU0FBZkEsRUFBTUMsS0FDTk4sY0FBY0gsUUFFYixHQUFJUSxFQUFNQyxLQUFLQyxRQUFTLENBRXpCLElBQU1DLEVBQUlILEVBQU1DLEtBQUtwQixVQUNyQkEsRUFBVUMsSUFBTXFCLEVBQUVyQixJQUNsQkQsRUFBVUUsS0FBT29CLEVBQUVwQixLQUNuQkYsRUFBVUksUUFBVWtCLEVBQUVsQixRQUV0QixJQUFNbUIsRUFBSUosRUFBTUMsS0FBS2IsVUFDckJBLEVBQVVOLElBQU1zQixFQUFFdEIsSUFDbEJNLEVBQVVMLEtBQU9xQixFQUFFckIsS0FDbkJLLEVBQVVILFFBQVVtQixFQUFFbkIsUUFFdEJNLEVBQW1CUyxFQUFNQyxLQUFLSSxTQUNsQyxDQUNLaEIsSUFDR1csRUFBTUMsS0FBS0ssaUJBRVhsQixFQUFVTixLQUFPeUIsS0FBS0MsT0FBT3BCLEVBQVVMLEtBQU9RLEdBQW9CLElBQ2xFSCxFQUFVTCxNQUFRSyxFQUFVTCxLQUFPUSxHQUFvQixHQUN2REUsRUFBVyxVQUVOTyxFQUFNQyxLQUFLUSxrQkFFaEI1QixFQUFVQyxLQUFPeUIsS0FBS0MsT0FBTzNCLEVBQVVFLEtBQU9RLEdBQW9CLElBQ2xFVixFQUFVRSxNQUFRRixFQUFVRSxLQUFPUSxHQUFvQixHQUV2REUsRUFBVyxVQUd2QixDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hlc3NfcHJvZ3JhbW1pbmcvLi9hc3NldHMvc3JjL3RpbWVyL3RpbWVyLXdvcmtlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmxldCB3aGl0ZVRpbWUgPSB7IG1pbjogMCwgc2VjczogMiwgcnVubmluZzogZmFsc2UsIG1pbFNlY3M6IDAsIHNob3VsZFNldE1pbDogdHJ1ZSwgbWlsVGltZXJSdW5uaW5nOiBmYWxzZSB9O1xyXG5sZXQgYmxhY2tUaW1lID0geyBtaW46IDAsIHNlY3M6IDE3LCBydW5uaW5nOiBmYWxzZSwgbWlsU2VjczogMCwgc2hvdWxkU2V0TWlsOiB0cnVlLCBtaWxUaW1lclJ1bm5pbmc6IGZhbHNlIH07XHJcbmxldCBpc0dhbWVPdmVyID0gZmFsc2U7XHJcbmxldCBnYW1lVGVybWluYXRpb25SZWFzb24gPSBcIlwiO1xyXG5sZXQgc2Vjb25kc0luY3JlbWVudCA9IDA7XHJcblxyXG5cclxubGV0IHRpbWVySW50ZXJ2YWxzID0gbnVsbDtcclxubGV0IG1pbGlUaW1lckludGVydmFsSWQgPSBudWxsXHJcblxyXG5cclxuZnVuY3Rpb24gc3RhcnRUaW1lcihjb2xvdXIpIHtcclxuICAgIGNsZWFySW50ZXJ2YWwodGltZXJJbnRlcnZhbHMpXHJcbiAgICBcclxuICB0aW1lckludGVydmFscyA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgIGlmICAoY29sb3VyID09PSAnYmxhY2snKSB7XHJcbiAgICAgICAgaWYgKGlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFscylcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChibGFja1RpbWUuc2Vjcykge1xyXG4gICAgICAgICAgICBibGFja1RpbWUuc2VjcyAtPSAxO1xyXG4gICAgICAgICAgICBpZiAoIWJsYWNrVGltZS5zZWNzICYmICFibGFja1RpbWUubWluKSB7XHJcbiAgICAgICAgICAgICAgICBpc0dhbWVPdmVyID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgZ2FtZVRlcm1pbmF0aW9uUmVhc29uID0gXCJCbGFjayBsb3N0IG9uIHRpbWUuXCJcclxuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlKFwiR2FtZSBvdmVyLiBCbGFjayBsb3N0IG9uIHRpbWUuXCIpXHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWxzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoYmxhY2tUaW1lLm1pbikge1xyXG4gICAgICAgICAgICAgIGJsYWNrVGltZS5taW4gLT0gMTtcclxuICAgICAgICAgICAgICBibGFja1RpbWUuc2VjcyA9IDU5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZVRlcm1pbmF0aW9uUmVhc29uID0gXCJCbGFjayBsb3N0IG9uIHRpbWUuXCJcclxuICAgICAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZShcIkdhbWUgb3Zlci4gQmxhY2sgbG9zdCBvbiB0aW1lLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXJJbnRlcnZhbHMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoY29sb3VyID09PSBcIndoaXRlXCIgKSB7XHJcbiAgICAgICAgaWYgKGlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFscylcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aGl0ZVRpbWUuc2Vjcykge1xyXG4gICAgICAgICAgICB3aGl0ZVRpbWUuc2VjcyAtPSAxO1xyXG4gICAgICAgICAgICBpZiAoIXdoaXRlVGltZS5zZWNzICYmICF3aGl0ZVRpbWUubWluKSB7XHJcbiAgICAgICAgICAgICAgICBpc0dhbWVPdmVyID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgZ2FtZVRlcm1pbmF0aW9uUmVhc29uID0gXCJXaGl0ZSBsb3N0IG9uIHRpbWUuXCJcclxuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlKFwiR2FtZSBvdmVyLiBXaGl0ZSBsb3N0IG9uIHRpbWUuXCIpXHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWxzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAod2hpdGVUaW1lLm1pbikge1xyXG4gICAgICAgICAgICAgIHdoaXRlVGltZS5taW4gLT0gMTtcclxuICAgICAgICAgICAgICB3aGl0ZVRpbWUuc2VjcyA9IDU5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZVRlcm1pbmF0aW9uUmVhc29uID0gXCJXaGl0ZSBsb3N0IG9uIHRpbWUuXCJcclxuICAgICAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZShcIkdhbWUgb3Zlci4gV2hpdGUgbG9zdCBvbiB0aW1lLlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXJJbnRlcnZhbHMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2VuZCB0aGUgdXBkYXRlZCB0aW1lIHJlbWFpbmluZyBiYWNrIHRvIHRoZSBtYWluIHRocmVhZFxyXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7IHdoaXRlVGltZSwgYmxhY2tUaW1lLCBnYW1lVGVybWluYXRpb25SZWFzb24sIGlzR2FtZU92ZXIgfSk7XHJcbiAgfSwgMTAwMClcclxufVxyXG5cclxuLy8gTGlzdGVuIGZvciBtZXNzYWdlcyBmcm9tIHRoZSBtYWluIHRocmVhZFxyXG5zZWxmLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJtZXNzYWdlIGZyb20gbWFpbiB0aHJlYWQ6XCIsIGV2ZW50LmRhdGEpXHJcbiAgICBpZiAoZXZlbnQuZGF0YSA9PT0gXCJraWxsXCIpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWxzKVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZXZlbnQuZGF0YS5pbml0aWFsKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3ZSBoYXZlIGFuIGluaXRpYWwgbWVzc2FnZVwiKVxyXG4gICAgICAgIGNvbnN0IHcgPSBldmVudC5kYXRhLndoaXRlVGltZVxyXG4gICAgICAgIHdoaXRlVGltZS5taW4gPSB3Lm1pblxyXG4gICAgICAgIHdoaXRlVGltZS5zZWNzID0gdy5zZWNzXHJcbiAgICAgICAgd2hpdGVUaW1lLm1pbFNlY3MgPSB3Lm1pbFNlY3NcclxuXHJcbiAgICAgICAgY29uc3QgYiA9IGV2ZW50LmRhdGEuYmxhY2tUaW1lXHJcbiAgICAgICAgYmxhY2tUaW1lLm1pbiA9IGIubWluXHJcbiAgICAgICAgYmxhY2tUaW1lLnNlY3MgPSBiLnNlY3NcclxuICAgICAgICBibGFja1RpbWUubWlsU2VjcyA9IGIubWlsU2Vjc1xyXG5cclxuICAgICAgICBzZWNvbmRzSW5jcmVtZW50ID0gZXZlbnQuZGF0YS5pbmNyZW1lbnRcclxuICAgIH1cclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGlmIChldmVudC5kYXRhLnN0YXJ0V2hpdGVUaW1lcikge1xyXG4gICAgICAgICAgICAvLyBBZGQgaW5jcmVtZW50IHRvIGJsYWNrIHRpbWVcclxuICAgICAgICAgICAgYmxhY2tUaW1lLm1pbiArPSBNYXRoLmZsb29yKChibGFja1RpbWUuc2VjcyArIHNlY29uZHNJbmNyZW1lbnQpIC8gNjApXHJcbiAgICAgICAgICAgIGJsYWNrVGltZS5zZWNzID0gKGJsYWNrVGltZS5zZWNzICsgc2Vjb25kc0luY3JlbWVudCkgJSA2MFxyXG4gICAgICAgICAgICBzdGFydFRpbWVyKFwid2hpdGVcIilcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQuZGF0YS5zdGFydEJsYWNrVGltZXIpIHtcclxuICAgICAgICAgICAgIC8vIEFkZCBpbmNyZW1lbnQgdG8gd2hpdGUgdGltZVxyXG4gICAgICAgICAgICB3aGl0ZVRpbWUubWluICs9IE1hdGguZmxvb3IoKHdoaXRlVGltZS5zZWNzICsgc2Vjb25kc0luY3JlbWVudCkgLyA2MClcclxuICAgICAgICAgICAgd2hpdGVUaW1lLnNlY3MgPSAod2hpdGVUaW1lLnNlY3MgKyBzZWNvbmRzSW5jcmVtZW50KSAlIDYwXHJcblxyXG4gICAgICAgICAgICBzdGFydFRpbWVyKFwiYmxhY2tcIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJ3aGl0ZVRpbWUiLCJtaW4iLCJzZWNzIiwicnVubmluZyIsIm1pbFNlY3MiLCJzaG91bGRTZXRNaWwiLCJtaWxUaW1lclJ1bm5pbmciLCJibGFja1RpbWUiLCJpc0dhbWVPdmVyIiwiZ2FtZVRlcm1pbmF0aW9uUmVhc29uIiwic2Vjb25kc0luY3JlbWVudCIsInRpbWVySW50ZXJ2YWxzIiwic3RhcnRUaW1lciIsImNvbG91ciIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInBvc3RNZXNzYWdlIiwic2VsZiIsIm9ubWVzc2FnZSIsImV2ZW50IiwiZGF0YSIsImluaXRpYWwiLCJ3IiwiYiIsImluY3JlbWVudCIsInN0YXJ0V2hpdGVUaW1lciIsIk1hdGgiLCJmbG9vciIsInN0YXJ0QmxhY2tUaW1lciJdLCJzb3VyY2VSb290IjoiIn0=