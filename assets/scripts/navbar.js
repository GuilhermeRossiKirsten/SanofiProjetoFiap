$(document).ready(function () {
  $("#mobile_btn").on("click", function () {
    $("#mobile_menu").toggleClass("active");
    $("#mobile_btn").find("i").toggleClass("fa-x");
  });
});

$(document).ready(function () {
  $(".close-button2").on("click", function () {
    $("#mobile_menu").removeClass("active");
    $("#mobile_btn").find("i").removeClass("fa-x");
  });
});




