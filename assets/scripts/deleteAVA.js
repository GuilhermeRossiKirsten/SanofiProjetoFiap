async function deleteAVA(id) {
  try {
    const response = await fetch(
      `https://apisanofi.onrender.com/evaluations/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao deletar avaliação");
    }

    const result = await response.json();
    window.location.reload();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar avaliação");
  }
}
