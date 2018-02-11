<?php

//echo "Username=".$_REQUEST["Username"];
//echo "Password=".$_REQUEST["Password"];
error_log("Alexa state:".$_REQUEST["state"]."\n", 3, "/var/tmp/errors.log");
error_log("Alexa redirect:".$_REQUEST["redirect_uri"]."\n", 3, "/var/tmp/errors.log");
$url = $_REQUEST["Server"].$_REQUEST["Path"].'/login/token.php?username='.urldecode($_REQUEST["Username"]).'&password='.urldecode($_REQUEST["Password"]).'&service=moodle_mobile_app';
$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);
$content = curl_exec($ch);
$array = json_decode($content, true); // decode json
if ($array["token"]) {
	$ch2 = curl_init();
	$url = $_REQUEST["Server"].$_REQUEST["Path"].'/webservice/rest/server.php?wstoken='.$array["token"].'&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json';
	//echo "url=".$url;
	curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch2, CURLOPT_URL,$url);
	$content2 = curl_exec($ch2);
	$array2 = json_decode($content2, true); // decode json
	if (strlen($_REQUEST["redirect_uri"])!=0 && strlen($_REQUEST["state"])!=0) {
		header("Location: ".$_REQUEST["redirect_uri"]."#state=".$_REQUEST["state"]."&access_token=".$_REQUEST["Server"]."@".$_REQUEST["Path"]."@".$array["token"]."@".$array2["userid"]."&token_type=Bearer");
		die();
	}
	else {
		header("Location: https://service.joerg-tuttas.de/alexa.php?msg=Login%20korrekt,%20aber%20kein%20Parameter%20%27redirect_uri%27%20bzw.%20%27state%27%20gefunden!");
		die();				
	}
}
else {
	header("Location: https://service.joerg-tuttas.de/alexa.php?msg=Login%20fehlgeschlagen");
	die();	
}
?>