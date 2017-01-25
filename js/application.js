// our application constructor
function application () {
}

application.prototype.displayErrorMessage = function(message) {
	$('#deal-list').html(message);
	$('#deal-sum').html(message);
}

application.prototype.chooseCurrentMonth = function() {
	var curmonth = new Date().getMonth();
	$('#select').val(curmonth.toString());
}

application.prototype.displayCurrentUser = function(selector) {
	BX24.callMethod('user.current', {}, function(result){
		$(selector).html(result.data().NAME + ' ' + result.data().LAST_NAME);
	});
}

application.prototype.displayLeads = function (month) {

	dealHTML = '';
	
	var curapp = this;
	var host = 'https://fmc24.bitrix24.ru';
	
	BX24.callMethod(
		"crm.lead.list", 
		{ 
			order: { "DATE_CREATE": "ASC" },
			filter: {},
			select: [ "ID", "TITLE", "BIRTHDATE"]
		}, 
		function(result) 
		{
			if (result.error()) {
                curapp.displayErrorMessage('An error occured, please try again later!');
				console.error(result.error());
			}
			else
			{
				var selecteddate = $('#select').find(":selected").val();
				var data = result.data();
				var theday = 0;
				var nowmonth = parseInt(selecteddate);
				for (indexDeal in data) {
					theday = new Date(data[indexDeal].BIRTHDATE).getMonth();
					if(nowmonth == theday) {
					dealHTML += '<tr><th scope="row">' + data[indexDeal].ID + '</th><td><a href="'+ host +'/crm/lead/show/'+ data[indexDeal].ID +'/">' + data[indexDeal].TITLE +'</a></td><td>'
						+  data[indexDeal].BIRTHDATE.substring(0,10) + '</td></tr>';
					}
				}
							
				if (result.more())
					result.next();
				else {
					$('#deal-list').html(dealHTML);
				}
					
			}
		}
	);
}

// create our application
app = new application();
