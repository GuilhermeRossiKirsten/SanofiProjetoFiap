const userTeste = {
  name: "Guilherme Rossi Kirsten",
  id: new Date(),
  email: "teste@teste",
  password: "teste",
};

document
  .querySelector("#formAuth")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const form = document.querySelector("form");
    const user = {
      email: form.emailInput.value,
      password: form.passwordInput.value,
    };
    if (authUser(user)) {
      window.location.href = "home.html";
    } else {
      showModal("Email ou senha incorreto");
    }

    function authUser(user) {
      return (
        user.email === userTeste.email && user.password === userTeste.password
      );
    }

    const closeButton = document.querySelector(".close-button1");

    closeButton.addEventListener("click", () => {
      modal1.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === modal1) {
        modal1.style.display = "none";
      }
    });

    function showModal(msg1) {
      const modal = document.getElementById("modal1");
      const modalMessage = modal.querySelector("p");
      modalMessage.innerHTML = "";
      modalMessage.appendChild(document.createTextNode(msg1));
      modal.style.display = "block";
    }
  });
