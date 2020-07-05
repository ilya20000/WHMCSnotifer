var prioritys = '';

if (typeof localStorage.cp_inferno == 'undefined' ) {
	var foo = {urls:''};
	foo.urls = [];
	foo.prioritys = [];
	foo.names = [];
	foo.statuses = [];
	foo.my = []; // для отслеживаемых
	foo.myanswered = []; // для отвечен или нет
	localStorage.cp_inferno = JSON.stringify(foo);
}


var cp_inferno = JSON.parse(localStorage.cp_inferno);
/*if (typeof cp_inferno.urls == 'undefined' ) {
	cp_inferno.urls = [];
	cp_inferno.urls.push('d');
	cp_inferno.prioritys = [];
	cp_inferno.names = [];
	cp_inferno.statuses = [];
	console.log('ыыыыыы', cp_inferno);
}
*/
function sec() //выполняется при загрузке страницы
{ 
	
	if(location.href == "https://cp.inferno.name/admin/supporttickets.php" || location.href == "https://cp.inferno.name/admin/supporttickets.php?filter=1" ){
		//статус
		statuses = $("#sortabletbl2 > tbody > tr > td:nth-child(6) > span");
		
		//priority приоритет тикета
		prioritys = $("#sortabletbl2 > tbody > tr > td:nth-child(2) > img[alt]");

		// urls тикетов
		urls = $("#sortabletbl2 > tbody > tr > td:nth-child(4) > a[href]");
		
		// names название тикета
		names = $("#sortabletbl2 > tbody > tr > td:nth-child(4) > a");
		var msg = '';
		for (var i = statuses.length - 1; i >= 0; i--) {
			
			var checkUrls = urls[i].href;
			// ищем url в базе
			var oldid_id = cp_inferno.urls.indexOf(checkUrls, 0);
			
			//  если найден
			if ( oldid_id > -1 ){
				//alert('index='+oldid_id);
				cp_inferno.statuses[oldid_id] = statuses[i].innerText; // обновим статус
				console.log('Обновили=', statuses[i].innerText);
				// ищем в Отслеживаемых
				oldid_id = cp_inferno.my.indexOf(checkUrls, 0);
				//alert('myindex='+oldid_id);
				if ( oldid_id > -1 ){
					if(cp_inferno.myanswered[oldid_id] == 'answered'){
						cp_inferno.myanswered[oldid_id] = 'clientanswered';
						msg = msg + '🛎✏️Ответ '+names[i].innerText+' \n\r'+checkUrls+' \n\r';
						msg = msg.replace(/\&/g, "%26");
						msg = msg.replace(/\#/g, "");
						$.get('https://pushmebot.ru/send?key=46c4d1f2b97df24fe0f5f5bdd726c36f&message='+msg);
						msg ='';
					}
				}
			}else{
				
				if( statuses[i].innerText == "Открыт"){
					// если новый
					cp_inferno.urls.push(checkUrls);
					cp_inferno.prioritys.push(prioritys[i].alt);
					var temp = names[i].innerText;
					temp = temp.replace(/\#/g, " ");
					//console.log('------',temp);
					cp_inferno.names.push(temp);
					cp_inferno.statuses.push(statuses[i].innerText);
					msg = msg + 'NEW '+ prioritys[i].alt +'\n\r<br>'+ temp + '<br>\n\r<br>' + checkUrls + '<br>\n\r\n\r<br>';
					msg = encodeURI(msg);
					msg = msg.replace(/\&/g, "%26");
					$.get('https://pushmebot.ru/send?key=46c4d1f2b97df24fe0f5f5bdd726c36f&message='+msg);
					msg ='';
				}//if
			}//else
			
		}//for
	
		//cp_inferno.myanswered = []; ///////.......убрать
		//cp_inferno.my = []; ///////.......убрать
		localStorage.cp_inferno = JSON.stringify(cp_inferno);
	}else{
		console.log("Url не тот");
		findButton();
	}
}			 	

function findButton(){
	$("#postreplybutton").attr("style","color:red;");
	$("#postreplybutton").click(function () {

    	//Добавим в отслеживаемые
    	var cp_inferno = JSON.parse(localStorage.cp_inferno);
    	var id_url = cp_inferno.my.indexOf(location.href, 0);
    	//alert("idindex="+id_url);
    	if ( id_url > -1 ) {
    		console.log('Уже слежу за этим url');
    		//alert("уже слежу");
    		cp_inferno.myanswered[id_url] = 'answered';
    	}else{
    		cp_inferno.my.push(location.href);
    		cp_inferno.myanswered.push('answered');
    		//alert("добавил новый");
    	}

    	localStorage.cp_inferno = JSON.stringify(cp_inferno);
	});
	
}

sec();

//setInterval(sec, 5000);// запускать функцию каждую секунду