const userTeste = {
  name: "Guilherme Rossi Kirsten",
  code: new Date(),
  email: "teste@teste",
  password: "teste",
};

localStorage.setItem("users", JSON.stringify(userTeste));

document
  .querySelector("#formAuth")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const form = document.querySelector("form");
    const user = {
      email: form.emailInput.value.trim(),
      password: form.passwordInput.value.trim(),
    };

    if (authUser(user.email, user.password)) {
      const username = getUserByEmail(user.email);
      showName(username.name);
      window.location.href = "home.html";
    } else {
      showModal("Email ou senha incorreto");
    }

    // Função para autenticar o usuário
    function authUser(email, password) {
      // Obtém a lista de usuários do LocalStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Procura o usuário correspondente
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      // Retorna verdadeiro se o usuário for encontrado, falso caso contrário
      return !!user;
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

    function showName(username) {
      // Cria um objeto apenas com o nome do usuário
      const currentUser = {
        name: username,
      };

      // Armazena o nome do usuário no localStorage
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    // Função para recuperar o usuário pelo email
    function getUserByEmail(email) {
      // Obtém a lista de usuários do LocalStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Procura o usuário correspondente ao email
      return users.find((user) => user.email === email);
    }
  });
