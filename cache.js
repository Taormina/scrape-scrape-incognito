
/** Cache Init
 * @param maxsize	The maximum size of the cache; 0 means no max size.
 * @param timeout The timeout for items in the cache to be invalidated; 0 means no timeout
 */
function init(_maxsize, _timeout) {
	maxsize = _maxsize;
	timeout = _timeout;
	cache = {};
	times = {};
	used = {};
	size = 0;
	initialized = true;
}

/** Cache Put
 * @param key 		The key to be used for the cache entry
 * @param value 	The value to be associated with the given key
 * @return fales	If cache is not initialized
 * @return 1			If entry is succesfully put into cache
 */
function put(key, value) {
	if (!initialized)
		return false;

	d = new Date();

	// If max size is reached, remove LRU item
	if (maxsize > 0 && size == maxsize) {
		min = d.getTime(); 
		mkey = null;

		// Find LRU item
		for (k in used) 
			if (used[k] < min) {
				min = used[k];
				mkey = k;
			}

		// Remove it
		if (mkey != null) {
			delete cache[mkey];
			delete times[mkey];
			delete used[mkey];
			size--;
		}
	}

	// Insert new item into cache
	times[key] = d.getTime();
	used[key] = d.getTime();
	cache[key] = value;
	size++;
	return 1;
}


/** Cache Get
 * @param key 		The key to be queried from the cache
 * @return false	If cache is not initialized
 * @return null 	If cache entry is past the timeout
 * @return value 	Value associated with the cache (this might return null if you ask for something that isn't there)
 */
function get(key) {
	if (!initialized)
		return false;

	d = new Date();

	// If timeout for entry is past
	if (timeout > 0 && d.getTime() - times[key] > timeout)
		return null;

	// Update timestamp
	used[key] = d.getTime();
	return cache[key];
}
