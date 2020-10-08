var data = {
  labels: [
    "Red",
    "Blue",
    "Yellow"
  ],
  datasets: [
    {
      data: [60,40],
      backgroundColor: [
        "#FF6384",
        "#D3D3D3"
      ],
      hoverBackgroundColor: [
        "#FF6384",
        "#D3D3D3"
      ]
    }]
};

var promisedDeliveryChart = new Chart(document.getElementById('myPieChart'), {
  type: 'doughnut',
  data: data,
  options: {
  	responsive: true,
    legend: {
      display: false
    }
  }
});

Chart.pluginService.register({
  beforeDraw: function(chart) {
    var width = chart.chart.width,
        height = chart.chart.height,
        ctx = chart.chart.ctx;

    ctx.restore();
    var fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    var text = "60%",
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
});