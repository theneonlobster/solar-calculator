/**
 * @author David Platek theneonlobster@gmail.com
 * @version 0.1
 * @source http://www.esrl.noaa.gov/gmd/grad/solcalc/sunrise.html
 * Calculations derived from @source
 * Form-independence by @author
 */

/**
 * Global output variables
 */
var solarRiseSet = new Array();
	solarRiseSet.sunrise = "";	
	solarRiseSet.utcSunrise = "";
	solarRiseSet.sunset = "";
	solarRiseSet.utcSunset = "";
	solarRiseSet.solnoon = "";
	solarRiseSet.utcSolnoon = "";
	solarRiseSet.eqTime = "";
	solarRiseSet.solarDec = "";
	solarRiseSet.dbug = "";

/**
 * Global input variables
 */
var solarDateTimeLatLong = new Array();
	solarDateTimeLatLong.latDeg = "";
	solarDateTimeLatLong.latMin = "";
	solarDateTimeLatLong.latSec = "";
	solarDateTimeLatLong.lonDeg = "";
	solarDateTimeLatLong.lonMin = "";
	solarDateTimeLatLong.lonSec = "";
	solarDateTimeLatLong.hrsToGMT = "";
	solarDateTimeLatLong.mos = ""; // January = 0, December = 11
	solarDateTimeLatLong.day = "";
	solarDateTimeLatLong.year = "";
	solarDateTimeLatLong.daySavings = ""; // = 0 (no) or 60 (yes)

/**
 * List of months and days (for non-leap years) used by isValidInput, calcDateFromJD, and calcDayFromJD
 */
var monthList = new Array();
var i = 0;
	monthList[i++] = new month("January", 31, "Jan");
	monthList[i++] = new month("February", 28, "Feb");
	monthList[i++] = new month("March", 31, "Mar");
	monthList[i++] = new month("April", 30, "Apr");
	monthList[i++] = new month("May", 31, "May");
	monthList[i++] = new month("June", 30, "Jun");
	monthList[i++] = new month("July", 31, "Jul");
	monthList[i++] = new month("August", 31, "Aug");
	monthList[i++] = new month("September", 30, "Sep");
	monthList[i++] = new month("October", 31, "Oct");
	monthList[i++] = new month("November", 30, "Nov");
	monthList[i++] = new month("December", 31, "Dec");

function month(name, numdays, abbr) {
    this.name = name;
    this.numdays = numdays;
    this.abbr = abbr;
}

/**
 * Returns 1 if the 4-digit yr is a leap year, 0 if it is not
 */
function isLeapYear(yr) {
	return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
}

/**
 * isPosInteger returns false if the value is not a positive integer, true is returned otherwise.  The code is from taken from Danny Goodman's Javascript Handbook, p. 372.
 */
function isPosInteger(inputVal) {
	inputStr = ("" + inputVal);
	for (var i = 0; i < inputStr.length; i++) {
			var oneChar = inputStr.charAt(i);
			if (oneChar < "0" || oneChar > "9")
				return false;
	}
	return true;
}

function isInteger(inputVal) {
	inputStr = "" + inputVal;
	if(inputStr == "NaN") return false;
	if(inputStr == "-NaN") return false;
	for (var i = 0; i < inputStr.length; i++) {
		var oneChar = inputStr.charAt(i);
		if (i == 0 && (oneChar == "-" || oneChar == "+")) {
			continue;
		}
		if (oneChar < "0" || oneChar > "9") {
			return false;
		}
	}
	return true;
}

function isNumber(inputVal) {
	var oneDecimal = false;
	var inputStr = "" + inputVal;
	for (var i = 0; i < inputStr.length; i++) {
		var oneChar = inputStr.charAt(i);
		if (i == 0 && (oneChar == "-" || oneChar == "+")) {
			continue;
		}
		if (oneChar == "." && !oneDecimal) {
			oneDecimal = true;
			continue;
		}
		if (oneChar < "0" || oneChar > "9") {
			return false;
		}
	}
	return true;
}

/**
 * isValidInput makes sure valid input is entered before going ahead to calculate the sunrise and sunset.
 * False is returned if an invalid entry was made, true if the entry is valid.
 */
function isValidInput(index) {
	if (solarDateTimeLatLong.day == "") { // see if the day field is empty
		alert("You must enter a day before attempting the calculation.");
		return false;
	}
	else if (solarDateTimeLatLong.year == "") { // see if the year field is empty
		alert("You must enter a year before attempting the calculation.");
		return false;
	}
	else if (!isPosInteger(solarDateTimeLatLong.day) || solarDateTimeLatLong.day == 0) {
		alert("The day must be a positive integer.");
		return false;
	}
	else if (!isInteger(solarDateTimeLatLong.year)) {
		alert("The year must be an integer.");
		return false;
	}
	else if ((solarDateTimeLatLong.year < -1000) || (solarDateTimeLatLong.year > 3000)) {
		alert("The algorithm used is not valid for years outside of/nthe range -1000 to 3000.");
		return false;
	}
	// For the non-February months see if the day entered is greater than the number of days in the selected month
	else if ((index != 1) && (solarDateTimeLatLong.day > monthList[index].numdays)) {
		alert("There are only " + monthList[index].numdays + " days in " + monthList[index].name + ".");
		return false;
	}
	// First see if the year entered is a leap year. If so we have to make sure the days entered is <= 29.  If not a leap year we make sure that the days entered is <= 28.
	else if (index == 1) { // month selected is February the screwball month
		if (isLeapYear(solarDateTimeLatLong.year)) { // year entered is a leap year
			if (solarDateTimeLatLong.day > (monthList[index].numdays + 1)) {
				alert("There are only " + (monthList[index].numdays + 1) + " days in " + monthList[index].name + ".");
				return false;
			}
			else
				return true;
		}
		else { // year entered is not a leap year
			if (solarDateTimeLatLong.day > monthList[index].numdays) {
				alert("There are only " + monthList[index].numdays + " days in " + monthList[index].name + ".");
				return false;
			}
			else
				return true;
		}
	}
	else
		return true;
}

