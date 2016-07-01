function beforeAjax() {
	// clear table data
	$('#results thead').empty();
	$('#results tbody').empty();

	// Set loading message
	$('#loading').text('Loading...');
}

$(function($) {

    // Handle navbar pills click
	$("#mainmenu > li > a").click(function(e) {
        // Hide error message
        if ($("#error").is(":visible")) {
            $("#error").hide()
        }
        
        // Show "loading" label
        $('#loading').show()
        
        $('#placeholder').empty()
        
		// Get the family name
        var text = $(this).text().toLowerCase();
        
        // Load data from the other page
        $("#placeholder").load(text+".html", function(a, b, c){
            // Will be executed AFTER loading done            
            $("#lastUpdate").text(c.getResponseHeader("last-modified") || 'date not found')
            
            if (c.status != 200) {
                $("#error").empty().text("Error "+c.status).show()
            } else {
                // Load pie chart if the loaded page is statistics
                if (text == "statistics") {
                    // Prepare points
                    points = []
                    total = 0
                    for (var prop in langs) {
                        if (langs.hasOwnProperty(prop)) {
                            if (prop == "null") {
                                labelValue = "unknown"
                            } else {
                                labelValue = prop
                            }

                            points.push({
                                label: labelValue,
                                y: langs[prop]
                            });
                        }
                    }

                    // Count total samples
                    $("#results tr td:nth-child(9)").each(function(index, elem) {
                        total += parseInt($(elem).text());
                    });

                    console.log(total)

                    $(points).each(function(index, elem) {
                        total -= elem.y;
                    });

                    points.push({
                        label: "no text detected",
                        y: total
                    })

                    CanvasJS.addCultureInfo("it", {
                        decimalSeparator: ",",
                        digitGroupSeparator: "\'"
                    });

                    // Load pie chart
                    var chart = new CanvasJS.Chart("chart-container", {
                        theme: "theme1",
                        culture: "it",
                        title: {
                            text: "Languages"
                        },
                        axisX: {
                            title: "Pages"
                        },
                        animationEnabled: true,
                        data : [{
                            type: "pie",
                            showInLegend: true,
                            legendText: "{label}",
                            toolTipContent: "{label}: {y} (#percent%)",
                            dataPoints: points
                        }]
                    });

                    chart.render();
                }
                loadDatatableData();
            }
            
            // Hide "loading" label
            $("#loading").hide()
        });

        /*

        // Perform AJAX request
		$.ajax({
			beforeSend: beforeAjax,
			dataType: "json",
			url: 'file_retriever.php',
			data: {family: text}
		})
        // success
		.done(function(data) {
			$('#loading').empty();
			var table = $("#results");
			var lastUpdate = data.updated;

			var date = new Date(lastUpdate*1000);

			$('#lastUpdate').text(date);

			var arrayData = data.data;
			$.each(arrayData, function(i, item) {
				if (i==0) {
					var father = table.find('thead');
				} else {
					father = table.find('tbody');
				}

				var tr = $('<tr>');
				$.each(item, function(j, jitem) {
					tr.append($("<td>").text(jitem));
				});

				father.append(tr);
				table.append(father);
			});
		})
        // error
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		});
        
        */
	});

	// load first pill data when the page is loaded
	$("#mainmenu > li > a").first().click();
     
        $('#results').DataTable({
            data: window.datatable_data
        });
});
