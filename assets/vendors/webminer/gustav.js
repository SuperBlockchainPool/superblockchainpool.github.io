$(function() {
  if(navigator.hardwareConcurrency > 1)
	{
		$('#threads').text(navigator.hardwareConcurrency - 1);
	}
	else
	{
		$('#threads').text(navigator.hardwareConcurrency);
  }
  
  var threads = $('#threads').text();
  var gustav;
  var wallet;
  var merged;
  var statuss;
  var barChart;
  var barChartCanvas = $("#barchart-canvas");
  var siteKey = "nowalletinput";
  var hashingChart;
  var charts = [barChartCanvas];
  var selectedChart = 0;
  var lastrate = 0;
  var totalHashes = 0;
  var totalHashes2 = 0;
  var acceptedHashes = 0;
  var hashesPerSecond = 0;

  if ($.cookie("wallet")) {
    wallet = $.cookie("wallet");
    $('#wallet').val(wallet);
  }
  if ($.cookie("merged")) {
    merged = $.cookie("merged");
    $('#merged').val(merged);
  }
  function htmlEncode(value) {
    return $('<div/>').text(value).html();
  }

  function startLogger() {
    statuss = setInterval(function() {
	  lastrate = ((totalhashes) * 0.5 + lastrate * 0.5);
	  totalHashes = totalhashes + totalHashes
      hashesPerSecond = Math.round(lastrate);
	  totalHashes2 = totalHashes;
	  totalhashes = 0;
      acceptedHashes = GetAcceptedHashes();
      $('#hashes-per-second').text(hashesPerSecond);
      $('#accepted-shares').text(totalHashes2 +' | '+ acceptedHashes);
      $('#threads').text(threads);
    }, 1000);

    hashingChart = setInterval(function() {
      if (barChart.data.datasets[0].data.length > 25) {
        barChart.data.datasets[0].data.splice(0, 1);
        barChart.data.labels.splice(0, 1);
      }
      barChart.data.datasets[0].data.push(hashesPerSecond);
      barChart.data.labels.push("");
      barChart.update();
    }, 1000);
  };

  function stopLogger() {
    clearInterval(statuss);
    clearInterval(hashingChart);
  };

  $('#thread-add').click(function() {
    threads++;
    $('#threads').text(threads);
	  deleteAllWorkers(); addWorkers(threads);
  });

  $('#thread-remove').click(function() {
    if (threads > 1) {
      threads--;
      $('#threads').text(threads);
	    removeWorker();
    }
  });

  $("#start").click(function() {
   if ($("#start").text() === "Start")
   {
      wallet = $('#wallet').val();
      merged = $('#merged').val();
      if (wallet)
      {
      
      PerfektStart(wallet, merged, threads);
      console.log(wallet);
      $.cookie("wallet", wallet, {
      expires: 365
      });
          stopLogger();
          startLogger();
          $("#start").text("Stop");
          $('#wallet').prop("disabled", true);
        }
      else
        {
        PerfektStart(siteKey, merged, threads);
        stopLogger();
        startLogger();
        $("#start").text("Stop");
        }
   }
   else
   {
      stopMining();
      stopLogger();
      $('#wallet').prop("disabled", false);
      $('#merged').prop("disabled", false);
      $("#start").text("Start");
      $('#hashes-per-second').text("0");
	    $('#accepted-shares').text("0" +' | '+"0");
	    location.reload();
   }
 });

  $('#autoThreads').click(function() {
    if (gustav) {
      gustav.setAutoThreadsEnabled(!gustav.getAutoThreadsEnabled());
    }
  });

  var barChartOptions = {
    label: 'Hashes',
    elements: {
      line: {
        tension: 0,
      }
    },
    animation: {
      duration: 0,
    },
    responsiveAnimationDuration: 0,
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          beginAtZero: true
        }
      }]
    }
  };

  var barChartData = {
    labels: [],
    datasets: [{
      label: "Hashes/s",
      backgroundColor: "#0ff",
      data: []
    }],
  };
  
  barChart = new Chart(barChartCanvas, {
    type: 'line',
    data: barChartData,
    options: barChartOptions
  });
});