/**
 * Converts any type of lat/long input into the table form and then handles bad input
 * Nested in the calcSun function.
 */
function convLatLong(f) {
	if(solarDateTimeLatLong.latDeg == "") {
		solarDateTimeLatLong.latDeg = 0;
	}
	if(solarDateTimeLatLong.latMin == "") {
		solarDateTimeLatLong.latMin = 0;
	}
	if(solarDateTimeLatLong.latSec == "") {
		solarDateTimeLatLong.latSec = 0;
	}
	if(solarDateTimeLatLong.lonDeg == "") {
		solarDateTimeLatLong.lonDeg = 0;
	}
	if(solarDateTimeLatLong.lonMin == "") {
		solarDateTimeLatLong.lonMin = 0;
	}
	if(solarDateTimeLatLong.lonSec == "") {
		solarDateTimeLatLong.lonSec = 0;
	}
	var neg = 0;
	if(solarDateTimeLatLong.latDeg.charAt(0) == '-') {
		neg = 1;
	}
	if(neg != 1) {
		var latSeconds = (parseFloat(solarDateTimeLatLong.latDeg))*3600 + parseFloat(solarDateTimeLatLong.latMin)*60 + parseFloat(solarDateTimeLatLong.latSec)*1;
		solarDateTimeLatLong.latDeg = Math.floor(latSeconds/3600);
		solarDateTimeLatLong.latMin = Math.floor((latSeconds - (parseFloat(solarDateTimeLatLong.latDeg)*3600))/60);
		solarDateTimeLatLong.latSec = Math.floor((latSeconds - (parseFloat(solarDateTimeLatLong.latDeg)*3600) - (parseFloat(solarDateTimeLatLong.latMin)*60)) + 0.5);
	}
	else if(parseFloat(solarDateTimeLatLong.latDeg) > -1) {
		var latSeconds = parseFloat(solarDateTimeLatLong.latDeg)*3600 - parseFloat(solarDateTimeLatLong.latMin)*60 - parseFloat(solarDateTimeLatLong.latSec)*1;
		solarDateTimeLatLong.latDeg = "-0";
		solarDateTimeLatLong.latMin = Math.floor((-latSeconds)/60);
		solarDateTimeLatLong.latSec = Math.floor( (-latSeconds - (parseFloat(solarDateTimeLatLong.latMin)*60)) + 0.5);
	}
	else {
		var latSeconds = parseFloat(solarDateTimeLatLong.latDeg)*3600 - parseFloat(solarDateTimeLatLong.latMin)*60 - parseFloat(solarDateTimeLatLong.latSec)*1;
		solarDateTimeLatLong.latDeg = Math.ceil(latSeconds/3600);
		solarDateTimeLatLong.latMin = Math.floor((-latSeconds + (parseFloat(solarDateTimeLatLong.latDeg)*3600))/60);
		solarDateTimeLatLong.latSec = Math.floor((-latSeconds + (parseFloat(solarDateTimeLatLong.latDeg)*3600) - (parseFloat(solarDateTimeLatLong.latMin)*60)) + 0.5);
	}
	neg = 0;
	if(solarDateTimeLatLong.lonDeg.charAt(0) == '-') {
		neg = 1;
	}
	if(neg != 1) {
		var lonSeconds = parseFloat(solarDateTimeLatLong.lonDeg)*3600 + parseFloat(solarDateTimeLatLong.lonMin)*60 + parseFloat(solarDateTimeLatLong.lonSec)*1;
		solarDateTimeLatLong.lonDeg = Math.floor(lonSeconds/3600);
		solarDateTimeLatLong.lonMin = Math.floor((lonSeconds - (parseFloat(solarDateTimeLatLong.lonDeg)*3600))/60);
		solarDateTimeLatLong.lonSec = Math.floor((lonSeconds - (parseFloat(solarDateTimeLatLong.lonDeg)*3600) - (parseFloat(solarDateTimeLatLong.lonMin))*60) + 0.5);
	}
	else if(parseFloat(solarDateTimeLatLong.lonDeg) > -1) {
		var lonSeconds = parseFloat(solarDateTimeLatLong.lonDeg)*3600 - parseFloat(solarDateTimeLatLong.lonMin)*60 - parseFloat(solarDateTimeLatLong.lonSec)*1;
		solarDateTimeLatLong.lonDeg = "-0";
		solarDateTimeLatLong.lonMin = Math.floor((-lonSeconds)/60);
		solarDateTimeLatLong.lonSec = Math.floor((-lonSeconds - (parseFloat(solarDateTimeLatLong.lonMin)*60)) + 0.5);
	}
	else {
		var lonSeconds = parseFloat(solarDateTimeLatLong.lonDeg)*3600 - parseFloat(solarDateTimeLatLong.lonMin)*60 - parseFloat(solarDateTimeLatLong.lonSec)*1;
		solarDateTimeLatLong.lonDeg = Math.ceil(lonSeconds/3600);
		solarDateTimeLatLong.lonMin = Math.floor((-lonSeconds + (parseFloat(solarDateTimeLatLong.lonDeg)*3600))/60);
		solarDateTimeLatLong.lonSec = Math.floor((-lonSeconds + (parseFloat(solarDateTimeLatLong.lonDeg)*3600) - (parseFloat(solarDateTimeLatLong.lonMin)*60)) + 0.5);
	}
	//Test for invalid lat/long input
	if(latSeconds > 324000) {
		alert("You have entered an invalid latitude.\n  Setting lat = 89.");
		solarDateTimeLatLong.latDeg = 89;
		solarDateTimeLatLong.latMin = 0;
		solarDateTimeLatLong.latSec = 0;
	}
	if(latSeconds < -324000) {
		alert("You have entered an invalid latitude.\n  Setting lat = -89.");
		solarDateTimeLatLong.latDeg = -89;
		solarDateTimeLatLong.latMin = 0;
		solarDateTimeLatLong.latSec = 0;
	}
	if(lonSeconds > 648000) {
		alert("You have entered an invalid longitude.\n Setting lon = 180.");
		solarDateTimeLatLong.lonDeg = 180;
		solarDateTimeLatLong.lonMin = 0;
		solarDateTimeLatLong.lonSec = 0;
	}
	if(lonSeconds < -648000) {
		alert("You have entered an invalid longitude.\n Setting lon = -180.");
		solarDateTimeLatLong.lonDeg = -180;
		solarDateTimeLatLong.lonMin = 0;
		solarDateTimeLatLong.lonSec =0;
	}
}

