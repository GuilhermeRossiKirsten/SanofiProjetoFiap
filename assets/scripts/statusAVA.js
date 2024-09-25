async function trocaStatus(progresso, id) {
  try {
    const response = await fetch(
      `https://apisanofi.onrender.com/evaluations/progresso/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: progresso,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao mudar status");
    }

    const result = await response.json();
    window.location.reload();
  } catch (err) {
    console.error("Error: ", err);
  }
}
