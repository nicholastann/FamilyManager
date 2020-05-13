<?php
	//Initialize the session
	session_start();
 
	//Check if the user is logged in, if not then redirect him to login page
	if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
		header("location: login.php");
		exit;
	}

	// Include config file
	require_once "config.php";
 
	// Define variables and initialize with empty values
	$new_txt =  "";
	$new_txt_err = "";
	
	// Processing form data when form is submitted
	if($_SERVER["REQUEST_METHOD"] == "POST"){

			$new_txt = $_POST["txt"];
			
			// Prepare an update statement
			$sql = "UPDATE users SET txt = ? WHERE id = ?";
			
			if ($stmt = mysqli_prepare($link, $sql)){
				// Bind variables to the prepared statement as parameters
				mysqli_stmt_bind_param($stmt, "ii", $param_txt, $param_id);
				
				// Set parameters
				$param_txt = $new_txt;
				$param_id = $_SESSION["id"];
				$_SESSION["txt"] = $new_txt;
				
				// Attempt to execute the prepared statement
				if(mysqli_stmt_execute($stmt)){
					// Password updated successfully. Destroy the session, and redirect to login page
					header("location: home.php");
					exit();
				} 
				else {
					echo "Oops! Something went wrong. Please try again later.";
				}
				// Close statement
				mysqli_stmt_close($stmt);
			}
		// Close connection
		mysqli_close($link);
	}
?>


<!DOCTYPE html>
<html lang="en" class="no-js">

<head>
	<title>Hi, <?php echo htmlspecialchars($_SESSION["username"]); ?>. Welcome to Family Management.</h1></title>

	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="css/demo.css" />
	<link rel="stylesheet" type="text/css" href="css/component.css" />
	<script src="js/modernizr-custom.js"></script>


	<!-- Stylesheets -->
	<link rel="stylesheet" href="css/bootstrap.min.css"/>
	<link rel="stylesheet" href="css/font-awesome.min.css"/>
	<link rel="stylesheet" href="css/themify-icons.css"/>
	<link rel="stylesheet" href="css/accordion.css"/>
	<link rel="stylesheet" href="css/owl.carousel.min.css"/>
	<link rel="stylesheet" href="css/dashstyle.css"/>
	<style>
		#map {
			height: 75%;
			width: 75%;
			z-index: 5;
            bottom: 0;
            position: relative;
			}
	</style>
    <script>
        window.life360username = <?php echo json_encode($_SESSION["life360username"]);?>;
        window.life360password = <?php echo json_encode($_SESSION["life360password"]);?>;
        window.circle = <?php echo json_encode($_SESSION["circle"]);?>;
    </script>

	<!-- Tasks -->
	<link rel="stylesheet" href="GoogleTask/style.css"/>
</head>

