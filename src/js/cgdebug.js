/**
 * Created by cgil on 1/5/17.
 */
'use strict';
class Console extends Object {
    static log(message) {
        window.console.log(message)
    }

    static logtimer(message) {
        const timer = new Date().getTime() - window.performance.timing.navigationStart;
        window.console.log(`${message} : page loading time: ${timer} ms`);
    }
}
export {Console as default}