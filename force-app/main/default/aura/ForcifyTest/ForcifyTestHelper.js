({
	setCookie : function(cname, cvalue) {
      var d = new Date();
      d.setTime(d.getTime() + (60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	},
    getCookie: function(cname){
    	var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
          }
        }
        return "";
    },
    getPlaylists: function(component, event, helper, token){
    	let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let playlists = JSON.parse(this.responseText);
                component.set('v.playlists', playlists.items);
            }
        }
        req.open('GET', 'https://api.spotify.com/v1/me/playlists', true);
        req.setRequestHeader('Authorization', 'Bearer ' + token);
        req.send();
	}
})