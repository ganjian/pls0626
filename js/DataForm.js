/**
 * DataForm
 * @author: Dingli.
 * @date: 2011-06-15
 * 数据窗体基本服务。
 */
function DataForm()
{
	var BASE_RETURN_XML = "<root><body><items name=\"requestList\"><item>#BODY#</item></items></body></root>";

	this.OTHER_ERROR_CODE = "94999";

	/**
	 * 获取其它返回异常代码。
	 */
	this.getErrorCode = function()
	{
		return this.OTHER_ERROR_CODE;
	}

	/**
	 * 收集表单数据。
	 * value: 每个表单都要设置name属性。传入的参数是使用","分隔的字符串。表示要收集哪些表单的值。如："name1,name2,name3"
	 * area: 要收集的表单区域id。所有的参数都包括在这个区域下。该参数可以设置为空(null)。
	 * array: 表单名/值表示的数组。如：new Array("name1","value1","name2","value2")。该参数可以设置为空(null)。
	 * attrName: 默认情况下使用"requestList"作为请求报文节点的name属性名，设置这个参数可以作为不同的处理方式。该参数可以设置为空(null)。
	 */
	this.collectData = function(value, area, array, attrName)
	{
		var bodyXml = "";
		var resultXml = BASE_RETURN_XML;
		value = value + ",currentPage,pageSize";
		var idArray = value.split(",");
		for(var i = 0; i < idArray.length; i++)
		{
			
			if(idArray[i] == "") continue;
			if(area && idArray[i] != "currentPage" && idArray[i] != "pageSize")
			{
				objTag = $("#" + area).find("#" + idArray[i]);
			}
			else
			{
				objTag = document.getElementsByName(idArray[i]);
			}
			
			if(typeof(objTag) == "undefined" || objTag == null)
			{
				
				return false;
			}
			if(typeof(objTag[0]) != "undefined")
			{
	            if(objTag.length == 1)
	            {
					switch(objTag[0].tagName)
					{		
						case "INPUT":
							if(objTag[0].type == "checkbox")
							{
								bodyXml += addInputData(idArray[i], objTag[0].checked);
							}
							else
							{
								bodyXml += addInputData(idArray[i], objTag[0].value);
							}
							break;
						case "HIDDEN":
							bodyXml += addInputData(idArray[i], objTag[0].value);
							break;
						case "SELECT":
							bodyXml += addInputData(idArray[i], objTag[0].value);
							break;
						default:
							if(objTag[0].value) bodyXml += addInputData(idArray[i], objTag[0].value);
							break;
					}
				}
				else
				{
					bodyXml += addInputData(idArray[i], getRadioValue(objTag[0]));
				}
			}
		}
		if(array)
		{
			bodyXml += collectDataByArray(array);
		}
		if(attrName)
		{
			resultXml = resultXml.replace(/requestList/, attrName);
		}
		return resultXml.replace(/#BODY#/, bodyXml);
	}

/***************************分界线——周龙  开始***************************************/
	/**
	*itemsData拼接items节点的报文结构
	*value:表单的name ，用“value,value1,value2”
	*attrName:items的name名字
	*text:是可选项，不用可以不输入。text是传入下拉框的name：等到结果是：例如<option value="0">请选择</option>要提取“请选择”这里面的字就要输入text这个字段。
	*/
	this.itemsData = function(value,attrName,text)
		{
			var bodyXml = "";
			var BASE_RETURN_XML = "<items name=\"requestList\"><item>#BODY#</item></items>";
			var resultXml = BASE_RETURN_XML;
			var idArray = value.split(",");
			for(var i = 0; i < idArray.length; i++)
			{
				if(idArray[i] == "") continue;
				objTag = document.getElementsByName(idArray[i]);
				if(typeof(objTag) == "undefiend" || objTag == null)
				{
					return false;
				}
				if(typeof(objTag[0]) != "undefined")
				{
		            if(objTag.length == 1)
		            {
						switch(objTag[0].tagName)
						{		
							case "INPUT":
								if(objTag[0].type == "checkbox")
								{
									bodyXml += addInputData(idArray[i], objTag[0].checked);
								}
								else
								{
									bodyXml += addInputData(idArray[i], objTag[0].value);
								}
								break;
							case "HIDDEN":
								bodyXml += addInputData(idArray[i], objTag[0].value);
								break;
							case "SELECT":
								if(text != null && typeof(text) != "undefined"){
									bodyXml += addInputData(idArray[i], objTag[0].value);
									bodyXml += addInputData(text, objTag[0][1].text);
								}else{
									bodyXml += addInputData(idArray[i], objTag[0].value);
								}
								break;
							default:
								if(objTag[0].value) bodyXml += addInputData(idArray[i], objTag[0].value);
								break;
						}
					}
					else
					{
						bodyXml += addInputData(idArray[i], getRadioValue(objTag[0]));
					}
				}
			}
			if(attrName)
			{
				resultXml = resultXml.replace(/requestList/, attrName);
			}
			return resultXml.replace(/#BODY#/, bodyXml);
		}
  
  
  
	/**
	* additemsData：拼接报文，将多个items组合成一个报文。
	* data：为 new Array(value1,value2)。value1为items1，value2为items2，将多个items组合在一起
	*/
	this.additemsData = function(data){
		var BASE_RETURN_XML = "<root><body>#BODY#</body></root>";
		var resultXml = BASE_RETURN_XML;
		var xml="";
		for(var i = 0 ;i <  data.length; i++){
			xml += data[i];
		}
		 return resultXml.replace(/#BODY#/, xml);
	}
/***************************分界线——周龙  结束***************************************/

	/**
	 * 获取报文头部 replyCode 的值。如果出现其它错误返回94999。
	 * data: 返回的XML。
	 */
	this.getReplyCode = function(data)
	{
		var items = $(data).find("root > head > service > replyCode");
		if(this.isObjectAvailabe(items))
		{
			return items.eq(0).text();
		}
		return "94999";
	}

	/**
	 * 获取报文头部 replyMsg 的值。
	 * data: 返回的XML。
	 */
	this.getReplyMsg = function(data)
	{
		var items = $(data).find("root > head > service > replyMsg");
		if(this.isObjectAvailabe(items))
		{
			return items.eq(0).text();
		}
		return "不能获取提示信息";
	}
	/**
	 * 获取指定属性的全部item。
	 * data: 返回的XML。
	 * attrName: 要查找的属性名。
	 * callback: 回调函数。用来处理每一条item。回调将传入index与domElement。
	 */
	this.getAllItems = function(data, attrName, callback)
	{
		var items = $(data).find("items[name='" + attrName + "'] > item");
		if(this.isObjectAvailabe(items))
		{
			if(this.isObjectAvailabe(callback))
			{
				$(items).each(function(index, domElement)
				{
					callback(index, domElement);
				});
			}
			return items;
		}
		return null;
	}

	/**
	 * 获取指定属性指定索引的item。
	 * data: 返回的XML。
	 * attrName: 要查找的属性名。
	 * index: 索引基于0。
	 */
	this.getItem = function(data, attrName, index)
	{
		var items = $(data).find("items[name='" + attrName + "'] > item");
		if(this.isObjectAvailabe(items) && index >= 0 && index < items.size())
		{
			return items.eq(index);
		}
		return null;
	}

	/**
	 * 获取指定属性指定索引的节点值。
	 * data: 返回的XML。
	 * nodeName: 节点名。
	 */
	this.getText = function(data, nodeName)
	{
		var items = $(data).find(nodeName);
		if(this.isObjectAvailabe(items))
		{
			return items.eq(0).text();
		}
		return "";
	}

	/**
	 * 判断一个对象是否有效。
	 */
	this.isObjectAvailabe = function(object)
	{
		return (object != null && typeof(object) != "undefined");
	}

	/**
	 * 表格的td付值
	 * @author: jyz
	 */
	this.setTableValue = function(data, value)
	{
		var idArray = value.split(",");
		for(var i = 0; i < idArray.length; i++)
		{
			var text = this.getText(data, idArray[i]);
			if(idArray[i] == "") continue;
			objTag = document.getElementById(idArray[i]);
			if(objTag.tagName != "undefined")
			{
				switch(objTag.tagName)
				{		
					case "INPUT":
						if(objTag.type != "checkbox")
						{
							$("#" + idArray[i]).val(text);
						}
						break;
					case "HIDDEN":
						$("#" + idArray[i]).val(text);
						break;
					case "SELECT":
						//保留
						break;
					default:
						$("#" + idArray[i]).text(text);
						//保留
						break;
				}
			}
		}
	}

	/**
	 * 绑定一个区域。这个区域里的对象id和报文节点名称对应的都会给赋值。
	 * data: 返回的数据。
	 * id: 要绑定的区域的字符串id。
	 */
	this.mapArea = function(data, id)
	{
		var nodeName = $("#" + id).attr("node");
		if(nodeName)
		{
		   	$(data).find("items").each(function(i)
		   	{
		   		if($(this).attr("name") == nodeName)
		   		{
		   			$(this).find("item").children().each(function(i)
		   			{
		   				var tagName = $(this).get(0).tagName;
		   				var tagText = $(this).text();
		   				var objectTag = $("#" + id).find("#" + tagName).get(0);
		   				if(typeof(objectTag) != "undefined")
		   				{
							switch(objectTag.tagName)
							{
								case "INPUT":
									if(objectTag.type == "checkbox" || objectTag.type == "radio")
									{
										if(tagText == "1" || tagText == "true" || tagText == "Y")
										{
											objectTag.checked = true;
										}
										else if(tagText == "0" || tagText == "false" || tagText == "N")
										{
											objectTag.checked = false;
										}
									}
									else
									{
										objectTag.value = tagText;
									}
									break;
								case "HIDDEN":
									objectTag.value = tagText;
									break;
								case "SELECT":
									objectTag.value = tagText;
									break;
								case "IMG":
									objectTag.src = tagText;
									break;
								default:
									objectTag.innerHTML = tagText;
									break;
							}
						}
		   			});
		   		}
		   	});
	   	}
	}

	/**
	 * 添加输入框的值。内部方法。
	 */
	function addInputData(id, value)
	{
		if(value.indexOf("$") !=-1){
			value = value.replace(/\$/g,"＄");
		}
		if(value.indexOf("&") !=-1){
			value = value.replace(/&/g,"＆");
		}
		if(value.indexOf("<") !=-1){
			value = value.replace(/</g,"＜");
		}
		if(value.indexOf(">") !=-1){
			value = value.replace(/>/g,"＞");
		}
		return "<" + id + ">" + value + "</" + id + ">"
	}

	/**
	 * 获取单选按钮的值。
	 */
	function getRadioValue(objTag)
	{
		for(var i = 0; i < objTag.length; i++)
		{
			if(objTag[i].checked)
			{	
				return objTag[i].value;
				break;
			}	
		}
	}

	/**
	 * 收集表单数据。如：new Array("name1,value1,name2,value2");
	 */
	function collectDataByArray(array)
	{
		var bodyXml = "";
		for(var i = 0; i < array.length; i += 2)
		{
			bodyXml += "<" + array[i] + ">" + array[i + 1] + "</" + array[i] + ">";
		}
		return bodyXml;
	}
}


/**
 * 收集表单数据。如：new Array("name1,value1,name2,value2");
 */
DataForm.DataByArray = function (array)
{
	var bodyXml = "";
	for(var i = 0; i < array.length; i += 2)
	{
		bodyXml += "<" + array[i] + ">" + array[i + 1] + "</" + array[i] + ">";
	}
	return DataForm.CodeTableXml(bodyXml);
}
/**
 * 构造一个用于代码表的代码表请求报文.
 */
DataForm.codeTableXml = function(codeTableId)
{
	return "<root><body><items name=\"requestList\"><item><codeTableId>#codeTableId#</codeTableId></item></items></body></root>".replace(/#codeTableId#/, codeTableId);
}
/**
 * 代码表请求服务ID。
 */
DataForm.CODE_TABLES_SERVICE_HANDLER = "mtax.service.common.codeTablesServiceHandler:getCodeTable";

/**
 * 打印XML字符串,用于在各种浏览器中调试.
 */
DataForm.alertXml = function(node)
{
	if(window.ActiveXObject)
	{
		alert(node.xml);
	}
	else
	{
		var serializer = new XMLSerializer();
		var xmlStr = serializer.serializeToString(node, "text/xml");
		alert(xmlStr);
	}
}

/**
 * 收集指定对象下属性标记为"keydata"的数据。
 * object: 要收集数据的父对象。
 * return: json对象，key为标记为keydata对象的id值, value为对象的值。
 */
DataForm.collectKeyData = function(object)
{
	var resultJson = {};
	$(object).find("*").each(function(i)
	{
		var attr = $(this).attr("keydata");
		if(typeof(attr) != "undefined" && attr != null)
		{
			var id = $(this).attr("id");
			var val = $(this).is("input")? $(this).val(): $(this).text();
			resultJson[id] = val;
		}
	});
	return resultJson;
}
/**
 * 删除循环表格中的数据
 * object: 需要删除的表格。
 */
DataForm.deleteData = function(object)
{
	$("#"+object).each(function(i){
		if(i == 0){
		 	return true; 
		}else{
			$(this).remove();
		}
	});
}

