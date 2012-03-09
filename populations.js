/**
 * @author David Platek theneonlobster@gmail.com
 * @version 0.1
 * @source http://www.esrl.noaa.gov/gmd/grad/solcalc/sunrise.html
 * Implements calculations.js in a form (index.html) to mimic @source
 */

/**
 * Data Structures
 */
function ans(daySave,value) {
    this.daySave = daySave;
    this.value = value;
}

function city(name, lat, lng, zoneHr) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.zoneHr = zoneHr;
}

/**
 * Data for Selectbox Controls
 */
var YesNo = new Array(); // Daylight Saving array
i=0;
    YesNo[i++] = new ans("No",0);
    YesNo[i++] = new ans("Yes",60);

var City = new Array();
j = 0;
    City[j++] = new city("Enter Lat/Long -->",0,0,0);
    City[j++] = new city("",0,0,0);
    City[j++] = new city("US CITIES",0,0,0);
    City[j++] = new city("Albuquerque, NM", 35.0833,106.65,7);
    City[j++] = new city("Anchorage, AK", 61.217, 149.90,9);
    City[j++] = new city("Atlanta, GA", 33.733, 84.383, 5);
    City[j++] = new city("Austin, TX", 30.283, 97.733, 6);
    City[j++] = new city("Birmingham, AL", 33.521, 86.8025, 6);
    City[j++] = new city("Bismarck, ND", 46.817, 100.783, 6);
    City[j++] = new city("Boston, MA", 42.35, 71.05, 5);
    City[j++] = new city("Boulder, CO", 40.125, 105.237, 7);
    City[j++] = new city("Chicago, IL", 41.85,87.65,6);
    City[j++] = new city("Dallas, TX", 32.46, 96.47,6);
    City[j++] = new city("Denver, CO", 39.733, 104.983, 7);
    City[j++] = new city("Detroit, MI", 42.333, 83.05, 5);
    City[j++] = new city("Honolulu, HI", 21.30, 157.85, 10);
    City[j++] = new city("Houston, TX", 29.75, 95.35, 6);
    City[j++] = new city("Indianapolis, IN", 39.767, 86.15, 5);
    City[j++] = new city("Jackson, MS", 32.283, 90.183, 6);
    City[j++] = new city("Kansas City, MO", 39.083, 94.567,6);
    City[j++] = new city("Los Angeles, CA",34.05,118.233,8);
    City[j++] = new city("Menomonee Falls, WI",43.11,88.10,6);
    City[j++] = new city("Miami, FL", 25.767, 80.183,5);
    City[j++] = new city("Minneapolis, MN", 44.967, 93.25, 6);
    City[j++] = new city("New Orleans, LA", 29.95, 90.067, 6);
    City[j++] = new city("New York City, NY", 40.7167, 74.0167, 5);
    City[j++] = new city("Oklahoma City, OK", 35.483, 97.533,6);
    City[j++] = new city("Philadelphia, PA", 39.95, 75.15, 5);
    City[j++] = new city("Phoenix, AZ",33.433,112.067,7);
    City[j++] = new city("Pittsburgh, PA",40.433,79.9833,5);
    City[j++] = new city("Portland, ME", 43.666, 70.283, 5);
    City[j++] = new city("Portland, OR", 45.517, 122.65, 8);
    City[j++] = new city("Raleigh, NC", 35.783, 78.65, 5);
    City[j++] = new city("Richmond, VA", 37.5667, 77.450, 5);
    City[j++] = new city("Saint Louis, MO", 38.6167,90.1833,6);
    City[j++] = new city("San Antonio, TX", 29.53, 98.47, 6);
    City[j++] = new city("San Diego, CA", 32.7667, 117.2167, 8);
    City[j++] = new city("San Francisco, CA",37.7667,122.4167,8);
    City[j++] = new city("Seattle, WA",47.60,122.3167,8);
    City[j++] = new city("Washington DC", 38.8833, 77.0333,5);
    City[j++] = new city("",0,0,0);
    City[j++] = new city("WORLD CITIES",0,0,0);
    City[j++] = new city("Beijing, China",39.9167, -116.4167,-8);
    City[j++] = new city("Berlin, Germany",52.33, -13.30, -1);
    City[j++] = new city("Bombay, India", 18.9333, -72.8333, -5.5);
    City[j++] = new city("Buenos Aires, Argentina", -34.60,58.45,3);
    City[j++] = new city("Cairo, Egypt", 30.10,-31.3667,-2);
    City[j++] = new city("Cape Town, South Africa",-33.9167,-18.3667,-2);
    City[j++] = new city("Caracas, Venezuela", 10.50,66.9333,4);
    City[j++] = new city("Helsinki, Finland", 60.1667, -24.9667,-2);
    City[j++] = new city("Hong Kong, China", 22.25,-114.1667, -8);
    City[j++] = new city("Jerusalem, Israel", 31.7833, -35.2333, -2);
    City[j++] = new city("London, England", 51.50, 0.1667,0);
    City[j++] = new city("Mexico City, Mexico", 19.4,99.15,6);
    City[j++] = new city("Moscow, Russia", 55.75, -37.5833, -3);
    City[j++] = new city("New Delhi, India",28.6, -77.2, -5.5);
    City[j++] = new city("Ottawa, Canada", 45.41667,75.7,5);
    City[j++] = new city("Paris, France", 48.8667, -2.667, -1);
    City[j++] = new city("Rio de Janeiro, Brazil",-22.90,43.2333,3);
    City[j++] = new city("Riyadh, Saudi Arabia", 24.633, -46.71667, -3);
    City[j++] = new city("Rome, Italy",41.90, -12.4833,-1);
    City[j++] = new city("Sydney, Australia",-33.8667,-151.2167,-10);
    City[j++] = new city("Tokyo, Japan", 35.70, -139.7667, -9);
    City[j++] = new city("Zurich, Switzerland", 47.3833, -8.5333,-1);
    City[j++] = new city("",0,0,0);
    City[j++] = new city("SURFRAD NETWORK",0,0,0);
    City[j++] = new city("Goodwin Creek, MS",34.2544444,89.8738888, 6);
    City[j++] = new city("Fort Peck, MT",48.310555,105.1025, 7);
    City[j++] = new city("Bondville, IL",40.055277,88.371944, 6);
    City[j++] = new city("Table Mountain, CO",40.125,105.23694, 7);
    City[j++] = new city("Desert Rock, NV",36.626, 116.018, 8);
    City[j++] = new city("Penn State, PA", 40.72, 77.93, 5);
    City[j++] = new city("Canaan Valley, WV", 39.1, 79.4, 5);
    City[j++] = new city("Sioux Falls, SD", 43.733, 96.6233, 6);
    City[j++] = new city("",0,0,0);
    City[j++] = new city("ARM/CART NETWORK",0,0,0);
    City[j++] = new city("Atqasuk, AK", 70.47215, 157.4078, 9);
    City[j++] = new city("Barrow, AK", 71.30,156.683, 9);
    City[j++] = new city("Manus Island, PNG", -2.06, -147.425,-10);
    City[j++] = new city("Nauru Island", -0.52, -166.92, -12);
    City[j++] = new city("Darwin, Australia", -12.425, -130.891, -9.5);
    City[j++] = new city("SGP Central Facility", 36.6167, 97.5, 6);
    City[j++] = new city("",0,0,0);
    City[j++] = new city("ISIS NETWORK",0,0,0);
    City[j++] = new city("Albuquerque, NM", 35.04, 106.62,7);
    City[j++] = new city("Bismarck, ND", 46.77, 100.77,6);
    City[j++] = new city("Hanford, CA", 36.31, 119.63,8);
    City[j++] = new city("Madison, WI", 43.13, 89.33,6);
    City[j++] = new city("Oak Ridge, TN", 35.96, 84.37,5);
    City[j++] = new city("Salt Lake City, UT", 40.77,111.97,7);
    City[j++] = new city("Seattle, WA", 47.68, 122.25,8);
    City[j++] = new city("Sterling, VA", 38.98, 77.47,5);
    City[j++] = new city("Tallahassee, FL", 30.38, 84.37,5);

