var ajaxBase = new AjaxBase();
var dataForm = new DataForm();
var Dining = {
	config: {
		"DELIVERY_USER": "delivery_user",
		"EATERY_USER": "eatery_user",
		"SERVER_IP": "183.62.139.156",
		"SERVER_PORT": "8001",
		"BASE_URL": "/diningserv",
		"TRANSFER_DATA_URL": "/transferDataServlet"
	},
	localdata: {
		USERID: "12",
		ADDRESS: "212",
		USERNAME: "12",
		LONGITUDE: "12",
		LATITUDE: "1212"
	},
	// Application Constructor
	initialize: function () {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: function () {
		Dining.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent: function (id) {
		alert("设备准备完毕！");
	},
	getAllDining: function (array) {
		var bodyXml = "";
		var BASE_RETURN_XML = "<root><body><items name=\"requestList\"><item>#BODY#</item></items></body></root>";
		var resultXml = BASE_RETURN_XML;
		bodyXml += this.collectDataByArray(array);
		return resultXml.replace(/#BODY#/, bodyXml);
	},
	/**
	 * 收集表单数据。如：new Array("name1,value1,name2,value2");
	 */
	collectDataByArray: function (array) {
		var bodyXml = "";
		for (var i = 0; i < array.length; i += 2) {
			bodyXml += "<" + array[i] + ">" + array[i + 1] + "</" + array[i] + ">";
		}
		return bodyXml;

	},

	/*resList为一位数组,msLIst是二维数组*/
	orderAdd: function (resList, msList) {
		var bodyXml = "";
		var msXml = "";
		var basexml = "<root><body><items name=\"requestList\"><item>#BODY#</item></items><items name=\"mxList\">#MSDATA</items></body></root>";
		bodyXml += this.collectDataByArray(resList);
		msXml += this.twoArray(msList);
		basexml = basexml.replace(/#BODY#/, bodyXml);
		basexml = basexml.replace(/#MSDATA/, msXml);
		return (basexml);
	},
	twoArray: function (arr) {
		//		var a = [["name", "nihao", "username", "sdf", "password", "21323"], ["name", "nihao2", "username", "zhangsan", "password", "123"]];
		var itemXml = "";
		for (var i = 0, length = arr.length; i < length; i++) {
			itemXml += "<item>" + this.collectDataByArray(arr[i]) + "</item>";
		}
		return (itemXml);
	},
	userRegist: function (ifo, ads) {
		var bodyXml = "";
		var adressXml = "";
		var basexml = "<root><body><items name=\"requestList\"><item>#BODY#</item></items><items name=\"addressList\"><item>#ADRESS#</item></items></body></root>";
		bodyXml += this.collectDataByArray(ifo);
		adressXml += this.collectDataByArray(ads);
		basexml = basexml.replace(/#BODY#/, bodyXml);
		basexml = basexml.replace(/#ADRESS#/, adressXml);
		return basexml;
	},
	orderDataByArray: function (res, mx) {


	},
	/*获取选中的选项*/
	getSelectedOption: function (selectform, selectionfield) {
		var result = [];
		var option = null;
		for (var i = 0; i < selectionfield.length; i++) {
			option = selectionfield[i];
			if (option.checked) {
				result.push(option);
			}

		}
		return result;
	},
	//用户登录
	showPopupLogin: function () {
		$("#afui").popup({
			title: "用户登录",
			message: "手机号: <input type='text' id='logintel' class='af-ui-forms'><br>密码: <input type='password' id='password' class='af-ui-forms' style='webkit-text-security:disc'>",
			cancelText: "登陆",
			cancelCallback: function () {
				//处理登录的一些操作
				var logintel = $('#logintel').val();
				var password = $('#password').val();
				//alert(username);			
				//alert(password);		
				if (logintel === '' || password === '') {
					alert('用户名或者密码不能为空');
					Dining.showPopupLogin();
				} else {
					var loginData = ["tel", logintel, "usertype", "0", "opt", "1", "userpassword", password];
					$.ui.showMask("登陆中。。。");
					/*ajaxBase.crossDomainCall(
						"zrsf.palsoon.common.service.registerServiceHandler:userRegist",
						Dining.getAllDining(loginData),
						Dining.LoginSuccess,
						Dining.LoginFail
					);*/

					ajaxBase.loacaltest(
						"./localtest/login.xml",
						Dining.LoginSuccess,
						Dining.LoginFail
					);
				}

			},
			doneText: "注册",
			doneCallback: function () {
				//				Dining.showPopupRegist();
				$.ui.loadContent('regist', false, false, 'pop');

			},
			cancelOnly: false
		});
	},
	LoginSuccess: function (data, textStatus, jqXHR) {
		var replyCode = dataForm.getReplyCode(data);
		var replyMsg = dataForm.getReplyMsg(data);

		var username = "";
		var sex = "";
		var userpwd = "";
		var userid = "";

		switch (replyCode) {
		case "0":
			//					var verifycode = $(data).find("verifycode").text();
			$.ui.hideMask();


			alert(replyMsg);
			username = $(data).find("USERNAME").text();

			sex = $(data).find("SEX").text();
			userid = $(data).find("USERID").text();
			LocalStorage.store("USERID", userid);
			$.ui.popup(username + "-----" + sex + "----" + userid);
			$.ui.loadContent('myself', false, false, 'pop');
			//									if(replyMsg.trim() ==="登陆成功") {
			//										alert("登陆成功");
			//										
			//									
			//									}else {
			//										alert("登陆失败");
			//										Dining.showPopupLogin();
			//									}
			//					var itemlist = $(data).find("items[name='diningList'] > item");
			//					for (var i = 0; i < itemlist.length; i++) {
			//						//              $(data).find("GRANTNO").text()
			//						diningList = itemlist[i];
			//
			//						rest_contDiv.diningname = $(diningList).find("DININGNAME").text();
			//
			//						rest_contDiv.tel = $(diningList).find("TEL").text();
			//						rest_contDiv.address = $(diningList).find("ADDRESS").text();
			//						rest_contDiv.servicezone = $(diningList).find("SERVICEZONE").text();
			//						rest_contDiv.picurl = $(diningList).find("PICURL").text();
			//						rest_contDiv.worktime_q = $(diningList).find("WORKTIME_Q").text();
			//						rest_contDiv.worktime_z = $(diningList).find("WORKTIME_Z").text();
			//						rest_contDiv.downprice = $(diningList).find("DOWNPRICE").text();
			//						rest_contDiv.averagetime = $(diningList).find("AVERAGETIME").text();
			//
			//						rest_contDiv.restContentDiv();
			//					}
			//            $("#restList").append(result);

			break;
		case "1":
			alert("密码错误");
			Dining.showPopupLogin();
			break;
		case "-1":
			alert(replyMsg);
			Dining.showPopupLogin();
			break;
		default:
			break;
		}
	},
	loginFail: function (jqXHR, textStatus, errorThrown) {
		alert("获取数据失败！");
	},
	regist_load: function () {
		$("#verification").bind("click", Dining.verificathandler);

	},
	verificathandler: function (event) {
		alert("chenggong");
		var myselftel = $("#myselftel").val();
		var setdata = ["tel", myselftel];
		if (myselftel !== "") {
			/*	ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.commonServiceHandler:getMobileYZM",
			Dining.getAllDining(setdata),
			Dining.verifySuccess,
			Dining.verifyFail
		);*/

			//本地测试
			ajaxBase.loacaltest(
				"./localtest/getMobileYZM.xml",
				Dining.verifySuccess,
				Dining.verifyFail
			);
		} else {
			alert("手机号不能为空！");
		}

	},
	regist_unload: function () {
		$("#verification").unbind("click", this.verificathandler);
	},
	//	showPopupRegist: function (tel) {
	//
	//		var registtel = tel;
	//		var result = "";
	//		if (arguments.length > 0) {
	//			alert(tel);
	//			result = "手机号: <input type='text' id='registtel' value=" + tel + "><br>密码: <input type='password' id='registpwd' class='af-ui-forms' style='webkit-text-security:disc'><br>确认密码: <input type='password' id='registpwdf' class='af-ui-forms' style='webkit-text-security:disc'><br>验证码: <input id='registverify' type='text'>";
	//		} else {
	//			result = "手机号: <input type='text' id='registtel'><br>密码: <input type='password' id='registpwd' class='af-ui-forms' style='webkit-text-security:disc'><br>确认密码: <input type='password' id='registpwdf' class='af-ui-forms' style='webkit-text-security:disc'><br>验证码: <input id='registverify' type='text'>";
	//		}
	//		$("#afui").popup({
	//			title: "用户注册",
	//			message: result,
	//			cancelText: "获取验证码",
	//			cancelCallback: function () {
	//				var tel = $("#registtel").val();
	//				if (tel !== "") {
	//					Dining.registVerify(tel);
	//					//					alert(tel);
	//				} else {
	//					alert("手机号不能为空！");
	//					Dining.showPopupRegist();
	//				}
	//
	//
	//			},
	//			doneText: "提交",
	//			doneCallback: function () {
	//				var registtel = $("#registtel").val();
	//				var registpwd = $("#registpwdf").val();
	//				var registverify = $("#registverify").val();
	//				var registerData = ["tel", registtel, "verifycode", registverify, "usertype", "0", "opt", "0", "userpassword", registpwd];
	//				/*				ajaxBase.crossDomainCall(
	//					"zrsf.palsoon.common.service.registerServiceHandler:userRegist",
	//					Dining.getAllDining(registerData),
	//					Dining.registSuccess,
	//					Dining.registFail
	//				);*/
	//
	//				ajaxBase.loacaltest(
	//					"./localtest/userRegist.xml",
	//					Dining.registSuccess,
	//					Dining.registFail
	//				);
	//
	//			},
	//			cancelOnly: false
	//		});
	//		//		$("#verifysubmit").bind("click", function (event) {
	//		//			alert("chuan");
	//		//		});
	//	},
	//	registFail: function (jqXHR, textStatus, errorThrown) {
	//		alert("传输错误");
	//	},
	//	registSuccess: function (data, textStatus, jqXHR) {
	//		var replyCode = dataForm.getReplyCode(data);
	//		var replyMsg = dataForm.getReplyMsg(data);
	//
	//		switch (replyCode) {
	//		case "0":
	//			//					var verifycode = $(data).find("verifycode").text();
	//			alert("注册成功");
	//			//					var itemlist = $(data).find("items[name='diningList'] > item");
	//			//					for (var i = 0; i < itemlist.length; i++) {
	//			//						//              $(data).find("GRANTNO").text()
	//			//						diningList = itemlist[i];
	//			//
	//			//						rest_contDiv.diningname = $(diningList).find("DININGNAME").text();
	//			//
	//			//						rest_contDiv.tel = $(diningList).find("TEL").text();
	//			//						rest_contDiv.address = $(diningList).find("ADDRESS").text();
	//			//						rest_contDiv.servicezone = $(diningList).find("SERVICEZONE").text();
	//			//						rest_contDiv.picurl = $(diningList).find("PICURL").text();
	//			//						rest_contDiv.worktime_q = $(diningList).find("WORKTIME_Q").text();
	//			//						rest_contDiv.worktime_z = $(diningList).find("WORKTIME_Z").text();
	//			//						rest_contDiv.downprice = $(diningList).find("DOWNPRICE").text();
	//			//						rest_contDiv.averagetime = $(diningList).find("AVERAGETIME").text();
	//			//
	//			//						rest_contDiv.restContentDiv();
	//			//					}
	//			//            $("#restList").append(result);
	//
	//			break;
	//		case "1":
	//			alert(replyMsg);
	//			break;
	//		case "-1":
	//			alert(replyMsg);
	//			break;
	//		default:
	//			break;
	//		}
	//
	//	},
	//	registVerify: function (tel) {
	//
	//		var myselftel = tel;
	//		var setdata = ["tel", myselftel];
	//		//		var ajaxBase = new AjaxBase();
	//		//		var dataForm = new DataForm();
	//		$.ui.showMask("发送中。。。");
	//		/*		ajaxBase.crossDomainCall(
	//			"zrsf.palsoon.common.service.commonServiceHandler:getMobileYZM",
	//			Dining.getAllDining(setdata),
	//			Dining.verifySuccess,
	//			Dining.verifyFail
	//		);*/
	//		ajaxBase.loacaltest(
	//			"./localtest/getMobileYZM.xml",
	//			Dining.verifySuccess,
	//			Dining.verifyFail
	//		);
	//
	//	},
	verifySuccess: function (data, textStatus, jqXHR) {
		var replyCode = dataForm.getReplyCode(data);
		var replyMsg = dataForm.getReplyMsg(data);

		switch (replyCode) {
		case "0":
			$.ui.hideMask();
			var verifycode = $(data).find("verifycode").text();
			alert("请输入验证码：" + verifycode);
			//			Dining.showPopupRegist(myselftel);
			//					var itemlist = $(data).find("items[name='diningList'] > item");
			//					for (var i = 0; i < itemlist.length; i++) {
			//						//              $(data).find("GRANTNO").text()
			//						diningList = itemlist[i];
			//
			//						rest_contDiv.diningname = $(diningList).find("DININGNAME").text();
			//
			//						rest_contDiv.tel = $(diningList).find("TEL").text();
			//						rest_contDiv.address = $(diningList).find("ADDRESS").text();
			//						rest_contDiv.servicezone = $(diningList).find("SERVICEZONE").text();
			//						rest_contDiv.picurl = $(diningList).find("PICURL").text();
			//						rest_contDiv.worktime_q = $(diningList).find("WORKTIME_Q").text();
			//						rest_contDiv.worktime_z = $(diningList).find("WORKTIME_Z").text();
			//						rest_contDiv.downprice = $(diningList).find("DOWNPRICE").text();
			//						rest_contDiv.averagetime = $(diningList).find("AVERAGETIME").text();
			//
			//						rest_contDiv.restContentDiv();
			//					}
			//            $("#restList").append(result);

			break;
		case "1":
			alert(replyMsg);
			break;
		case "-1":
			alert(replyMsg);
			break;
		default:
			break;
		}
	},
	verifyFail: function (jqXHR, textStatus, errorThrown) {
		alert("后台服务器出现错误");
	},
	showMask: function (text) {
		$.ui.showMask(text);
		window.setTimeout(function () {
			$.ui.hideMask();
		}, 2000);
	},

	/*首页方法安装与卸载*/
	index_load: function () {
		//		alert(typeof(this.myself_load));
		//		var login =  this.showPopupLogin();

		//		var t = setTimeout(this.showPopupLogin(), 5000);
		LocalStorage.store("json_data", JSON.stringify(this.localdata));
		var userid = LocalStorage.load("USERID");
		if (!userid) {
			this.showPopupLogin();
		}
		//		this.showPopupLogin();

		$("#ifooter-one").bind("click", this.todayOrder);
		//		$("#search").bind("click",this.searchHandler);
	},
	searchHandler: function () {


	},
	index_unload: function () {
		$("#ifooter-one").unbind("click", this.todayOrder);
	},
	/*地图模式的方法安装与卸载*/
	load_map: function () {
		$.ui.disableSideMenu();
	},
	unload_map: function () {
		$.ui.enableSideMenu();
	},
	/*餐厅列表方法的安装与卸载*/
	setmap: function () {
		$("#map_mode").toggle();
	},
	restaurant_load: function () {
		//  var delivery_user = JSON.parse(decodeURI(LocalStorage.load(Config.DELIVERY_USER)));
		//  Toast.show(Messages.MSG_LOADING, "2000", "5", "1");  

		//		console.log(json_data);
		$("#map_mode").hide();
		$("#Select").bind("click", this.showPopup3);
		$("#set_map").bind("click", this.setmap);
		$("#restListmore").bind("click", this.restListmore);
		var currentPage = 1;
		$.ui.showMask("数据加载中...");
		/*	ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.OrderFoodServiceHandler:nearTakeAway",
			//    dataForm.collectData("", null, new Array("deliveryid",5)),
			this.getAllDining(new Array("longitude", "112.156421", "latitude", "25.63124", "distance", "", "sort", "", "queryname", "", "currentPage", currentPage, "pageSize", "8")),
			this.restListSuccess,
			this.restListFail
		);*/

		/*本地测试*/
		ajaxBase.loacaltest(
			"./localtest/nearTakeAway.xml",
			this.restListSuccess,
			this.restListFail
		);
	},
	restListSuccess: function (data, textStatus, jqXHR) {
		$.ui.hideMask();

		var name = "";
		var address = "";
		var tel = "";
		var result = "";
		var restName = "";
		var diningList = null;

		var diningno = "";
		var replyCode = dataForm.getReplyCode(data);
		var replyMsg = dataForm.getReplyMsg(data);
		switch (replyCode) {
		case "0":
			var itemlist = $(data).find("items[name='diningList'] > item");
			for (var i = 0; i < itemlist.length; i++) {
				//              $(data).find("GRANTNO").text()
				diningList = itemlist[i];
				//              name = diningList.getElementsByTagName("NAME")[0].firstChild.nodeValue;
				//              address = diningList.getElementsByTagName("ADDRESS")[0].firstChild.nodeValue;
				//              tel = diningList.getElementsByTagName("TEL")[0].firstChild.nodeValue;
				name = $(diningList).find("DININGNAME").text();
				address = $(diningList).find("ADDRESS").text();
				tel = $(diningList).find("TEL").text();
				diningid = $(diningList).find("DININGID").text(); //储存进Localstorage,用以获取餐厅详细信息
				result += Dining.restListdiv(name, address, tel, diningid);
			}
			$("#restList").append(result);
			break;
		case "1":
			//          Toast.show(replyMsg, "1200", "3", "0");
			//          DataForm.deleteData("mainDiningList table");
			//          $("#mainDiningList").css("display", "none");
			break;
		case "-1":
			//            Toast.show(replyMsg, "1200", "2", "0");
			//            DataForm.deleteData("mainDiningList table");
			//            $("#mainDiningList").css("display", "none");
			break;
		default:
			//            Toast.show(replyMsg, "1200", "2", "0");
			//            DataForm.deleteData("mainDiningList table");
			//            $("#mainDiningList").css("display", "none");
			break;
		}
	},
	restListFail: function (jqXHR, textStatus, errorThrown) {
		alert("网络错误");
	},
	restListmore: function () {
		var page = 2;
		ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.OrderFoodServiceHandler:nearTakeAway",
			//    dataForm.collectData("", null, new Array("deliveryid",5)),
			Dining.getAllDining(new Array("longitude", "112.156421", "latitude", "25.63124", "distance", "", "sort", "", "queryname", "", "currentPage", page, "pageSize", "8")),
			function (data, textStatus, jqXHR) {
				var name = "";
				var address = "";
				var tel = "";
				var result = "";
				var restName = "";
				var diningList = null;

				var diningno = "";
				var replyCode = dataForm.getReplyCode(data);
				var replyMsg = dataForm.getReplyMsg(data);
				switch (replyCode) {
				case "0":
					var itemlist = $(data).find("items[name='diningList'] > item");
					for (var i = 0; i < itemlist.length; i++) {
						//              $(data).find("GRANTNO").text()
						diningList = itemlist[i];
						//              name = diningList.getElementsByTagName("NAME")[0].firstChild.nodeValue;
						//              address = diningList.getElementsByTagName("ADDRESS")[0].firstChild.nodeValue;
						//              tel = diningList.getElementsByTagName("TEL")[0].firstChild.nodeValue;
						name = $(diningList).find("DININGNAME").text();
						address = $(diningList).find("ADDRESS").text();
						tel = $(diningList).find("TEL").text();
						diningid = $(diningList).find("DININGID").text(); //储存进Localstorage,用以获取餐厅详细信息
						if (diningList === '') {
							$("#restListmore").text('已经到最后一页了');
						}
						result += Dining.restListdiv(name, address, tel, diningid);
					}
					$("#restList").append(result);
					page++;
					break;
				case "1":
					//          Toast.show(replyMsg, "1200", "3", "0");
					//          DataForm.deleteData("mainDiningList table");
					//          $("#mainDiningList").css("display", "none");
					break;
				case "-1":
					//            Toast.show(replyMsg, "1200", "2", "0");
					//            DataForm.deleteData("mainDiningList table");
					//            $("#mainDiningList").css("display", "none");
					break;
				default:
					//            Toast.show(replyMsg, "1200", "2", "0");
					//            DataForm.deleteData("mainDiningList table");
					//            $("#mainDiningList").css("display", "none");
					break;
				}

			},
			this.restListFail
		);
	},
	restListdiv: function (name, address, tel, diningid) {
		var WDiv = "<li class='clearfix' onclick=\"LocalStorage.store('diningid','" + diningid + "')\">";
		WDiv += "<a href='#menuList'><img title=" + name + " alt=" + name + " src='http://fuss10.elemecdn.com/d/f2/843275c103eee51b0ffb667b8d82fjpeg_size_42_42.jpeg'/>";
		WDiv += "<p>" + name + "<span>0.4公里</span></p>";
		WDiv += "<p>地址：" + address + "</p>";
		WDiv += "</a>";
		WDiv += "</li>";
		return WDiv;
	},
	history_load: function () {
		$("#historyListmore").bind("click", this.historyMore);
		//http://218.17.162.79:8181/diningserv/xmlController.do?sid=zrsf.palsoon.common.service.OrderFoodServiceHandler:queryHistoryOrderByUserId&xmlContent=<root><body><items name="requestList"><item><userid>81</userid><currentPage>1</currentPage><pageSize>10</pageSize><latitude>25.63124</latitude><longitude>26.63124</longitude><distance>1000</distance></item></items></body></root>&callback=?    获取历史订单
		var dataset = ["userid", "81", "currentPage", "1", "pageSize", "10", "latitude", "25.63124", "longitude", "25.63324", "distance", "1000"];
		$.ui.showMask("数据加载中...");
		/*	ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.OrderFoodServiceHandler:queryHistoryOrderByUserId",
			//    dataForm.collectData("", null, new Array("deliveryid",5)),
			this.getAllDining(dataset),
			this.historySuccess,
			this.historyFail
		);
*/
		ajaxBase.loacaltest(
			"./localtest/queryHistoryOrderByUserId.xml",
			this.historySuccess,
			this.historyFail

		);
	},
	historySuccess: function (data, textStatus, jqXHR) {
		/*		<li class="clearfix">
						<a href="#history_order">
							<img title="（赠饮）汉堡家" alt="（赠饮）汉堡家" src="http://fuss10.elemecdn.com/d/f2/843275c103eee51b0ffb667b8d82fjpeg_size_42_42.jpeg">
							<p>真功夫南山店
								<span>0.4公里</span>
							</p>
							<p>起送
								<span class="font_red">
									<span class="￥">￥</span>99</span>
							</p>
						</a>
					</li>*/
		//  var delivery_user = JSON.parse(decodeURI(LocalStorage.load(Config.DELIVERY_USER)));
		//  Toast.show(Messages.MSG_LOADING, "2000", "5", "1");  
		$.ui.hideMask();
		var reminderstatus, rank, dining, distance, name, amt, rn, ordertime, orderstatus, picurl, diningpicurl, deliverytel, orderid, deliveryname, diningname, sum, long, lat, historyList = null,
			result = "";

		var replyCode = dataForm.getReplyCode(data);
		var replyMsg = dataForm.getReplyMsg(data);
		switch (replyCode) {
		case "0":
			var itemlist = $(data).find("items[name='orderInfo'] > item");
			for (var i = 0; i < itemlist.length; i++) {
				//              $(data).find("GRANTNO").text()
				historyList = itemlist[i];
				//              name = diningList.getElementsByTagName("NAME")[0].firstChild.nodeValue;
				//              address = diningList.getElementsByTagName("ADDRESS")[0].firstChild.nodeValue;
				//              tel = diningList.getElementsByTagName("TEL")[0].firstChild.nodeValue;
				name = $(historyList).find("NAME").text();
				amt = $(historyList).find("AMT").text();
				ordertime = $(historyList).find("ORDERTIME").text();
				diningname = $(historyList).find("DININGNAME").text();
				sum = $(historyList).find("SUM").text();
				orderid = $(historyList).find("ORDERID").text(); //储存进Localstorage,用以获取餐厅详细信息
				result += Dining.historydiv(diningname, name, amt, ordertime, orderid, sum);
			}
			$("#historyList").append(result);
			break;
		case "1":
			alert("出现故障");
			break;
		case "-1":
			alert("出现故障");
			break;
		default:
			alert("出现故障");
			break;
		}
	},
	historyFail: function (jqXHR, textStatus, errorThrown) {
		alert("服务器故障");
		$.ui.hideMask();
	},
	historyMore: function () {
		var currentPage = 2;
		var dataset = ["userid", "81", "currentPage", currentPage, "pageSize", "10", "latitude", "25.63124", "longitude", "25.63324", "distance", "1000"];
		$.ui.showMask("数据加载中...");
		ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.OrderFoodServiceHandler:queryHistoryOrderByUserId",
			//    dataForm.collectData("", null, new Array("deliveryid",5)),
			Dining.getAllDining(dataset),
			function (data, textStatus, jqXHR) {
				$.ui.hideMask();
				var reminderstatus, rank, dining, distance, name, amt, rn, ordertime, orderstatus, picurl, diningpicurl, deliverytel, orderid, deliveryname, diningname, sum, long, lat, historyList = null,
					result = "";

				var replyCode = dataForm.getReplyCode(data);
				var replyMsg = dataForm.getReplyMsg(data);
				switch (replyCode) {
				case "0":
					var itemlist = $(data).find("items[name='orderInfo'] > item");
					for (var i = 0; i < itemlist.length; i++) {
						historyList = itemlist[i];
						name = $(historyList).find("NAME").text();
						amt = $(historyList).find("AMT").text();
						ordertime = $(historyList).find("ORDERTIME").text();
						diningname = $(historyList).find("DININGNAME").text();
						sum = $(historyList).find("SUM").text();
						orderid = $(historyList).find("ORDERID").text(); //储存进Localstorage,用以获取餐厅详细信息
						result += Dining.historydiv(diningname, name, amt, ordertime, orderid, sum);
					}
					$("#historyList").append(result);
					currentPage++;
					break;
				case "1":
					alert("出现故障");
					break;
				case "-1":
					alert("出现故障");
					break;
				default:
					alert("出现故障");
					break;
				}
			},
			Dining.historyFail
		);


	},
	historydiv: function (diningname, name, amt, ordertime, orderid, sum) {
		/*				<li class="clearfix">
						<a href="#history_order">
							<img title="（赠饮）汉堡家" alt="（赠饮）汉堡家" src="http://fuss10.elemecdn.com/d/f2/843275c103eee51b0ffb667b8d82fjpeg_size_42_42.jpeg">
							<p>真功夫南山店
								<span class="listRight">0.4公里</span>
							</p>
							<p>起送
								<span class="font_red">
									<span class="￥">￥</span>99</span>
							</p>
							<p>台湾卤肉饭</p>
						</a>
					</li>*/
		/*	<ul class="list" style="background:aqua;">
		<p id="diningid810" class="divider" style="margin:0px;">
			<span>真功夫南山店</span>
			<span>¥</span>
			<span class="orderPrice">66</span>
		</p>
		<li id="dishid982">
			<span>鱼香肉丝</span>
			<span>¥</span>
			<span>12</span>
			<span>×</span>
			<span class="orderPiece">1</span>份
			<a class="increase edit">+</a>
			<a class="subtract see">-</a>
		</li>
	</ul>*/
		var WDiv = "<li class='clearfix' onclick=\"LocalStorage.store('orderid','" + orderid + "')\">";
		WDiv += "<a href='#history_order'><img title=" + diningname + " alt=" + diningname + " src='http://fuss10.elemecdn.com/d/f2/843275c103eee51b0ffb667b8d82fjpeg_size_42_42.jpeg'/>";
		WDiv += "<p>" + diningname + "<span class='listRight'>0.4公里</span></p>";
		WDiv += "<p>订餐时间：" + ordertime + "<span class='listRight'>￥" + amt + "</span></p>";
		WDiv += "<p>订餐内容：" + name + "<span class='listRight'>" + sum + "份</span></p>";
		WDiv += "</a>";
		WDiv += "</li>";
		return WDiv;

	},
	historyOrder_load: function () {
		//		$("#historyOrder").bind("click", this.orderhandler);
		$("#historyOrderTime").bind("mousedown", this.timehandler);
		$("#historyOrderPay").bind("mousedown", this.accounthandler);
		$("#historySubmit").bind("click", this.historySubmit);
		$("#historyOrder").bind("longTap", this.removehandler);

		//查询订单明细（根据订单id查询订单菜品明细信息） 历史订单详情
		//	URL=http://218.17.162.79:8181/diningserv/xmlController.do?sid=zrsf.palsoon.common.service.OrderFoodServiceHandler:queryDishByOrderid&xmlContent=<root><body><items name="requestList"><item><orderid>2221</orderid></item></items></body></root>&callback=? 
		var dataset = ["orderid", "2221"];
		$.ui.showMask("数据加载中...");
		/*ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.OrderFoodServiceHandler:queryDishByOrderid",
			//    dataForm.collectData("", null, new Array("deliveryid",5)),
			this.getAllDining(dataset),
			this.historyOrderSuccess,
			this.historyOrderFail
		);*/

		ajaxBase.loacaltest(
			"./localtest/queryDishByOrderid.xml",
			this.historyOrderSuccess,
			this.historyOrderFail
		);



	},
	historySubmit: function () {
		alert("提交订单成功");
		var str = $("#historyOrder").html();
		var pay = $("#historyOrderPay").val();
		var tel = $("#historyOrdertel").val();
		var ads = $("#historyOrderads").val();
		var time = $("#historyOrderTime").val();
		$("#orderlinks").append(str);

		$("#confirmPay").val(pay);
		$("#confirmads").val(ads);
		$("#confirmtel").val(tel);
		$("#confirmTime").val(time);

	},
	historyOrder_unload: function () {
		//		$("#historyOrder").unbind("click", this.orderhandler);
		$("#historyOrderTime").unbind("mousedown", this.timehandler);
		$("#historyOrderPay").unbind("mousedown", this.accounthandler);
		$("#historyOrder").text("");
		$("#historySubmit").unbind("click", this.historySubmit);
	},
	historyOrderSuccess: function (data, textStatus, jqXHR) {
		$.ui.hideMask();
		//		var diningid = "";
		//		var reminderstatus = "";
		//		var leavetime = "";
		//		var sendend = "";
		//		var amt = "";
		//		var sendbegin = "";
		//		var orderno = "";
		//		var paytype = "";
		//		var orderstatus = "";
		//		var remainingtime = "";
		//		var orderid = "";
		//		var diningname = "";
		//		var sum = "";
		//		var havetime = "";
		var deliverytel = "";
		var username = "";
		var dishid = "";
		var price = "";
		var dishamt = "";
		var dishsum = "";
		var dishname = "";
		var piece = "";
		var ordertime = "";
		var dishOrderstatus = "";
		var dishList = null;
		var dishListStr = "";

		var replyCode = dataForm.getReplyCode(data);
		var replyMsg = dataForm.getReplyMsg(data);
		switch (replyCode) {
		case "0":
			var address = $(data).find("ADDRESS").text();
			var diningid = $(data).find("DININGID").text();
			var reminderstatus = $(data).find("REMINDRESTATUS").text();
			var leavetime = $(data).find("LEAVETIME").text();
			var sendend = $(data).find("SENDEND").text();
			var amt = $(data).find("items[name='orderInfo']>item>AMT").text();
			var sendbegin = $(data).find("SENDBEGIN").text();
			var orderno = $(data).find("ORDERNO").text();
			var paytype = $(data).find("PAYTYPE").text();
			var orderstatus = $(data).find("ORDERSTATUS").text();
			var remainingtime = $(data).find("REMAININGTIME").text();
			var orderid = $(data).find("ORDERID").text();
			var diningname = $(data).find("DININGNAME").text();
			var sum = $(data).find("items[name='orderInfo']>item>SUM").text();
			var havetime = $(data).find("HAVETIME").text();
			var tel = $(data).find("TEL").text();
			$("#historyOrderName").text(diningname);
			$("#historyOrderPrice").text(amt);
			$("#historyOrdertel").val(tel);
			$("#historyOrderads").val(address);
			$("#historyOrderTime").val("" + sendbegin + "---" + sendend + "");
			switch (paytype) {
			case "0":
				$("#historyOrderPay").val("现金");
				break;
			case "1":
				$("#historyOrderPay").val("微信支付");
				break;
			}
			var itemlist = $(data).find("items[name='dishList'] > item");
			for (var i = 0, length = itemlist.length; i < length; i++) {
				//				//              $(data).find("GRANTNO").text()
				dishList = itemlist[i];
				dishid = $(dishList).find("DISHID").text();
				price = $(dishList).find("PRICE").text();
				dishamt = $(dishList).find("DISHID").text();

				dishsum = $(dishList).find("SUM").text();
				dishname = $(dishList).find("DISHNAME").text();
				piece = $(dishList).find("PIECE").text();
				ordertime = $(dishList).find("ORDERTIME").text();
				dishOrderstatus = $(dishList).find("ORDERSTATUS").text();
				dishListStr += Dining.historyOrderDiv(diningid, diningname, dishid, dishname, price, piece);
				//				//              name = diningList.getElementsByTagName("NAME")[0].firstChild.nodeValue;
				//				//              address = diningList.getElementsByTagName("ADDRESS")[0].firstChild.nodeValue;
				//				//              tel = diningList.getElementsByTagName("TEL")[0].firstChild.nodeValue;
				//				name = $(historyList).find("NAME").text();
				//				amt = $(historyList).find("AMT").text();
				//				ordertime = $(historyList).find("ORDERTIME").text();
				//				diningname = $(historyList).find("DININGNAME").text();
				//				sum = $(historyList).find("SUM").text();
				//				orderid = $(historyList).find("ORDERID").text(); //储存进Localstorage,用以获取餐厅详细信息
				//				result += Dining.historydiv(diningname, name, amt, ordertime, orderid, sum);
			}
			$("#historyOrder").append(dishListStr);
			//			$("#historyList").append(result);


			break;
		case "1":
			//          Toast.show(replyMsg, "1200", "3", "0");
			//          DataForm.deleteData("mainDiningList table");
			//          $("#mainDiningList").css("display", "none");
			break;
		case "-1":
			//            Toast.show(replyMsg, "1200", "2", "0");
			//            DataForm.deleteData("mainDiningList table");
			//            $("#mainDiningList").css("display", "none");
			break;
		default:
			//            Toast.show(replyMsg, "1200", "2", "0");
			//            DataForm.deleteData("mainDiningList table");
			//            $("#mainDiningList").css("display", "none");
			break;
		}
	},
	historyOrderDiv: function (diningid, diningname, dishid, dishname, price, piece) {
		var result = [
			'<ul class="list" style="background:aqua;">',
			'<p id="diningid' + diningid + '" class="divider" style="margin:0px;">',
			'<span>' + diningname + '</span>',
			'<span>¥</span>',
			'<span class="orderPrice">66</span>',
			'</p>',
			'<li id= "dishid' + dishid + '">',
			'<span>' + dishname + '</span>',
			'<span>¥</span>',
			'<span>' + price + '</span>',
			'<span>×</span>',
			'<span class="orderPiece">' + piece + '</span>份',
			'</li>',
			'</ul>'
		].join('');


		/*	var str = "<li id='" + dishid + "'>";
		str += "<span>" + dishname + "</span>";
		str += "<span>" + price + "</span>";
		str += "<span>×</span>";
		str += "<span>" + piece + "</span>份";

		str += "<a class='increase edit'>+</a>";
		str += "<a class='subtract see'>-</a>";
		str += "</li>";*/
		return result;
	},
	historyOrderFail: function (jqXHR, textStatus, errorThrown) {
		alert("服务器故障");
		$.ui.hideMask();
	},
	restaurant_scroll: function (currentPage) {
		var page = currentPage;

		var rMyScroller;
		var hasMorePage = true;
		$.ui.ready(function () {
			rMyScroller = $("#restaurant").scroller(); //Fetch the scroller from cache
			//Since this is a App Framework UI scroller, we could also do
			// myScroller=$.ui.scrollingDivs['webslider'];
			rMyScroller.addInfinite();
			rMyScroller.addPullToRefresh();
			rMyScroller.runCB = true;
			$.bind(rMyScroller, 'scrollend', function () {
				console.log("滑动开始"); //目前未使用  
			});

			$.bind(rMyScroller, 'scrollstart', function () {
				console.log("滑动结束"); //目前未使用  
			});
			$.bind(rMyScroller, "scroll", function (position) {
				console.log("正在滑动"); //目前未使用  
			});
			$.bind(rMyScroller, "refresh-trigger", function () {
				console.log("Refresh trigger");

			});
			var hideClose;
			$.bind(rMyScroller, "refresh-release", function () {
				var that = this;
				console.log("正在加载餐厅...");
				clearTimeout(hideClose);
				hideClose = setTimeout(function () {
					console.log("hiding manually refresh");
					that.hideRefresh();
				}, 5000);
				return false; //tells it to not auto-cancel the refresh
				//
				//
				//				ajaxBase.crossDomainCall(
				//					"zrsf.palsoon.common.service.OrderFoodServiceHandler:nearTakeAway",
				//					//    dataForm.collectData("", null, new Array("deliveryid",5)),
				//					this.getAllDining(new Array("diningname", "", "deliveryid", 5, "currentPage", 1, "pageSize", 5)),
				//					function (data, textStatus, jqXHR) {
				//						var replyCode = dataForm.getReplyCode(data);
				//						var replyMsg = dataForm.getReplyMsg(data);
				//						switch (replyCode) {
				//						case "0":
				//							//          Toast.show("", "1200", "1", "2");
				//							//          doQuerySuccess(data);
				//							var itemlist = $(data).find("items[name='diningList'] > item");
				//							for (var i = 0; i < itemlist.length; i++) {
				//								//              $(data).find("GRANTNO").text()
				//								diningList = itemlist[i];
				//								//              name = diningList.getElementsByTagName("NAME")[0].firstChild.nodeValue;
				//								//              address = diningList.getElementsByTagName("ADDRESS")[0].firstChild.nodeValue;
				//								//              tel = diningList.getElementsByTagName("TEL")[0].firstChild.nodeValue;
				//								name = $(diningList).find("NAME").text();
				//								address = $(diningList).find("ADDRESS").text();
				//								tel = $(diningList).find("TEL").text();
				//								diningno = $(diningList).find("DININGNO").text(); //储存进Localstorage,用以获取餐厅详细信息
				//								result += Dining.addrestListdiv(name, address, tel, diningno);
				//							}
				//							$("#restList").append(result);
				//							currentPage++;
				//
				//							break;
				//						case "1":
				//							//          Toast.show(replyMsg, "1200", "3", "0");
				//							//          DataForm.deleteData("mainDiningList table");
				//							//          $("#mainDiningList").css("display", "none");
				//							break;
				//						case "-1":
				//							//            Toast.show(replyMsg, "1200", "2", "0");
				//							//            DataForm.deleteData("mainDiningList table");
				//							//            $("#mainDiningList").css("display", "none");
				//							break;
				//						default:
				//							//            Toast.show(replyMsg, "1200", "2", "0");
				//							//            DataForm.deleteData("mainDiningList table");
				//							//            $("#mainDiningList").css("display", "none");
				//							break;
				//						}
				//					},
				//					function (jqXHR, textStatus, errorThrown) {
				//						//			Toast.show(Messages.MSG_REQUEST_FAIL, "1200", "2", "0");
				//						//				alert("网络错误");
				//						alert("网络错误");
				//					}
				//				);
			});

			$.bind(rMyScroller, "refresh-cancel", function () {
				clearTimeout(hideClose);
				console.log("cancelled");
			});
			rMyScroller.enable();

			$.bind(rMyScroller, "infinite-scroll", function () {
				var self = this;
				console.log("infinite triggered");
				$(this.el).append("<div id='infinite' style='border:2px solid black;margin-top:10px;width:100%;height:20px'>加载内容中...</div>");
				$.bind(rMyScroller, "infinite-scroll-end", function () {
					$.unbind(rMyScroller, "infinite-scroll-end");
					self.scrollToBottom();
					setTimeout(function () {
						$(self.el).find("#infinite").remove();
						self.clearInfinite();
						$(self.el).append("<div>这个事加载的内容</div>");
						self.scrollToBottom();
					}, 3000);
				});
			});
			$("#restaurant").css("overflow", "auto");
		});

	},
	restaurant_unload: function () {
		$("#map_mode").hide();
		$("#restList").text("");
		$("#Select").unbind("click", this.showPopup3);
		$("#set_map").unbind("click", this.setmap);
	},
	/*筛选选项*/
	showPopup3: function () {
		$("#afui").popup({
			title: "排序方式",
			message: "<form id='form1'><label>排序：</label><input id='aaaaa' type='checkbox' name='test2' value='1'><label for='aaaaa'>月销量</label><input id='bbbbb' type='checkbox' name='test2' value='2'><label for='bbbbb'>距离最近</label><input id='ccccc' type='checkbox' name='test2' value='3'><label for='ccccc'>送餐最快</label> <br style='clear:both'><label>口味：</label><input id='ddddd' type='checkbox' name='test2' value='4'><label for='ddddd'>川菜</label><input id='eeeee' type='checkbox' name='test2' value='5'><label for='eeeee'>粤菜</label><input id='fffff' type='checkbox' name='test2' value='6'><label for='fffff'>湘菜</label></form>",
			cancelText: "取消",
			cancelCallback: function () {
				$("#map_mode").hide();
			},
			doneText: "确定",
			doneCallback: function () {
				alert("选择成功");
				var form = document.getElementById("form1");
				var field = form.elements["test2"];
				var option = this.getSelectedOption(form, field);
				var message = "";
				for (var i = 0, len = option.length; i < len; i++) {
					message += "Select id:" + option[i].id + "\nSelected name:" + option[i].name + "\nSelected value:" + option[i].value + "\n\n";
				}
				alert(message);

				$("#map_mode").hide();
			},
			cancelOnly: false
		});
	},
	mheaderPop: function () {
		$("#afui").popup({
			title: "排序方式",
			message: "<form id='form2'><label>排序：</label><input id='aaaaa' type='checkbox' name='test2' value='1'><label for='aaaaa'>月销量</label><input id='bbbbb' type='checkbox' name='test2' value='2'><label for='bbbbb'>评分</label><input id='ccccc' type='checkbox' name='test2' value='3'><label for='ccccc'>优惠</label> <br style='clear:both'><label>分类：</label><input id='ddddd' type='checkbox' name='test2' value='4'><label for='ddddd'>商务套餐</label><input id='eeeee' type='checkbox' name='test2' value='5'><label for='eeeee'>凉菜</label><input id='fffff' type='checkbox' name='test2' value='6'><label for='fffff'>热菜</label> </form>",
			cancelText: "取消",
			cancelCallback: function () {

			},
			doneText: "确定",
			doneCallback: function () {
				var form = document.getElementById("form2");
				var field = form.elements["test2"];

				var option = this.getSelectedOption(form, field);
				var message = "";
				for (var i = 0, len = option.length; i < len; i++) {
					message += "Select id:" + option[i].id + "\nSelected name:" + option[i].name + "\nSelected value:" + option[i].value + "\n\n";
				}
				alert(message);
			},
			cancelOnly: false
		});
	},
	/*测试授权码*/
	doCheckAuthcode: function () {
		var delivery_user = {};
		var requestXml = "<root><body><items name=\"requestList\"><item><grantno>" + $("#authcode").val() + "</grantno></item></items></body></root>";
		// Toast.show(Messages.MSG_SUBMITING, "1200", "5", "1");
		ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.registerServiceHandler:checkGrantNo",
			requestXml,
			function (data, textStatus, jqXHR) {
				var replyCode = dataForm.getReplyCode(data);
				var replyMsg = dataForm.getReplyMsg(data);

				alert(replyMsg);
				switch (replyCode) {
				case "0":
					//					Toast.show(replyMsg, "1200", "1", "0", function()
					//					{
					//						delivery_user = LocalStorage.load(Config.DELIVERY_USER);
					//						if(delivery_user != null && typeof(delivery_user) != "undefined")
					//						{
					//							delivery_user = JSON.parse(delivery_user);
					//						}
					//						else
					//						{
					//							delivery_user = {};
					//						}
					var authcode = $(data).find("GRANTNO").text();
					LocalStorage.store("USER", authcode);
					//          window.location.href = "index.html";
					//					});
					alert(replyCode);
					break;
				case "1":
					//Toast.show(replyMsg, "1200", "3", "0");
					alert(replyCode);
					break;
				case "-1":
					//          Toast.show(replyMsg, "1200", "2", "0");
					alert(replyCode);
					alert(replyMsg);
					break;
				default:
					//          Toast.show(replyMsg, "1200", "2", "0");
					alert(replyCode);
					break;
				}
			},
			function (jqXHR, textStatus, errorThrown) {
				//			Toast.show(Messages.MSG_REQUEST_FAIL, "1200", "2", "0");
			}
		);
	},
	/*餐厅详情内容*/
	rest_cont_load: function () {
		$.ui.setBackButtonText('返回');
		var diningList = null;
		var result = "";
		//		var localStorage = new LocalStorage();
		//		var ajaxBase = new AjaxBase();
		//		var dataForm = new DataForm();
		var diningno = LocalStorage.load("diningid");

		var setdiningno = ["diningno", diningno];
		ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.OrderFoodServiceHandler:queryDiningByNo",
			this.getAllDining(setdiningno),
			this.rest_contSuccess,
			this.rest_contFail
		);
	},
	rest_contSuccess: function (data, textStatus, jqXHR) {
		var replyCode = dataForm.getReplyCode(data);
		var replyMsg = dataForm.getReplyMsg(data);

		switch (replyCode) {
		case "0":
			var itemlist = $(data).find("items[name='diningList'] > item");
			for (var i = 0; i < itemlist.length; i++) {
				// $(data).find("GRANTNO").text()
				diningList = itemlist[i];

				Dining.rest_contDiv.diningname = $(diningList).find("DININGNAME").text();
				Dining.rest_contDiv.tel = $(diningList).find("TEL").text();
				Dining.rest_contDiv.address = $(diningList).find("ADDRESS").text();
				Dining.rest_contDiv.servicezone = $(diningList).find("SERVICEZONE").text();
				Dining.rest_contDiv.picurl = $(diningList).find("PICURL").text();
				Dining.rest_contDiv.worktime_q = $(diningList).find("WORKTIME_Q").text();
				Dining.rest_contDiv.worktime_z = $(diningList).find("WORKTIME_Z").text();
				Dining.rest_contDiv.downprice = $(diningList).find("DOWNPRICE").text();
				Dining.rest_contDiv.averagetime = $(diningList).find("AVERAGETIME").text();

				Dining.rest_contDiv.restContentDiv();
			}
			//            $("#restList").append(result);
			break;
		case "1":
			alert(replyMsg);
			break;
		case "-1":
			alert(replyMsg);
			break;
		default:
			break;
		}
	},
	rest_contFail: function (jqXHR, textStatus, errorThrown) {
		alert("服务器故障");
		$.ui.hideMask();
	},

	rest_cont_unload: function () {

	},
	rest_contDiv: {
		diningList: null,
		diningname: "",
		tel: "",
		address: "",
		servicezone: "",
		picurl: "",
		worktime_q: "",
		worktime_z: "",
		downprice: "",
		averagetime: "",
		restContentDiv: function () {
			$("#rest_address").html(this.address);
			$("#rest_phone").html(this.tel);
			$("#rest_fanwei").html(this.servicezone);
			$.ui.setTitle(this.diningname);
		}

	},

	/*订单详情*/
	order_confirm_load: function () {
		$("#orderlinks").bind("click", this.orderhandler);
		$("#confirmTime").bind("mousedown", this.timehandler);
		$("#confirmPay").bind("mousedown", this.accounthandler);
		$("#orderlinks").bind("longTap", this.removehandler);
		$("#orderSubmit").bind("click", this.orderSubmit);
	},

	order_confirm_unload: function () {
		$("#orderlinks ul").unbind("click", this.orderhandler);
		$("#confirmTime").unbind("click", this.timehandler);
		$("#confirmPay").unbind("click", this.accounthandler);
		$("#orderSubmit").unbind("click", this.orderSubmit);

	},
	orderSubmit: function () {

		var json_data = JSON.parse(LocalStorage.load("json_data"));
		var begintime, endtime, quicklysend, paytype;
		var t = $("#confirmTime").val();
		var pay = $("#confirmPay").val();
		var ads = $("#confirmAds").val();

		if (pay.length > 2) {
			paytype = "1"; // 1:微信支付
		} else {
			paytype = "0"; // 0:现金
		}
		if (t.length > 12) {
			begintime = t.substr(0, 5);
			endtime = t.substr(-5);
			quicklysend = "";
		} else {
			begintime = "尽快送出(25分钟内)";
			endtime = "尽快送出(25分钟内)";
			quicklysend = "尽快送出(25分钟内)";
		}

		alert(begintime + "---" + endtime + "---" + paytype + "---" + quicklysend);
		var mListdata = [];

		var ullist = document.getElementById("orderlinks").querySelectorAll("ul");
		for (var i = 0, length = ullist.length; i < length; i++) {
			var ulobj = ullist[i];
			var diningid = ulobj.querySelector("p").id.substring(8);
			var price = ulobj.querySelector(".orderPrice").innerHTML;
			var liobj = ulobj.querySelectorAll("li");
			for (var j = 0, lilength = liobj.length; j < lilength; j++) {
				var spanObj = liobj[j];
				var dishid = spanObj.id.substring(6);
				//					var price = spanObj.querySelector(".orderPrice").innerHTML;
				var piece = spanObj.querySelector(".orderPiece").innerHTML;
				var list = [];
				list.push("dishid", dishid, "price", price, "piece", piece, "diningid", diningid);
				mListdata.push(list);
				//					alert("一位数组长度:"+list.length);

			}

		}



		console.log(mListdata);

		//		var setdata = ["userid", "2", "address", json_data.ADDRESS, "username", json_data.USERNAME, "longitude", json_data.LONGITUDE, "latitude", json_data.LATITUDE, "nextusername", "", "remark", "订餐", "sendbegin", begintime, "sendend", endtime, "paytype", paytype, "quicklysend", quicklysend];
		var setdata = ["userid", "2", "address", "深圳北站", "username", "kevin", "longitude", "0.00", "latitude", "0.00", "nextusername", "", "remark", "订餐", "sendbegin", "11:30", "sendend", "12:00", "paytype", "1", "quicklysend", "尽快送出(25分钟内)"];
		var mxListdata = [["dishid", "982", "price", "12", "piece", "2", "diningid", "810"], ["dishid", "981", "price", "12", "piece", "2", "diningid", "810"]];
		var test = Dining.orderAdd(setdata, mListdata);
		console.log(test);
		ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.OrderFoodServiceHandler:addOrder",
			Dining.orderAdd(setdata, mListdata),
			Dining.orderSubmitSuccess,
			Dining.orderSubmitFail
		);
	},
	orderSubmitSuccess: function (data, textStatus, jqXHR) {
		alert("OK!");
		var replyCode = dataForm.getReplyCode(data);
		var replyMsg = dataForm.getReplyMsg(data);
		console.log(replyCode);
		alert(replyMsg);
	},
	orderSubmitFail: function (jqXHR, textStatus, errorThrown) {
		alert("服务器故障");
		$.ui.hideMask();
	},
	removehandler: function (event) {
		var target = event.target;
		var targetId = target.id;
		$("#" + targetId + "").remove();
	},

	timehandler: function (event) {
		var focustarget = event.target;
		var id = focustarget.id;
		var n = new Date();
		var nHour = n.getHours();
		if (nHour < 10) {
			nHour = "0" + nHour;
		}
		var nMin = n.getMinutes();
		if (nMin < 10) {
			nMin = "0" + nMin;
		}
		var t1 = nHour + ":" + nMin;

		var n1 = Dining.timeSet1();
		var n1Hour = n1.getHours();
		if (n1Hour < 10) {
			n1Hour = "0" + n1Hour;
		}
		var n1Min = n1.getMinutes();
		if (n1Min < 10) {
			n1Min = "0" + n1Min;
		}
		var t2 = n1Hour + ":" + n1Min;

		var n2 = Dining.timeSet2();
		var n2Hour = n2.getHours();
		if (n2Hour < 10) {
			n2Hour = "0" + n2Hour;
		}
		var n2Min = n2.getMinutes();
		if (n2Min < 10) {
			n2Min = "0" + n2Min;
		}
		var t3 = n2Hour + ":" + n2Min;

		var n3 = Dining.timeSet3();
		n3.setHours(n2Hour);
		var n3Hour = n3.getHours();
		if (n3Hour < 10) {
			n3Hour = "0" + n3Hour;
		}
		var n3Min = n3.getMinutes();
		if (n3Min < 10) {
			n3Min = "0" + n3Min;
		}
		var t4 = n3Hour + ":" + n3Min;

		var result1 = t1 + "----" + t2;
		var result2 = t2 + "----" + t3;
		var result3 = t3 + "----" + t4;
		//		var t = Dining.timeAdd();
		//		var h = t.getHours();
		//		var m = t.getMinutes();
		//	var t2 = h + ":" + m;
		//		var result1 = t1+"---"+t2;
		//		var t3 = Dining.timeSet(m);

		//		var result2 = t2+"---"+
		$("#afui").popup({
			title: "时间",
			message: "<input id='ddddd' type='radio' name='test2' value='尽快送出(25分钟内)'><label for='ddddd'>尽快送出(25分钟内)</label><input id='aaaaa' type='radio' name='test2' value='" + result1 + "'><label for='aaaaa'>" + result1 + "</label><input id='bbbbb' type='radio' name='test2' value='" + result2 + "'><label for='bbbbb'>" + result2 + "</label><input id='ccccc' type='radio' name='test2' value='" + result3 + "'><label for='ccccc'>" + result3 + "</label><div style=\"height:100px\"></div>",
			cancelText: "取消",
			cancelCallback: function () {},
			doneText: "确定",
			doneCallback: function () {
				var result = $("input[name = 'test2']:checked").val();
				$("#" + id + "").val(result);
			},
			cancelOnly: false
		});


	},
	timeSet1: function () {

		var ti = new Date();
		var n = ti.getMinutes();
		var addMin = n + 30;
		ti.setMinutes(addMin);
		return ti;
	},
	timeSet2: function () {
		var ti = new Date();
		var n = ti.getMinutes();
		var addMin = n + 60;
		ti.setMinutes(addMin);
		return ti;
	},
	timeSet3: function () {
		var ti = new Date();
		var n = ti.getMinutes();
		var addMin = n + 90;
		ti.setMinutes(addMin);
		return ti;
	},

	accounthandler: function (event) {
		var focustarget = event.target;
		var id = focustarget.id;
		$("#afui").popup({
			title: "结算方式",
			message: "<input id='aaaaa' type='radio' name='test3' value='现金'><label for='aaaaa'>现金</label><input id='bbbbb' type='radio' name='test3' value='积分'><label for='bbbbb'>积分</label><input id='ccccc' type='radio' name='test3' value='现金+积分'><label for='ccccc'>现金+积分</label><input id='ddddd' type='radio' name='test3' value='微信支付'><label for='ddddd'>微信支付</label><div style=\"height:100px\"></div>",
			cancelText: "取消",
			cancelCallback: function () {},
			doneText: "确定",
			doneCallback: function () {
				var result = $("input[name = 'test3']:checked").val();
				$("#" + id + "").val(result);
			},
			cancelOnly: false
		});

	},

	orderhandler: function (event) {
		var target = event.target;
		switch (target.classList[0]) {
		case "increase":
			var previous = target.previousElementSibling;
			previous.innerHTML++;
			break;
		case "subtract":
			var mprevious = target.previousElementSibling.previousElementSibling;
			mprevious.innerHTML--;
			var test = mprevious.innerHTML;
			if (test < 1) {
				alert("不能小于0");
				mprevious.innerHTML = "0";
			}

			break;
		}
	},
	/*弹出框*/
	confirmTime: function () {
		$("#afui").popup({
			title: "时间",
			message: "<input id='aaaaa' type='radio' name='test2' value='10:30-11:00'><label for='aaaaa'>10:30-11:00 </label><input id='bbbbb' type='radio' name='test2' value='11:00-11:30'><label for='bbbbb'>11:00-11:30</label><input id='ccccc' type='radio' name='test2' value='11:30-12:00'><label for='ccccc'>11:30-12:00</label><div style=\"height:100px\"></div>",
			cancelText: "取消",
			cancelCallback: function () {},
			doneText: "确定",
			doneCallback: function () {
				var result = $("input[name = 'test2']:checked").val();
				$("#confirmTime").val(result);
			},
			cancelOnly: false
		});
	},


	/*今日订单*/
	todayOrder: function () {
		//		$.ui.disableLeftSideMenu();
		ajaxBase.loacaltest(
			"./localtest/today.xml",
			Dining.todayOrderSuccess,
			Dining.todayOrderFail
		);
		//		$("af_actionsheet").bind("swipeDown",this.todayOrderHander);   --触发下滑功能
	},
	todayOrderHander: function () {
		alert("触发");
	},
	todayOrderSuccess: function (data, textStatus, jqXHR) {
		var diningname, name, amt, sum, diningList, orderid, result = '';
		var itemlist = $(data).find("items[name='orderInfo'] > item");
		for (var i = 0; i < itemlist.length; i++) {
			diningList = itemlist[i];
			diningname = $(data).find("DININGNAME").text();
			name = $(data).find("NAME").text();
			amt = $(data).find("AMT").text();
			sum = $(data).find("SUM").text();
			orderid = $(data).find("ORDERID").text();
			result += Dining.todayOrderDiv(orderid, diningname, name, amt, sum);
		}
		var result2 = [
			'<div id="todayOrder">',
			'<ul id="orderListCont" class="list">',
			result,
			'</ul>',
			'</div>',
			'<a class="button block">取消</a>'
		].join('');
		$("#afui").actionsheet(result2);
		var myScroller = $("#af_actionsheet").scroller({
			verticalScroll: true,
			horizontalScroll: false,
			autoEnable: true
		});
	},
	todayOrderDiv: function (orderid, diningname, name, amt, sum) {
		var result = [
			'<li><a href="#todayDetail" data-transition="up">',
			'<div id="orderListLeft" class="orderListLeft">',
			'<h3>' + diningname + '</h3>',
			'<p>' + name + '</p>',
			'<p><span>菜品：</span><span>' + sum + '</span>份<span>' + amt + '</span>元</p>',
			'</div>',
			'<div id="orderListRight" class="orderListRight">',
			'<p>10:23</p>',
			'<p>00:26</p>',
			'<p>打印中</p>',
			'</div>',
			'</a>',
			'</li>'
		].join('');
		return result;
	},
	todayOrderFail: function (jqXHR, textStatus, errorThrown) {
		alert("服务器故障");
		$.ui.hideMask();
	},
	menuList_load: function () {
		$("#num").text("8");
		$("#mheaderPop").bind("click", this.mheaderPop);
		$("#mylinks").bind("click", this.handler);
		$.ui.showMask("正在加载中...");
		var diningid = LocalStorage.load("diningid");
		var setdiningno = ["diningid", "810", "typeno", ""];
		//		if (typeof (diningid) != "undefined") {
		/*ajaxBase.crossDomainCall(
				"zrsf.palsoon.common.service.dininghallServiceHandler:queryDishByDiningId",
				this.getAllDining(setdiningno),
				this.menuListSuccess,
				this.menuListFail
			);*/

		//本地测试
		ajaxBase.loacaltest(
			"./localtest/queryDishByDiningId.xml",
			this.menuListSuccess,
			this.menuListFail
		);
		//		}

	},
	menuListSuccess: function (data, textStatus, jqXHR) {
		$.ui.hideMask();
		var dishno, price, taste, dishid, dishname, rn, lxmc, typemc, result, diningList = null;
		var itemlist = $(data).find("items[name='dishList'] > item");
		for (var i = 0; i < itemlist.length; i++) {
			diningList = itemlist[i];
			dishno = $(diningList).find("DISHNO").text();
			price = $(diningList).find("PRICE").text();
			taste = $(diningList).find("TASTE").text();
			dishid = $(diningList).find("DISHID").text(); //储存进Localstorage,用以获取餐厅详细信息
			dishname = $(diningList).find("DISHNAME").text();
			rn = $(diningList).find("RN").text();
			lxmc = $(diningList).find("LX_MC").text();
			typemc = $(diningList).find("TYPE_MC").text();
			result += Dining.menuListDiv(dishno, price, taste, dishid, dishname, rn, lxmc, typemc);
		}
		$("#mylinks").append(result);
	},
	menuListFail: function (jqXHR, textStatus, errorThrown) {
		alert("服务器故障");
		$.ui.hideMask();
	},
	menuListDiv: function (dishno, price, taste, dishid, dishname, rn, lxmc, typemc) {
		/*		<li id="link2">鱼香肉丝¥24
		<span style="margin-left:19px;">×</span>
		<span id="order1" style="margin-left:20px;">0</span>份
		<a class="increase edit">+</a>
		<a class="subtract see">-</a>
	</li>*/
		//		this.dishname = dishname;
		//		this.price = price;
		var result = [
			'<li onclick = "LocalStorage.store("dishid",' + dishid + ')"> ' + dishname + '¥' + price + '',
			'<span>×</span>',
			'<span>0</span>份',
			'<a class="increase edit">+</a>',
			'<a class="subtract see">-</a>',
		].join('');
		return result;
	},



	handler: function (event) {
		var target = event.target;

		if (target.tagName.toLowerCase() == "li") {

			$.ui.loadContent('dishesAbout', false, false, 'slide');

		}
		var previous = target.previousElementSibling;
		var mprevious = target.previousElementSibling.previousElementSibling;
		switch (target.classList[0]) {
		case "increase":
			previous.innerHTML++;
			break;
		case "subtract":
			mprevious.innerHTML--;
			var test = mprevious.innerHTML;
			if (test < 1) {
				alert("不能小于0");
				mprevious.innerHTML = "0";
			}
			break;
		}

		//					alert(target.classList[0]+"---"+event.cancelable+"----"+event.bubbles+"----"+event.eventPhase);
	},
	menuList_unload: function () {
		//		$("#mfooter-one").unbind("click", this.todayOrder);
		$("#mylinks").unbind("click", this.handler);
		$("#mylinks").text("");
	},

	dishabout_load: function () {

		$("#dishadd").bind("click", this.dishaddhandler);
		$.ui.showMask("正在加载中...");
		var dishid = LocalStorage.load("dishid");

		var setdishno = ["dishid", "918", "diningid", "721", "userid", "2"];
		if (typeof (dishid) != "undefined") {
			/*	ajaxBase.crossDomainCall(
				"zrsf.palsoon.common.service.dininghallServiceHandler:queryDishByDishId",
				this.getAllDining(setdishno),
				Dining.dishaboutSuccess,
				Dining.dishaboutFail
			);*/
			ajaxBase.loacaltest(
				"./localtest/queryDishByDishId.xml",
				Dining.dishaboutSuccess,
				Dining.dishaboutFail
			);

		}
	},
	dishAddHandler: function () {
		/*		<ul class="list" style="background:aqua;">
			<p id="diningid811" class="divider" style="margin:0px;">
				<span>真功夫南山店</span>
				<span>¥</span>
				<span class="orderPrice">12</span>
			</p>
			<li id="dishid930">
				<span>鱼香肉丝</span>
				<span>¥</span>
				<span class="orderPrice">13</span>
				<span>×</span>
				<span class="orderPiece">1</span>份
				<a class="increase edit">+</a>
				<a class="subtract see">-</a>
			</li>
			<li id="dishid931">
				<span>鱼香肉丝</span>
				<span>¥</span>
				<span class="orderPrice">16</span>
				<span>×</span>
				<span class="orderPiece">1</span>份
				<a class="increase edit">+</a>
				<a class="subtract see">-</a>
			</li>
		</ul>*/

		var result = [
			'<ul class="list" style="background:aqua;">',
			'<p id="diningid811" class="divider" style="margin:0px;">',
			'<span>真功夫南山店</span>',
			'<span>¥</span>',
			'<span class="orderPrice">12</span>',
			'</p>',
			'<li id="dishid930">',
			'<span>鱼香肉丝23</span>',
			'<span>¥</span>',
			'<span class="orderPrice">12</span>',
			'<span>×</span>',
			'<span class="orderPiece">1</span>份',
			'<a class="increase edit">+</a>',
			'<a class="subtract see">-</a>',
		].join('');
		$("#orderlinks").append(result);
	},
	dishaboutSuccess: function (data, textStatus, jqXHR) {
		$.ui.hideMask();
		var dishintro = $(data).find("DISHINTRO").text();
		var picurl = $(data).find("DISHPICURL").text();
		var dishname = $(data).find("DININGNAME").text();
		var tel = $(data).find("TEL").text();
		var servicezone = $(data).find("SERVICEZONE").text();
		var dishspeed = $(data).find("SPEED_CSI").text();
		var dishamount = $(data).find("AMOUNT").text();
		var worktimeq = $(data).find("WORKTIME_Q").text();
		var worktimez = $(data).find("WORKTIME_Z").text();

		$("#dishworktime").text(worktimeq + "--" + worktimez);
		$("#dishamount").text(dishamount);
		$("#dishspeed").text(dishspeed);
		$("#dishzone").text(servicezone);
		$("#dishtel").text(tel);
		$("#dishname").text(dishname);
		$("#dishintro").text(dishintro);
		//		$("#dishesImg").attr("src", picurl);
	},
	dishaboutFail: function (jqXHR, textStatus, errorThrown) {
		alert("服务器故障");
		$.ui.hideMask();
	},
	dishabout_unload: function () {


	},


	/*个人信息*/
	getFormField: function (selectform) {
		var result = [];
		var field = null;
		for (var i = 0, len = selectform.length; i < len; i++) {
			field = selectform.elements[i];
			result.push(field);
		}
		return result;
	},
	//	/*测试对象*/
	//	SongCan.Myself.prototype = {
	//		constructor: this.Myself,
	//		myselfload: function () {
	//			alert("加载成功");
	//			//		this.adr = $("#myselfadr").val();
	//			//	  this.myselfsubmit = document.querySelector("#myselfsubmit");
	//			//		this.myselfsubmit.addEventListener("click",this.submithandler,false);
	//			$("#myselfsubmit").bind("click", this.submithandler);
	//		},
	//		myselfunload: function () {
	//			$("#myselfsubmit").unbind("click", this.submithandler);
	//			alert("卸载事件");
	//			//		document.querySelector("#myselfsubmit");
	//			//		alert(myselfload);
	//			alert(typeof this.myselfload);
	//			alert("成功");
	//		},
	//		submithandler: function (event) {
	//			alert("绑定功能");
	//			var sex = $("input[name='sex']:checked").val();
	//			var myselfadr = $("#myselfadr").val();
	//			var myselfkouwei = $("#myselfkouwei").val();
	//			var myselftel = $("#myselftel").val();
	//			var verifycode = $("verifycode").val();
	//			alert(sex);
	//		}
	//	},
	myself_load: function () {
		//		$("#verification").bind("click", this.verificathandler);
		$("#myselfsubmit").bind("click", this.submithandler);
		$("#myselfedit").bind("click", this.editHandler);
	},
	myself_unload: function () {
		$("#myselfsubmit").unbind("click", this.submithandler);
		//		$("#verification").unbind("click", this.verificathandler);
		$("#myselfedit").unbind("click", this.editHandler);
	},
	editHandler: function (event) {
		var txtN = document.getElementById("myselfForm").querySelectorAll("input");
		for (i = 0; i < txtN.length; i++) {
			if (txtN[i].type === "text") {
				txtN[i].readOnly = false;
			}
		}
	},
	submithandler: function (event) {
		$.ui.showMask("提交中...");
		var myselfsex = $("input[name='sex']:checked").val();
		var username = $("#username").val();
		var myselfadr = $("#myselfadr").val();
		var flavor = $("#myselfkouwei").val();
		var myselftel = $("#myselftel").val();
		var verifycode = $("#verifycode").val();
		var password = "123456";
		var info = ["grantno", "", "username", username, "tel", myselftel, "verifycode", verifycode, "usertype", 0, "companyname", "", "dietdeclaration", "", "sex", myselfsex, "flavor", flavor, "remark", "", "servicearea", "", "opt", "0", "userpassword", password];
		var adr = ["longitude", "113.46152", "latitude", "22.27154", "isdefault", "1", "address", myselfadr];
		//		var ajaxBase = new AjaxBase();
		//		var dataForm = new DataForm();
		ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.registerServiceHandler:userRegist",
			Dining.userRegist(info, adr),
			function (data, textStatus, jqXHR) {
				var replyCode = dataForm.getReplyCode(data);
				var replyMsg = dataForm.getReplyMsg(data);

				switch (replyCode) {
				case "0":
					$.ui.hideMask();
					//					var verifycode = $(data).find("verifycode").text();
					alert("注册成功");
					//					var itemlist = $(data).find("items[name='diningList'] > item");
					//					for (var i = 0; i < itemlist.length; i++) {
					//						//              $(data).find("GRANTNO").text()
					//						diningList = itemlist[i];
					//
					//						rest_contDiv.diningname = $(diningList).find("DININGNAME").text();
					//
					//						rest_contDiv.tel = $(diningList).find("TEL").text();
					//						rest_contDiv.address = $(diningList).find("ADDRESS").text();
					//						rest_contDiv.servicezone = $(diningList).find("SERVICEZONE").text();
					//						rest_contDiv.picurl = $(diningList).find("PICURL").text();
					//						rest_contDiv.worktime_q = $(diningList).find("WORKTIME_Q").text();
					//						rest_contDiv.worktime_z = $(diningList).find("WORKTIME_Z").text();
					//						rest_contDiv.downprice = $(diningList).find("DOWNPRICE").text();
					//						rest_contDiv.averagetime = $(diningList).find("AVERAGETIME").text();
					//
					//						rest_contDiv.restContentDiv();
					//					}
					//            $("#restList").append(result);

					break;
				case "1":
					alert(replyMsg);
					break;
				case "-1":
					alert(replyMsg);
					break;
				default:
					break;
				}
			},
			function (jqXHR, textStatus, errorThrown) {
				alert("服务器故障");
				$.ui.hideMask();
			}
		);

	},
	/*	myself_load2: function () {
		$("#editmyself").bind("click", this.editHandler);
		var myselfadr = $("#myselfadr").val();
		var myselfkouwei = $("#myselfkouwei").val();
		var myselftel = $("#myselftel").val();
		var verifycode = $("verifycode").val();

		var myselfsubmit = document.querySelector("#myselfsubmit");

		myselfsubmit.addEventListener("onclick", myselfsubmit(), false);




		var radioselected = $("input[name='sex']:checked").val();


		//	var result = ["sex",radioselected];
		//	var fieldObj = getFormField(form);
		//	for (var i=2,len=fieldObj.length;i<len;i++) {
		//		var name = fieldObj[i].name;
		//		var value = fieldObj[i].value;
		//		
		//		alert(name+"+++"+value);
		//	  result.push(name,value);
		//	}
		//	
		//	var field1 = form.elements["sex"].checked;
		//	alert(field1.value);

		//		edit.addEventListener("click", this.editHandler, false);
		var verification = document.querySelector("#verification");
		//		var myselftel = document.querySelector("#myselftel").value;
		var setdata = ["tel", myselftel];
		verification.addEventListener("click", function (event) {
			ajaxBase.crossDomainCall(
				"zrsf.palsoon.common.service.commonServiceHandler:getMobileYZM",
				getAllDining(setdata),
				function (data, textStatus, jqXHR) {
					var replyCode = dataForm.getReplyCode(data);
					var replyMsg = dataForm.getReplyMsg(data);

					switch (replyCode) {
					case "0":
						var verifycode = $(data).find("verifycode").text();
						alert("请输入验证码：" + verifycode);
						break;
					case "1":
						alert(replyMsg);
						break;
					case "-1":
						alert(replyMsg);
						break;
					default:
						break;
					}
				},
				function (jqXHR, textStatus, errorThrown) {
					Toast.show(Messages.MSG_REQUEST_FAIL, "1200", "2", "0");
				}
			);

		}, false);

	},
	success: function (data, textStatus, jqXHR) {

	},
	fail: function (jqXHR, textStatus, errorThrown) {

	},*/
	tDetail_load: function () {
		var dataset = ["orderid", "2221"];
		$.ui.showMask("数据加载中...");
		/*ajaxBase.crossDomainCall(
			"zrsf.palsoon.common.service.OrderFoodServiceHandler:queryDishByOrderid",
			//    dataForm.collectData("", null, new Array("deliveryid",5)),
			this.getAllDining(dataset),
			this.historyOrderSuccess,
			this.historyOrderFail
		);*/

		ajaxBase.loacaltest(
			"./localtest/queryDishByOrderid.xml",
			this.tDetailSuccess,
			this.tDetailFail
		);

	},
	tDetail_unload: function () {
		$("#todayList").html("");
	},
	tDetailSuccess: function (data, textStatus, jqXHR) {
		$.ui.hideMask();
		var dishid, price, dishamt, dishsum, dishname, piece, ordertime, dishOrderstatus, dishList, dishListStr = "";

		var replyCode = dataForm.getReplyCode(data);
		var replyMsg = dataForm.getReplyMsg(data);
		switch (replyCode) {
		case "0":
			var address = $(data).find("ADDRESS").text();
			var diningid = $(data).find("DININGID").text();
			var reminderstatus = $(data).find("REMINDRESTATUS").text();
			var leavetime = $(data).find("LEAVETIME").text();
			var sendend = $(data).find("SENDEND").text();
			var amt = $(data).find("items[name='orderInfo']>item>AMT").text();
			var sendbegin = $(data).find("SENDBEGIN").text();
			var orderno = $(data).find("ORDERNO").text();
			var paytype = $(data).find("PAYTYPE").text();
			var orderstatus = $(data).find("ORDERSTATUS").text();
			var remainingtime = $(data).find("REMAININGTIME").text();
			var orderid = $(data).find("ORDERID").text();
			var diningname = $(data).find("DININGNAME").text();
			var sum = $(data).find("items[name='orderInfo']>item>SUM").text();
			var havetime = $(data).find("HAVETIME").text();
			var tel = $(data).find("TEL").text();
			var deliverytel = $(data).find("DELIVERYTEL").text();
			var username = $(data).find("USERNAME").text();
			$("#todayDName").text(diningname);
			$("#todayTel").text(tel);
			$("#todayAds").text(address);

			$("#tSendBegin").text(sendbegin);
			$("#tOrderHT").text(havetime);

			//			 $("#tDTel").text(deliverytel);
			$("#tDName").text(username + "(" + deliverytel + ")");

			$("#historyOrderPrice").text(amt);
			$("#todaySum").text(sum);
			//			$("#historyOrderTime").val("" + sendbegin + "---" + sendend + "");
			switch (orderstatus) {
			case "0":
				$("#tOrderST").text("用户下单");
				break;
			case "2":
				$("#tOrderST").text("配餐中");
				break;
			case "3":
				$("#tOrderST").text("配送中");
				break;
			case "5":
				$("#tOrderST").text("已结单");
				break;
			case "6":
				$("#tOrderST").text("已退单");
				break;
			case "7":
				$("#tOrderST").text("异常订单");
				break;
			case "8":
				$("#tOrderST").text("已取消订单");
				break;
			}

			var itemlist = $(data).find("items[name='dishList'] > item");
			for (var i = 0, length = itemlist.length; i < length; i++) {
				dishList = itemlist[i];
				price = $(dishList).find("PRICE").text();
				dishamt = $(dishList).find("DISHID").text();

				dishsum = $(dishList).find("SUM").text();
				dishname = $(dishList).find("DISHNAME").text();
				piece = $(dishList).find("PIECE").text();
				ordertime = $(dishList).find("ORDERTIME").text();
				dishOrderstatus = $(dishList).find("ORDERSTATUS").text();
				dishListStr += Dining.tDetailDiv(diningid, diningname, dishid, dishname, price, piece);
			}
			$("#todayList").append(dishListStr);
			//			$("#historyList").append(result);


			break;
		case "1":
			//          Toast.show(replyMsg, "1200", "3", "0");
			//          DataForm.deleteData("mainDiningList table");
			//          $("#mainDiningList").css("display", "none");
			break;
		case "-1":
			//            Toast.show(replyMsg, "1200", "2", "0");
			//            DataForm.deleteData("mainDiningList table");
			//            $("#mainDiningList").css("display", "none");
			break;
		default:
			//            Toast.show(replyMsg, "1200", "2", "0");
			//            DataForm.deleteData("mainDiningList table");
			//            $("#mainDiningList").css("display", "none");
			break;
		}
	},
	tDetailFail: function (jqXHR, textStatus, errorThrown) {
		alert("服务器出现故障");
		$.ui.hideMask();
	},
	tDetailDiv: function (diningid, diningname, dishid, dishname, price, piece) {
		var result = [
			'<li id="dishid982">',
			'<span>' + dishname + '</span>',
			'<span>¥</span>',
			'<span>' + price + '</span>',
			'<span>×</span>',
			'<span class="orderPiece">' + piece + '</span>份',
			'</li>'
		].join('');
		return result;
	}

};