// Get a reference to the root of the chat data.
var requestRef = new Firebase('https://intense-fire-7795.firebaseio.com/Request');
var lineOptions = {
	animation : false,
}
var times = [];
var reqData = new Array(3600+1).join('0').split('').map(parseFloat);
var data = {
	labels: times,
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
		/**
		{
			label: "My Second dataset",
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 
				   81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 
				   40, 65, 59, 80, 81, 56, 55, 40 ,65, 59, 
				   65, 59, 80, 81, 56, 55, 40, 65, 59, 80,
				   65, 59, 80, 81, 56, 55, 40, 65, 59, 80,
				   65, 59, 80, 81, 56, 55, 40, 65, 59, 80]
		}
		**/
	]
};

// When user presses the button, data is pushed to the server
function submit() {
	var d = getDateTime();
	var r = requestRef.push({Date:d});
}

//Add a callback that is triggered for each chat message.
requestRef.on('child_added', function (snapshot) {
	var d = snapshot.val();
	for (i = 0; i < times.length; i++){
		if (d.Date.substring(11,16) == times[i]){
			reqData[i]++;
		}
	}
	refresh();
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
	var currentSecond  = now.getSeconds();
	var hour;
	var minute;
	var second;
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
	if (currentSecond == 59) {
		second = 0;
	} else {
		second = currentSecond + 1;
	}
	for (i = 0; i < 3600; i++) {
		if (hour.toString().length == 1){
			var hour = '0'+hour;
		}
		if(minute.toString().length == 1) {
			var minute = '0'+minute;
		}
		if (second.toString().length == 1){
			var second = '0'+second;
		}
		times[i] = hour + ":" + minute + ":" + second;
		if (second == 59) {
			second = 00;
			if (minute == 59) {
				minute = 00;
				if (hour == 23) {
					hour = 0;
				} else {
					hour ++;
				}
			} else {
				minute ++;
			}
		} else {
			second ++;
		}
	}
}

function refresh() {
	getTimeArray();
	var context = document.getElementById("chartCanvas").getContext("2d");
	$('#chartCanvas').attr("width",$(window).width());
    $('#chartCanvas').attr("height",$(window).height()*.97);
	var requests = new Chart(context).Line(data,lineOptions);
}

setInterval(function() {
	var now = new Date();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	if (hour.toString().length == 1){
		var hour = '0'+hour;
	}
	if(minute.toString().length == 1) {
		var minute = '0'+minute;
	}
	if(second.toString().length == 1){
		var second = '0'+second;
	}
	times.push(hour + ":" + minute);
	times.shift();
	reqData.push(0);
	reqData.shift();
	refresh();
}, 1000);

window.onload = refresh;
window.onresize = refresh;

