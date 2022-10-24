var fontName = 'Microsoft Yahei';
var curCanvas;
var curCanvasRota=[];
var timer;


// xml读取方法
function loadXML(xmlFile){
	if (window.XMLHttpRequest){
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else{
		// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",xmlFile,false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
}

// 移除当前页所有卡牌
function RemoveAllCardImg(){
	var box = document.getElementById("box");
	// 获取 box 标签下的所有子节点
    var pObjs = box.childNodes;
    for (var i = pObjs.length - 1; i >= 0; i--) { // 一定要倒序，正序是删不干净的，可自行尝试
      pObjs[i].remove();
    }
	window.scrollTo(0, 0); 
	cardImgList=[];
}

// 显示卡牌大图
function CreateMoreImfor(cardData){
	var cardDataVec=new Array(1);
	cardDataVec[0]=cardData;
	var disX=30;//间距
	var imgScale=1.3;
	if (IsMobile==true) {
		imgScale=0.88;
		disX=10;
	}
	
	//判断是否有升级卡
	if (cardData.UpLvlCardId>0){
		var upLvlCardData = getCardDataById(cardData.UpLvlCardId);
		if (upLvlCardData!=null){
			cardDataVec[1]=upLvlCardData;
		}
	}
	var tempCard = document.createElement("center"); //创建一个标签
	var aboveBg = document.getElementById("aboveBg");		
	tempCard.className='tempCard';
	document.body.appendChild(tempCard);
	
	tempCard.style.position='absolute';
	tempCard.style.top = (getPageOffY()+document.body.clientHeight/2-CardBgSize[1]/2*imgScale-100) + 'px';
	tempCard.style.left = (document.body.clientWidth/2-cardDataVec.length*(disX*2+CardBgSize[0])/2*imgScale) + 'px';
	tempCard.onclick = function() {
		closeAbovePage();
	}
	for (var i=0;i<cardDataVec.length;++i){
		var canvas = CreateCardImg(tempCard,cardDataVec[i],disX*imgScale,false,imgScale);
		CreatCardImgaeByData(cardDataVec[i],canvas,imgScale);
	}
	
	//卡牌来源
	var txt=cardData.FromDesc;
	if (txt==null) txt="";
	var cardFrom = document.getElementById("cardFrom");
	cardFrom.innerText=txt;
	var offY=650;
	if (IsMobile==true) {
		offY=500;
	}
	cardFrom.style.paddingTop = offY+'px';
}

// 关闭蒙版
function closeAbovePage(){
	document.getElementById("aboveBg").style.display="none"; //显示			
	enablePageScroll(true);
	var tempCards = document.getElementsByClassName('tempCard');
	for (var i = tempCards.length - 1; i >= 0; i--) { // 一定要倒序，正序是删不干净的，可自行尝试
	  document.body.removeChild(tempCards[i]);
	}
}

//创建单张卡牌
function CreatCardImgaeByData(cardData,canvas,imgScale){
	if (canvas==null) return;
	var IconCardId=getCardIconIdByData(cardData);
	var ctx = canvas.getContext('2d');
	var cardPic = new Image();
	cardPic.src = './img/cards/'+IconCardId+'.jpg';	
	cardImgList[cardImgList.length]=cardPic;
	var cardScale=1.05;
	
	ctx.rect(0,29*imgScale,CardBgSize[0]*imgScale,235*imgScale);
	// ctx.stroke();
	ctx.clip();
	drawCanvasImage(cardPic,ctx,cardScale*imgScale,(CardBgSize[0]-cardPic.width*cardScale)*imgScale/2,0);	
	
	//描述和背板
	var txt=cardData.RulesText;
	if (txt!=null && txt!=""){
		txt = cardDesFunc(txt,cardData.ID);
		ctx.fillStyle = "white";
		ctx.textBaseline = "middle";
		ctx.textAlign = 'center';
		ctx.font = 14*imgScale+'px '+fontName;
		drawText(ctx, txt, 250*imgScale, 139*imgScale, imgScale);
	}
}

// 创建一张卡
function CreateCardImg(box,cardData,space,canClick,imgScale){
	if (imgScale==null) imgScale=1;
	var canvas = document.createElement("canvas"); //创建一个标签
	
	if (canClick==true){
		canvas.onclick = function() {
			if (IsMobile==false) resetCardCanvasRotate(canvas);
			CreateMoreImfor(cardData);
			document.getElementById("aboveBg").style.top=getPageOffY()+"px";
			document.getElementById("aboveBg").style.display="block"; //显示				
			enablePageScroll(false);
		}
		if (IsMobile==false) {
			canvas.onmouseover = function() {
			runCardCanvasRotate(canvas);
			}
			canvas.onmouseout = function() {
				resetCardCanvasRotate(canvas);
			}
		}
	}
	
	canvas.name = 1;//缩放系数
	canvas.id = 'card_' + cardData.ID;
	canvas.className="cardObj";
	canvas.width = CardBgSize[0]*imgScale;
	canvas.height = CardBgSize[1]*imgScale;
	canvas.style.margin=space+'px';
	box.appendChild(canvas);
	var ctx = canvas.getContext('2d');
	// 画图
	//获取插画
	var IconCardId=getCardIconIdByData(cardData);
	// var cardNameColor="black";
	var cardTypeStr="";
	var cardBgFile="";
	var cardRarityFile="";
	var cardNameColor="black";
	if (cardData.Type==1){
		cardTypeStr="Creature";
		cardBgFile=cardTypeStr+cardData.Color;
		cardRarityFile=cardTypeStr+cardData.Rarity;
	}
	else if (cardData.Type==2){
		cardTypeStr="Magic";
		cardBgFile=cardTypeStr+cardData.Color;
		cardRarityFile=cardTypeStr+cardData.Rarity;
	}
	else if (cardData.Type==4){
		cardTypeStr="Curse";
		cardBgFile=cardTypeStr;
		cardRarityFile=cardTypeStr;
		cardNameColor="#FF00FF";
	}
	else if (cardData.Type==8 || cardData.Type==16){
		cardTypeStr="Weapon";
		cardBgFile=cardTypeStr+cardData.Type;
		cardRarityFile=cardTypeStr+cardData.Rarity;
	}
	
	var cardBg = new Image();
	cardBg.src = './img/ui/cardBg'+cardBgFile+'.png';
	var cardRarity = new Image();
	cardRarity.src = './img/ui/cardRarity'+cardRarityFile+'.jpg';
	var costBg = new Image();
	costBg.src = './img/ui/Lv1.png';
	if  (cardData.CardLvl>=2){
		costBg.src = './img/ui/Lv2.png';
	}
	var manaBg = new Image();
	manaBg.src = './img/ui/mana.png';
	//绘制有先后
	//背景
	drawCanvasImage(cardBg,ctx,imgScale);

	//卡牌名
	var offy=14;
	if (IsMobile==true) offy=offy-1;
	var txt=cardData.Name;
	ctx.fillStyle = cardNameColor;
	ctx.textBaseline = "middle";
	ctx.textAlign = 'center';
	ctx.font = 18*imgScale+'px '+fontName;
	ctx.fillText(txt,CardBgSize[0]*imgScale/2, offy*imgScale);
	
	//稀有度
	drawCanvasImage(cardRarity,ctx,imgScale,(CardBgSize[0]-cardRarity.width)*imgScale/2,(CardBgSize[1]-36)*imgScale);
		
	if (cardData.Type!=4){
		//费用
		drawCanvasImage(costBg,ctx,imgScale);
		var txt=cardData.Level;
		ctx.fillStyle = "white";
		ctx.textBaseline = "middle";
		ctx.textAlign = 'center';
		ctx.font = 24*imgScale+'px '+'Microsoft Yahei';
		var offx=11;
		var offy=15;
		if (IsMobile==true) offy=offy-3;
		ctx.fillText(txt,offx*imgScale, offy*imgScale);
		if (IsMobile==false) ctx.strokeText(txt,offx*imgScale, offy*imgScale);				
	}
	//生物额外的攻血
	if (cardData.Type==1){
		var offy=-21;
		if (IsMobile==true) offy=offy-3;
	
		var txt=cardData.Power;
		if (txt==null) txt=0;
		ctx.fillStyle = "black";
		ctx.textBaseline = "middle";
		ctx.textAlign = 'center';
		ctx.font = 26*imgScale+'px '+fontName;
		ctx.fillText(txt,40*imgScale,CardBgSize[1]*imgScale+offy*imgScale);
		
		var txt=cardData.Life;
		if (txt==null) txt=0;
		ctx.fillStyle = "black";
		ctx.textBaseline = "middle";
		ctx.textAlign = 'center';
		ctx.font = 26*imgScale+'px '+fontName;
		ctx.fillText(txt,CardBgSize[0]*imgScale-25*imgScale,CardBgSize[1]*imgScale+offy*imgScale);
	}

	return canvas;
}

//获取插画ID
function getCardIconIdByData(cardData){
	var IconCardId=cardData.ID;
	if (cardData.IconCardId>0){
		IconCardId=cardData.IconCardId;
	}
	return IconCardId;
}

function drawCanvasImage(img,context,scale,offx,offy) {
    // context.clearRect(0, 0, canvas.width, canvas.height);
	if (scale==null) scale=1;
	if (offx==null) offx=0;
	if (offy==null) offy=0;
    context.drawImage(
		img, //规定要使用的图像、画布或视频。
		offx, offy, //开始剪切的 x 坐标位置。
		img.width*scale, img.height*scale,  //被剪切图像的高度。
		// img.X, img.Y,//在画布上放置图像的 x 、y坐标位置。
		// img.width * img.Scale, img.height * img.Scale  //要使用的图像的宽度、高度
	);
}
		
//卡牌描述特殊处理
function cardDesFunc(txt,cardID){
	var newText="";
	txt=txt.replace(/<LC>/g,"");
	txt=txt.replace(/<-LC>/g,"");
	if (txt.includes("},{")){
		var stringVec=txt.split("},{");
		for (var i=0;i<stringVec.length;++i){
			if (i>0){
				stringVec[i]="{"+stringVec[i];
			}
			if (i<stringVec.length-1){
				stringVec[i]=stringVec[i]+"}";
				stringVec[i]=stringVec[i]+"\\n";
			}
			//第1种
			if (stringVec[i].includes("{'T':'")){
				stringVec[i]=stringVec[i].replace(/{'T':'/g,"");
				stringVec[i]=stringVec[i].replace(/'}/g,"");
			}
			//第2种
			else if (stringVec[i].includes("Shuoming_")){
				var shuomingVec = stringVec[i].split('Shuoming_');
				var shuomingVec2 = shuomingVec[1].split("'");
				var costMana = shuomingVec2[0];
				stringVec[i]=costMana+"费#";
			}
		}
		for (var i=0;i<stringVec.length;++i){
			newText=newText+stringVec[i];
		}
	}
	else{
		newText=txt;
	}
	return newText;
}

//文本换行
function drawText(ctx, originTxt, initHeight, maxWidth, imgScale) {
	var strList=[];	
	var txtList=originTxt.split("\\n");
	var num = 0;
	var titleHeight=0;
	var leftWidth=CardBgSize[0]*imgScale/2
	
	for (var j=0;j<txtList.length;++j){		
		var lineWidth = 0;		
		var lastSubStrIndex = 0; //每次开始截取的字符串的索引
		var str=txtList[j].replace(/\s*/g,"");
		
		for (var i = 0; i < str.length; i++) {
			lineWidth += ctx.measureText(str[i]).width;
			if (lineWidth > maxWidth) {
				if (num < 5) {
					strList[num]=str.substring(lastSubStrIndex, i);
					num++;
				} else {
					strList[num]=str.substring(lastSubStrIndex, i-5) + "...";
					num++;
					return;
				}
				lineWidth = 0;
				lastSubStrIndex = i;
			}
			if (i == str.length - 1) { //绘制剩余部分
				strList[num]=str.substring(lastSubStrIndex, i + 1);
				num++;
			}
		}
	}	
	
	
	titleHeight=20*strList.length+10;
	var desBg = new Image();
	desBg.src = './img/ui/desBg.png';
	ctx.drawImage(desBg,0,(CardBgSize[1]-titleHeight-46)*imgScale,CardBgSize[0]*imgScale,titleHeight*imgScale);
	
	for (var i = 0; i < strList.length; ++i) {
		var txt = strList[strList.length-i-1];
			
		if (txt.includes("费#")){
			var stringVec=txt.split("费#");
			var manaCost=stringVec[0];
			txt="   "+stringVec[1];
			var manaBg = new Image();
			manaBg.src = './img/ui/mana.png';
			var offx = 10;
			var offy = 12;
			var offx2 = 0;
			var offx3 = 0.5;
			if (strList.length==1){
				offx2=8;
			}
			if (IsMobile==true) offx3=offx3-2;
			ctx.drawImage(manaBg, leftWidth-ctx.measureText(txt).width/2-offx*imgScale-offx2*imgScale, initHeight-offy*imgScale, 17*imgScale, 20*imgScale);
			ctx.font = 14*imgScale+'px '+fontName;
			ctx.fillText(manaCost, leftWidth-ctx.measureText(txt).width/2-offx*imgScale+offx3*imgScale, initHeight-offy*imgScale+12.5*imgScale);
		}
		
		ctx.font = 16*imgScale+'px '+fontName;
		ctx.fillText(txt, leftWidth, initHeight); //绘制截取部分
		initHeight -= 20*imgScale; //16为字体的高度
	}
	
	// 标题border-bottom 线距顶部距离
	titleHeight = titleHeight + 10;
	return titleHeight;
}

//dbPage     当前页  
//totalPages 总页数  
function pageShow(dbPage,totalPages,onePageCardCount,CardDataList)   
{  
	RemoveAllCardImg();
	showOnePageCard(dbPage,onePageCardCount);
	$(function()   
	{  
		//page分割数量  
		var pageFor = 10;
		if (IsMobile==true) pageFor=7;
		var pageSlipt = parseInt(pageFor / 2);  
		var pageHTML = new Array; 
		if (dbPage > 1) //如果当前页大于1，则显示上一页  
		{     
			var dbPagePre = dbPage-1;  
			pageHTML += "<a href=\"javascript:pageShow('"+ (dbPagePre) +"','"+totalPages+"','"+onePageCardCount+"');\"><上一页</a>";  
		}  
		  
		if (totalPages > pageFor)    //如果总页数大于分割页数  
		{                     
			if(dbPage <= pageSlipt+1)  
			{  
				for (i=1;i<=pageFor;i++)   
				{  
					if (i == dbPage)   
					{  
						pageHTML += "<a href=\"javascript:pageShow('"+ i +"','"+totalPages+"','"+onePageCardCount+"' );\" class=\"this\">" +i+ "</a>";  
					}  
					else  
					{  
						pageHTML += "<a href=\"javascript:pageShow('"+ i +"','"+totalPages+"','"+onePageCardCount+"' );\">" +i+ "</a>";  
					}  
				}  
			}  
			else if (dbPage > totalPages-pageSlipt)  
			{  
				for (i=totalPages-pageFor+1; i<=totalPages; i++)   
				{  
					if (i == dbPage)   
					{  
						pageHTML += "<a href=\"javascript:pageShow('"+ i +"','"+totalPages+"','"+onePageCardCount+"' );\" class=\"this\">" +i+ "</a>";  
					}  
					else  
					{  
						pageHTML += "<a href=\"javascript:pageShow('"+ i +"','"+totalPages+"','"+onePageCardCount+"' );\">" +i+ "</a>";  
					}  
				}  
			}  
			else  
			{  
				for (i=dbPage-pageSlipt; i<=parseInt(dbPage)+parseInt(pageSlipt); i++)   
				{  
					if (i == dbPage)   
					{  
						pageHTML += "<a href=\"javascript:pageShow('"+ i +"','"+totalPages+"','"+onePageCardCount+"' );\" class=\"this\">" +i+ "</a>";  
					}  
					else  
					{  
						pageHTML += "<a href=\"javascript:pageShow('"+ i +"','"+totalPages+"','"+onePageCardCount+"' );\">" +i+ "</a>";  
					}  
				}  
			}  
		}  
		else  
		{  
			for (i=1; i<=totalPages; i++)   
			{  
				if (i == dbPage)   
				{  
					pageHTML += "<a href=\"javascript:pageShow('"+ i +"','"+totalPages+"','"+onePageCardCount+"' );\" class=\"this\">" +i+ "</a>";  
				}  
				else  
				{  
					pageHTML += "<a href=\"javascript:pageShow('"+ i +"','"+totalPages+"','"+onePageCardCount+"' );\">" +i+ "</a>";  
				}  
			}  
		}  

		if (parseInt(dbPage)<parseInt(totalPages))   //如果当前页小于总页数，则显示下一页  
		{  
			var dbPageNext = parseInt(dbPage)+1;  
			pageHTML += "<a href=\"javascript:pageShow('"+ dbPageNext +"','"+totalPages+"','"+onePageCardCount+"');\">下一页></a>";  
		}  
		  
		$(".pages").html(pageHTML);  
	});  
}

//获取页面偏移Y
function getPageOffY(){
	if(window.pageYOffset != 'undefined') {
		point_x = window.pageXOffset;
		point_y = window.pageYOffset;
	}
	else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
		point_x = document.documentElement.scrollLeft;
		point.y = document.documentElement.scrollTop;
	}
	else if(typeof document.body != 'undefined') {
		point_x = document.body.scrollLeft;
		point_y = document.body.scrollTop;
	}
	return point_y;
}

//禁止和允许滑动
function enablePageScroll(isable){
	if (isable == true){
		$(document).unbind("scroll.unable");
		if (IsMobile==true){
			window.ontouchmove=function(e){};
		}
	}
	else{
		var top = $(document).scrollTop();
		$(document).on('scroll.unable',function (e) {
			$(document).scrollTop(top);
		})
        if (IsMobile==true){
			window.ontouchmove=function(e){
				e.preventDefault && e.preventDefault();
				e.returnValue=false;
				e.stopPropagation && e.stopPropagation();
				return false;
			};
		}
	}
}

//根据卡牌id获取data
function getCardDataById(cardID){
	for(var i=0;i<CardDataList.length;++i){
		if(CardDataList[i].ID==cardID){
			
			return CardDataList[i];
		}
	}
	for(var i=0;i<UpgradeCardDataList.length;++i){
		if(UpgradeCardDataList[i].ID==cardID){
			
			return UpgradeCardDataList[i];
		}
	}
	return null;
}

// 封装定时器
function AllCardScaleRun(){
	var scaleMax=1.05;
	timer = setInterval(function() {
		var cardCanvas = document.getElementsByClassName('cardObj');
		for (var i=0;i<cardCanvas.length;++i) {
			var canvas=cardCanvas[i];
			var scale = canvas.name;
			if (canvas==curCanvas){			
				if (scale<scaleMax){
					scale=scale+0.01;
				}
				canvas.style.transform = 'perspective(1000px) rotateX(' + curCanvasRota[0] + 'deg) rotateY(' + curCanvasRota[1] + 'deg)'+' scale('+scale+','+scale+')';
			}
			else{
				if (scale>1){
					scale=scale-0.01;
				}
				if (scale<1) scale=1;
				canvas.style.transform = 'scale('+scale+','+scale+')';
			}		
			canvas.name=scale;
		}
	}, 25)
}

// 卡牌开始旋转
function runCardCanvasRotate(canvas) {
	canvas.onmousemove = function(e) {
		setCardCanvasRotate(canvas,e);
	}
	curCanvas=canvas;
}
				
// 卡牌旋转
function setCardCanvasRotate(canvas,e){
	var e = event || window.event;
	if (e.offsetX || e.offsetY) {  //适用非Mozilla浏览器
		x = e.offsetX;
		y = e.offsetY;
	} else if (e.layerX || e.layerY) {  //兼容Mozilla浏览器
		x = e.layerX;
		y = e.layerY;
	}
	curCanvasRota[0]=(y/canvas.height-0.5)*20;
	curCanvasRota[1]=(x/canvas.width-0.5)*(-20);
	var scale = canvas.name;
	canvas.style.transform = 'perspective(1000px) rotateX(' + curCanvasRota[0] + 'deg) rotateY(' + curCanvasRota[1] + 'deg)'+' scale('+scale+','+scale+')';
}

// 指定卡牌旋转还原
function resetCardCanvasRotate(canvas){
	canvas.onmousemove = function(e) {	
	}
	curCanvas=null;
	curCanvasRota=[];
}