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

                initDatatableData();
//                var datatable = $('#results').DataTable({
//                    data: window.datatable_data
//                });

                window.datatable = $('#results').DataTable({
                    data: window.datatable_data,
                    columnDefs: [
                        {
                            targets: 0,
                            render: function(data, type, row) {
                                var isStatistics = !(data instanceof Array);

                                if (isStatistics) {
                                    var result = data;
                                } else {
                                    var result = data[2]+'<div class="row"><div class="col-xs-12">';
                                    result += '<a class="btn btn-primary" href="https://www.virustotal.com/it/file/'+data[2]+'/analysis/"><i class="fa fa-cloud-download"></i> VT Report</a>';
                                    result += '</div></div><div class="row"><div class="col-xs-12">';
                                    result += '<a class="btn btn-primary" href="http://detect.ransom.mobi/fetch-scan?hash='+data[1]+'""><i class="fa fa-info"></i> Analysis result</a>';
                                    result += '</div></div>';
                                    result += '</div></div><div class="row"><div class="col-xs-12">';
                                    result += '<a class="btn btn-primary" href="http://detect.ransom.mobi/fetch-apk?family='+data[0]+'&hash='+data[2]+'""><i class="fa fa-download"></i> Analysis result</a>';
                                    result += '</div></div>';
                                }
                                return result;
                            }
                        }
                    ],
                    initComplete: function () {
                                this.api().columns([1, 2, 3, 6, 7, 8, 9, 11, 13]).every( function () {
                                    // Skip if family == statistics
                                    if (text == 'statistics')
                                        return;
                                    var column = this;
                                    var select = $('<select><option value=""></option></select>')
                                        .appendTo( $(column.footer()).empty() )
                                        .on( 'change', function () {
                                            var val = $.fn.dataTable.util.escapeRegex(
                                                $(this).val()
                                            );
                     
                                            column
                                                .search( val ? '^'+val+'$' : '', true, false )
                                                .draw();
                                        } );
                                    column.data().unique().sort().each( function ( d, j ) {
                                        select.append( '<option value="'+d+'">'+d+'</option>' )
                                    } );
                                } );
                            }
                });

                // Load pie chart if the loaded page is statistics
                if (text == "statistics") {
                    // Prepare points
                    points = []
                    // total = 0
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

                    total = 0;
                    datatable.data().each(function(val) {
                        total += parseInt(val[8]);
                    });

                    console.log(total)

                    var unknown = total;

                    $(points).each(function(index, elem) {
                        unknown -= elem.y;
                    });

                    /*
                     * Uncomment to include samples with no
                     * threatening text inside the pie chart
                     */
                    // points.push({
                    //     label: "no text detected",
                    //     y: unknown
                    // })

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
     
});
