# Laura Keylogger

This project is a collection of `chrome-extension` and `chrome-application` that logs user events on page. Each event is logged with timw, codified, and there is the page name that has generated the event.

## Logging structure

``` Javascript

event : {
	time : {
		epoch : time of event from epoch
		localeTime : time string formatted with locale rules
		localeDate : date string formatted with locale rules
	}	

	title : title of page that generates event

	mouse : {
		x : x position of mouse
		y : y position of mouse
		evnt : type of event (click, move, ...)
		button : button pressed
	}

	keyboard : {
		keyCode : hex code of key pressed
		key : string char of key pressed
		string : complete combination of key pressed
		ctrl : track if ctrl modifier is pressed
		alt : track if alt modifier is pressed
		shift : track if shift modifier is pressed
		meta : track if meta modifier is pressed
	}
}

```

## Installation

 1. Copy the github repo (or download zip file) in folder `$LauraKeylogger`
 2. Install keylogger app and keylogger extension on google-chrome:
   * go to `chrome://extension`
   * select **Deveoper Mode**
   * click on **Load unpacked extension...**
   * select the folder: `$LauraKeylogger/app`
   * select the folder: `$LauraKeylogger/extension`
 3. Copy the `id` value assigned at the app from google-chrome (`$appid`)
 4. Copy the `id` value assigned at the extension from google-chrome (`$extensionid`)
 5. Open the file `$LauraKeylogger/app/appID.js` with a text editor and modify `__appID` variable with `id`'s obtained in steps 3 and 4.
 5. Open the file `$LauraKeylogger/extension/appID.js` with a text editor and modify `__appID` variable with `id`'s obtained in steps 3 and 4.
 6. In chrome, reload the extension and the application. 
