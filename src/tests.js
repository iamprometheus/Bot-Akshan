let s = "abcabcbb"

var lengthOfLongestSubstring = function(s) {
    let visited = []
    for (let i = 0; i< s.length; i++) {
    		console.log(s[i])
        if (!visited.includes(s[i]))
            visited.push(s[i])
        else return visited.length
    }
};

lengthOfLongestSubstring(s);