/**
 * Convert radian angle to degrees
 */ 
function radToDeg(angleRad) {
    return (180.0 * angleRad / Math.PI);
}

/**
 * Convert degree angle to radians
 */
function degToRad(angleDeg) {
    return (Math.PI * angleDeg / 180.0);
}

/** 
 * Return the numerical day-of-year from mn (January = 1), day (1-31), and lpyr (1 = TRUE) info
 */
function calcDayOfYear(mn, dy, lpyr) {
    var k = (lpyr ? 1 : 2);
    var doy = Math.floor((275 * mn)/9) - k * Math.floor((mn + 9)/12) + dy -30;
    return doy;
}

/**
 * Return string containing name of weekday from Julian Day
 */
function calcDayOfWeek(juld) {
    var A = (juld + 1.5) % 7;
    var DOW = (A==0)?"Sunday":(A==1)?"Monday":(A==2)?"Tuesday":(A==3)?"Wednesday":(A==4)?"Thursday":(A==5)?"Friday":"Saturday";
    return DOW;
}

/**
 * Return Julian Day corresponding to year (4 digit year), month (January = 1), and day (1 - 31)
 * Note: Number is returned for start of day.  Fractional days should be added later.
 */
function calcJD(year, month, day) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    var A = Math.floor(year/100);
    var B = 2 - A + Math.floor(A/4);
    var JD = Math.floor(365.25*(year + 4716)) + Math.floor(30.6001*(month+1)) + day + B - 1524.5;
    return JD;
}

/**
 * Return calendar date in the form DD-MONTHNAME-YYYY from Julian Day
 */
function calcDateFromJD(jd) {
    var z = Math.floor(jd + 0.5);
    var f = (jd + 0.5) - z;
    if (z < 2299161) {
        var A = z;
    } else {
        alpha = Math.floor((z - 1867216.25)/36524.25);
        var A = z + 1 + alpha - Math.floor(alpha/4);
    }
    var B = A + 1524;
    var C = Math.floor((B - 122.1)/365.25);
    var D = Math.floor(365.25 * C);
    var E = Math.floor((B - D)/30.6001);
    var day = B - D - Math.floor(30.6001 * E) + f;
    var month = (E < 14) ? E - 1 : E - 13;
    var year = (month > 2) ? C - 4716 : C - 4715;
    // alert ("date: " + day + "-" + monthList[month-1].name + "-" + year);
    return (day + "-" + monthList[month-1].name + "-" + year);
}

/**
 * Return calendar day in the form DD-MONTH (minus year) from Julian Day
 */
function calcDayFromJD(jd) {
    var z = Math.floor(jd + 0.5);
    var f = (jd + 0.5) - z;
    if (z < 2299161) {
        var A = z;
    } else {
        alpha = Math.floor((z - 1867216.25)/36524.25);
        var A = z + 1 + alpha - Math.floor(alpha/4);
    }
    var B = A + 1524;
    var C = Math.floor((B - 122.1)/365.25);
    var D = Math.floor(365.25 * C);
    var E = Math.floor((B - D)/30.6001);
    var day = B - D - Math.floor(30.6001 * E) + f;
    var month = (E < 14) ? E - 1 : E - 13;
    var year = (month > 2) ? C - 4716 : C - 4715;
    return ((day<10 ? "0" : "") + day + monthList[month-1].abbr);
}

