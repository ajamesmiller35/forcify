({
    auth : function(component, event, helper){
        window.location='https://accounts.spotify.com/authorize?client_id=04b9c572a99a410fab751ec399e7a07d&response_type=token&redirect_uri=https%3A%2F%2Fwise-impala-cd7twc-dev-ed.lightning.force.com%2Flightning%2Fn%2FSpotifyPlayer%2F&callback&scope=user-read-private%20user-read-email%20streaming%20user-read-playback-state%20user-modify-playback-state';
    },
    pause : function(component, event, helper){
        let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 204){
            	console.log('PAUSED');   
            }
        }
        req.open('PUT', 'https://api.spotify.com/v1/me/player/pause', true);
        req.setRequestHeader('Authorization', 'Bearer ' + component.get('v.token'));
        req.send();
    },
    play : function(component, event, helper){
    	let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 204){
            	console.log('PLAY');   
            }
        }
        req.open('PUT', 'https://api.spotify.com/v1/me/player/play', true);
        req.setRequestHeader('Authorization', 'Bearer ' + component.get('v.token'));
        req.send();
    },
    playThisList : function(component, event, helper){
    	let target = event.target.id;
        console.log(target);
        let body = {"context_uri": target};
        body = JSON.stringify(body);
        console.log(body);
        let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 204){
            	console.log('PLAY');   
            }
        }
        req.open('PUT', 'https://api.spotify.com/v1/me/player/play', true);
        req.setRequestHeader('Authorization', 'Bearer ' + component.get('v.token'));
        req.send(body);
    },
    next : function(component, event, helper){
    	let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 204){
            	console.log('NEXT');   
            }
        }
        req.open('POST', 'https://api.spotify.com/v1/me/player/next', true);
        req.setRequestHeader('Authorization', 'Bearer ' + component.get('v.token'));
        req.send(); 
    },
    previous : function(component, event, helper){
        let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 204){
            	console.log('PREVIOUS');   
            }
        }
        req.open('POST', 'https://api.spotify.com/v1/me/player/previous', true);
        req.setRequestHeader('Authorization', 'Bearer ' + component.get('v.token'));
        req.send(); 
    },
    initialize : function(component, event, helper) {
        console.log('initialize');
        console.log(window.location.href);        
        
        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?#]' + name + '=([^&#]*)');
            var results = regex.exec(window.location.href);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };
        let token = getUrlParameter('access_token');
        
        if(token == ''){
            token = helper.getCookie('access_token');
        }
        
        
        if(token != ''){
            console.log('Token: ' + token);
            console.log('START PLAYER NOW');
            helper.setCookie('access_token', token);
            component.set('v.token', token);
            component.set('v.needAuth', false);
            
            window.onSpotifyWebPlaybackSDKReady = () => {
              const player = new Spotify.Player({
                name: 'Forcify Player',
                getOAuthToken: cb => { cb(token); }
              });
            
              // Error handling
              player.addListener('initialization_error', ({ message }) => { console.error(message); });
              player.addListener('authentication_error', ({ message }) => { 
              	console.error(message);
                component.set('v.needAuth', true);
              });
              player.addListener('account_error', ({ message }) => { console.error(message); });
              player.addListener('playback_error', ({ message }) => { console.error(message); });                                                            
            
              // Playback status updates
			  player.addListener('player_state_changed', ({
                  position,
                  duration,
                  track_window: { current_track }
                }) => {
                  console.log('Currently Playing', current_track);
                  console.log('Track Name: ' + current_track.name);
                  console.log('Album: ' + current_track.album.name);
                  console.log('Artist: ' + current_track.artists[0])
                  console.log('Position in Song', position);
                  console.log('Duration of Song', duration);
                  component.set('v.currentTrack', current_track);
                });
                  
            
              // Ready
                player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                helper.getPlaylists(component, event, helper, token);
              });
            
              // Not Ready
              player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
              });
            
              // Connect to the player!
              player.connect();
            };   
        }
	}                                                                   
})