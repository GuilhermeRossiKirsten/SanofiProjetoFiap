window.onload = function () {
  // Definindo o conjunto de cores
  CanvasJS.addColorSet("greenShades", [
    "#2F4F4F",
    "#008080",
    "#2E8B57",
    "#3CB371",
    "#90EE90",
  ]);

  // Fazendo a requisição para a API usando fetch
  fetch("http://localhost:5000/emotion-stats")
    .then((response) => response.json())
    .then((data) => {
      // Atualizando os pontos de dados com os valores da API
      var chart = new CanvasJS.Chart("chartContainer", {
        colorSet: "greenShades",
        theme: "light2",
        title: {
          text: "Distribuição de Emoções dos Funcionários",
        },
        data: [
          {
            type: "pie",
            showInLegend: true,
            toolTipContent: "{y} - #percent %",
            yValueFormatString: "## ",
            legendText: "{indexLabel}",
            dataPoints: [
              { y: data.muito_triste, indexLabel: "😭 Muito Triste" },
              { y: data.triste, indexLabel: "😟 Triste" },
              { y: data.neutro, indexLabel: "😐 Neutro" },
              { y: data.feliz, indexLabel: "🙂 Feliz" },
              { y: data.muito_feliz, indexLabel: "🤩 Muito Feliz" },
            ],
          },
        ],
      });
      chart.render();
    })
    .catch((error) => {
      console.error("Erro ao buscar os dados:", error);
    });
};