/**
 * Return the T value corresponding to the Julian Day converted to centuries since J2000.0
 */
function calcTimeJulianCent(jd) {
    var T = (jd - 2451545.0)/36525.0;
    return T;
}

/**
 * Return the number of Julian centuries since J2000.0 corresponding to the t value
 */
function calcJDFromJulianCent(t) {
    var JD = t * 36525.0 + 2451545.0;
    return JD;
}

/**
 * Return the Geometric Mean Longitude of the Sun in degrees for t
 */
function calcGeomMeanLongSun(t) {
    var L0 = 280.46646 + t * (36000.76983 + 0.0003032 * t);
    while(L0 > 360.0) {
        L0 -= 360.0;
    }
    while(L0 < 0.0) {
        L0 += 360.0;
    }
    return L0; // in degrees
}

/**
 * Return the Geometric Mean Anomaly of the Sun in degrees for t
 */
function calcGeomMeanAnomalySun(t) {
    var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
    return M; // in degrees
}

/**
 * Return the unitless eccentricity of earth's orbit for t
 */
function calcEccentricityEarthOrbit(t) {
    var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    return e; // unitless
}

/**
 * Calculate the equation of center for the sun for t
 */
function calcSunEqOfCenter(t) {
    var m = calcGeomMeanAnomalySun(t);
    var mrad = degToRad(m);
    var sinm = Math.sin(mrad);
    var sin2m = Math.sin(mrad+mrad);
    var sin3m = Math.sin(mrad+mrad+mrad);
    var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
    return C; // in degrees
}

/**
 * Return sun's true longitude in degrees for t
 */
function calcSunTrueLong(t) {
    var l0 = calcGeomMeanLongSun(t);
    var c = calcSunEqOfCenter(t);
    var O = l0 + c;
    return O; // in degrees
}

/**
 * Return sun's true anamoly in degrees for t
 */
function calcSunTrueAnomaly(t) {
    var m = calcGeomMeanAnomalySun(t);
    var c = calcSunEqOfCenter(t);
    var v = m + c;
    return v; // in degrees
}

/**
 * Return the distance to the sun (sun radius vector) in AUs for t
 */
function calcSunRadVector(t) {
    var v = calcSunTrueAnomaly(t);
    var e = calcEccentricityEarthOrbit(t);
    var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(v)));
    return R; // in AUs
}

/**
 * Return sun's apparent longitude in degrees for t
 */
function calcSunApparentLong(t) {
    var o = calcSunTrueLong(t);
    var omega = 125.04 - 1934.136 * t;
    var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
    return lambda; // in degrees
}

/**
 * Return mean obliquity of the ecliptic in degrees for t
 */
function calcMeanObliquityOfEcliptic(t) {
    var seconds = 21.448 - t*(46.8150 + t*(0.00059 - t*(0.001813)));
    var e0 = 23.0 + (26.0 + (seconds/60.0))/60.0;
    return e0; // in degrees
}

/**
 * Return corrected obliquity of the ecliptic in degrees for t
 */
function calcObliquityCorrection(t) {
    var e0 = calcMeanObliquityOfEcliptic(t);
    var omega = 125.04 - 1934.136 * t;
    var e = e0 + 0.00256 * Math.cos(degToRad(omega));
    return e; // in degrees
}

/**
 * Return sun's right ascension in degrees for t
 */
function calcSunRtAscension(t) {
    var e = calcObliquityCorrection(t);
    var lambda = calcSunApparentLong(t);
    var tananum = (Math.cos(degToRad(e)) * Math.sin(degToRad(lambda)));
    var tanadenom = (Math.cos(degToRad(lambda)));
    var alpha = radToDeg(Math.atan2(tananum, tanadenom));
    return alpha; // in degrees
}

/**
 * Return sun's declination in degrees for t
 */
function calcSunDeclination(t) {
    var e = calcObliquityCorrection(t);
    var lambda = calcSunApparentLong(t);
    var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
    var theta = radToDeg(Math.asin(sint));
    return theta; // in degrees
}

/**
 * Calculate the difference between true solar time and mean solar time for t
 * Return equation of time in minutes of time
 */
function calcEquationOfTime(t) {
    var epsilon = calcObliquityCorrection(t);
    var l0 = calcGeomMeanLongSun(t);
    var e = calcEccentricityEarthOrbit(t);
    var m = calcGeomMeanAnomalySun(t);
    var y = Math.tan(degToRad(epsilon)/2.0);
    y *= y;
    var sin2l0 = Math.sin(2.0 * degToRad(l0));
    var sinm   = Math.sin(degToRad(m));
    var cos2l0 = Math.cos(2.0 * degToRad(l0));
    var sin4l0 = Math.sin(4.0 * degToRad(l0));
    var sin2m  = Math.sin(2.0 * degToRad(m));
    var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
    return radToDeg(Etime)*4.0; // in minutes of time
}

/**
 * Return hour angle of the sun at sunrise in radians for latitude of observer in degrees and declination angle of sun in degrees
 */
function calcHourAngleSunrise(lat, solarDec) {
    var latRad = degToRad(lat);
    var sdRad  = degToRad(solarDec);
    var HAarg = (Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad));
    var HA = (Math.acos(Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad)));
    return HA; // in radians
}

