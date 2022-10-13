function LoadConfig(){
	alert("显示卡牌：1");
	StandardTaxRate();
}

function StandardTaxRate()
{
	$.ajax({
	url: "/demo.xml",
	dataType: 'xml',
	type: 'GET',
	timeout: 2000,
	error: function(xml)
	{
		alert("加载XML 文件出错！");
	},
	success: function(xml)
	{
		alert("显示卡牌：2")	
		$(xml).find("taxrate").each(function(i)
		{
		var oid = $(this).attr("id");
		var lower = $(this).children("lower").text();
		var upper = $(this).children("upper").text();
		var rate = $(this).children("rate").text();
		var buckle = $(this).children("buckle").text();
		alert("显示卡牌："+lower)	
	  });
	}
	});
}

function ShowCards(){
	alert("显示卡牌");
}

