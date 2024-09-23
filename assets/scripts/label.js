window.onload = function () {
  CanvasJS.addColorSet("greenShades", [
    //colorSet Array

    "#2F4F4F",
    "#008080",
    "#2E8B57",
    "#3CB371",
    "#90EE90",
  ]);

  var chart = new CanvasJS.Chart("chartContainer", {
    colorSet: "greenShades",
    theme: "light2",
    title: {
      text: "",
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        toolTipContent: "{y} - #percent %",
        yValueFormatString: "## ",
        legendText: "{indexLabel}",
        dataPoints: [
          { y: 41, indexLabel: "😭 Muito Triste"},
          { y: 21, indexLabel: "😟 Triste" },
          { y: 31, indexLabel: "😐 Neutro" },
          { y: 11, indexLabel: "🙂 Feliz" },
          { y: 17, indexLabel: "🤩 Muito Feliz" },
        ],
      },
    ],
  });
  chart.render();
};
