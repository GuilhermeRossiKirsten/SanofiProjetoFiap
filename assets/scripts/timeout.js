// Função para verificar se o token expirou
function checkTokenExpiry() {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (tokenExpiry && new Date().getTime() > tokenExpiry) {
    // Token expirou
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    showModal("Sua sessão expirou. Faça login novamente.");
    // Redireciona para a página de login
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  }
}

// Chama a função de verificação ao carregar a página
window.addEventListener("load", checkTokenExpiry);


const closeButton = document.querySelector(".close-button1");

closeButton.addEventListener("click", () => {
  modal1.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal1) {
    modal1.style.display = "none";
  }
});

function showModal(msg) {
  const modal = document.getElementById("modal1");
  const modalMessage = modal.querySelector("p");
  modalMessage.innerHTML = "";
  modalMessage.appendChild(document.createTextNode(msg));
  modal.style.display = "block";
}