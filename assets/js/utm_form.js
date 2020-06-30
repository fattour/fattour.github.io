!function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=n,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(t){function o(n,r,i){var c;if(arguments.length>1){if(i=e({path:"/"},o.defaults,i),"number"==typeof i.expires){var s=new Date;s.setMilliseconds(s.getMilliseconds()+864e5*i.expires),i.expires=s}try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(a){}return r=t.write?t.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",r,i.expires&&"; expires="+i.expires.toUTCString(),i.path&&"; path="+i.path,i.domain&&"; domain="+i.domain,i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var f=p[u].split("="),l=f[0].replace(d,decodeURIComponent),m=f.slice(1).join("=");'"'===m.charAt(0)&&(m=m.slice(1,-1));try{if(m=t.read?t.read(m,l):t(m,l)||m.replace(d,decodeURIComponent),this.json)try{m=JSON.parse(m)}catch(a){}if(n===l){c=m;break}n||(c[l]=m)}catch(a){}}return c}return o.get=o.set=o,o.getJSON=function(){return o.apply({json:!0},[].slice.call(arguments))},o.defaults={},o.remove=function(n,t){o(n,"",e(t,{expires:-1}))},o.withConverter=n,o}return n(function(){})});

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null) {
	  return "";
	} else {
	  return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
}
var utm_source=utm_medium=utm_content=utm_term=utm_campaign=referrer=last_source=visited="";
referrer	=	document.referrer;
last_source		=	getParameterByName("utm_source");
jQuery(document).ready(function() {
	visited=Cookies.get('visited');
	if(!visited){
		visited=1;
		GetUTMFromURL();
		FillUTMFields();
		Cookies.set('visited', 1, { expires: 30 });
		SetUTMCookies();
	}
	else
	{
		visited=parseInt(Cookies.get('visited'))+1;
		GetUTMFromCookies();
		if(!utm_source){
			GetUTMFromURL();
			FillUTMFields();
			SetUTMCookies();
		}
		else{
			SetUTMCookies();
			FillUTMFields();
		}			
		
		Cookies.set('visited', visited, { expires: 30 });			
	}
});
function GetUTMFromURL(){
	if(getParameterByName("utm_source")) 	utm_source	=	last_source		=	getParameterByName("utm_source");
	if(getParameterByName("utm_medium")) 	utm_medium	=	getParameterByName("utm_medium");
	if(getParameterByName("utm_content"))	utm_content	=	getParameterByName("utm_content");
	if(getParameterByName("utm_term")) 		utm_term	=	getParameterByName("utm_term");
	if(getParameterByName("utm_campaign")) utm_campaign	=	getParameterByName("utm_campaign");

}
function SetUTMCookies(){
	Cookies.set('utm_source', utm_source, { expires: 30 });
	Cookies.set('utm_medium', utm_medium, { expires: 30 });
	Cookies.set('utm_content', utm_content, { expires: 30 });
	Cookies.set('utm_term', utm_term, { expires: 30 });
	Cookies.set('utm_campaign', utm_campaign, { expires: 30 });
}
function GetUTMFromCookies(){
	if(Cookies.get('utm_source'))	utm_source 	= Cookies.get('utm_source');
	if(Cookies.get('utm_medium'))	utm_medium 	= Cookies.get('utm_medium');
	if(Cookies.get('utm_content'))	utm_content = Cookies.get('utm_content');
	if(Cookies.get('utm_term'))		utm_term 	= Cookies.get('utm_term');
	if(Cookies.get('utm_campaign'))	utm_campaign= Cookies.get('utm_campaign');
}
function FillUTMFields(){
	if(utm_source) 	jQuery("input[name$='utm_source']").val(utm_source);
	if(utm_medium) jQuery("input[name$='utm_medium']").val(utm_medium);
	if(utm_content) jQuery("input[name$='utm_content']").val(utm_content);
	if(utm_term) jQuery("input[name$='utm_term']").val(utm_term);
	if(utm_campaign) jQuery("input[name$='utm_campaign']").val(utm_campaign);
	if(referrer) jQuery("input[name$='referrer']").val(referrer);
	if(last_source) jQuery("input[name$='last_source']").val(last_source);
	if(visited) jQuery("input[name$='visited']").val(visited);

}