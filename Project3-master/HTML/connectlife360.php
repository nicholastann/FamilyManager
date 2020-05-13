<?php
session_start();
// Include config file
require_once "config.php";
 
// Define variables and initialize with empty values
$password = $email = $username_err = $password_err = $email_err = "";
// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){
 
    // Validate username
    if(empty(trim($_POST["circle"]))){
        $username_err = "Please enter the name of your circle.";
    } else{
        $circle = trim($_POST["circle"]);
	}
	
	// Validate email
    if(empty(trim($_POST["email"]))){
        $email = "Please enter an email.";
    } else {
        $email = trim($_POST["email"]);
        }

    
    // Validate password
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter a password.";     
    } else{
        $password = trim($_POST["password"]);
    }
    
    // Check input errors before inserting in database
    if(empty($username_err) && empty($password_err) && empty($email_err)){
        
        // Prepare an insert statement
        $sql = "UPDATE users SET life360username = ?, life360password = ?,
        circle = ? WHERE id = ?";
        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "sssi", $email,
            $password, $circle, $id);
            
            // Set parameters
			//$param_username = $username;
            $id = $_SESSION["id"];
            $_SESSION["life360username"] = $email;
            $_SESSION["life360password"] = $password;
            $_SESSION["circle"] = $circle;


            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                // Redirect to home page
                header("location: home.php");
            } else {
                echo "Something went wrong. Please try again later.";
            }

            // Close statement
            mysqli_stmt_close($stmt);
        }
    }
    
    // Close connection
    mysqli_close($link);
}
?>
 
 <!DOCTYPE html>
<html lang="en">
<head>
	<title>Family Manager Login</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
<!--===============================================================================================-->	
	<link rel="icon" type="image/png" href="images/icons/favicon.ico"/>
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="fonts/font-awesome-4.7.0/css/font-awesome.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="fonts/iconic/css/material-design-iconic-font.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/animate/animate.css">
<!--===============================================================================================-->	
	<link rel="stylesheet" type="text/css" href="vendor/css-hamburgers/hamburgers.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/animsition/css/animsition.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/select2/select2.min.css">
<!--===============================================================================================-->	
	<link rel="stylesheet" type="text/css" href="vendor/daterangepicker/daterangepicker.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="css/util.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
<!--===============================================================================================-->

</head>
<body>
	
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<form  action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post" class="login100-form validate-form">
					<span class="login100-form-title p-b-26">
						Connect your Life360 account
					</span>
				
					<div class="wrap-input100 validate-input">
						<input name="circle"  class="input100" type="text">
						<span class="focus-input100" data-placeholder="Circle" > </span>
					</div>

					<div class="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c" >
						<input class="input100" type="text" name="email">
						<span class="focus-input100" data-placeholder="Email"></span>
					</div>

					<div class="wrap-input100 validate-input" data-validate="Enter password">
						<span class="btn-show-pass">
							<i class="zmdi zmdi-eye"></i>
						</span>
						<input class="input100" type="password" name="password">
						<span class="focus-input100" data-placeholder="Password"></span>
					</div>

					<div class="container-login100-form-btn">
						<div class="wrap-login100-form-btn">
							<div class="login100-form-bgbtn"></div>
								<button  name="submitButton" class="login100-form-btn" value="Submit" >
									Connect Account
								</button>
						</div>
                    </div>
                    

				</form>
			</div>
		</div>
	</div>
	

	<div id="dropDownSelect1"></div>
	
<!--===============================================================================================-->
	<script src="vendor/jquery/jquery-3.2.1.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/animsition/js/animsition.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/bootstrap/js/popper.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/select2/select2.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/daterangepicker/moment.min.js"></script>
	<script src="vendor/daterangepicker/daterangepicker.js"></script>
<!--===============================================================================================-->
	<script src="vendor/countdowntime/countdowntime.js"></script>
<!--===============================================================================================-->
	<script src="js/form.js"></script>

</body>
</html>