/**
 * Return hour angle of of the sun at sunset in radians for latitude of observer in degrees and declination angle of sun in degrees
 */
function calcHourAngleSunset(lat, solarDec) {
    var latRad = degToRad(lat);
    var sdRad  = degToRad(solarDec);
    var HAarg = (Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad));
    var HA = (Math.acos(Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad)));
    return -HA; // in radians
}

/**
 * Return the Universal Coordinated Time (UTC) of sunrise for the given Julian Day at the given location on earth in degrees in minutes from zero Z
 */
function calcSunriseUTC(JD, latitude, longitude) {
    var t = calcTimeJulianCent(JD);
    // Find the time of solar noon at the location, and use that declination.
    // This is better than start of the Julian Day
    var noonmin = calcSolNoonUTC(t, longitude);
    var tnoon = calcTimeJulianCent (JD+noonmin/1440.0);
    // First pass to approximate sunrise (using solar noon)
    var eqTime = calcEquationOfTime(tnoon);
    var solarDec = calcSunDeclination(tnoon);
    var hourAngle = calcHourAngleSunrise(latitude, solarDec);
    var delta = longitude - radToDeg(hourAngle);
    var timeDiff = 4 * delta; // in minutes of time
    var timeUTC = 720 + timeDiff - eqTime; // in minutes
    // alert("eqTime = " + eqTime + "\nsolarDec = " + solarDec + "\ntimeUTC = " + timeUTC);
    // Second pass includes fractional jday in gamma calc
    var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC/1440.0); 
    eqTime = calcEquationOfTime(newt);
    solarDec = calcSunDeclination(newt);
    hourAngle = calcHourAngleSunrise(latitude, solarDec);
    delta = longitude - radToDeg(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes
    // alert("eqTime = " + eqTime + "\nsolarDec = " + solarDec + "\ntimeUTC = " + timeUTC);
    return timeUTC;
}

/**
 * Return the Universal Coordinated Time (UTC) of solar noon for the given day at the given location on earth in degrees in minutes from zero Z
 */
function calcSolNoonUTC(t, longitude) {
    // First pass uses approximate solar noon to calculate eqtime
    var tnoon = calcTimeJulianCent(calcJDFromJulianCent(t) + longitude/360.0);
    var eqTime = calcEquationOfTime(tnoon);
    var solNoonUTC = 720 + (longitude * 4) - eqTime; // min
    var newt = calcTimeJulianCent(calcJDFromJulianCent(t) -0.5 + solNoonUTC/1440.0); 
    eqTime = calcEquationOfTime(newt);
    // var solarNoonDec = calcSunDeclination(newt);
    solNoonUTC = 720 + (longitude * 4) - eqTime; // min
    return solNoonUTC;
}

/**
 * Return  the Universal Coordinated Time (UTC) of sunset for the given day at the given location on earth in degrees in minutes from zero Z
 */
function calcSunsetUTC(JD, latitude, longitude) {
    var t = calcTimeJulianCent(JD);
    // Find the time of solar noon at the location, and use that declination.
    // This is better than start of the Julian Day
    var noonmin = calcSolNoonUTC(t, longitude);
    var tnoon = calcTimeJulianCent (JD+noonmin/1440.0);
    // First calculates sunrise and approx length of day
    var eqTime = calcEquationOfTime(tnoon);
    var solarDec = calcSunDeclination(tnoon);
    var hourAngle = calcHourAngleSunset(latitude, solarDec);
    var delta = longitude - radToDeg(hourAngle);
    var timeDiff = 4 * delta;
    var timeUTC = 720 + timeDiff - eqTime;
    // first pass used to include fractional day in gamma calc
    var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC/1440.0);
    eqTime = calcEquationOfTime(newt);
    solarDec = calcSunDeclination(newt);
    hourAngle = calcHourAngleSunset(latitude, solarDec);
    delta = longitude - radToDeg(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes
    return timeUTC;
}

/**
 * Return the decimal latitude from the degrees, minutes and seconds entered into a form
 */
function getLatitude() {
    var neg = 0;
    var strLatDeg = solarDateTimeLatLong.latDeg;
    var degs = parseFloat(solarDateTimeLatLong.latDeg);
    if (solarDateTimeLatLong.latDeg.charAt(0) == '-') {
        neg = 1;
    }
    if (strLatDeg.indexOf(".") != -1) {
    	solarDateTimeLatLong.latMin = 0;
    	solarDateTimeLatLong.latSec = 0;
    }
    if(solarDateTimeLatLong.latMin == "") {
    	solarDateTimeLatLong.latMin = 0;
    }
    if(solarDateTimeLatLong.latSec == "") {
    	solarDateTimeLatLong.latSec = 0;
    }
    var mins = parseFloat(solarDateTimeLatLong.latMin);
    var secs = parseFloat(solarDateTimeLatLong.latSec);
    if(neg != 1) {
        var decLat = degs + (mins / 60) + (secs / 3600);
    } else if(neg == 1) {
        var decLat = degs - (mins / 60) - (secs / 3600);
    } else {
        return -9999;
    }
    return decLat;
}

/**
 * Return the decimal longitude from the degrees, minutes and seconds entered into a form
 */
