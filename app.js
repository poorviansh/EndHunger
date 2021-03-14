const express = require("express");
const ejs = require("ejs");
var path = require('path');
const app = express();
const PORT = process.env.PORT || 3000
// const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require('express-session')
// const flash = require('connect-flash')
const MongoDbStore = require('connect-mongo').default;
const passport = require("passport");
require('dotenv').config();

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// connect database
const password = process.env.passw;
const url = "mongodb+srv://poorvi:"+password+"@cluster0.p2jtj.mongodb.net/pizza?retryWrites=true&w=majority";
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify : true});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Database connected...");
}).catch(err => {
    console.log("connection failed...")
});

app.locals.errors = null;
//session store

// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })


// //session

// app.use(session({
// secret: process.env.COOKIE_SECRET,
// resave: false,
// store: mongoStore,
// saveUninitialized: false,
// cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
// }))

const mongoStore = MongoDbStore.create({
    mongoUrl: url,
    collectionName: "sessions",
  });
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: mongoStore,
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, //cookie valid for 24 hours
    })
  );

//passport
const passportInit = require("./app/config/passport")
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// (flash());
//global middleware
app.use((req, res, next) => {
res.locals.session = req.session
res.locals.user = req.user
next()
})

//assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//set template
// app.use(expressLayout);
app.set("views", path.join(__dirname, "views"));
// app.set("layout", path.join(__dirname, "/layout"));
app.set("view engine", "ejs");

// require("./routes/web.js")(app)

// app.set("view options", { layout: false })
// View engine setup

// app.use(express.static(path.join(__dirname, 'layout')));
require("./routes/web")(app)

//hiring schema
var hiring = new mongoose.Schema({
    first_name: String,
	last_name: String,
    birthday: String,
	gender: String,
    email: String,
    phone:String,
    subject: String
});

var Hiring = mongoose.model("Hiring", hiring);
//________________________________

// ngo schema
var ngo = new mongoose.Schema({
    name: String,
    email: String,
    phone:String,
    address:String,
    food_amount:String,
    date: String,
    add_info:String
});

var NGO = mongoose.model("NGO", ngo);
//_______________________________

//post for event
var event = new mongoose.Schema({
    name: String,
    email: String,
    phone:String,
    address:String,
    message:String,
});

var Event = mongoose.model("Event", event);
//__________________________________

//post for contact
var contact = new mongoose.Schema({
    first_name: String,
	last_name: String,
    email: String,
    phone:String,
    message:String,
});

var Contact = mongoose.model("Contact", contact);
//__________________________________

//post for volunteer
var volunteer = new mongoose.Schema({
    name: String,
    email: String,
    phone:String,
    address:String,
    days_available:String,
	hours_perday:String,
	add_info:String
});

var Volunteer = mongoose.model("Volunteer", volunteer);
//__________________________________

//post for industry
var industry = new mongoose.Schema({
    name: String,
    email: String,
    phone:String,
    address:String,
    website:String,
});

var Industry = mongoose.model("Industry", industry);
//__________________________________

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/who", function(req, res){
    res.render("who.ejs");
});
app.get("/hiring", function(req, res){
    // res.render("hiring.ejs");
    var loggedIn = (req.isAuthenticated()) ? true : false;
	res.render("hiring.ejs", {Hiring:Hiring});
			 loggedIn;
});

//post for hiring
app.post("/hiring", function(req, res){
	var loggedIn = (req.isAuthenticated()) ? true : false;
	var first_name= req.body.first_name;
	var last_name= req.body.last_name;
    var birthday= req.body.birthday;
    var gender= req.body.gender;
	var email= req.body.email;
	var Mobile= req.body.phone;
    var subject= req.body.subject;
	var newhiring= {first_name:first_name, last_name:last_name, birthday:birthday, gender:gender, email:email, Mobile:Mobile, subject: subject};
	Hiring.create(newhiring, function(err, newhiring){
		if(err){
			console.log(err);
		}else{
			req.flash('success', "Thanks for submitting");
			res.redirect("/hiring");
			loggedIn: loggedIn;
		}
	});
});
//


app.get("/ngo", function(req, res){
    var loggedIn = (req.isAuthenticated()) ? true : false;
	res.render("ngo.ejs", {NGO:NGO});
			 loggedIn;
});

