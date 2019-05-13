const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],	
	months = ["January", "February", "March", "April", "May", "June", "July",
		"August", "September", "October", "November", "December"];

const checkChar = (input) => {
	switch (input) {
		case 1:
			return 'st';

		case 2:
			return 'nd';

		case 3:
			return 'rd';

		default:
			return 'th';
	}
};

const checkSecondChar = (input) => {
	switch (input) {
		case '1':
			return 'st';

		case '2':
			return 'nd';

		case '3':
			return 'rd';

		default:
			return 'th';
	}
};

const checkChars = (an_array) => {
	switch (an_array[0]) {
		case '1':
			return an_array[0] + '' + an_array[1] + 'th';

		default:
			return an_array[0] + '' + an_array[1] + checkSecondChar(an_array[1]);
	}
};

const suffix = (input) => {
	const temp = [],
		string = new String(input).trim();

	for (let i = 0; i < string.length; i++) {
		temp.push(string.charAt(i));
	}

	switch (temp.length) {
		case 1:
			return input + '' + checkChar(input);

		case 2:
			return checkChars(temp);
	}

};

const time = () => {
	const d = new Date(),
		seconds = null,
		minutes = null,
		hours = null;
	
	switch (d.getSeconds()) {
		case 0:
			seconds = '00';
			break;
		case 1:
			seconds = '01';
			break;
		
		case 2:
			seconds = '02';
			break;
			
		case 3:
			seconds = '03';
			break;
			
		case 4:
			seconds = '04';
			break;
			
		case 5:
			seconds = '05';
			break;
			
		case 6:
			seconds = '06';
			break;
			
		case 7:
			seconds = '07';
			break;
			
		case 8:
			seconds = '08';
			break;
			
		case 9:
			seconds = '09';
			break;
			
		default:
			seconds = d.getSeconds();
			break;
	}
	
	switch (d.getMinutes()) {
		
		case 0:
			minutes = '00';
			break;
		case 1:
			minutes = '01';
			break;
		
		case 2:
			minutes = '02';
			break;
			
		case 3:
			minutes = '03';
			break;
			
		case 4:
			minutes = '04';
			break;
			
		case 5:
			minutes = '05';
			break;
			
		case 6:
			minutes = '06';
			break;
			
		case 7:
			minutes = '07';
			break;
			
		case 8:
			minutes = '08';
			break;
			
		case 9:
			minutes = '09';
			break;
			
		default:
			minutes = d.getMinutes();
			break;
	}
	
	switch (d.getHours()) {
		
		case 0:
			hours = '00';
			break;
		case 1:
			hours = '01';
			break;
		
		case 2:
			hours = '02';
			break;
			
		case 3:
			hours = '03';
			break;
			
		case 4:
			hours = '04';
			break;
			
		case 5:
			hours = '05';
			break;
			
		case 6:
			hours = '06';
			break;
			
		case 7:
			hours = '07';
			break;
			
		case 8:
			hours = '08';
			break;
			
		case 9:
			hours = '09';
			break;
			
		default:
			hours = d.getHours();
			break;
	}
	
	return `${hours}:${minutes}:${seconds}`;
};

const date = () => {
	var d = new Date();
	var date = days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + suffix(d.getDate('Greenwich Mean Time')) + ' ' + d.getFullYear();
	return `${days[d.getDay()]} ${months[d.getMonth()]} `;
};

const stamp = () => {
	return '<b class="datetimestamp">' + date() + '  ' + time() + '</b>';
};
