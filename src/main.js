var CardDataList=[];
var UpgradeCardDataList=[];
var ShowCardDataList=[];
var imgList=[];
var cardImgList=[];
var onePageCardCount = 21;//每页显示卡牌数量
var CardBgSize=[]; //卡牌尺寸
var IsMobile=false; //移动端
var MobileScale=0.6; //移动端


// 卡牌数据结构
function CardData(ID,SetNo,Name,Color,Type,Level,Power,Life,Rarity,RulesText,CardLvl,UpLvlCardId,NpcAIFlag,IconCardId,FromDesc){
	this.ID=ID;
	this.SetNo=SetNo;
	this.Name=Name;
	this.Color=Color;
	this.Type=Type;
	this.Level=Level;
	this.Power=Power;
	this.Life=Life;
	this.Rarity=Rarity;
	this.RulesText=RulesText;
	this.CardLvl=CardLvl;
	this.UpLvlCardId=UpLvlCardId;
	this.NpcAIFlag=NpcAIFlag;
	this.IconCardId=IconCardId;
	this.FromDesc=FromDesc;
}

// 初始化
function Init(){
	// if (IsMobile==true) onePageCardCount=12;
	InitCardBgSize();
	AddOptionBtn();
	LoadConfig();
	if (IsMobile==false) AllCardScaleRun();
}

// 判断是否是移动端
function CheckDevice(){
	if (window.screen.width < 500) {
	  // 当前设备是移动设备 
		IsMobile=true;
	}
}

// 设置卡牌尺寸
function InitCardBgSize(){
	var img = new Image();
	img.src = 'img/ui/cardBgCurse.png';
	CardBgSize[0]=img.width;
	CardBgSize[1]=img.height;
}

// 创建下拉框
function AddOptionBtn(){
	// 系别
	var txtList=['系别','木','水','火','暗'];
	var valueList=[-1,2,4,8,16];
	AddOneOptionBtn(txtList,valueList,'option_color');
	// 类型
	var txtList=['类型','生物卡','魔法卡','装备卡','心魔卡'];
	var valueList=[-1,1,2,24,4];
	AddOneOptionBtn(txtList,valueList,'option_type');
	// 费用
	var txtList=['费用'];
	var valueList=[-1];
	for (var i=0;i<=9;++i){
		txtList[i+1]=i+'费';
		valueList[i+1]=i;
	}
	AddOneOptionBtn(txtList,valueList,'option_cost');
	
	//卡牌关键字
	var inputText = document.getElementById('inputText');	
	inputText.onchange = function() {
		showCards();
	}
	
	//关闭蒙版
	document.getElementById('aboveBg').onclick = function(){
		closeAbovePage();
	}
}

function ResetInputText(){
	if (IsMobile==false) return;
	//卡牌关键字
	var inputText = document.getElementById('inputText');
	inputText.remove(); 
	inputText = document.createElement("input"); //创建一个标签
	document.getElementById("options").appendChild(inputText);
	inputText.id = 'inputText';
	inputText.autocomplete = 'off';
	inputText.placeholder = '输入卡牌关键字...';
}

// 创建一个下拉框
function AddOneOptionBtn(txtList,valueList,selectId){
	var selectNode = document.getElementById(selectId); 
	
	for (var i=0;i<txtList.length;++i){
		var optionNode = document.createElement("option"); //创建一个标签
		selectNode.appendChild(optionNode);
		optionNode.value = valueList[i];
		optionNode.innerText = txtList[i];
	}

	selectNode.onchange = function() {
		showCards();
	}	
}

// 读取卡牌配置
function LoadConfig(){
	CardDataList=[];
	UpgradeCardDataList=[];

	var url = window.location.href;
	var result=/^https/.test(url);
	if (result==false){
		url="https://dkttlong.github.io/1/";
	}
	
	var xmlFile = url+"cards/CardTxt.xml";
	LoadCardXml(xmlFile);
	
	showCards();
}

