// Seleciona o formulário e os elementos de entrada
const form = document.querySelector(".formLogin");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#emailInput");
const codeInput = document.querySelector("#códigoFunc");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#passwordconfirm");

// Adiciona o evento de envio do formulário
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Valida os campos
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const code = codeInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // Cria um objeto de usuário
  const newUser = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    code: codeInput.value.trim(),
    password: passwordInput.value.trim(), // Nota: Em um ambiente real, nunca armazene senhas em texto simples
  };

  if (
    name === "" ||
    email === "" ||
    code === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    showModal("Por favor, preencha todos os campos.");
    return;
  }

  if (password !== confirmPassword) {
    showModal("As senhas não coincidem.");
    return;
  }

  // Carrega a lista de usuários do LocalStorage
  let users = JSON.parse(localStorage.getItem("users"));

  if (!users) {
    users = [];
  }

  // Verifica duplicidade de nome, email ou código
  if (
    users.some(
      (user) =>
        user.name === newUser.name ||
        user.email === newUser.email ||
        user.code === newUser.code
    )
  ) {
    showModal("Nome, código de funcionário ou email já cadastrado.");
    return;
  }

  // Adiciona o novo usuário à lista existente
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  // Limpa os campos do formulário
  form.reset();

  showModal("Cadastro realizado com sucesso! redirecionando...");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
});

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