function getLongitude() {
    var neg = 0;
    var strLonDeg = solarDateTimeLatLong.lonDeg;
    var degs = parseFloat(solarDateTimeLatLong.lonDeg);
    if (solarDateTimeLatLong.lonDeg.charAt(0) == '-') {
        neg = 1;
    }
    if (strLonDeg.indexOf(".") != -1) {
    	solarDateTimeLatLong.lonMin = 0;
    	solarDateTimeLatLong.lonSec = 0;
    }
    if(solarDateTimeLatLong.lonMin == "") {
    	solarDateTimeLatLong.lonMin = 0;
    }
    if(solarDateTimeLatLong.lonSec == "") {
    	solarDateTimeLatLong.lonSec = 0;
    }
    var mins = parseFloat(solarDateTimeLatLong.lonMin);
    var secs = parseFloat(solarDateTimeLatLong.lonSec);
    var decLon = degs + (mins / 60) + (secs / 3600);
    if(neg != 1) {
        var decLon = degs + (mins / 60) + (secs / 3600);
    } else if(neg == 1) {
        var decLon = degs - (mins / 60) - (secs / 3600);
    } else {
        return -9999;
    }
    return decLon;
}

/**
 * Return the Julian Day of the most recent sunrise starting from the given day at the given location on earth in degrees
 */
function findRecentSunrise(jd, latitude, longitude) {
    var julianday = jd;
    var time = calcSunriseUTC(julianday, latitude, longitude);
    while(!isNumber(time)) {
        julianday -= 1.0;
        time = calcSunriseUTC(julianday, latitude, longitude);
    }
    return julianday;
}

/**
 * Return the Julian Day of the most recent sunset starting from the given day at the given location on earth in degrees
 */
function findRecentSunset(jd, latitude, longitude) {
    var julianday = jd;
    var time = calcSunsetUTC(julianday, latitude, longitude);
    while(!isNumber(time)) {
        julianday -= 1.0;
        time = calcSunsetUTC(julianday, latitude, longitude);
    }
    return julianday;
}

/**
 * Return the Julian Day of the next sunrise starting from the given day at the given location on earth in degrees
 */
function findNextSunrise(jd, latitude, longitude) {
    var julianday = jd;
    var time = calcSunriseUTC(julianday, latitude, longitude);
    while(!isNumber(time)) {
        julianday += 1.0;
        time = calcSunriseUTC(julianday, latitude, longitude);
    }
    return julianday;
}

/**
 * Return calculate the Julian Day of the next sunset starting from the given day at the given location on earth in degrees
 */
function findNextSunset(jd, latitude, longitude) {
    var julianday = jd;
    var time = calcSunsetUTC(julianday, latitude, longitude);
    while(!isNumber(time)) {
        julianday += 1.0;
        time = calcSunsetUTC(julianday, latitude, longitude);
    }
    return julianday;
}

/**
 * Return time of day in minutes to a zero-padded string suitable for printing to the form text fields in the format HH:MM:SS for a time of day in minutes
 */
function timeString(minutes) {
    // timeString returns a zero-padded string (HH:MM:SS) given time in minutes
    var floatHour = minutes / 60.0;
    var hour = Math.floor(floatHour);
    var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
    var minute = Math.floor(floatMinute);
    var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
    var second = Math.floor(floatSec + 0.5);
    if (second > 59) {
        second = 0;
        minute += 1;
    }
    var timeStr = hour + ":";
    if (minute < 10) // i.e. only one digit
        timeStr += "0" + minute + ":";
    else
        timeStr += minute + ":";
    if (second < 10) // i.e. only one digit
        timeStr += "0" + second;
    else
        timeStr += second;
    return timeStr;
}

/**
 * Return time of day in minutes to a zero-padded string suitable for printing to the form text fields in the format HH:MM[AM/PM] (DDMon) for time of Julian Day in minutes
 * If time crosses a day boundary, date is appended.
 * Return a zero-padded string (HH:MM *M) given time in minutes and appends short date if time is > 24 or < 0, resp.
 */
function timeStringShortAMPM(minutes, JD) {
    var julianday = JD;
    var floatHour = minutes / 60.0;
    var hour = Math.floor(floatHour);
    var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
    var minute = Math.floor(floatMinute);
    var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
    var second = Math.floor(floatSec + 0.5);
    var PM = false;
    minute += (second >= 30)? 1 : 0;
    if (minute >= 60) {
        minute -= 60;
        hour ++;
    }
    var daychange = false;
    if (hour > 23) {
        hour -= 24;
        daychange = true;
        julianday += 1.0;
    }
    if (hour < 0) {
        hour += 24;
        daychange = true;
        julianday -= 1.0;
    }
    if (hour > 12) {
        hour -= 12;
        PM = true;
    }
    if (hour == 12) {
    PM = true;
    }
    if (hour == 0) {
    PM = false;
    hour = 12;
    }
    var timeStr = hour + ":";
    if (minute < 10) //  i.e. only one digit
        timeStr += "0" + minute + ((PM)?"PM":"AM");
    else
        timeStr += "" + minute + ((PM)?"PM":"AM");
    if (daychange) return timeStr + " " + calcDayFromJD(julianday);
    return timeStr;
}

/**
 * Return time of day in minutes to a zero-padded string suitable for printing to the form text fields, and appends the date in the format HH:MM[AM/PM] DDMon for time of Julian Day in minutes
 * Return a zero-padded string (HH:MM[AM/PM]) given time in minutes and Julian Day, and appends the short date
 */
