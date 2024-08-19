var express=require("express");
var mysql2=require("mysql2");
var fileuploader=require("express-fileupload");
let app=express();
app.listen(1977,function(){
    console.log("Server Started :-)");
})
app.use(express.static("public"));
app.use(express.urlencoded("true"));
app.use(fileuploader());
//***************************************************8888 */
// let config={
//     host:"127.0.0.1",
//     user:"root",
//     password:"jindal#2027@aditya",
//     database:"project",
//     dateStrings:true
// }

let config={
    host:"bexewdcmeoixpyziqdjt-mysql.services.clever-cloud.com",
    user:"u84n00adz4w9bn0e",
    password:"ATHaDzYadJGQqzGHjg4j",
    database:"bexewdcmeoixpyziqdjt",
    dateStrings:true,
    keepAliveInitialDelay : 10000,
    enableKeepAlive : true,
    
}

var mysql=mysql2.createConnection(config);
    mysql.connect(function(err){
            if(err==null)
                    console.log("Connected To Database Successfulllyyyy");
                else
                console.log(err.message+"  ########");

    })
//*************************************************************** */
app.get("/",function(req,resp)
{
    let path=__dirname+"/public/index.html";
    resp.sendFile(path);

})

app.get("/signup-process",function(req,resp)
{
    let txtemail=req.query.txtemail;
    let txtpwd=req.query.txtpwd;
    let txttype=req.query.txttype;
    console.log(txtemail);


    mysql.query("insert into users values(?,?,?,?)",[txtemail,txtpwd,txttype,1],function(err)
    {
            if(err==null)
                    resp.send("Signedup Successfully");
            else
                    resp.send(err.message);
    })


})

app.get("/login-process",function(req,resp)
{
    let txtemaillog=req.query.txtemail;
    let txtpwdlog=req.query.txtpwd;
    mysql.query("select * from users where email=? and pwd=?",[txtemaillog,txtpwdlog],function(err,resultJSONAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
            resp.send(resultJSONAry);
        // console.log(resultJSONAry);
        // if(resultJSONAry.length>=0)
        //     {
        //         console.log(resultJSONAry);
        //         if(resultJSONAry[0].ustatus=='1')
        //             {
        //                 resp.send("Logined as",resultJSONAry[0].utype);
        //             }
        //         else
        //         {
        //             resp.send("Sorry you are blocked");
        //         }
        //     }
        // else
        // {
        //     resp.send("Invalid email ID or password");
        // }
    })


})

app.get("/dashboard",function(req,resp)
{
    let path=__dirname+"/public/Infl-dash.html";
    resp.sendFile(path);
})
app.get("/Inf_profile",function(req,resp)
{
    let path=__dirname+"/public/Inf_profile.html";
    resp.sendFile(path);
})

app.post("/save-process",function(req,resp)
{
    let fileName="";
    if(req.files!=null)
        {
            fileName=req.files.ppath.name;
            let path=__dirname+"/public/uploads/"+fileName;
            req.files.ppath.mv(path);
        }
    else
    {
        fileName="nopic.jpg";
    }

    let fl=req.body.fields;
    let str="";
    if(Array.isArray(fl))
        {
            for(i=0;i<fl.length;i++)
                {
                    str+=fl[i];
                    if (i !== fl.length - 1) { 
                        str += ',';
                }
            }
        }
    else
    {
        str+=fl;
    }
    

    

    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.txtemailid,req.body.txtfullname,req.body.gender,req.body.dob,req.body.txtaddress,req.body.txtcity,req.body.numb,str,req.body.txtinsta,req.body.txtfb,req.body.txtyt,req.body.txtother,fileName],function(err)
    {
            if(err==null)
                    resp.send("Data Saved Successfullyyyyy............");
            else
                    resp.send(err.message);
    })

})

app.post("/update-process",function(req,resp)
{
    let fileName="";
    if(req.files!=null)
        {
            req.files.ppath.name;
            let path=__dirname+"/public/uploads/"+fileName;
            req.files.ppath.mv(path);
    
        }
    else
    {
        fileName=req.body.hdn;
    }
       
        let fl=req.body.fields;
        let str="";
        if(Array.isArray(fl))
            {
                for(i=0;i<fl.length;i++)
                    {
                        str+=fl[i];
                        if (i !== fl.length - 1) 
                            { 
                                str += ',';
                            } 
                    }

            }
        else
        {
            str+=fl;
        }
    
    mysql.query("update iprofile set name=?, gender=?, dob=?, address=?, city=?, contact=?, field=?, insta=?, fb=?, youtube=?, other=?, picpath=? where emaildid=?",[req.body.txtfullname,req.body.gender,req.body.dob,req.body.txtaddress,req.body.txtcity,req.body.numb,str,req.body.txtinsta,req.body.txtfb,req.body.txtyt,req.body.txtother,fileName,req.body.txtemailid],function(err,result)
    {
            if(err==null)
            {
                if(result.affectedRows>=1)
                {
                    resp.send("Record Updated sucessfully");
                }
                else
                {
                    resp.send("Invalid ID");
                }
                
            }
                    
            else
                    resp.send(err.message); 
    })
})

