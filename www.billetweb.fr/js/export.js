var shop_frame = {
    getInstances: document.getElementsByTagName("a"),
    init: function () {
    	for (var i = 0; i < this.getInstances.length; i++) {
            var a = this.getInstances[i];
            if (-1 !== this.getInstances[i].className.indexOf("shop_frame") && -1 === this.getInstances[i].className.indexOf("updated")) {              
                var frame = document.createElement("iframe");
                frame.style.borderRadius = '10px';
                this.setParams(frame, this.getParams(a)), 1 == this.getParams(a).resize && this.resize(), a.className = a.className + " updated";
                var frameContainer = this.wrap(frame, a);
                frameContainer.classList.add("billetweb");
                frameContainer.style.textAlign = 'center';
                frameContainer.style.maxWidth = '800px';
                frameContainer.style.margin = '0 auto';
                frameContainer.style.width = '100%';
                this.display(a, frameContainer);
                this.getInstances[i].style.display = 'none';
                
                console.log('initializing ticket iframe');
                
                if(String(document.querySelector('meta[name="viewport"]')).includes('maximum-scale')===false){
                	console.log('viewport fix');
            		document.querySelector('meta[name="viewport"]').setAttribute("content",document.querySelector('meta[name="viewport"]').content+", maximum-scale=1");
            	}
				
				const idIframe = this.getParams(a).id;
				const iframeElement = document.getElementById(idIframe);

				if (iframeElement) {
					iframeElement.addEventListener("load", () => {
						try {
							let contentDocument = iframeElement.contentDocument;
							if (contentDocument) {
								let bodyShop = contentDocument.body;
								try {
									let obs = new MutationObserver(mutations => {
										mutations.forEach(mutation => {
											let isReCaptchaVisible = mutation.target.classList.contains("g-recaptcha") &&
												mutation.oldValue?.includes("visibility: hidden") &&
												mutation.target.style?.visibility === "visible";
				
											if (isReCaptchaVisible) {
												console.log("reCAPTCHA est devenu visible :", mutation.target);
												setTimeout(() => {
													mutation.target.scrollIntoView({ behavior: "smooth", block: "center" });
												}, 200);
											}
										});
									});
				
									obs.observe(bodyShop, {
										subtree: true,
										attributes: true,
										attributeFilter: ["style"],
										attributeOldValue: true,
									});
								} catch (e) {
									console.error('Error with MutationObserver:', e);
								}
							} else {
								console.log('The iframe contentDocument is null.');
							}
						} catch (e) {
							console.error('Error accessing contentDocument:', e);
						}
					});
				} else {
					console.error(`Element with id not found.`);
				}
				

            }
        }
    	
    	setTimeout(function(){
			if (typeof gtag !== "undefined") {
				try {
					var gtagConfig = window.gtagDataLayer || window.dataLayer;
					var measurementId = null;
		
					for (var i = 0; i < gtagConfig.length; i++) {
						if (gtagConfig[i][0] === 'config' && gtagConfig[i][1].indexOf('G-') === 0) {
							measurementId = gtagConfig[i][1];
							console.log("gtag ID:", measurementId);
							setInterval(function() {
								if (frame !== undefined) {
									var frameWindow = document.getElementById(frame.id).contentWindow;
									frameWindow.postMessage('analyticsid_' +measurementId, '*'); 
								}
							}, 1000);
							break;
						}
					}
				} catch (e) {
					console.log("Error fetching clientId");  
					console.log(e);
				}
			}

			if (typeof dataLayer !== 'undefined') {
				var gtmId = null;
				var scripts = document.getElementsByTagName('script');
				for (var i = 0; i < scripts.length; i++) {
					if (scripts[i].src && scripts[i].src.includes("googletagmanager.com/gtm.js?id=")) {
						var queryString = scripts[i].src.split('?')[1];
						if (typeof URLSearchParams !== 'undefined') {
							var params = new URLSearchParams(queryString);
							gtmId = params.get('id');
						} else {
							gtmId = scripts[i].src.split('id=')[1];
						}
						console.log("GTM ID:", gtmId);
						setInterval(function() {
							if (typeof frame !== 'undefined' && frame.id) {
								var frameWindow = document.getElementById(frame.id).contentWindow;
								frameWindow.postMessage('gtmid_' + gtmId, '*');
							}
						}, 1000);
						break;
					}
				}
			}

		}, 2000);

    },
    getParams: function (a) {
        var param = {
            id: "event" + a.attributes["data-id"].value,
            src: a.attributes["data-src"].value,
            width: a.attributes["data-max-width"].value,
            height: a.attributes["data-initial-height"].value,
            resize: a.attributes["data-resize"].value,
            scrolling: "data-scrolling" in a.attributes?a.attributes["data-scrolling"].value:"no",
            title: a.attributes["title"].value,
            frameborder: "0"
        };
        
        if("data-margin" in a.attributes){
			param.margin=a.attributes["data-margin"].value;
		}
        
        if(this.getURLParameter('event_id')!=false){
        	param.src+="&event_id="+this.getURLParameter('event_id');
        }
        if(this.getURLParameter('event_date')!=false){
        	param.src+="&date="+this.getURLParameter('event_date');
        }
        if(this.getURLParameter('event_tag')!=false){
        	param.src+="&tag="+this.getURLParameter('event_tag');
        }
        if(this.getURLParameter('event_name')!=false){
        	param.src+="&name="+this.getURLParameter('event_name');
        }
        if(this.getURLParameter('event_view')!=false){
        	param.src+="&view="+this.getURLParameter('event_view');
        }
        if(this.getURLParameter('event_src')!=false){
        	param.src+="&src="+this.getURLParameter('event_src');
        }
        if(this.getURLParameter('event_ticket')!=false){
        	param.src+="&ticket="+this.getURLParameter('event_ticket');
        }
        if(this.getURLParameter('event_filters')!=false){
        	param.src+="&filters="+this.getURLParameter('event_filters');
        }
        if(this.getURLParameter('code')!=false){
        	param.src+="&code="+this.getURLParameter('code');
        }
        if(this.getURLParameter('event_quick')!=false){
        	param.src+="&quick="+this.getURLParameter('event_quick');
        }
        
        return param
    },
    setParams: function (a, params) {
        for (var b in params) a.setAttribute(b, params[b])
    },
    getParentLocation: function (){
    	try {
    		return window.parent.location.href;
    	} catch (e){
    		return false;
    	}
    },
    resize: function () {
    	 
        function resizeEv(event) {

			var message = event.data.toString();
			if (message.indexOf("gtag_") === 0 || message.indexOf("dlayer_") === 0) {
				if(message.indexOf("gtag_") === 0){
					try {
						var jsonContent = message.substring(5);
						var receivedData = JSON.parse(jsonContent);
						if (Array.isArray(receivedData)) {
							if (typeof gtag === "function") {
								receivedData.forEach(function(event) {
									gtag(event.command, event.eventName, event.params);
									console.log('remote gtag event processed');
								});
							} else {
								console.error('gtag is not defined.');
							}
						}
					} catch (e) {
						console.error('Error processing gtag message:', e);
					}
				}
				if(message.indexOf("dlayer_") === 0){
					try {
						var jsonContent = message.substring(7);
						var receivedData = JSON.parse(jsonContent);
						if (Array.isArray(receivedData)) {
							window.dataLayer = window.dataLayer || [];
							receivedData.forEach(function(event) {
								dataLayer.push(event);
							});
							console.log('remote dlayer processed');
						}
					} catch (e) {
						console.error('Error processing dlayer message:', e);
					}
				}
			}
			else{
				
				var result = event.data.toString().split("_");
				var change = false;

				if(document.getElementById(result[2])!=null &&  0 == result[0].indexOf("scroll")){
					var rect = document.getElementById(result[2]).getBoundingClientRect(),
						scrollTop = window.pageYOffset || document.documentElement.scrollTop;
						var offset= rect.top + scrollTop;
						var total = parseFloat(offset)+parseFloat(result[1])-parseFloat(window.innerHeight/2);
						
						console.log('scroll : '+result[1]);
						if(result[1]=="widget"){
							/*window.scrollTo(0, offset);*/
							document.getElementById(result[2]).scrollIntoView();
						}
						else{
							window.scrollTo(0, total);
						}
				}
				
				if(document.getElementById(result[2])!=null &&  0 == result[0].indexOf("fullscreen")){
				   if(result[1]=="on" && window.location.href.indexOf("filesusr")==-1){
					   document.getElementById(result[2]).style.position = 'fixed';
					   document.getElementById(result[2]).style.top = '0px';
					   document.getElementById(result[2]).style.left = '0px';
					   document.getElementById(result[2]).style.right = '0px';
					   document.getElementById(result[2]).style.width = '100%';
					   document.getElementById(result[2]).style.height = '100%';
					   document.getElementById(result[2]).style.zIndex = '1000';
					   document.getElementById(result[2]).style.overflow = 'hidden';
					   document.getElementById(result[2]).setAttribute('fullscreen',true);
				   }
				   else{
					   if(document.getElementById(result[2]).getAttribute('fullscreen')!== undefined){
						   document.getElementById(result[2]).style.position = 'relative';
						   document.getElementById(result[2]).style.height = '';
						   document.getElementById(result[2]).style.overflow = 'auto';
					   }
				   }
				}
				 
				if( 0 == result[0].indexOf("relocate")){
					if(parent==top)
						window.location.href=event.data.toString().replace('relocate_','');
					else
						window.parent.location.href=event.data.toString().replace('relocate_','');
				}
				
				if(0 == result[0].indexOf("event") && document.getElementById(result[0])){
					var current_height = parseInt(document.getElementById(result[0]).height.replace('px',''));
					if(current_height!=result[1]){
						change=true;
					}
				}
	 
				if (result[0].indexOf("event") === 0) {
					 var parentZoom = window.getComputedStyle(document.body).zoom || 1;
					 if (parentZoom < 0.5 || parentZoom > 1) {
						 parentZoom = 1;
					 }
					 var element = document.getElementById(result[0]);
					 if (element) {
						 element.height = result[1]/parentZoom + "px";
					 }
				 }
	 
				
				 if(0 == result[0].indexOf("event") && document.getElementById(result[0])){
					 if(window[result[0]] == undefined ||  window[result[0]] ==0){
						 window[result[0]] =result[1];
					 }
					 
					 if(result[2] !== undefined ){
						 if(document.getElementById(result[0]).dataset.url != undefined && document.getElementById(result[0]).clientWidth < 480){
							 if(document.getElementById(result[0]).dataset.url != result[2])
								 document.getElementById(result[0]).scrollIntoView();
						 }
						 document.getElementById(result[0]).dataset.url= result[2];
					 }
					 
					 
					 if(change){
						 
						 var scroll = window.pageYOffset || document.documentElement.scrollTop;
						 var new_height = parseInt(document.getElementById(result[0]).height.replace('px',''));
						 var size = parseInt(new_height)+parseInt(result[1])-window.innerHeight/3;
						 /*console.log("current "+current_height+" vs "+new_height);*/
						 console.log("resizing iframe : "+Math.round(size)+'px');
					 
						 if(new_height>300 && current_height>new_height &&  size<scroll){
							 console.log('scroll');
							 document.getElementById(result[0]).scrollIntoView();
							 /*window.scrollBy(0, -(scroll/10)); */
						 }
					 
					 }
					 
					 window[result[0]] =result[1];
					 
				}
			}
        }
        window.addEventListener ? window.addEventListener("message", resizeEv, !1) : window.attachEvent("onmessage", resizeEv)
    },
    wrap: function (frame, link) {
        var param = document.createElement("div");
        return param.innerHTML = frame.outerHTML + link.outerHTML, param.style.maxwidth = this.getParams(link).width + "px", param
        
    },
    display: function (a, frame) {
        a.outerHTML = frame.outerHTML
    },
    getURLParameter: function(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    	for (i = 0; i < sURLVariables.length; i++) {
    	    sParameterName = sURLVariables[i].split('=');
    	
    	    if (sParameterName[0] === sParam) {
    	        return sParameterName[1] === undefined ? true : sParameterName[1];
    	    }
    	}
    	
    	return false;
    },
   
};
shop_frame.init();