<body onload="updatetext();">
	<!-- Page Preloder -->
	<div id="preloder"><div class="loader"></div></div>

	<title>Hi, <?php echo htmlspecialchars($_SESSION["username"]); ?>. Welcome to Family Management.</title>

	<div class="colorlib-loader"></div>

	<!-- navigation -->
	<nav class="pages-nav">
		<div class="pages-nav__item"><a class="link link--page" href="#page-map">Locator</a></div>
		<div class="pages-nav__item" onclick='window.location = "calendar/index.html"'><a class="link link--page" href="calendar/index.html" >Calendar</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-lists">Lists</a></div>
		<div class="pages-nav__item" onclick='window.location = "photos/photos.html"'><a class="link link--page" href="photos/photos.html" >Photos</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-settings">Settings</a></div>
		<div class="pages-nav__item" onclick='window.location = "logout.php"'><a class="link link--page" href="logout.php">Sign Out </a></div>
	</nav>
	<!-- /navigation-->
	
	<!-- page stack -->
	<div class="pages-stack">


		<!-- Map -->
		<div class="page" id="page-map" style="background-image: url('images/4.png');background-size: cover;">
			<header class="bp-header cf"><h1 class="bp-header__title">Locator</h1></header>
			<div class="hero-btn-container" style="display: flex" id =
            "familyButtons"></div>
            <div class="family-info-panel" style="height: 250px; position: absolute; right:
            2%;" id ="infoPanel"></div>
			<div id="map" ></div>
		</div>
		<!-- /map -->


		<!-- Calendar -->
		<div class="page" id="page-calendar" style="background-image: url('images/4.png');background-size: cover;">
			<header class="bp-header cf"><h1 class="bp-header__title">Calendar</h1></header>
		</div>
		<!-- /Calendar -->


		<!-- lists -->
		<div class="page" id="page-lists" style="background-image: url('images/4.png');background-size: cover; overflow:auto;" >
			<header class="bp-header cf"> <h1 class="bp-header__title">Lists</h1></header>
			<div class="sticky" style="float:right;" align="right">
				
					<button class="button" id="authorize_button" style="display: none;"> Authorize</button>
					<button class="button" id="signout_button" style="display: none;">Sign Out</button>
			
					<button class="button" id="create_button" style="display: none;">Create List</button>
					
					<input type="text" id="new_title" value="Enter Title Here" style="display: none;">
					<div class='row'>
						<div class='column'>
							<button class="button" id="submit_title" style="display: none;">Submit</button>
						</div>
						<div class='column'>
							<button class = "button" id="cancel_title" style="display: none;">Cancel</button>
						</div>
					</div>

					<button class="button" id="add_item_button" style="display: none;">Add Item to List</button>
					<!---Drop Down Menu to store all the lists
					<div style="margin-bottom: 20px;" align="right">
						<select id ="drop_select" style="display: none; margin-bottom: 12px;">

						</select>
					</div>-->
					<div align="right">
						<input type="text" id="new_item" value="Enter Item Here" style="display: none;">
					</div>
					<div class='row'>
						<div class='column'>
							<button class="button" id="submit_item" style="display: none;">Submit</button>
						</div>
						<div class='column'>
							<button class = "button" id="cancel_item" style="display: none;">Cancel</button>
						</div>
					</div>
				

					<button class="button" id="delete_button" style="display: none;">Delete Selected</button>
			</div>
					
			
			<div id="root" style="overflow:auto;"></div>
			<script src="GoogleTask/task_working.js"></script>
			<script async defer src="https://apis.google.com/js/api.js" onload="this.onload=function(){};handleClientLoad()" onreadystatechange="if (this.readyState === 'complete') this.onload()"> </script>
		</div>	
		<!-- /Lists -->



		<!-- Photos -->
		<div class="page" id="page-photos" style="background-image: url('images/4.png');background-size: cover;">
			<header class="bp-header cf"><h1 class="bp-header__title">Photos</h1></header>
		</div>
		<!-- /Photos -->



		<!-- Settings -->
		<div class="page" id="page-settings" style="background-image: url('images/4.png');background-size: cover;">
			<header class="bp-header cf"><h1 class="bp-header__title">Settings</h1></header>
					<button onclick='window.location = "resetemail.php"' class="button">reset email</button>
					<button onclick='window.location = "resetpassword.php"' class="button">reset password</button>
					<button onclick='window.location = "connectlife360.php"'
                    class="button">change Life360 information</button>
				</div>
				<div class = splitvertical> 
					<h1 style="text-align: center;font-size:24px">Text Size: <?php echo $_SESSION["txt"]; ?>
					
					<FORM id="form" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
						<div class="range-slider">
							<span id="rs-bullet" class="rs-label"></span><input name="txt" id="rs-range-line" class="rs-range" type="range" value="<?php echo $_SESSION["txt"]; ?>" min="930" max="1140">
						</div>
					</FORM>

					<div style="margin-left: 50px" class="box-minmax"><span>1/2</span><span>2x</span></div>
				</div>
			</h1>
		</div>
		<!-- /Settings -->


	</div>
	<!-- /pages-stack -->
	<button class="menu-button"><span>Menu</span></button>

	<!--====== Javascripts & Jquery ======-->
	<script src="js/classie.js"></script>
	<script src="js/main.js"></script>
	<script src="js/vendor/jquery-3.2.1.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/imagesloaded.pkgd.min.js"></script>
	<script src="js/isotope.pkgd.min.js"></script>
	<script src="js/jquery.nicescroll.min.js"></script>
	<script src="js/circle-progress.min.js"></script>
	<script src="js/dashmain.js"></script>
    <script src="js/bundle.js"></script>
	<script>
		function initMap() {
			window.map = new
			google.maps.Map(document.getElementById('map'),
				{
					center: {lat: 30.62, lng: -96.33},
					zoom: 8
				});
		}
	</script>
	<script> 
		// update font size slider
		$(function(){
    		resize = function() {
        		var v = $('#rs-range-line').val();
				$('*').each(function(){
					var k =  parseInt($(this).css('font-size')); 
					var newSize = k * v / 1000;
					$(this).css('font-size',newSize);
				});
    		}
		})

		var rangeSlider = document.getElementById("rs-range-line");
		var rangeBullet = document.getElementById("rs-bullet");

		rangeSlider.addEventListener("input", showSliderValue, false);

		rangeSlider.onmouseup = function () {
  			document.getElementById("form").submit();
		}

		function updatetext() {
			showSliderValue();
			resize();
		}

		function showSliderValue() {
			var rangeSlider = document.getElementById("rs-range-line");
			var rangeBullet = document.getElementById("rs-bullet");
  			rangeBullet.innerHTML = Math.round(((rangeSlider.value - 930)/1.4)+50 );
			rangeBullet.style.left = ((rangeSlider.value-906)*2.75) + "px";
		}

	</script>
	<script src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAHl9q4c77E-pr7bazVDREqL-WsIjH89vM&callback=initMap" async defer></script>
	
</body>
</html>