/**
 * Populates cityLatLong text fields with city select index (index2) values
 */
function updateCityLatLong(latLongForm, index2) {
    if(index2 != 0) {
        setLatLong(latLongForm, index2);
    }
}

function setLatLong(f, index) {
    // Decimal degrees are passed in the array.  Temporarily store these
    // degs in lat and lon deg and have convLatLong modify them.
    f["latDeg"].value = City[index].lat;
    f["lonDeg"].value = City[index].lng;
    // These are needed to prevent iterative adding of min and sec when
    // set button is clicked.
    f["latMin"].value = 0;
    f["latSec"].value = 0;
    f["lonMin"].value = 0;
    f["lonSec"].value = 0;
    //call convLatLong to convert decimal degrees into table form.
    formConvLatLong(f);
    //Local time zone value set in table
    f["hrsToGMT"].value =  City[index].zoneHr;
}

/**
 * formConvLatLong converts any type of lat/long input into the table form and then handles bad input
 */
function formConvLatLong(f) {
	if(f["latDeg"].value == "") {
		f["latDeg"].value = 0;
	}
	if(f["latMin"].value == "") {
		f["latMin"].value = 0;
	}
	if(f["latSec"].value == "") {
		f["latSec"].value = 0;
	}
	if(f["lonDeg"].value == "") {
		f["lonDeg"].value = 0;
	}
	if(f["lonMin"].value == "") {
		f["lonMin"].value = 0;
	}
	if(f["lonSec"].value == "") {
		f["lonSec"].value = 0;
	}
	var neg = 0;
	if(f["latDeg"].value.charAt(0) == '-') {
		neg = 1;
	}
	if(neg != 1) {
		var latSeconds = (parseFloat(f["latDeg"].value))*3600 + parseFloat(f["latMin"].value)*60 + parseFloat(f["latSec"].value)*1;
		f["latDeg"].value = Math.floor(latSeconds/3600);
		f["latMin"].value = Math.floor((latSeconds - (parseFloat(f["latDeg"].value)*3600))/60);
		f["latSec"].value = Math.floor((latSeconds - (parseFloat(f["latDeg"].value)*3600) - (parseFloat(f["latMin"].value)*60)) + 0.5);
	}
	else if(parseFloat(f["latDeg"].value) > -1) {
		var latSeconds = parseFloat(f["latDeg"].value)*3600 - parseFloat(f["latMin"].value)*60 - parseFloat(f["latSec"].value)*1;
		f["latDeg"].value = "-0";
		f["latMin"].value = Math.floor((-latSeconds)/60);
		f["latSec"].value = Math.floor( (-latSeconds - (parseFloat(f["latMin"].value)*60)) + 0.5);
	}
	else {
		var latSeconds = parseFloat(f["latDeg"].value)*3600 - parseFloat(f["latMin"].value)*60 - parseFloat(f["latSec"].value)*1;
		f["latDeg"].value = Math.ceil(latSeconds/3600);
		f["latMin"].value = Math.floor((-latSeconds + (parseFloat(f["latDeg"].value)*3600))/60);
		f["latSec"].value = Math.floor((-latSeconds + (parseFloat(f["latDeg"].value)*3600) - (parseFloat(f["latMin"].value)*60)) + 0.5);
	}
	neg = 0;
	if(f["lonDeg"].value.charAt(0) == '-') {
		neg = 1;
	}
	if(neg != 1) {
		var lonSeconds = parseFloat(f["lonDeg"].value)*3600 + parseFloat(f["lonMin"].value)*60 + parseFloat(f["lonSec"].value)*1;
		f["lonDeg"].value = Math.floor(lonSeconds/3600);
		f["lonMin"].value = Math.floor((lonSeconds - (parseFloat(f["lonDeg"].value)*3600))/60);
		f["lonSec"].value = Math.floor((lonSeconds - (parseFloat(f["lonDeg"].value)*3600) - (parseFloat(f["lonMin"].value))*60) + 0.5);
	}
	else if(parseFloat(f["lonDeg"].value) > -1) {
		var lonSeconds = parseFloat(f["lonDeg"].value)*3600 - parseFloat(f["lonMin"].value)*60 - parseFloat(f["lonSec"].value)*1;
		f["lonDeg"].value = "-0";
		f["lonMin"].value = Math.floor((-lonSeconds)/60);
		f["lonSec"].value = Math.floor((-lonSeconds - (parseFloat(f["lonMin"].value)*60)) + 0.5);
	}
	else {
		var lonSeconds = parseFloat(f["lonDeg"].value)*3600 - parseFloat(f["lonMin"].value)*60 - parseFloat(f["lonSec"].value)*1;
		f["lonDeg"].value = Math.ceil(lonSeconds/3600);
		f["lonMin"].value = Math.floor((-lonSeconds + (parseFloat(f["lonDeg"].value)*3600))/60);
		f["lonSec"].value = Math.floor((-lonSeconds + (parseFloat(f["lonDeg"].value)*3600) - (parseFloat(f["lonMin"].value)*60)) + 0.5);
	}
	//Test for invalid lat/long input
	if(latSeconds > 324000) {
		alert("You have entered an invalid latitude.\n  Setting lat = 89.");
		f["latDeg"].value = 89;
		f["latMin"].value = 0;
		f["latSec"].value = 0;
	}
	if(latSeconds < -324000) {
		alert("You have entered an invalid latitude.\n  Setting lat = -89.");
		f["latDeg"].value = -89;
		f["latMin"].value = 0;
		f["latSec"].value = 0;
	}
	if(lonSeconds > 648000) {
		alert("You have entered an invalid longitude.\n Setting lon = 180.");
		f["lonDeg"].value = 180;
		f["lonMin"].value = 0;
		f["lonSec"].value = 0;
	}
	if(lonSeconds < -648000) {
		alert("You have entered an invalid longitude.\n Setting lon = -180.");
		f["lonDeg"].value = -180;
		f["lonMin"].value = 0;
		f["lonSec"].value =0;
	}
}

