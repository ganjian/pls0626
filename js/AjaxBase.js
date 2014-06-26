/**
 * AjaxBase
 * @author: Dingli.
 * @date: 2011-06-15
 * Ajax 基本服务。
 */
function AjaxBase() {
	this.REQUEST_TIMEOUT = 10000;
	this.REQUEST_TYPE = "GET";
	this.CONTENT_TYPE = "application/x-www-form-urlencoded; charset=UTF-8";
	this.REQUEST_DATA_TYPE = "xml";
	this.REQUEST_ASYNC = true;
	this.REQUEST_CACHE = false;
	//this.REQUEST_URL = "http://" + Config.SERVER_IP + ":" + Config.SERVER_PORT + Config.BASE_URL + "/xmlController.do";
	//	this.REQUEST_URL="http://218.17.162.79:8181/diningserv/xmlController.do";
	this.REQUEST_URL = "http://218.17.162.79:8181/diningserv/xmlController.do";
	this.LOCAL_URL = ".localtest";
	/**
	 * 设置超时时间。默认为 10000 (10秒)
	 */
	this.setTimeOut = function (value) {
		this.REQUEST_TIMEOUT = value;
	}

	/**
	 * 设置方法请求类型。默认为 "POST"
	 */
	this.setRequestType = function (value) {
		this.REQUEST_TYPE = value;
	}

	/**
	 * 设置返回结果类型。默认为 "xml"
	 */
	this.setReturnDataType = function (value) {
		this.REQUEST_DATA_TYPE = value;
	}

	/**
	 * 设置是否同步请求。
	 * 设置为 false 为同步，true 为异步请求。默认为 true
	 */
	this.setRequestAsync = function (value) {
		this.REQUEST_ASYNC = value;
	}

	/**
	 * 设置是否使用缓存。
	 * 设置为 false 为不是用。默认为 false
	 */
	this.setUseCache = function (value) {
		this.REQUEST_CACHE = value;
	}

	/**
	 * 设置请求的URL地址。
	 * 设置为 false 为不是用。默认为 false
	 */
	this.setUrl = function (value) {
		this.REQUEST_URL = value;
	}

	/**
	 * 执行远程请求。
	 * sid: 服务SID，类似于XXXX:XXX的形式。
	 * data: 要提交的数据，是一个xml字符串。
	 * _success: 成功时的回调方法。
	 * _error: 失败时的回调方法，可选。
	 */
	this.call = function (sid, data, _success, _error) {
		$.ajax({
			async: this.REQUEST_ASYNC,
			type: this.REQUEST_TYPE,
			cache: this.REQUEST_CACHE,
			contentType: this.CONTENT_TYPE,
			dataType: this.REQUEST_DATA_TYPE,
			timeout: this.REQUEST_TIMEOUT,
			url: this.REQUEST_URL,
			data: {
				sid: sid,
				xmlContent: data
			},
			success: function (data, textStatus, jqXHR) {
				if (_success != null && typeof (_success) != "undefiend") {
					_success(data, textStatus, jqXHR);
					//成功时刷新iScroll，是不是应该在此统一调用？
					if (typeof (myScroll) != "undefined" && myScroll != null) {
						myScroll.refresh();
					}
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (_error != null && typeof (_error) != "undefiend") {
					_error(jqXHR, textStatus, errorThrown);
					//失败时刷新iScroll，是不是应该在此统一调用？
					if (typeof (myScroll) != "undefined" && myScroll != null) {
						myScroll.refresh();
					}
				}
			}
		});
	}
	/*本地测试*/
	this.loacaltest = function (src, _success, _error) {
		$.ajax({
			url: src,
			success: function (data, textStatus, jqXHR) {
				var xmlDoc = (typeof (data) == "string") ? $.parseXML(data) : data;
				_success(xmlDoc, textStatus, jqXHR);
			},
			timeout: "1000",
			error: function (jqXHR, textStatus, errorThrown) {
				if (_error != null && typeof (_error) != "undefiend") {
					_error(jqXHR, textStatus, errorThrown);
					//失败时刷新iScroll，是不是应该在此统一调用？
					if (typeof (myScroll) != "undefined" && myScroll != null) {
						myScroll.refresh();
					}
				}
			}

		});
	}


	/**
	 * 跨域执行远程请求。
	 * sid: 服务SID，类似于XXXX:XXX的形式。
	 * data: 要提交的数据，是一个xml字符串。
	 * _success: 成功时的回调方法。
	 * _error: 失败时的回调方法，可选。
	 */
	this.crossDomainCall = function (sid, data, _success, _error) {
		$.ajax({
			async: this.REQUEST_ASYNC,
			type: this.REQUEST_TYPE,
			cache: this.REQUEST_CACHE,
			contentType: this.CONTENT_TYPE,
			dataType: "jsonp",
			timeout: this.REQUEST_TIMEOUT,
			url: this.REQUEST_URL,
			data: {
				sid: sid,
				xmlContent: data
			},
			jsonp: "jsonpCallback",
			success: function (data, textStatus, jqXHR) {
				if (_success != null && typeof (_success) != "undefiend") {
					var xmlDoc = (typeof (data.contents) == "string") ? $.parseXML(data.contents) : data;
					_success(xmlDoc, textStatus, jqXHR);
					//成功时刷新iScroll，是不是应该在此统一调用？
					if (typeof (myScroll) != "undefined" && myScroll != null) {
						myScroll.refresh();
					}
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (_error != null && typeof (_error) != "undefiend") {
					_error(jqXHR, textStatus, errorThrown);
					//失败时刷新iScroll，是不是应该在此统一调用？
					if (typeof (myScroll) != "undefined" && myScroll != null) {
						myScroll.refresh();
					}
				}
			}
		});
	}
}