//post for ngo
app.post("/ngo", function(req, res){
	var loggedIn = (req.isAuthenticated()) ? true : false;
	var name= req.body.name;
	var email= req.body.email;
    var phone= req.body.phone;
    var address= req.body.address;
	var food_amount= req.body.food_amount;
	var date= req.body.date;
    var add_info= req.body.add_info;
	var newngo= {name:name, email:email, phone:phone, address:address, food_amount:food_amount, date:date, add_info:add_info};
	NGO.create(newngo, function(err, newngo){
		if(err){
			console.log(err);
		}else{
			req.flash('success', "Thanks for submitting");
			res.redirect("/ngo");
			loggedIn;
		}
	});
});
//
app.get("/event", function(req, res){
    var loggedIn = (req.isAuthenticated()) ? true : false;
	res.render("event.ejs", {Event:Event});
			 loggedIn;
});

//
app.post("/event", function(req, res){
	var loggedIn = (req.isAuthenticated()) ? true : false;
	var name= req.body.name;
	var email= req.body.email;
    var phone= req.body.phone;
    var address= req.body.address;
	var message= req.body.message;
	var newevent= {name:name, email:email, phone:phone, address:address, message:message};
	Event.create(newevent, function(err, newevent){
		if(err){
			console.log(err);
		}else{
			req.flash('success', "Thanks for submitting");
			res.redirect("/event");
			loggedIn;
		}
	});
});
//

app.get("/contact", function(req, res){
	var loggedIn = (req.isAuthenticated()) ? true : false;
    res.render("contact", {Contact: Contact}); 
	loggedIn;
 });

 //
 app.post("/contact", function(req, res){
	var loggedIn = (req.isAuthenticated()) ? true : false;
	var first_name= req.body.first_name;
	var last_name= req.body.last_name;
	var email= req.body.email;
    var phone= req.body.phone;
	var message= req.body.message;
	var newcontact= {first_name: first_name, last_name:last_name,email:email, phone:phone, message:message};
	Contact.create(newcontact, function(err, newcontact){
		if(err){
			console.log(err);
		}else{
			req.flash('success', "Thanks for submitting");
			res.redirect("/contact");
			loggedIn;
		}
	});
});
 //_____________________________________________
 
 app.get("/about", function(req, res){
	 res.render("about");
 })

 app.get("/volunteer", function(req, res){
	var loggedIn = (req.isAuthenticated()) ? true : false;
    res.render("volunteer", {Volunteer: Volunteer}); 
	loggedIn;
 });

 //
 app.post("/volunteer", function(req, res){
	var loggedIn = (req.isAuthenticated()) ? true : false;
	var name= req.body.name;
	var email= req.body.email;
    var phone= req.body.phone;
	var address= req.body.address;
	var days_available= req.body.days_available;
	var hours_perday= req.body.hours_perday;
	var add_info= req.body.add_info;
	var newvolunteer= {name: name ,email:email, phone:phone, address:address, days_available:days_available, hours_perday:hours_perday, add_info:add_info};
	Volunteer.create(newvolunteer, function(err, newvolunteer){
		if(err){
			console.log(err);
		}else{
			req.flash('success', "Thanks for submitting");
			res.redirect("/volunteer");
			loggedIn;
		}
	});
});
 //_____________________________________________

 app.get("/industry", function(req, res){
    var loggedIn = (req.isAuthenticated()) ? true : false;
	res.render("fuel_industry.ejs", {Industry:Industry});
			 loggedIn;
});

//
app.post("/industry", function(req, res){
	var loggedIn = (req.isAuthenticated()) ? true : false;
	var name= req.body.name;
	var email= req.body.email;
    var phone= req.body.phone;
    var address= req.body.address;
	var website= req.body.website;
	var newindustry= {name:name, email:email, phone:phone, address:address, website:website};
	Industry.create(newindustry, function(err, newindustry){
		if(err){
			console.log(err);
		}else{
			req.flash('success', "Thanks for submitting");
			res.redirect("/industry");
			loggedIn;
		}
	});
});
//
 



app.listen(process.env.PORT||3000, process.env.IP, function(){
    console.log("server has started");
});