/**
 * Define solarDateTimeLatLongInput values with form values
 */
function solarDateTimeLatLongInput(riseSetForm, latLongForm, index) {
	solarDateTimeLatLong.latDeg = latLongForm["latDeg"].value;
	solarDateTimeLatLong.latMin = latLongForm["latMin"].value;
	solarDateTimeLatLong.latSec = latLongForm["latSec"].value;
	solarDateTimeLatLong.lonDeg = latLongForm["lonDeg"].value;
	solarDateTimeLatLong.lonMin = latLongForm["lonMin"].value;
	solarDateTimeLatLong.lonSec = latLongForm["lonSec"].value;
	solarDateTimeLatLong.hrsToGMT = latLongForm["hrsToGMT"].value;
	solarDateTimeLatLong.daySavings = YesNo[index].value; // = 0 (no) or 60 (yes)
	solarDateTimeLatLong.mos = riseSetForm["mos"].selectedIndex;
	solarDateTimeLatLong.day = riseSetForm["day"].value;
	solarDateTimeLatLong.year = riseSetForm["year"].value;
}

/**
 * Populate form with riseSetFormOutput values defined by calcSun and other functions
 */
function riseSetFormOutput(riseSetForm) {
	riseSetForm["sunrise"].value = solarRiseSet.sunrise;
    riseSetForm["utcsunrise"].value = solarRiseSet.utcSunrise;
    riseSetForm["sunset"].value = solarRiseSet.sunset;
    riseSetForm["utcsunset"].value = solarRiseSet.utcSunset;
    riseSetForm["solnoon"].value = solarRiseSet.solnoon;
    riseSetForm["utcsolnoon"].value = solarRiseSet.utcSolnoon;
    riseSetForm["eqTime"].value = solarRiseSet.eqTime;
    riseSetForm["solarDec"].value = solarRiseSet.solarDec;
}