function timeStringAMPMDate(minutes, JD) {
    var julianday = JD;
    var floatHour = minutes / 60.0;
    var hour = Math.floor(floatHour);
    var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
    var minute = Math.floor(floatMinute);
    var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
    var second = Math.floor(floatSec + 0.5);
    minute += (second >= 30)? 1 : 0;
    if (minute >= 60) {
        minute -= 60;
        hour ++;
    }
    if (hour > 23) {
        hour -= 24;
        julianday += 1.0;
    }
    if (hour < 0) {
        hour += 24;
        julianday -= 1.0;
    }
    var PM = false;
    if (hour > 12) {
        hour -= 12;
        PM = true;
    }
    if (hour == 12) {
        PM = true;
    }
    if (hour == 0) {
        PM = false;
        hour = 12;
    }
    var timeStr = hour + ":";
    if (minute < 10) // i.e. only one digit
        timeStr += "0" + minute + ((PM)?"PM":"AM");
    else
        timeStr += minute + ((PM)?"PM":"AM");
    return timeStr + " " + calcDayFromJD(julianday);
}

/**
 * Return time of day in minutes to a zero-padded 24hr time suitable for printing to the form text fields in the format HH:MM (DDMon for time of Julian Day in minutes
 * If time crosses a day boundary, date is appended.
 * Return a zero-padded string (HH:MM) given time in minutes and Julian Day, and appends the short date if time crosses a day boundary
 */
function timeStringDate(minutes, JD) {
    var julianday = JD;
    var floatHour = minutes / 60.0;
    var hour = Math.floor(floatHour);
    var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
    var minute = Math.floor(floatMinute);
    var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
    var second = Math.floor(floatSec + 0.5);
    minute += (second >= 30)? 1 : 0;
    if (minute >= 60) {
        minute -= 60;
        hour ++;
    }
    var daychange = false;
    if (hour > 23) {
        hour -= 24;
        julianday += 1.0;
        daychange = true;
    }
    if (hour < 0) {
        hour += 24;
        julianday -= 1.0;
        daychange = true;
    }
    var timeStr = hour + ":";
    if (minute < 10) // i.e. only one digit
        timeStr += "0" + minute;
    else
        timeStr += minute;
    if (daychange) return timeStr + " " + calcDayFromJD(julianday);
    return timeStr;
}

/**
 * Calculate time of sunrise and sunset for the entered date and location and defines global solarRiseSet values.
 * In the special cases near earth's poles, the date of nearest sunrise and set are reported.
 */