// 筛选卡牌
function siftCards(){
	ShowCardDataList=[];
	
	var keyWord = document.getElementById('inputText').value;
	var option_color = document.getElementById('option_color').value;
	var option_type = document.getElementById('option_type').value;
	var option_cost = document.getElementById('option_cost').value;

	CardDataList.forEach( function( item ) {
		if (keyWord!="" && !(item.Name.includes(keyWord) || item.RulesText.includes(keyWord))){
			return;
		}
		if (option_color>=0 && option_color!=item.Color){
			return;
		}
		if (option_type>=0 && (option_type&item.Type)==0){
			return;
		}
		if (option_cost>=0 && option_cost!=item.Level){
			return;
		}
		ShowCardDataList[ShowCardDataList.length]=item;
	  }
	)
}

// 显示卡牌
function showCards(){
	siftCards();
	var pageNum = Math.ceil(ShowCardDataList.length/onePageCardCount);
	pageShow(1,pageNum,onePageCardCount);
}

//显示一页卡牌
function showOnePageCard(curPage,onePageCardCount){
	var beginNum = (curPage-1)*onePageCardCount
	var endNum = curPage*onePageCardCount;
	if (endNum>ShowCardDataList.length)
	{
		endNum=ShowCardDataList.length;
	}
	for (var i=beginNum;i<endNum;++i){
		var box = document.getElementById("box");
		var cardData=ShowCardDataList[i];		
		var IconCardId=getCardIconIdByData(cardData);
		var cardPic = new Image();
		cardPic.src = './img/cards/'+IconCardId+'.jpg';
		cardPic.id = IconCardId;
		var imgScale=1;
		var space=30;
		if (IsMobile==true) {
			imgScale=imgScale*MobileScale;
			space=5;
		}
		var canvas = CreateCardImg(box,cardData,space,true,imgScale);
		cardPic.onload=function(){		
			LodCardImgaeByID(this.id);
		}
	}
}

//页面创建单张卡牌
function LodCardImgaeByID(cardID){
	var canvas = document.getElementById('card_'+cardID);
	var cardData=getCardDataById(cardID);
	var imgScale=1;
	if (IsMobile==true) imgScale=imgScale*MobileScale;
	CreatCardImgaeByData(cardData,canvas,imgScale);
}

//读取单个文件配置
function LoadCardXml(xmlFile){
	var xmldoc=loadXML(xmlFile);
	//获得根节点
	var cards=xmlDoc.getElementsByTagName("CardTxt");
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
		var CardLvl=cards[i].getAttribute("CardLvl");
		var UpLvlCardId=cards[i].getAttribute("UpLvlCardId");
		var NpcAIFlag=cards[i].getAttribute("NpcAIFlag");
		var IconCardId=cards[i].getAttribute("IconCardId");
		var FromDesc=cards[i].getAttribute("FromDesc");
		
		if (ID==null){
			continue;
		}
		if (CardLvl==null){
			CardLvl=0;
		}
		if (NpcAIFlag==null){
			NpcAIFlag=0;
		}

		if (Type!=32 && (NpcAIFlag&8)==0){
			if (CardLvl<=1){
				CardDataList[CardDataList.length] = new CardData(ID,SetNo,Name,Color,Type,Level,Power,Life,Rarity,RulesText,CardLvl,UpLvlCardId,NpcAIFlag,IconCardId,FromDesc);
			}
			else if(CardLvl==2){
				UpgradeCardDataList[UpgradeCardDataList.length] = new CardData(ID,SetNo,Name,Color,Type,Level,Power,Life,Rarity,RulesText,CardLvl,UpLvlCardId,NpcAIFlag,IconCardId,FromDesc);
			}
		}
		CardDataList.sort(function(a,b){
			var colorA = a.Color;
			var colorB = b.Color;
			if (colorA==0) colorA=100;
			if (colorB==0) colorB=100;
			var sortA = -colorA*1000 + a.Level;
			var sortB = -colorB*1000 + b.Level;
			return sortB - sortA;
		})
	}
}