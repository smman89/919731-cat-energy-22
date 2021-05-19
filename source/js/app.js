const navMain = document.querySelector(".main-nav")
const contactMap = document.querySelector(".contact__map")
const contactMapImage = document.querySelector(".contact__map-image")
const navToggle = document.querySelector(".main-nav__toggle")

navMain.classList.remove("main-nav--no-js")
contactMap.classList.remove("contact__map--no-js")
navToggle.classList.remove("main-nav__toggle--no-js")
contactMapImage.classList.add("contact__map-image--no-js")

navToggle.addEventListener("click", function () {
  navMain.classList.toggle("main-nav--closed")
});

function initMap() {
  const position = { lat: 59.9388293430981, lng: 30.323025941024312 }
  const center = { lat: 59.9389593430981, lng: 30.323025941024312 }
  const map = new google.maps.Map(contactMap, {
    zoom: 14.4,
    center: center,
    disableDefaultUI: true,
    scaleControl: false,
    scrollwheel: false,
  });
  const image = "img/map/map-pin.png"
  new google.maps.Marker({
    position: position,
    map,
    icon: image,
  });
}
