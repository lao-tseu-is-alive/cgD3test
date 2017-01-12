/**
 * Created by cgil on 1/5/17.
 */
'use strict';
import Console from './cgdebug.js';

function main() {
    Console.log('inside main function');
}

document.addEventListener(
    'DOMContentLoaded', () => Console.logtimer(`#EVENT DOMContentLoaded : 
        document.readyState=${document.readyState}`));
window.addEventListener(
    'load',  () => {
        Console.logtimer('EVENT window load');
        function loadScript(url, callback) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = callback;
            script.onload = callback;

            // Fire the loading
            head.appendChild(script);
        }
        main();
    });

