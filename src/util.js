var fontName = '宋体';
	
function RemoveAllCardImg(){
	// 移除所有卡牌
	var box = document.getElementById("box");
	// 获取 box 标签下的所有子节点
    var pObjs = box.childNodes;
    for (var i = pObjs.length - 1; i >= 0; i--) { // 一定要倒序，正序是删不干净的，可自行尝试
      box.removeChild(pObjs[i]);
    }
	window.scrollTo(0, 0); 
}
	
function CreateCardImg(cardData){
	// 创建 canvas
	// <canvas id="canvas" width="256" height="256"></canvas>
	var box = document.getElementById("box");
	const canvas = document.createElement("canvas"); //创建一个标签
	var space = 50;
	canvas.id = cardData.ID;
	canvas.width = 256 + space;
	canvas.height = 256 + space;
	box.appendChild(canvas);

	const ctx = canvas.getContext('2d')
	// 画图
	var cardPic = new Image();
	cardPic.src = './img/cards/'+cardData.ID+'.png';
	var cardBg = new Image();
	cardBg.src = './img/ui/mana.png';
	var manaBg = new Image();
	manaBg.src = './img/ui/mana.png';
	//绘制有先后
	setTimeout(function(){
		//插画
		ctx.drawImage(cardPic, 0, 0, 256, 256)
		//背景
		// ctx.drawImage(cardBg, 0, 0, 120, 120)
		//卡牌名
		var txt=cardData.Name;
		ctx.fillStyle = "black";
		ctx.textBaseline = "middle";
		ctx.textAlign = 'center';
		ctx.font = '22px '+fontName;
		var width = ctx.measureText(txt).width;
		ctx.fillText(txt,canvas.width/2 - space/2, 20);
		//描述
		var txt=cardData.RulesText;
		ctx.fillStyle = "white";
		ctx.textBaseline = "middle";
		ctx.textAlign = 'center';
		ctx.font = '18px '+fontName;
		txt = cardDesFunc(txt);
		var width = ctx.measureText(txt).width;
		var titleHeight = drawText(ctx, txt, canvas.width/2 - space/2, 200, 170 ,titleHeight)
	},10)
}

//卡牌描述特殊处理
function cardDesFunc(txt){
	var newText=txt;
	if (txt.includes("'T':'")){
		var stringVec=txt.split("'T':'");
		newText=stringVec[stringVec.length-1];
		newText=newText.replace("'}","");
	}
	if (txt.includes('Shuoming_')){
		var stringVec = txt.split('Shuoming_');
		var stringVec2 = stringVec[1].split("'");
		var costMana = stringVec2[0];
		// newText="（"+costMana+"费）"+newText;
		newText=""+costMana+"费#"+newText;
	}

	return newText;
}

//文本换行
function drawText(ctx, str, leftWidth, initHeight, maxWidth, titleHeight) {
	var strList=[];
	var lineWidth = 0;
	var num = 0;
	var lastSubStrIndex = 0; //每次开始截取的字符串的索引
	str=str.replace(/\s*/g,"");
	
	for (var i = 0; i < str.length; i++) {
		lineWidth += ctx.measureText(str[i]).width;
		if (lineWidth > maxWidth) {
			if (num < 5) {
				strList[num]=str.substring(lastSubStrIndex, i);
			} else {
				strList[num]=str.substring(lastSubStrIndex, i-5) + "...";
				return
			}
			lineWidth = 0;
			lastSubStrIndex = i;
			num++;
		}
		if (i == str.length - 1) { //绘制剩余部分
			strList[num]=str.substring(lastSubStrIndex, i + 1);
		}
	}
	
	for (var i = 0; i < strList.length; ++i) {
		var txt = strList[strList.length-i-1];
			
		if (txt.includes("费#")){
			var stringVec=txt.split("费#");
			var manaCost=stringVec[0];
			txt="   "+stringVec[1];
			var manaBg = new Image();
			manaBg.src = './img/ui/mana.png';
			var offx = 10;
			var offy = 13;
			ctx.drawImage(manaBg, leftWidth-ctx.measureText(txt).width/2-offx, initHeight-offy, 21, 25);
			ctx.font = '16px '+fontName;
			ctx.fillText(manaCost, leftWidth-ctx.measureText(txt).width/2-offx+3, initHeight-offy+14);
		}
		
		ctx.font = '18px '+fontName;
		ctx.fillText(txt, leftWidth, initHeight); //绘制截取部分
		initHeight -= 26; //16为字体的高度
		titleHeight += 30;
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
