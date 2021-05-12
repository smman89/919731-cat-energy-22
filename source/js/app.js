const navMain = document.querySelector(".main-nav")
const contactMap = document.querySelector(".contact__map")
const navToggle = document.querySelector(".main-nav__toggle")

navMain.classList.remove("main-nav--no-js")
contactMap.removeAttribute("hidden")

navToggle.addEventListener("click", function () {
  navMain.classList.toggle("main-nav--closed")
});

function initMap() {
  const location = { lat: 59.9388293430981, lng: 30.323025941024312 }
  const map = new google.maps.Map(contactMap, {
    zoom: 16,
    center: location,
    disableDefaultUI: true,
    scaleControl: false,
    scrollwheel: false,
  });
  const image = "img/map/map-pin.png"
  new google.maps.Marker({
    position: location,
    map,
    icon: image,
  });
}