app.get("/find-user-details",function(req,resp)
{
    let email=req.query.txtemailid;
    mysql.query("select * from iprofile where emaildid=?",[email],function(err,resultJSONAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
        if(resultJSONAry.length!=0)
            {
                resultJSONAry[0].field=resultJSONAry[0].field.split(",");
                console.log(resultJSONAry);
                resp.send(resultJSONAry);
            }
        else
        {
            resp.send(resultJSONAry);
        }
    })
    
})

app.post("/post-event",function(req,resp)
{
    let emailbook=req.body.emailbook;
    let txtevent=req.body.txtevent;
    let doe=req.body.doe;
    let st=req.body.st;
    let city=req.body.city;
    let venue=req.body.venue;

    if(txtevent==null || doe==null || st==null || city==null || venue==null)
    {
        resp.send("Please Fill all the Fields")
    }
    else{


    mysql.query("insert into eventts values(null,?,?,?,?,?,?)",[emailbook,txtevent,doe,st,city,venue],function(err)
    {
            if(err==null)
                    resp.send("Event posted Successfully");
            else
                    resp.send(err.message);
    })
}


})

app.post("/update-pass",function(req,resp)
{
    let email=req.body.emailsetting;
    let op=req.body.oldpass;
    let np=req.body.newpass;
    let cp=req.body.confirmpass;
    let opreal;
    mysql.query("select * from users where email=?",[email],function(err,result){
        if(op==result[0].pwd){
            if(cp==np)
                {
                    mysql.query("update users set pwd=? where email=?",[np,email],function(err,result)
                    {
                        if(err==null)
                        {
                            if(result.affectedRows>=1)
                            {
                                resp.send("Password Updated Successfully");
                            }
                            else
                            {
                                resp.send("Invalid ID");
                            }
                        
                        }
                        else
                            resp.send(err.message); 
                    })
                }
            else
            {
                resp.send("New and confirm passwords do not match pls check");
            }
        }
        else
    {
        resp.send("Old password Did not match");
    }

    })


    
})

app.get("/check-user-existance",function(req,resp)
{
    let email=req.query.txtEmail;
    mysql.query("select * from users where email=?",[email],function(err,resultJSONAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
        else
        {
            resp.send(resultJSONAry);
        }
    })
    
})

//---------NOW ADMIN PANEL--------------------------
app.get("/admindash",function(req,resp)
{
    let path=__dirname+"/public/admin-dash.html";
    resp.sendFile(path);
})

app.get("/admin-users",function(req,resp)
{
    let path=__dirname+"/public/admin-users.html";
    resp.sendFile(path);
})

app.get("/fetch-all",function(req,resp)
{
    mysql.query("select * from users",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);
    })

})

app.get("/block-one",function(req,resp)
{
    mysql.query("update users set ustatus=? where email=?",[0,req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("User Blocked Succesffully..");
    })

})

app.get("/resume-one",function(req,resp)
{
    mysql.query("update users set ustatus=? where email=?",[1,req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("User Unblocked..");
    })

})


app.get("/delete-one",function(req,resp)
{
    mysql.query("delete from users where email=?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("User Deleted Succesfully");
    })

})


app.get("/all-infl",function(req,resp){
    let path=__dirname+"/public/admin-all-influ.html";
    resp.sendFile(path);

})

app.get("/fetch-all-infl",function(req,resp){

    mysql.query("select * from iprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);
    })


})

//----------------------------------INFLUENCER FINDER PAGE
app.get("/infl-finder",function(req,resp)
{
    let path=__dirname+"/public/influ-finder.html";
    resp.sendFile(path);
})

app.get("/fetch-all-fields", function(req, resp) {
    mysql.query("select field from iprofile", function(err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        let distinctFields = new Set();

        // Iterate through each row using a for loop
        for (let i = 0; i < resultJsonAry.length; i++) {
            let row = resultJsonAry[i];
            // Split the 'field' value by commas
            let fields = row.field.split(',');

            // Iterate through each split field
            for (let j = 0; j < fields.length; j++) {
                let field = fields[j]; 
                distinctFields.add(field); 
            }
        }

        // Convert Set to array for response
        let distinctFieldsArray = Array.from(distinctFields);;

        // console.log(distinctFieldsArray);
        resp.send(distinctFieldsArray);
    });
});

app.get("/fetch-all-cities", function(req, resp) {
    mysql.query("select distinct city from iprofile", function(err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        // console.log(resultJsonAry);
        resp.send(resultJsonAry);
    });
});
app.get("/show-city", function(req, resp) {
    let fieldlike='%'+req.query.field+'%';
    mysql.query("select distinct city from iprofile where field like ?",[fieldlike], function(err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        // console.log(resultJsonAry);
        resp.send(resultJsonAry);
    });
});

