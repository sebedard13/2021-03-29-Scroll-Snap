let sectionList
let timerScrollEvent;
let indexSection = 0;


document.addEventListener("DOMContentLoaded", function () {
   sectionList = document.querySelector("main").childNodes;


   if(isTouchDevice()){
      window.addEventListener("scroll", function (e){
         if(timerScrollEvent !== null) {
            clearTimeout(timerScrollEvent);
         }
         timerScrollEvent = setTimeout(function() {
            scrollGrabAfterFreeScroll()
         }, 100);
      });
   }

   else {
      let canBeInScroll = true;
      document.querySelector("body").style.overflow = "hidden";

      scrollGrabAfterFreeScroll()
      for (let i = 0; i < sectionList.length; i++) {
         let valueSection = sectionList[i].offsetTop
         if(window.scrollY === valueSection){
            indexSection = i;
         }
      }

      document.addEventListener('wheel', function (e){
         if(canBeInScroll){
            if(e.deltaY >0) { //Scroll vers le bas
               scrollGrabBlock(1)
            }
            else {
               scrollGrabBlock(-1)
            }
         }
         canBeInScroll = false;
         if(timerScrollEvent !== null) {
            clearTimeout(timerScrollEvent);
         }
         timerScrollEvent = setTimeout(function() {
            canBeInScroll = true;
         }, 100);
      });
   }
});

function isTouchDevice() {
   return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
}


function scrollGrabBlock(value){
   indexSection+= value;
   if(indexSection>sectionList.length-1){
      indexSection = sectionList.length-1
   }
   else if(indexSection<0){
      indexSection = 0;
   }
   else {
      window.scrollTo({
         top: sectionList[indexSection].offsetTop,
         left: 0,
         behavior: 'smooth'
      })
   }
}


function scrollGrabAfterFreeScroll(){

   let scrollPosition = window.scrollY;
   let position = null;
   let differenceNow = null;
   for (let i = 0; i < sectionList.length; i++) {
      let valueSection = sectionList[i].offsetTop

      let difference = Math.abs(valueSection-scrollPosition);
      if(position === null){
         position = sectionList[i].offsetTop;
         differenceNow = difference
      }
      else if(difference<differenceNow){
         position = sectionList[i].offsetTop;
         differenceNow = difference
      }
   }


   window.scrollTo({
      top: position,
      left: 0,
      behavior: 'smooth'
   })


}
