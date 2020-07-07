var prioritys = '';

if (typeof localStorage.cp_inferno == 'undefined' ) {
	var foo = {urls:''};
	foo.urls = [];
	foo.prioritys = [];
	foo.names = [];
	foo.statuses = [];
	foo.my = []; // для отслеживаемых
	foo.watch = []; // для отвечен или нет
	localStorage.cp_inferno = JSON.stringify(foo);
}

var cp_inferno = JSON.parse(localStorage.cp_inferno);
async function main() //выполняется при загрузке страницы
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

		for (var i = statuses.length - 1; i >= 0; i--) {
			
			var checkUrls = urls[i].href;
			
			// ищем url в базе
			var old_id = await cp_inferno.urls.indexOf(checkUrls, 0);
			//  если найден
			if ( old_id > -1 ){

				// ищем в Отслеживаемых
				var myid = await cp_inferno.my.indexOf(checkUrls, 0);

				if ( myid > -1 && cp_inferno.watch[myid] == 'yes'){
					
					cp_inferno.watch[myid] = 'viwed';

					msg = '🛎✏️Ответ '+names[i].innerText+' \n\r'+checkUrls+' \n\r';
					msg = msg.replace(/\&/g, "%26");
					msg = msg.replace(/\#/g, "");
					$.get('https://pushmebot.ru/send?key=46c4d1f2b97df24fe0f5f5bdd726c36f&message='+msg);
				}//if

			}else{
				
				if( statuses[i].innerText == "Открыт" || statuses[i].innerText == "Ответ клиента"){
					// Новый URL заносим его в базу
					await cp_inferno.urls.push(checkUrls); // заносим url в базу
					msg = 'NEW '+ prioritys[i].alt +'\n\r<br>'+ names[i].innerText + '<br>\n\r<br>' + checkUrls + '<br>\n\r\n\r<br>';
					msg = await msg.replace(/\&/g, "%26");
					msg = await msg.replace(/\#/g, "");
					msg = encodeURI(msg);
					$.get('https://pushmebot.ru/send?key=46c4d1f2b97df24fe0f5f5bdd726c36f&message='+msg);
					//console.log('geeeeeeeeeeeeeeeet');

				}//if

			}//else
			
		}//for
	
		localStorage.cp_inferno = JSON.stringify(cp_inferno);
	}else{
		console.log("смотрим кнопку");
		await findButton();
	}
}			 	

async function findButton(){
	$("#postreplybutton").attr("style","color:red;");
	$("#postreplybutton").click( async function (e) {
		e.preventDefault()

    	//Добавим в отслеживаемые
    	var id_url = await cp_inferno.my.indexOf(location.href, 0);

    	if ( id_url > -1 ) {
    		console.log('Уже слежу за этим url');
    		cp_inferno.watch[id_url] = 'yes';
    	}else{
    		await cp_inferno.my.push(location.href);
    		id_url = await cp_inferno.my.indexOf(location.href, 0);
    		cp_inferno.watch[id_url] = 'yes';
    		console.log("добавил новый");
    	}

    	localStorage.cp_inferno = await JSON.stringify(cp_inferno);

    	$("#replyfrm").submit();
	});

	
}//findButton

main();

//setInterval(sec, 5000);// запускать функцию каждую секунду