// app.get("/show-field", function(req, resp) {
//     let citylike='%'+req.query.city+'%';
//     mysql.query("select distinct field from iprofile where city like ?",[citylike], function(err, resultJsonAry) {
//         if (err != null) {
//             resp.send(err.message);
//             return;
//         }


//         let distinctFields = new Set();

//         for (let i = 0; i < resultJsonAry.length; i++) {
//             let row = resultJsonAry[i];
//             let fields = row.field.split(',');
//             for (let j = 0; j < fields.length; j++) {
//                 let field = fields[j]; 
//                 distinctFields.add(field); 
//             }
//         }

//         let distinctFieldsArray = Array.from(distinctFields);
//         // console.log(distinctFieldsArray);

//         resp.send(distinctFieldsArray);
//     });
// });

app.get("/show-infl",function(req,resp)
{
    if((!req.query.name)&&(req.query.field)&&(req.query.city))
    {
        mysql.query("select * from iprofile where field like ? and city=?",['%'+req.query.field+'%',req.query.city], function(err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);
        });
    }
    else if((!req.query.field)&&(req.query.name)&&(req.query.city))
    {
        mysql.query("select * from iprofile where name like ? and city=?",['%'+req.query.name+'%',req.query.city], function(err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);
        });
    }
    else if((!req.query.city)&&(req.query.field)&&(req.query.name))
    {
        mysql.query("select * from iprofile where field like ? and name like ?",['%'+req.query.field+'%','%'+req.query.name+'%'], function(err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);
        });
    }
    else if((!req.query.city)&&(!req.query.field)&&(req.query.name))
    {
        mysql.query("select * from iprofile where name like ?",['%'+req.query.name+'%'], function(err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);
        });
    }
    else if((!req.query.city)&&(req.query.field)&&(!req.query.name))
    {
        mysql.query("select * from iprofile where field like ?",['%'+req.query.field+'%'], function(err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);
        });
    }
    else if((req.query.city)&&(!req.query.field)&&(!req.query.name))
    {
        mysql.query("select * from iprofile where city=?",[req.query.city], function(err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);
        });
    }
    else if((req.query.city)&&(req.query.field)&&(req.query.name))
    {
        mysql.query("select * from iprofile where name like ? and field like ? and city=?",['%'+req.query.name+'%','%'+req.query.field+'%',req.query.city], function(err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);
        });
    }
})

//____________event manager ------------------
app.get("/event-manage",function(req,resp){
    let path=__dirname+"/public/events-manager.html";
    resp.sendFile(path);
})

app.get("/show-all-events",function(req,resp){

    mysql.query("select * from eventts where emailid=? and doe>=current_date()",[req.query.emailid],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);
    })

})

app.get("/dodel-event",function(req,resp){
    mysql.query("delete from eventts where recordid=?",[req.query.recordid],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send("Event Deleted Successfully....");
    })

})

//---------- brand dashboard---------------------------
app.get("/branddash",function(req,resp){
    let path=__dirname+"/public/brand-dash.html";
    resp.sendFile(path);
})

app.get("/client",function(req,resp){
    let path=__dirname+"/public/client-profile.html";
    resp.sendFile(path);
})

app.get("/infl-finder",function(req,resp){
    let path=__dirname+"/public/influ-finder.html";
    resp.sendFile(path);
})


app.get("/save-client-process",function(req,resp)
{
    mysql.query("insert into cprofile values(?,?,?,?,?,?)",[req.query.txtemailidclient,req.query.txtfullnameclient,req.query.txtcityclient,req.query.txtstateclient,req.query.txtorg,req.query.numbclient],function(err)
    {
            if(err==null) 
                    resp.send("Data Saved Successfullyyyyy............");
            else
                    resp.send(err.message);
    })

})

app.get("/update-client-process",function(req,resp)
{    
  mysql.query("update cprofile set clientname=?, clientcity=?, clientstate=?, org=?, mobile=? where cemail=?",[req.query.txtfullnameclient,req.query.txtcityclient,req.query.txtstateclient,req.query.txtorg,req.query.numbclient,req.query.txtemailidclient],function(err,result)
    {
            if(err==null)
            {
                if(result.affectedRows>=1)
                {
                    resp.send("Record Updated sucessfully");
                }
                else
                {
                    resp.send("Invalid ID");
                }
                
            }
                    
            else
                    resp.send(err.message); 
    })
})

app.get("/find-client-details",function(req,resp)
{
    let email=req.query.txtemailidclient;
    mysql.query("select * from cprofile where cemail=?",[email],function(err,resultJSONAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
        // resultJSONAry[0].field
        // =resultJSONAry[0].field.split(",");
        console.log(resultJSONAry);
        resp.send(resultJSONAry);
    })
})


app.get("/creator",function(req,resp)
{
    let path=__dirname+"/public/influ-finder.html";
    resp.sendFile(path);
})

app.get("/brands",function(req,resp)
{
    let path=__dirname+"/public/brand-finder.html";
    resp.sendFile(path);
})

app.get("/show-all-brands",function(req,resp){

    mysql.query("select * from cprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);
    })

})