function calcSun() {
	var latitude = getLatitude();
	var longitude = getLongitude();
	var indexRS = solarDateTimeLatLong.mos;
    if (isValidInput(indexRS)) {
        if((latitude >= -90) && (latitude < -89)) {
            alert("All latitudes between 89 and 90 S\n will be set to -89");
            solarDateTimeLatLong.latDeg = -89;
            latitude = -89;
        }
        if ((latitude <= 90) && (latitude > 89)) {
            alert("All latitudes between 89 and 90 N\n will be set to 89");
            solarDateTimeLatLong.latDeg = 89;
            latitude = 89;
        }
        // Calculate the time of sunrise
        var JD = calcJD(parseFloat(solarDateTimeLatLong.year), indexRS + 1, parseFloat(solarDateTimeLatLong.day));
        var dow = calcDayOfWeek(JD);
        var doy = calcDayOfYear(indexRS + 1, parseFloat(solarDateTimeLatLong.day), isLeapYear(solarDateTimeLatLong.year));
        var T = calcTimeJulianCent(JD);
        var alpha = calcSunRtAscension(T);
        var theta = calcSunDeclination(T);
        var Etime = calcEquationOfTime(T);
        // solarRiseSet.dbug = doy;
        var eqTime = Etime;
        var solarDec = theta;
        // Calculate sunrise for this date if no sunrise is found, set flag nosunrise
        var nosunrise = false;
        var riseTimeGMT = calcSunriseUTC(JD, latitude, longitude);
        if (!isNumber(riseTimeGMT)) {
            nosunrise = true;
        }
        // Calculate sunset for this date if no sunset is found, set flag nosunset
        var nosunset = false;
        var setTimeGMT = calcSunsetUTC(JD, latitude, longitude);
        if (!isNumber(setTimeGMT)) {
            nosunset = true;
        }
        var daySavings = solarDateTimeLatLong.daySavings; // = 0 (no) or 60 (yes)
        var zone = solarDateTimeLatLong.hrsToGMT;
        if(zone > 12 || zone < -12.5) {
            alert("The offset must be between -12.5 and 12.  \n Setting \"Off-Set\"=0");
            zone = "0";
            solarDateTimeLatLong.hrsToGMT = zone;
        }
        if (!nosunrise) { // Sunrise was found
            var riseTimeLST = riseTimeGMT - (60 * zone) + daySavings; // in minutes
            var riseStr = timeStringShortAMPM(riseTimeLST, JD);
            var utcRiseStr = timeStringDate(riseTimeGMT, JD);
            solarRiseSet.sunrise = riseStr;
            solarRiseSet.utcSunrise = utcRiseStr;
        }
        if (!nosunset) { // Sunset was found
            var setTimeLST = setTimeGMT - (60 * zone) + daySavings;
            var setStr = timeStringShortAMPM(setTimeLST, JD);
            var utcSetStr = timeStringDate(setTimeGMT, JD);
            solarRiseSet.sunset = setStr;
            solarRiseSet.utcSunset = utcSetStr;
        }
        // Calculate solar noon for this date
        var solNoonGMT = calcSolNoonUTC(T, longitude);
        var solNoonLST = solNoonGMT - (60 * zone) + daySavings;
        var solnStr = timeString(solNoonLST);
        var utcSolnStr = timeString(solNoonGMT);
        solarRiseSet.solnoon = solnStr;
        solarRiseSet.utcSolnoon = utcSolnStr;
        var tsnoon = calcTimeJulianCent(calcJDFromJulianCent(T) -0.5 + solNoonGMT/1440.0);
        eqTime = calcEquationOfTime(tsnoon);
        solarDec = calcSunDeclination(tsnoon);
        solarRiseSet.eqTime = (Math.floor(100*eqTime))/100;
        solarRiseSet.solarDec = (Math.floor(100*(solarDec)))/100;
        // Convert lat and long to standard format
        convLatLong();
        // report special cases of no sunrise
        if(nosunrise) {
            solarRiseSet.utcSunrise = "";
            // if Northern hemisphere and spring or summer, OR
            // if Southern hemisphere and fall or winter, use
            // previous sunrise and next sunset
            if (((latitude > 66.4) && (doy > 79) && (doy < 267)) || ((latitude < -66.4) && ((doy < 83) || (doy > 263)))) {
                newjd = findRecentSunrise(JD, latitude, longitude);
                newtime = calcSunriseUTC(newjd, latitude, longitude) - (60 * zone) + daySavings;
                if (newtime > 1440) {
                    newtime -= 1440;
                    newjd += 1.0;
                }
                if (newtime < 0) {
                    newtime += 1440;
                    newjd -= 1.0;
                }
                solarRiseSet.sunrise = timeStringAMPMDate(newtime, newjd);
                solarRiseSet.utcSunrise = "prior sunrise";
            }
            // if Northern hemisphere and fall or winter, OR
            // if Southern hemisphere and spring or summer, use
            // next sunrise and previous sunset
            else if (((latitude > 66.4) && ((doy < 83) || (doy > 263))) || ((latitude < -66.4) && (doy > 79) && (doy < 267))) {
                newjd = findNextSunrise(JD, latitude, longitude);
                newtime = calcSunriseUTC(newjd, latitude, longitude) - (60 * zone) + daySavings;
                if (newtime > 1440) {
                    newtime -= 1440;
                    newjd += 1.0;
                }
                if (newtime < 0) {
                    newtime += 1440;
                    newjd -= 1.0;
                }
                solarRiseSet.sunrise = timeStringAMPMDate(newtime, newjd);
                // solarRiseSet.sunrise = calcDayFromJD(newjd) + " " + timeStringDate(newtime, newjd);
                solarRiseSet.utcSunrise = "next sunrise";
            }
            else {
                alert("Cannot Find Sunrise!");
            }
            // alert("Last Sunrise was on day " + findRecentSunrise(JD, latitude, longitude));
            // alert("Next Sunrise will be on day " + findNextSunrise(JD, latitude, longitude));
        }
        if(nosunset) {
            solarRiseSet.utcSunset = "";
            // if Northern hemisphere and spring or summer, OR
            // if Southern hemisphere and fall or winter, use
            // previous sunrise and next sunset
            if (((latitude > 66.4) && (doy > 79) && (doy < 267)) || ((latitude < -66.4) && ((doy < 83) || (doy > 263)))) {
                newjd = findNextSunset(JD, latitude, longitude);
                newtime = calcSunsetUTC(newjd, latitude, longitude) - (60 * zone) + daySavings;
                if (newtime > 1440) {
                    newtime -= 1440;
                    newjd += 1.0;
                }
                if (newtime < 0) {
                    newtime += 1440;
                    newjd -= 1.0;
                }
                solarRiseSet.sunset = timeStringAMPMDate(newtime, newjd);
                solarRiseSet.utcSunset = "next sunset";
                solarRiseSet.utcSolnoon = "";
            }
            // if Northern hemisphere and fall or winter, OR
            // if Southern hemisphere and spring or summer, use
            // next sunrise and last sunset
            else if (((latitude > 66.4) && ((doy < 83) || (doy > 263))) || ((latitude < -66.4) && (doy > 79) && (doy < 267))) {
            	newjd = findRecentSunset(JD, latitude, longitude);
            	newtime = calcSunsetUTC(newjd, latitude, longitude) - (60 * zone) + daySavings;
            	if (newtime > 1440) {
            		newtime -= 1440;
            		newjd += 1.0;
            	}
            	if (newtime < 0) {
            		newtime += 1440;
            		newjd -= 1.0;
            	}
            	solarRiseSet.sunset = timeStringAMPMDate(newtime, newjd);
            	solarRiseSet.utcSunset = "prior sunset";
            	solarRiseSet.solnoon = "N/A";
            	solarRiseSet.utcSolnoon = "";
            }
            else {
                alert ("Cannot Find Sunset!");
            }
        }
    }
}