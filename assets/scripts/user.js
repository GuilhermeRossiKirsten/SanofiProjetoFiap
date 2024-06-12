


const user = JSON.parse(localStorage.getItem("currentUser"));

const nome = user.name.split(" ");

const elements = document.querySelectorAll(".user");
elements.forEach(element => {
    element.innerText = nome[0]
});


function getUserByEmail(email) {
      // Obtém a lista de usuários do LocalStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Procura o usuário correspondente ao email
      return users.find((user) => user.email === email);
    }