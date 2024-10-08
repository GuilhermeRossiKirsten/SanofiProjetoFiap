document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("chatModal");
  var btn = document.getElementById("openChatModal");
  var span = document.getElementsByClassName("close")[0];

  // Quando o usuário clicar no botão, abre a modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // Quando o usuário clicar no X, fecha a modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // Quando o usuário clicar fora da modal, fecha a modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
