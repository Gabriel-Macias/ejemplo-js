/*
	Function to get the index of the smallest element in an array with earthquake API objects
*/

function argMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0].magnitude;
    var minIdx = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i].magnitude < min) {
            minIdx = i;
            min = arr[i].magnitude;
        }
    }

    return minIdx;
}

/*
	Function to get the top 10 earthquakes around the world in the past 12 months
*/

function top10() {

	var limitDate = new Date();
	const currYear = limitDate.getFullYear();
	limitDate.setFullYear(currYear - 1);

	const minMag = 6;
	const maxRows = 100;
	const APIurl = `https://cors-anywhere.herokuapp.com/http://api.geonames.org/earthquakesJSON?username=Lorius2&maxRows=${maxRows}&minMagnitude=${minMag}&date=${currYear}-12-31`;
	const bbUrl = "&north=71.3&south=-42&east=-114&west=61";

	fetch(APIurl + bbUrl, { headers: {"X-Requested-With": "topEarthquakes"} })
	.then((response) => response.json())
	.then(function(data) {

		// Get top 10 earthquakes
		var i, j, date, minIdx;
		var dataArr = [];

		for (i = 0; i < data.earthquakes.length; i++) {
			date = new Date(data.earthquakes[i].datetime);
			if (date >= limitDate){

				// First get the first 10 earthquakes
				if (dataArr.length < 10){
					dataArr[i] = data.earthquakes[i];

				} else {
					// Once we have 10 replace the smallest earthquake with another if it's bigger
					minIdx = argMin(dataArr);
					if (data.earthquakes[i].magnitude > dataArr[minIdx].magnitude){
						dataArr[minIdx] = data.earthquakes[i];
					}
				}
			}
		}

		// Sort the top 10 earthquakes by magnitude
		dataArr = dataArr.sort((a,b) => (a.magnitude > b.magnitude) ? -1 : ((b.magnitude > a.magnitude) ? 1 : 0));

		// Display the top 10 earthquakes into a table
		var contentDiv = document.getElementById("tableDiv");

		// Create a title for the table
		var header = document.createElement("h2");
		header.appendChild(document.createTextNode("Top 10 Earthquakes Worldwide This Year"));
		contentDiv.appendChild(header);

		// Information to be included in the table
		var tableVars = ["datetime", "magnitude", "lat", "lng"];

		// Insert the information into the table
		var td, tr, th, txt;
		var tbl = document.createElement("table");
		tbl.style.width = "100%";
		tbl.setAttribute("border", "1");
		var tbdy = document.createElement("tbody");

		// Table titles
		tr = document.createElement("tr");
		for (i = 0; i < tableVars.length; i++){
			th = document.createElement("th");
			txt = tableVars[i].charAt(0).toUpperCase() + tableVars[i].substr(1).toLowerCase();
			th.appendChild(document.createTextNode(txt));
			tr.appendChild(th)
		}

		tbdy.appendChild(tr);

		// Table content
		for (i = 0; i < dataArr.length; i++) {

			tr = document.createElement("tr");

			for (j = 0; j < tableVars.length; j++) {
				td = document.createElement("td");
			    td.appendChild(document.createTextNode(dataArr[i][tableVars[j]]))
			    tr.appendChild(td)
			}

			tbdy.appendChild(tr);

		}

		tbl.appendChild(tbdy);
		contentDiv.appendChild(tbl)

	})
	.catch(function(err) {
		console.log(err);
		//alert("There was an error with the request. Verify the location name and try again.");
	})
}

top10();