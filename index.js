var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
const winston = require("winston");
const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
  transports: [consoleTransport],
};
const logger = new winston.createLogger(myWinstonOptions);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit-student-data", function (req, res) {
  let initialAmount = req.body.initAmt;
  let monthlyAmount = req.body.monthlyAmount;
  let cagr = req.body.cagr;
  let noOfYears = req.body.numYears;

  var name =
    req.body.initAmt +
    " " +
    req.body.monthlyAmount +
    " " +
    req.body.cagr +
    " " +
    req.body.numYears;
  var compoundingData = {
    table: [],
  };
  for (let i = 0; i <= noOfYears; i++) {
    let interest = calcInterest(initialAmount, cagr);
    initialAmount = parseFloat(initialAmount) + monthlyAmount * 12 + interest;
    logger.info("compounded amount " + initialAmount);
    let initialAmountRounded = initialAmount | 0;
    compoundingData.table.push({ year: i, amount: initialAmountRounded });
  }
  var jsonString = JSON.stringify(compoundingData);
  res.render("sample.html", { name: jsonString });
});

app.get("/budget-plan", function (req, res) {
  res.sendFile(__dirname + "/views/budgetplan.html");
});

app.post("/submit-budget-plan", function (req, res) {
  let salary = req.body.salary;
  let rentalincome = req.body.rentalincome;
  let otherincome = req.body.otherincome;
  let eduexpense = req.body.eduexpense;
  let livingexpense = req.body.livingexpense;
  let otherexpense = req.body.otherexpense;
  let rentalexpense = req.body.rentalexpense;
  let hlemiexpense = req.body.hlemiexpense;
  let plemiexpense = req.body.plemiexpense;
  let invType1 = req.body.invType1;
  let invType1Percentage = req.body.invType1Percentage;
  let invType2 = req.body.invType2;
  let invType2Percentage = req.body.invType2Percentage;
  let invType3 = req.body.invType3;
  let invType3Percentage = req.body.invType3Percentage;
  let invType4 = req.body.invType4;
  let invType4Percentage = req.body.invType4Percentage;

  let totalIncome =
    parseFloat(salary) + parseFloat(rentalincome) + parseFloat(otherincome);

  let totalExpenditure =
    parseFloat(eduexpense) +
    parseFloat(livingexpense) +
    parseFloat(otherexpense) +
    parseFloat(rentalexpense) +
    parseFloat(hlemiexpense) +
    parseFloat(plemiexpense);

  let totalSavings = totalIncome - totalExpenditure;

  var investmentData = {
    investmentType: [],
  };

  investmentData.investmentType.push({
    type: "totalIncome",
    amount: totalIncome | 0,
  });
  investmentData.investmentType.push({
    type: "totalExpenditure",
    amount: totalExpenditure | 0,
  });
  investmentData.investmentType.push({
    type: "totalSavings",
    amount: totalSavings | 0,
  });
  if (invType1Percentage === undefined) {
    invType1Percentage = 0;
  }
  if (invType2Percentage === undefined) {
    invType2Percentage = 0;
  }
  if (invType3Percentage === undefined) {
    invType3Percentage = 0;
  }
  if (invType4Percentage === undefined) {
    invType4Percentage = 0;
  }
  investmentData.investmentType.push({
    type: invType1 + "(" + invType1Percentage + "%)",
    amount: totalSavings * parseFloat(invType1Percentage / 100),
  });
  investmentData.investmentType.push({
    type: invType2 + "(" + invType2Percentage + "%)",
    amount: totalSavings * parseFloat(invType2Percentage / 100),
  });
  investmentData.investmentType.push({
    type: invType3 + "(" + invType3Percentage + "%)",
    amount: totalSavings * parseFloat(invType3Percentage / 100),
  });
  investmentData.investmentType.push({
    type: invType4 + "(" + invType4Percentage + "%)",
    amount: totalSavings * parseFloat(invType4Percentage / 100),
  });

  let remainingPercentage =
    100 -
    parseFloat(invType1Percentage) -
    parseFloat(invType2Percentage) -
    parseFloat(invType3Percentage) -
    parseFloat(invType4Percentage);
  investmentData.investmentType.push({
    type: "remainingMoney",
    amount: totalSavings * (remainingPercentage / 100),
  });

  var jsonString = JSON.stringify(investmentData);
  res.render("investmentplan.html", { name: jsonString });
});

var server = app.listen(5000, function () {
  console.log("Node server is running..");
});

function calcInterest(principal, cagr) {
  const amount = principal * Math.pow(1 + cagr / 100, 1);
  return amount - principal;
}
