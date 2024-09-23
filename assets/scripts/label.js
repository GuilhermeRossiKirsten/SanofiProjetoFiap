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
        yValueFormatString: "#,##0,,.## Million",
        legendText: "{indexLabel}",
        dataPoints: [
          { y: 4181563, indexLabel: "😭" },
          { y: 2175498, indexLabel: "😟" },
          { y: 3125844, indexLabel: "😐" },
          { y: 1176121, indexLabel: "🙂" },
          { y: 1727161, indexLabel: "🤩" },
        ],
      },
    ],
  });
  chart.render();
};
