/**
 * Created by Administrator on 2016/5/27.
 */
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ = require('underscore')


exports.detail = function(req,res){
    var id = req.params.id
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        console.log('err ID');
        return;
    }
    Movie.findById(id, function(err,movie){
        if(err){
            console.log('err4:'+err);
        }
        else {
            Comment
                .find({movie:id})
                .populate('from','name')
                .populate('reply.from reply.to', 'name')
                .exec(function(err,comment){
                    if(err){
                        console.log('commenterr:'+err);
                    }else{
                        res.render('detail',{
                            title:'Movie:' + movie.title,
                            movie: movie,
                            comments: comment
                        })
                    }
                })
        }
    })
}

exports.newa = function(req,res){

    console.log('in news');
    res.render('category_admin',{
        title:'分类录入页',
        category:{
            category :''
        }
    })
}


exports.update = function(req,res){
    var id = req.params.id
    if(id)
        Category.findById(id,function(err,Category){
            res.render('category_admin',{
                title: '更新',
                category :category
            })
        })
    else
        console.log('更新：无效ID');
}



//admin  post category
exports.save = function(req,res){
    var id = req.body.category._id
    var categoryObj = req.body.category
    var _category

    if (id != 'undefined'){
        Category.findById(id, function(err,category){
            if(err)
                console.log('err1:'+err);
            _category = _.extend(category,categoryObj)
            _category.save(function(err,category){
                if(err)
                    console.log('err2:'+err);
                res.redirect('/movie/detail/' + category._id)
            })
        })
    }
    else{
        _category = new Category({
            category: categoryObj
        })
        _category.save(function(err,category){
            if(err)
                console.log('err3:'+err);
            res.redirect('/category/detail/' + category._id)
        })
    }
}


exports.list = function(req,res){
    Category.fetch(function (err,categories){
        if(err)
            console.log(err);
        res.render('category_list',{
            categories : categories
        })
    })
}

exports.del = function(req,res){
    var id = req.query.id
    if(id){
        Category.remove({_id:id},function(err,category){
            if(err)
                console.log(err);
            else
                res.json({success:1})
        })
    }
}