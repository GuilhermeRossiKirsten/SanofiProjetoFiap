document.addEventListener("DOMContentLoaded", function () {
  const emojiContainer = document.querySelector(".emoji-container");
  const submitButton = document.querySelector(".submit-button");
  const textArea = document.querySelector("textarea");
  let selectedEmoji = null;

  // Captura a seleção do emoji
  emojiContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("emoji")) {
      selectedEmoji = event.target.getAttribute("data-emoji");

      // Limpa seleção anterior
      document.querySelectorAll(".emoji").forEach((emoji) => {
        emoji.classList.remove("selected");
      });

      // Marca emoji selecionado
      event.target.classList.add("selected");
    }
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const employee_code = currentUser.code; // Pegar o código de onde ele está armazenado

  submitButton.addEventListener("click", async function () {
    const emotionState = selectedEmoji;
    const textEmotion = textArea.value.trim(); // Aqui você decide como tratar o valor do textArea

    if (!emotionState) {
      showModal("Por favor, selecione um estado emocional e preencha o campo.");
      return;
    }

    const data = {
      employee_code: employee_code,
      emotion_state: emotionState,
      text_emotion: textEmotion,
    };

    try {
      const response = await fetch("http://localhost:5000/user-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status == 201) {
        
        showModal("Dados enviados com sucesso!");
      } else {
        const errorData = await response.text();
        showModal("Erro ao enviar os dados: " + errorData);
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      showModal("Erro ao conectar ao servidor.");
    }
  });
});


function showModal(msg) {
  const modal = document.getElementById("modal1");
  const modalMessage = modal.querySelector("p");
  modalMessage.innerHTML = "";
  modalMessage.appendChild(document.createTextNode(msg));
  modal.style.display = "block";
}
