$(document).ready(function() {
	let data = null;

	//parse CSV data with papaparse
	Papa.parse('data.csv', {
	  header: true,
	  download: true,
	  dynamicTyping: true,

	  // fire callback after parsing data
		complete: function(results) {

			// hide the loader and clean data
		  $('.loader-wrapper').hide();
  	  data = results.data.filter(d => String(d['Measurement date']).includes('12:00'));

		  // use chart themes and animation
	    am4core.useTheme(am4themes_kelly);
			am4core.useTheme(am4themes_animated)

	    // chart init
	    let chart = am4core.create("chartdiv", am4charts.XYChart);

	    // Add data
			chart.data = data;

			// define X axis to be date and configure it
			let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.title.text = "Date";
			dateAxis.groupData = true;
			dateAxis.groupCount = 100;
			dateAxis.dateFormats.setKey("month", "MMM-yy");
			dateAxis.dateFormats.setKey("day", "dd-MMM-yy");
			dateAxis.periodChangeDateFormats.setKey("month", "MMM-yy");

			// define Y axis to be ppm value
			var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.title.text = "PPM";

			// define function to create and plot series of data connecting X,Y coords on chart
			function createSeries(field, name) {
			  var series = chart.series.push(new am4charts.LineSeries());
			  series.dataFields.valueY = field;
			  series.dataFields.dateX = "Measurement date";
			  series.name = name;
			  series.tooltipText = "Date: {dateX.formatDate('dd-MMM-yy')}\nStation: {Station code}\nPPM: {valueY}"
			  series.strokeWidth = 2;
			  series.tooltip.pointerOrientation = "vertical";
				series.tooltip.background.fillOpacity = 0.5;
				var bullet = series.bullets.push(new am4charts.CircleBullet());
				bullet.circle.radius = 3;
			}

			//plot line series data
			createSeries("CO", "CO2 Data");
			createSeries("O3", "O3 data");
			createSeries("NO2", "NO2 data");
			createSeries("SO2", "SO2 data");

			// define chart legend
			chart.legend = new am4charts.Legend();

			//define chart hoverable tootlip cursor
			chart.cursor = new am4charts.XYCursor();

			//create and customize scrollbar to go forward and backward in data
			var scrollbarX = new am4core.Scrollbar();
			scrollbarX.marginBottom = 30;
			chart.scrollbarX = scrollbarX;
			chart.scrollbarX.background.fill = am4core.color("#dc67ab");
			chart.scrollbarX.background.fillOpacity = 0.2;
			chart.scrollbarX.thumb.background.fill = am4core.color("#67dcab");
			chart.scrollbarX.thumb.background.fillOpacity = 0.2;
			chart.scrollbarX.startGrip.icon.disabled = true;
			chart.scrollbarX.endGrip.icon.disabled = true;
			chart.scrollbarX.endGrip.background.fill = am4core.color("#ccc");
			chart.scrollbarX.startGrip.background.fill = am4core.color("#ccc");

			//initialize calendar
			$('.ui.calendar').calendar({
			  type: 'date',
			  startMode: 'year',
			  minDate: new Date('2017-01-01'),
			  maxDate: new Date('2019-12-31')
			});

			// data search funtionality 
			$('.searchBtn').click(function(e){
				e.preventDefault();
				$('#error-message').css('display', 'none');
				let stDate = new Date($('#stDate').val() || '2017-01-01 12:00');
				let enDate = new Date($('#enDate').val() || '2019-12-31 12:00');
				let station = +$('#station').val() || 101;

				// if invalid date show error message and end function
				if(stDate > enDate || enDate < stDate) {
					$('#error-message').css('display', 'block');
					return;
				}

				// filter data based on search criteria
				const filteredData = data.filter(d => {
					const date = new Date(String(d['Measurement date']).replace(/\d\d:\d\d/, '00:00'));
					return (date >= stDate && date <= enDate) && d['Station code'] === station
				});

				// reassign new chart data
				chart.data = filteredData;

				//repaint the chart
				chart.validateData();
			});

	  }//papa parse read callback end  
	})//papa parse options obj
});//DOM ready event end








































