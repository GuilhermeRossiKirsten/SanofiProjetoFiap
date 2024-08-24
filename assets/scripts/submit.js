// Seleciona o formulário e os elementos de entrada
const form = document.querySelector("#formAuth");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");

// Adiciona o evento de envio do formulário
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Valida os campos
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email === "" || password === "") {
    showModal("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch("https://apisanofi.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status == 200) {
      const data = await response.json();

      // Armazena o token e a data de expiração
      const expiryTime = new Date().getTime() + 60 * 60 * 1000; // Token expira em 1 hora
      localStorage.setItem("tokenExpiry", expiryTime);

      console.log("Login bem-sucedido:", data.username);
      showModal("Login realizado com sucesso! redirecionando...");
      showName(data.username, data.code);

      setTimeout(() => {
        window.location.href = "home.html";
      }, 3000);
    } else {
      const errorData = await response.json();
      showModal("Erro ao fazer login: " + errorData.message);
    }
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
    showModal("Erro ao conectar ao servidor.");
  }
});

// Função para exibir o modal
function showModal(msg) {
  const modal = document.getElementById("modal1");
  const modalMessage = modal.querySelector("p");
  modalMessage.innerHTML = "";
  modalMessage.appendChild(document.createTextNode(msg));
  modal.style.display = "block";
}

// Adiciona eventos para fechar o modal
const closeButton = document.querySelector(".close-button1");
const modal1 = document.getElementById("modal1");

closeButton.addEventListener("click", () => {
  modal1.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal1) {
    modal1.style.display = "none";
  }
});


function showName(username, code) {
  // Cria um objeto apenas com o nome do usuário
  const currentUser = {
    name: username,
    code: code,
  };
  // Armazena o nome do usuário no localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}
