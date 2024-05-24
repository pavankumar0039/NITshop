const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();


app.set('trust proxy', true);

app.use(express.static(__dirname));
const mysql = require('mysql2');
const conc = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pavan@2114101",
    database: "nitsilchar",
});
app.use(express.urlencoded({ extended: true }));
// signupdetailsinsertion
app.post('/insertsignupdetails', (req, res) => {
    const username = req.body.Username;
    const email = req.body.Email;
    const password = req.body.Password;
    const phonenumber = req.body.Phonenumber;
    const discription = req.body.Discription;
    const sql = " INSERT INTO studentinfo (username,email, studentpassword,phonenumber,discription) VALUES (?,?,?,?,?)";
    const values = [username,email,password,phonenumber,discription];
    conc.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error inserting record." + err.message);
        } else {
            console.log(result.affectedRows + " record(s) inserted");
            res.send("Record inserted successfully.");
        }
    });

});
app.post('/creatingindividualstudentdatabase', (req, res) => {
    const email = req.body.Email;
    let tablename = email.substring(0, email.length - 10);
    const sql = `
    CREATE TABLE ${tablename} (
        image VARCHAR(2000),
        productname VARCHAR(50),
        productprice VARCHAR(10),
        productdis VARCHAR(5000),
        emailofstudent VARCHAR(50),
        timeofproduct TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    conc.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Error inserting record: " + err.message);
        } else {
            console.log(result.affectedRows + " record(s) inserted");
            return res.send("Record created successfully.");
        }
    });
});


// signupdetailschecking
app.post('/signupdetailcheck', (req, res) => {
    const email = req.body.email;


    const sql = `SELECT COUNT(*) AS count FROM studentinfo WHERE Email = '${email}' ;`;

    conc.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error executing query: " + err.message);
        } else {

            const count = result[0].count;
            if (count > 0) {

                res.send("Record exists. Redirecting...");
            } else {

                res.send("Record does not exist.");
            }
        }
    });
});
// loggingin
app.post('/signincheck', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = `SELECT COUNT(*) AS count FROM studentinfo WHERE email = '${email}' AND studentpassword = '${password}';`;

    conc.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error executing query: " + err.message);
        } else {

            const count = result[0].count;
            if (count > 0) {

                res.send("Record exists. Redirecting...");
            } else {

                res.send("Record does not exist.");
            }
        }
    });
});
// getting student details
app.post('/insertinguserdetails', (req, res) => {
    const email = req.body.email;
   

    const sql = `SELECT * FROM studentinfo WHERE email = '${email}';`;

    conc.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error executing query: " + err.message);
        } else {

            const array = result.map(item => ({
               username: item.username,
                email: item.email,
                studentpassword: item.studentpassword,
                phonenumber:item.phonenumber,
                discription:item.discription
                
            }));
            res.json(array);
        }
    });
});
app.post('/insertingproductdetails', (req, res) => {
    const Productname = req.body.Productname;
    const Productprice = req.body.Productprice;
    const Productdis = req.body.Productdis;
    const Productimages = req.body.Productimages;
    const Email = req.body.Email;
    const eemail = Email.substring(0, Email.length - 10);

    // SQL queries and parameter values for each table
    const sql1 = `INSERT INTO ${eemail} (image, productname, productprice, productdis, emailofstudent) VALUES (?, ?, ?, ?, ?)`;
    const values1 = [Productimages, Productname, Productprice, Productdis, Email];
    
    const sql2 = `INSERT INTO nitsilcharproducts (image, productname, productprice, productdis, emailofstudent) VALUES (?, ?, ?, ?, ?)`;
    const values2 = [Productimages, Productname, Productprice, Productdis, Email];
    conc.query(sql1, values1, (err1, result1) => {
        if (err1) {
            console.error(err1);
            return res.status(500).send("Error inserting record: " + err1.message);
        } else {
            console.log("Number of records inserted into table1: " + result1.affectedRows);
            conc.query(sql2, values2, (err2, result2) => {
                if (err2) {
                    console.error(err2);
                    return res.status(500).send("Error inserting record: " + err2.message);
                } else {
                    console.log("Number of records inserted into table2: " + result2.affectedRows);
                    return res.send("Records inserted successfully.");
                }
            });
        }
    });
});

app.post('/populatingmyproductcontainer', (req, res) => {
    const email=req.body.email;
    const eemail = email.substring(0, email.length - 10);
    const sql = `SELECT * FROM ${eemail}`;
    conc.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching records: " + err.message);
        } else {
            const array = result.map(item => ({
                proimg:item.image,
                prona: item.productname,
                propri: item.productprice,
                prodis: item.productdis,
                proem:item.emailofstudent,
                proti:item.timeofproduct
                
            }));
            res.json(array);
        }
    });
});
app.get('/populatinghomeproductcontainer', (req, res) => {
   
    const sql = `SELECT * FROM nitsilcharproducts`;
    conc.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching records: " + err.message);
        } else {
            const array = result.map(item => ({
                proimg:item.image,
                prona: item.productname,
                propri: item.productprice,
                prodis: item.productdis,
                proem:item.emailofstudent,
                proti:item.timeofproduct
                
            }));
            res.json(array);
        }
    });
});
app.post('/populatingviewproductcontainer', (req, res) => {
    const email = req.body.email;
    const proname = req.body.proname;
    const proprice = req.body.proprice;
    const protime = req.body.protime;
    const eemail = email.substring(0, email.length - 10);
    const propri=proprice.substring(0,proprice.length-1);
    const sql = `SELECT * FROM ${eemail} 
                   where productname='${proname}' and productprice=${propri}`;
    conc.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching records: " + err.message);
        } else {
            const array = result.map(item => ({
                proimg: item.image,
                prona: item.productname,
                propri: item.productprice,
                prodis: item.productdis,
                proem: item.emailofstudent,
                proti: item.timeofproduct
            }));
            res.json(array);
        }
    });
});
app.post('/removingproduct', (req, res) => {
    const email = req.body.Email;
    const name = req.body.name;
    const price = req.body.price;
    const pricepro=price.substr(0,price.length-1);
    const eemail = email.substring(0, email.length - 10);
    const sql1 = `DELETE FROM ${eemail} WHERE productname='${name}' AND productprice='${pricepro}'`;
    const sql2 = `DELETE FROM nitsilcharproducts WHERE productname='${name}' AND productprice='${pricepro}' AND emailofstudent='${email}'`;
    
   

    conc.query(sql1, (err1, result1) => {
        if (err1) {
            console.error("Error executing SQL 1:", err1);
            return res.status(500).send("Error deleting record: " + err1.message);
        } else {
            console.log("Records deleted from table 1:", result1);
            conc.query(sql2, (err2, result2) => {
                if (err2) {
                    console.error("Error executing SQL 2:", err2);
                    return res.status(500).send("Error deleting record: " + err2.message);
                } else {
                    console.log("Records deleted from table 2:", result2);
                    return res.send("Records deleted successfully.");
                }
            });
        }
    });
});


conc.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
app.listen(4141, () => {
    console.log(`Server is running on port 4141`);
});
// databaseconection
