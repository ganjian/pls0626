/**
 * LocalStorage html5 本地缓存类。
 * @author: Dingli.
 * @date: 2013-07-15
 * @support: IE8+, FF3+, Opear10.5+, Chrome4+, Safari4+, iPhone2+, Android2+
 */
function LocalStorage()
{}

/**
 * 检查是否支持本地存储。
 */
LocalStorage.checkLocalStorageSupport = function()
{
	try
	{
		return 'localStorage' in window && window['localStorage'] !== null;
	}
	catch(e)
	{
		return false;
	}
}

/**
 * 加载本地缓存。
 * key: 缓存使用的键。
 */
LocalStorage.load = function(key)
{
	if(LocalStorage.checkLocalStorageSupport())
	{
		return window.localStorage.getItem(key);
	}
}

/**
 * 保存本地缓存。
 * key: 缓存使用的键。
 * value: 缓存内容。
 */
LocalStorage.store = function(key, value)
{
	if(LocalStorage.checkLocalStorageSupport())
	{
		window.localStorage.setItem(key, value);
	}
}

/**
 * 删除指定键的本地存储。
 */
LocalStorage.remove = function(key)
{
	if(LocalStorage.checkLocalStorageSupport())
	{
		window.localStorage.removeItem(key);
	}
}

/**
 * 清理全部本地缓存。
 */
LocalStorage.clear = function()
{
	if(LocalStorage.checkLocalStorageSupport())
	{
		window.localStorage.clear();
	}
}