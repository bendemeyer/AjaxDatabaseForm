<?php
	$dbsrv = "DATABASE_SERVER";
	$dbname = "DATABASE_NAME";
	$dbusr = "DATABASE_USERNAME";
	$dbpwd = "DATABASE_PASSWORD";
	$dbtbl = "DATABASE_TABLE_NAME";
	$recaptchaPrivateKey = "YOUR_RECAPTCHA_PRIVATE_KEY";
		
	if ($_POST["recaptcha"] == "true") {
		require_once('recaptchalib.php');
		$resp = recaptcha_check_answer($recaptchaPrivateKey,
			$_SERVER["REMOTE_ADDR"],
			$_POST["challenge"],
			$_POST["response"]
		);
		if (!$resp->is_valid) {
			echo "recaptcha invalid";
		}
		else {
			InsertRowFromForm($dbsrv,$dbusr,$dbpwd,$dbname,$dbtbl);
		}
	}
	else {
		InsertRowFromForm($dbsrv,$dbusr,$dbpwd,$dbname,$dbtbl);
	}
	
	function InsertRowFromForm($dbsrv,$dbusr,$dbpwd,$dbname,$dbtbl)
	{
		$con = mysql_connect($dbsrv,$dbusr,$dbpwd); 
		mysql_select_db($dbname, $con);
		
		$create = "CREATE TABLE IF NOT EXISTS $dbtbl (Date datetime)";
		mysql_query($create);
		$date = date("Y-m-d H:i:s");
		$columns = "Date,";
		$values = "'$date',";
		$fields = json_decode($_POST["fields"]);
		foreach ($fields as $field) {
			$column = "ALTER TABLE $dbtbl ADD COLUMN " . mysql_real_escape_string($field->name) . " " . $field->type;
			try {
				mysql_query($column);
			}
			catch (Exception $e) {
				echo $e->getMessage();
			}
			$columns .= $field->name . ",";
			$values .= "'" . mysql_real_escape_string($field->value) . "'" . ",";
		}
		$columns = substr($columns,0,-1);
		$values = substr($values,0,-1);
		$sql = "INSERT INTO $dbtbl ($columns) VALUES ($values)";
		mysql_query($sql);
		
		mysql_close($con);
	}
?>