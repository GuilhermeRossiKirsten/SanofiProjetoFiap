document.addEventListener("DOMContentLoaded", () => {
  const createEvaluationForm = document.getElementById(
    "createEvaluationForm_unique"
  );
  const searchEvaluationForm = document.getElementById(
    "searchEvaluationForm_unique"
  );
  const evaluationsList = document.getElementById("evaluationsList_unique");

  const BASE_URL = "https://apisanofi.onrender.com"; // URL do servidor local

  // Função para criar uma avaliação
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
        evaluations.forEach((evaluation) => {
          const evaluationItem = document.createElement("div");
          evaluationItem.classList.add("evaluation-item");
          evaluationItem.innerHTML = `
          <h3>${evaluation.evaluation_name}</h3>
          <p><strong>ID: </strong> ${evaluation.id}
          <p><strong>Funcionários:</strong> ${evaluation.employees_involved.join(
            ", "
          )}</p>
          <p><strong>Descrição:</strong> ${evaluation.description}</p>
          <p><strong>Data:</strong> ${new Date(
            evaluation.created_at
          ).toLocaleDateString()}</p>
    <button class="buttonAVA" data-id="${evaluation.id}">Enviar Email</button>
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
        evaluations.forEach((evaluation) => {
          const evaluationItem = document.createElement("div");
          evaluationItem.classList.add("evaluation-item");
          evaluationItem.innerHTML = `
            <h3>${evaluation.evaluation_name}</h3>
            <p><strong>ID: </strong> ${evaluation.id}
            <p><strong>Funcionários:</strong> ${evaluation.employees_involved.join(
              ", "
            )}</p>
            <p><strong>Descrição:</strong> ${evaluation.description}</p>
            <p><strong>Data:</strong> ${new Date(
              evaluation.created_at
            ).toLocaleDateString()}</p>
    <button class="buttonAVA" data-id="${evaluation.id}">Enviar Email</button>
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

  evaluationsList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("email-button")) {
      const evaluationId = event.target.dataset.id;

      emailjs.init("6sftJf-YW7IWM-"); // Substitua "YOUR_USER_ID" pela sua chave pública do EmailJS

      const emailsInput = document.getElementById("emails").value;
      const emailsArray = emailsInput.split(",").map((email) => email.trim());

      emailsArray.forEach((email) => {
        if (email) {
          // Verifica se o email não está vazio
          sendEmail(email);
        }
      });

      const sendEmail = (email) => {
        const templateParams = {
          to_email: email,
          subject: "Assunto do Email",
          message: "Este é o corpo do email.",
        };

        emailjs.send("Yrvice_x1qak48", "mplate_eqxszuq", templateParams).then(
          (response) => {
            console.log(
              "Email enviado com sucesso!",
              response.status,
              response.text
            );
            alert(`Email enviado para: ${email}`);
          },
          (error) => {
            console.error("Erro ao enviar email:", error);
            alert(`Erro ao enviar email para: ${email}`);
          }
        );
      };

      sendEmail(evaluationId);
    }
  });
});
