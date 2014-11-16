// Get a reference to the root of the chat data.
var requestRef = new Firebase('https://intense-fire-7795.firebaseio.com/Request');
var times = [];
var reqData = new Array(60+1).join('0').split('').map(parseFloat);
var appData = new Array(61+1).join('0').split('').map(parseFloat);

var lineOptions = {
	animation : false,
	pointDotRadius : 3,
	bezierCurveTension : 0.3,
}

var data = {
	labels: times,
	axisY:{title: "Power (kW)"},
	datasets: [
		{
			label: "Requests", 
			fillColor: "rgba(220,220,220,0.2)",
			strokeColor: "rgba(220,220,220,1)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(220,220,220,1)",
			data: reqData
		},
		{
			label: "Approved",
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: appData
		}
	]
};

// When user presses the button, data is pushed to the server
function submit() {
	var d = getDateTime();
	var p = (Math.random()*10 + 1).toFixed(2);
	requestRef.push({Date:d, Power:p});
}

//Add a callback that is triggered for each chat message.
requestRef.on('child_added', function (snapshot) {
	var d = snapshot.val();
	for (i = 0; i < times.length; i++){
		if (d.Date.substring(11,16) == times[i]){
			reqData[i] = reqData[i] + parseInt(d.Power);
		}
	}
	for (i = 1; i < times.length; i++){
		if (d.Date.substring(11,16) == times[i]){
			if ((appData[i] < appData[i-1] * 1.1) || (appData[i-1] == 0 && Math.random() < .5)) {
				appData[i] = appData[i] + parseInt(d.Power);
			} else {
				appData[i+1] = appData[i+1] + parseInt(d.Power);
			}
		}
	}
	refresh();
});

$(document).keypress(function (e) {
        if (e.keyCode == 99) {
			window.location.href = 'menu.html';
        }
      });
	  
function getDateTime() {
	var now     = new Date(); 
	var year    = now.getFullYear();
	var month   = now.getMonth()+1; 
	var day     = now.getDate();
	var hour    = now.getHours();
	var minute  = now.getMinutes();
	var second  = now.getSeconds(); 
	if(month.toString().length == 1) {
		var month = '0' + month;
	}
	if(day.toString().length == 1) {
		var day = '0' + day;
	}   
	if(hour.toString().length == 1) {
		var hour = '0' + hour;
	}
	if(minute.toString().length == 1) {
		var minute = '0' + minute;
	}
	if(second.toString().length == 1) {
		var second = '0' + second;
	}   
	var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
	return dateTime;
}

function getTimeArray() {
	var now = new Date(); 
	var currentHour    = now.getHours();
	var currentMinute  = now.getMinutes();
	var hour;
	var minute;
	if (currentHour == 0) {
		hour = 23;
	} else {
		hour = currentHour - 1;
	}
	if (currentMinute == 59) {
		minute = 0;
	} else {
		minute = currentMinute + 1; 
	}
	for (i = 0; i < 60; i++) {
		if (hour.toString().length == 1){
			var hour = '0'+hour;
		}
		if(minute.toString().length == 1) {
			var minute = '0'+minute;
		}
		times[i] = hour + ":" + minute;
		if (minute == 59) {
			minute = 00;
			if (hour == 23) {
				hour = 0;
			} else {
				hour ++;
			}
		} else {
			minute++;
		}
	}
}

function pushArrays() {
	
}

function refresh() {
	getTimeArray();
	var context = document.getElementById("chartCanvas").getContext("2d");
	$('#chartCanvas').attr("width",$(window).width()*0.99);
    $('#chartCanvas').attr("height",$(window).height());
	var requests = new Chart(context).Line(data,lineOptions);
}

setInterval(function() {
	if (new Date().getSeconds() == 0){
		var now = new Date();
		var hour = now.getHours();
		var minute = now.getMinutes();
		if (hour.toString().length == 1){
			var hour = '0'+hour;
		}
		if(minute.toString().length == 1) {
			var minute = '0'+minute;
		}
		times.push(hour + ":" + minute);
		times.shift();
		reqData.push(0);
		reqData.shift();
		appData.push(0);
		appData.shift();
		refresh();
	}
}, 1000);

window.onload = refresh;
window.onresize = refresh;
window.onclick = submit;

