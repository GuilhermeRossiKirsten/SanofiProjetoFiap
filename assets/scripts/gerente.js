document
  .getElementById("searchButton")
  .addEventListener("click", async function () {
    const query = document.getElementById("searchBox").value;

    if (query.length > 2) {
      // Esperar pelo menos 3 caracteres para iniciar a busca
      const response = await fetch("https://apisanofi.onrender.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: query }),
      });

      if (response.ok) {
        const results = await response.json();

        const resultsList = document.getElementById("results");
        resultsList.innerHTML = "";

        results.forEach((result) => {
          // Criar uma div para cada resultado
          const div = document.createElement("div");
          div.className = "result-box"; // Classe CSS para estilizar

          // Criar o botão de detalhes
          const detailsButton = document.createElement("button");
          detailsButton.textContent = "Detalhes";
          detailsButton.className = "details-button";
          detailsButton.addEventListener("click", () => {
            // Preencher o modal com detalhes
            document.getElementById(
              "modalName"
            ).textContent = `Nome: ${result.name}`;
            document.getElementById(
              "modalEmail"
            ).textContent = `Email: ${result.email}`;
            document.getElementById(
              "modalCode"
            ).textContent = `Código: ${result.employee_code}`;

            // Atualizar o emoji com base no estado
            const emojiSpan = document.getElementById("modalState");
            const emoji = getEmoji(result.emotion_state);
            emojiSpan.textContent = `${emoji}`;

            document.getElementById(
              "modalEmotion"
            ).textContent = `${result.text_emotion}`;
            document.getElementById(
              "modalDate"
            ).textContent = `Data: ${new Date(
              result.created_at
            ).toLocaleString()}`;

            // Mostrar o modal
            document.getElementById("detailsModal").style.display = "block";
          });

          // Adicionar o botão ao resultado
          div.appendChild(detailsButton);

          // Adicionar informações ao resultado
          const name = document.createElement("p");
          name.textContent = `Nome: ${result.name}`;
          div.appendChild(name);

          const email = document.createElement("p");
          email.textContent = `Email: ${result.email}`;
          div.appendChild(email);

          const code = document.createElement("p");
          code.textContent = `Código: ${result.employee_code}`;
          div.appendChild(code);

          //   const state = document.createElement("p");
          //   state.textContent = `Estado: ${result.emotion_state}`;
          //   div.appendChild(state);

          //   const emotion = document.createElement("p");
          //   emotion.textContent = `Emoção: ${result.text_emotion}`;
          //   div.appendChild(emotion);

          const date = document.createElement("p");
          date.textContent = `Data: ${new Date(
            result.created_at
          ).toLocaleString()}`;
          div.appendChild(date);

          // Adicionar a div ao resultsList
          resultsList.appendChild(div);
        });
      } else {
        console.error("Erro na requisição:", response.statusText);
      }
    }
  });

// Função para obter o emoji com base no estado
function getEmoji(state) {
  switch (state) {
    case 1:
      return "😭"; // Emoji para estado 1
    case 2:
      return "😟"; // Emoji para estado 2
    case 3:
      return "😐"; // Emoji para estado 3
    case 4:
      return "🙂"; // Emoji para estado 4
    case 5:
      return "🤩"; // Emoji para estado 5
  }
}

// Adiciona eventos para fechar o modal
const closeButton3 = document.querySelector(".close3");
const modal3 = document.getElementById("detailsModal");

closeButton3.addEventListener("click", () => {
  modal3.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal3) {
    modal3.style.display = "none";
  }
});
