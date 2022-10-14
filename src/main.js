function LoadConfig(){
	for(var i=1;i<=3;++i) {
		LoadCardXml(i)
	}
	var url = window.location.href;
	alert("显示1：" + url);
	var url = window.location.pathname;
	alert("显示2：" + url);
}

function LoadCardXml(index){
	var xmlFile = "https://dkttlong.github.io/1/cards/"+index+".xml"
	var xmldoc=loadXML(xmlFile);

	//获得根节点
	var cards=xmlDoc.getElementsByTagName("Card");
	for(var i=0;i<cards.length;i++) {
		var ID=cards[i].getAttribute("ID");
		var SetNo=cards[i].getAttribute("SetNo");
		var Name=cards[i].getAttribute("Name");
		var Color=cards[i].getAttribute("Color");
		var Type=cards[i].getAttribute("Type");
		var Level=cards[i].getAttribute("Level");
		var Power=cards[i].getAttribute("Power");
		var Life=cards[i].getAttribute("Life");
		var Rarity=cards[i].getAttribute("Rarity");
		var RulesText=cards[i].getAttribute("RulesText");
		var UpLvlCardId=cards[i].getAttribute("UpLvlCardId");
		var NpcAIFlag=cards[i].getAttribute("NpcAIFlag");
	}
	// alert("显示卡牌：" + cards.length);
}

function loadXML(xmlFile){
	if (window.XMLHttpRequest){
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else{// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",xmlFile,false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
}

function ShowCards(){
	alert("显示卡牌");
}

