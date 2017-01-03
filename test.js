
var x = require('casper').selectXPath;
casper.options.viewportSize = {width: 1920, height: 1080};
casper.options.zoomFactor = 5;

var searchHotelUrl = 'http://almundo.com.ar/hotels/results/buenos-aires-1282466?date=2017-03-01,2017-03-15&rooms=2&type=CITY';

var showHotelButton = "//a[normalize-space(text())='Ver hotel']";
var showRoomButton = "//a[normalize-space(text())='Ver habitaciones']";
var reserveHotelRoomButton = "//span[normalize-space(text())='Reservar ahora']";

var visaCreditCardSelectOption = '//*[@id="cardselect"]/option[3]';
var creditCardInstallmentsSelectOption = '//*[@id="cantselect"]/option[3]'

function clickAction(casper, test, query, name, nested_action = function() {}, timeout = 14000) {
  casper.waitForSelector(
    x(query),
    function success() {
      test.assertExists(x(query), "Found '" + name + "'");
      this.click(x(query), "Click on '" + name + "'");
      nested_action();
    },
    function fail() { test.assertExists(x(query), "Missing '" + name + "'"); },
    timeout
  );
}

casper.test.begin('When buy a flight paying with credit card from arg web', function(test) {
  casper.start(searchHotelUrl).zoom(1.2);

  // Search an hotel...
  clickAction(casper, test, showHotelButton, "Ver Hotel");
  clickAction(casper, test, showRoomButton, "Ver Habitationes");
  clickAction(casper, test, reserveHotelRoomButton, "Reservar ahora");

  // Pay with visa credit card in 12 installments...
  clickAction(casper, test, visaCreditCardSelectOption, "credit card select", function() {
    console.log("Selected Credit Card: " + casper.getHTML(x(visaCreditCardSelectOption)));
  });

  clickAction(
    casper,
    test,
    creditCardInstallmentsSelectOption,
    "credit card installments",
    function() {
      console.log("Selected Installments: " + casper.getHTML(x(creditCardInstallmentsSelectOption)));
    },
    20000
  );

  casper.run(function() {test.done();});
});
