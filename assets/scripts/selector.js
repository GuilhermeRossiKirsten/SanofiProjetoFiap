document.addEventListener("DOMContentLoaded", function () {
  const emojis = document.querySelectorAll(".emoji");

  emojis.forEach((emoji) => {
    emoji.addEventListener("click", function () {
      // Remove a classe 'selected' de todos os emojis
      emojis.forEach((e) => e.classList.remove("selected"));

      // Adiciona a classe 'selected' ao emoji clicado
      this.classList.add("selected");
    });
  });

});
