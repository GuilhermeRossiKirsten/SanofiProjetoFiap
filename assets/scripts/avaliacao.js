document.addEventListener("DOMContentLoaded", () => {
  const createEvaluationForm = document.getElementById(
    "createEvaluationForm_unique"
  );
  const searchEvaluationForm = document.getElementById(
    "searchEvaluationForm_unique"
  );
  const evaluationsList = document.getElementById("evaluationsList_unique");

  //const BASE_URL = "https://apisanofi.onrender.com"; // URL do servidor local
  const BASE_URL = "http://localhost:5000"; // URL do servidor local

  createEvaluationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const storedData = localStorage.getItem("currentUser");

    const codigoId = JSON.parse(storedData);

    const formData = new FormData(createEvaluationForm);
    const data = {
      evaluation_name: formData.get("evaluation_name"),
      employees_involved: formData
        .get("employees_involved")
        .split(",")
        .map((email) => email.trim()),
      description: formData.get("description"),
      user_id: codigoId.codeId, // Substitua pelo ID do usuário autenticado
      due_date: formData.get("due_date"), // Adiciona o campo de data prevista
    };

    try {
      const response = await fetch(`${BASE_URL}/evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar avaliação");
      }

      const result = await response.json();
      alert(result.message);
      createEvaluationForm.reset(); // Limpar o formulário
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar avaliação");
    }

    fetchAllEvaluations(); // Atualiza a lista de avaliações
  });

  // Função para buscar avaliação específica
  searchEvaluationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchTerm = document.getElementById("search_term_unique").value; // Pega o termo de busca

    try {
      const response = await fetch(
        `${BASE_URL}/evaluations/search?query=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar avaliações");
      }

      const evaluations = await response.json();
      evaluationsList.innerHTML = ""; // Limpar a lista anterior

      if (evaluations.length === 0) {
        evaluationsList.innerHTML = "<p>Nenhuma avaliação encontrada.</p>";
      } else {
        evaluations.forEach(async (evaluation) => {
          const evaluationItem = document.createElement("div");
          const response2 = await fetch(
            `${BASE_URL}/idUser?id=${evaluation.user_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const userId = await response2.json();
          evaluationItem.classList.add("evaluation-item");
          evaluationItem.innerHTML = `
            <p><strong class="leftID">ID: ${evaluation.id} </strong></p>
            <p><strong>Criado por</strong> ${userId.name}</p>
            <p><strong>Data de Criação:</strong> ${new Date(
              evaluation.created_at
            ).toLocaleDateString()}</p>
            </br>
            <h3>${evaluation.evaluation_name}</h3>
            <p><strong>Agendado para </strong>${new Date(
              evaluation.scheduled_date
            ).toLocaleDateString()}</p>
            </br>
            
            <p><strong>Status: ${evaluation.status}</strong></p>
            </br>

            </div>
            <p id="modalEmotionLabel">Funcionários:</p>
            <textarea id="modalAVALabel" readonly>${evaluation.employees_involved.join(
              ", "
            )}</textarea>
            </div>
            </div>
            <p id="modalEmotionLabel">Descrição:</p>
            <textarea id="modalAVALabel" readonly>${
              evaluation.description
            }</textarea>
            </div>
            </br>
            <button class="buttonAVA" data-id="${
              evaluation.id
            }">Enviar Email</button>


            <button class="buttonAVA" data-id="${
              evaluation.id
            }" onclick="trocaStatus('CONCLUIDO', '${
            evaluation.id
          }')">Concluir</button>


            <button class="buttonAVA" data-id="${
              evaluation.id
            }" onclick="trocaStatus('EM ESPERA', '${
            evaluation.id
          }')">Em espera</button>


            <button class="buttonAVA" data-id="${
              evaluation.id
            }" onclick="trocaStatus('ANDAMENTO', '${
            evaluation.id
          }')">Andamento</button>


            <button class="buttonDelete" data-id="${
              evaluation.id
            }" onclick="deleteAVA('${evaluation.id}')">Deletar Tarefa</button>
            </br>
            </br>
          `;
          evaluationsList.appendChild(evaluationItem);
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao buscar avaliação");
    }
  });

  // Função para buscar todas as avaliações
  const fetchAllEvaluations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/evaluations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar avaliações");
      }

      const evaluations = await response.json();
      evaluationsList.innerHTML = ""; // Limpar a lista anterior

      if (evaluations.length === 0) {
        evaluationsList.innerHTML = "<p>Nenhuma avaliação encontrada.</p>";
      } else {
        evaluations.forEach(async (evaluation) => {
          const evaluationItem = document.createElement("div");
          const response2 = await fetch(
            `${BASE_URL}/idUser?id=${evaluation.user_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const userId = await response2.json();
          evaluationItem.classList.add("evaluation-item");
          evaluationItem.classList.add(`id_${evaluation.id}`);
          evaluationItem.innerHTML = `
            <p><strong class="leftID">ID: ${evaluation.id} </strong></p>
            <p><strong>Criado por</strong> ${userId.name}</p>
            <p><strong>Data de Criação:</strong> ${new Date(
              evaluation.created_at
            ).toLocaleDateString()}</p>
            </br>
            <h3>${evaluation.evaluation_name}</h3>
            <p><strong>Agendado para </strong>${new Date(
              evaluation.scheduled_date
            ).toLocaleDateString()}</p>
            </br>
            
            <p><strong>Status: ${evaluation.status}</strong></p>
            </br>

            </div>
            <p id="modalEmotionLabel">Funcionários:</p>
            <textarea id="modalAVALabel" readonly>${evaluation.employees_involved.join(
              ", "
            )}</textarea>
            </div>
            </div>
            <p id="modalEmotionLabel">Descrição:</p>
            <textarea id="modalAVALabel" readonly>${
              evaluation.description
            }</textarea>
            </div>
            </br>
            <button class="buttonAVA" data-id="${
              evaluation.id
            }">Enviar Email</button>


            <button class="buttonAVA" data-id="${
              evaluation.id
            }" onclick="trocaStatus('CONCLUIDO', '${
            evaluation.id
          }')">Concluir</button>


            <button class="buttonAVA" data-id="${
              evaluation.id
            }" onclick="trocaStatus('EM ESPERA', '${
            evaluation.id
          }')">Em espera</button>


            <button class="buttonAVA" data-id="${
              evaluation.id
            }" onclick="trocaStatus('ANDAMENTO', '${
            evaluation.id
          }')">Andamento</button>


            <button class="buttonDelete" data-id="${
              evaluation.id
            }" onclick="deleteAVA('${evaluation.id}')">Deletar Tarefa</button>
            </br>
            </br>
          `;
          evaluationsList.appendChild(evaluationItem);
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao buscar avaliações");
    }
  };

  fetchAllEvaluations();
});
