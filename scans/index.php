<?php
function transformFileNames($elem) {
    return ucfirst(preg_replace('/\\.[^.\\s]{3,4}$/', '', $elem));
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Ransomware report</title>

        <!-- Bootstrap -->
        <link href="css/bootstrap.min.css" rel="stylesheet">

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
      </head>
    <body class="container-fluid">
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="js/jquery.min.js"></script>
        <!-- Include all compiled plugins (below), or include individual files as needed -->
        <script src="js/bootstrap.min.js"></script>
        <!-- Include my script -->
        <script src="js/app.js" type="text/javascript"></script>

        <div class="row">
            <div class="col-xs-12">
                <h1>Ransomware reports <small>(last update: <span id="lastUpdate"></span>)</small></h1>
            </div>
        </div>
        <?php
        $csvFiles = array_map("transformFileNames", glob('*.csv'));
        $index = array_search('Statistics', $csvFiles);
        if ($index) {
            $elem = $csvFiles[$index];

            unset($csvFiles[$index]);
            // Prepend item to array
            array_unshift($csvFiles, $elem);
        }
        ?>
        <div class="row">
            <div class="col-xs-12">
                <ul class="nav nav-pills" id="mainmenu">
                    <?php
                    foreach($csvFiles as $file) {
                        $class = $file === $csvFiles[0] ? 'active' : '';
                        echo "<li class=\"$class\"><a data-toggle='pill' href='#'>$file</a></li>";
                    }
                    ?>
                </ul>
            </div>
        </div>
        <div class="row" id="loading">
            <div class="col-xs-12">
                <p>Loading...</p>
            </div>
        </div>
        <h2 id="error" class="text-danger"></h2>
        <div id="placeholder">
        </div>
    </body>
</html>