<!doctype html>
<html lang="de">
	<head>
		<meta charset="utf-8">
		<title>Moodle Skill</title>
		<meta name="description" content="The HTML5">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<!-- jQuery library -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<!-- Latest compiled JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		<style type="text/css">
			.wrapper {
			margin-top: 80px;
			margin-bottom: 20px;
		}
		.form-signin {
		max-width: 420px;
		padding: 30px 38px 66px;
		margin: 0 auto;
		background-color: #eee;
		border: 3px dotted rgba(0,0,0,0.1);
		}
		.form-signin-heading {
		text-align:center;
		margin-bottom: 30px;
		}
		.form-control {
		position: relative;
		font-size: 16px;
		height: auto;
		padding: 10px;
		}
		input[type="text"] {
		margin-bottom: 0px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		}
		input[type="password"] {
		margin-bottom: 20px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		}
		.error {color: #ff0000;text-align: center;}
		.url {font-size: small;}
		.colorgraph {
		height: 7px;
		border-top: 0;
		background: #c4e17f;
		border-radius: 5px;
		background-image: -webkit-linear-gradient(left, #c4e17f, #c4e17f 12.5%, #f7fdca 12.5%, #f7fdca 25%, #fecf71 25%, #fecf71 37.5%, #f0776c 37.5%, #f0776c 50%, #db9dbe 50%, #db9dbe 62.5%, #c49cde 62.5%, #c49cde 75%, #669ae1 75%, #669ae1 87.5%, #62c2e4 87.5%, #62c2e4);
		background-image: -moz-linear-gradient(left, #c4e17f, #c4e17f 12.5%, #f7fdca 12.5%, #f7fdca 25%, #fecf71 25%, #fecf71 37.5%, #f0776c 37.5%, #f0776c 50%, #db9dbe 50%, #db9dbe 62.5%, #c49cde 62.5%, #c49cde 75%, #669ae1 75%, #669ae1 87.5%, #62c2e4 87.5%, #62c2e4);
		background-image: -o-linear-gradient(left, #c4e17f, #c4e17f 12.5%, #f7fdca 12.5%, #f7fdca 25%, #fecf71 25%, #fecf71 37.5%, #f0776c 37.5%, #f0776c 50%, #db9dbe 50%, #db9dbe 62.5%, #c49cde 62.5%, #c49cde 75%, #669ae1 75%, #669ae1 87.5%, #62c2e4 87.5%, #62c2e4);
		background-image: linear-gradient(to right, #c4e17f, #c4e17f 12.5%, #f7fdca 12.5%, #f7fdca 25%, #fecf71 25%, #fecf71 37.5%, #f0776c 37.5%, #f0776c 50%, #db9dbe 50%, #db9dbe 62.5%, #c49cde 62.5%, #c49cde 75%, #669ae1 75%, #669ae1 87.5%, #62c2e4 87.5%, #62c2e4);
		}
		</style>
	</head>
	<body>
		<div class = "container">
			<div class="wrapper">

				<form action="alexaauth.php" method="post" name="Login_Form" class="form-signin">
					<h3 class="form-signin-heading">Moodle Signin</h3>
					<hr class="colorgraph"><br>
					
					<input type="hidden" name="state" value="<?php echo $_REQUEST["state"]; ?>">
					<input type="hidden" name="redirect_uri" value="<?php echo $_REQUEST["redirect_uri"]; ?>">
					<input type="text" class="form-control url" name="Server" placeholder="Moodle Server" required="" value="https://moodle.mm-bbs.de" />
					<input type="text" class="form-control url" name="Path" placeholder="Moodle Path" required="" value="/moodle" />					
					<input type="text" class="form-control" name="Username" placeholder="Username" required="" autofocus="" />
					<input type="password" class="form-control" name="Password" placeholder="Password" required=""/>
					<?php
						if ($_REQUEST["msg"]) {
							echo '<p class="error">'.$_REQUEST["msg"].'</p>';
						}
					?>
					<button class="btn btn-lg btn-primary btn-block"  name="Submit" value="Login" type="Submit">Login</button>
				</form>
			</div>
		</div>
		<?php
			error_log("1 Alexa receive:".print_r($_REQUEST,TRUE)."\n", 3, "/var/tmp/errors.log");
			
		?>
	</body>
</html>