var weatherurl = "https://s3-ap-southeast-1.amazonaws.com/acbw/tokyo_weather.json";
var chartConfig = function(weatherData) {
  var hourLabels = weatherData.hourly.data.map(function(hour) {
    var utcSeconds = hour.time;
    var d = new Date(0);
    d.setUTCSeconds(utcSeconds);
    if (d.getHours() < 10) {
      return "0"+d.getHours().toString()+":00";
    } else {
      return d.getHours().toString()+":00";
    }
  });
  var hourTemperatures = weatherData.hourly.data.map(function(hour) {
    return Math.round(hour.temperature)
  });
  var maxTemp = Math.max.apply(null, hourTemperatures);
  var minTemp = Math.min.apply(null, hourTemperatures);
  var config = {
    type: 'line',
    data: {
      labels: hourLabels,
      datasets: [
        {
          label: "Linear interpolation",
          data: hourTemperatures,
          borderColor: "#566197",
          backgroundColor: '#566197',
          fill: true,
          cubicInterpolationMode: 'monotone',
        }
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      tooltips: false,
      scales: {
        yAxes: [{
          display: false,
          ticks: {
            min: (minTemp - 5),
            max: (maxTemp + 5),
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: "#7780ad",
          }
        }]
      },
      animation: {
        onComplete: function() {
          var ctx = this.chart.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';

          this.data.datasets.map(function(dataset) {
            for (var i = 0; i < dataset.data.length; i++) {
              var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
              ctx.fillStyle = '#7780ad';
              var label = dataset.data[i];
              ctx.fillText(label, model.x - 8, model.y - 8);
            }
          });
        }
      },
    },
  };
  return config;
}
var ctx = document.getElementById("myChart1").getContext("2d");
// var chart = new Chart(ctx, config);
var chart = axios.get(weatherurl).then(function(response) {
  var chart = new Chart(ctx, chartConfig(response.data));
  console.log(chart.chart.options.scales.xAxes);
  return chart;
});
