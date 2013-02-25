AjaxDatabaseForm
================

This set of files is a simple template for creating an HTML form that creates/updates a MySQL database through an Ajax connection.

Setup:

The only thing you NEED to do is edit the form.php file and set the appropriate values for 
the five variable at the top of the file. You'll need your server name (use "localhost" if
you're not sure), your database name, your username for accessing the database, your
password for accessing the database, and the name of the table within the database you want
to use/create.

If you want to use Recaptcha with your form, you'll have to add your Recaptcha Private Key 
to the proper variable assignment near the top of the form.php file. You'll also have to 
change a few variable assignments near the top of the /js/form.js file. Set DBForm.recaptcha
to true, change the Recaptcha theme if you wish, and assign your Recaptcha Public Key as
DBForm.recaptchaPublicKey.