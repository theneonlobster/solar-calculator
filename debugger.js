/**
 * @author David Platek theneonlobster@gmail.com
 * @version 0.1
 * @source http://www.esrl.noaa.gov/gmd/grad/solcalc/sunrise.html
 */

/**
 * Output global variables to the console
 */
function feedMe() {
    console.log(solarRiseSet.sunrise);
    console.log(solarRiseSet.utcSunrise);
    console.log(solarRiseSet.sunset);
    console.log(solarRiseSet.utcSunset);
    console.log(solarRiseSet.solnoon);
    console.log(solarRiseSet.utcSolnoon);
    console.log(solarRiseSet.eqTime);
    console.log(solarRiseSet.solarDec);
    console.log(solarDateTimeLatLong.latDeg);
    console.log(solarDateTimeLatLong.latMin);
    console.log(solarDateTimeLatLong.latSec);
    console.log(solarDateTimeLatLong.lonDeg);
    console.log(solarDateTimeLatLong.lonMin);
    console.log(solarDateTimeLatLong.lonSec);
    console.log(solarDateTimeLatLong.hrsToGMT);
    console.log(solarDateTimeLatLong.daySavings);
    console.log(solarDateTimeLatLong.mos);
    console.log(solarDateTimeLatLong.day);
    console.log(solarDateTimeLatLong.year);
}