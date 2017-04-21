var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var app = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
// Create schema for mongoose
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});
// Create a model
var Blog = mongoose.model("Blog", blogSchema);


// RESTFUL ROUTES

// INDEX ROUTE
app.get("/", function(req,res){
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {
    // Create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    var id = req.params.id;
    Blog.findById(id, function (err, foundBlog) {
        if (err) {
            res.render("/blogs");
        } else {
            res.render("show", {blog:foundBlog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    var id = req.params.id;
    Blog.findById(id, function (err, foundBlog) {
        if (err) {
            res.render("/blogs");
        } else {
            res.render("edit", {blog:foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var id = req.params.id;
    var blogPost = req.body.blog;
    Blog.findByIdAndUpdate(id, blogPost, function(err, updateBlogPost) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res) {
    var id = req.params.id;
    Blog.findByIdAndRemove(id, function(err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});



app.listen(process.env.PORT, process.env.IP, function() {
    console.log("RESTful App Server Has Started.");
});
