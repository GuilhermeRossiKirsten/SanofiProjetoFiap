// Seleciona o formulário e os elementos de entrada
const form = document.querySelector(".formLogin");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#emailInput");
const codeInput = document.querySelector("#códigoFunc");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#passwordconfirm");

// Adiciona o evento de envio do formulário
form.addEventListener("submit", async function (event) {
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

  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        employee_code: code,
      }),
    });

    if (response.status == 201) {
      showModal("Cadastro realizado com sucesso! redirecionando...");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);

    } else {
      const errorData = await response.text();
      showModal("Erro ao cadastrar: " + errorData);
    }
  } catch (error) {
    showModal("Erro ao conectar ao servidor.");
  }

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
