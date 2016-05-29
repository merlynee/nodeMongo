/**
 * Created by Administrator on 2016/5/27.
 */
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ = require('underscore')


//exports.detail = function(req,res){
//    var id = req.params.id
//    if(!id.match(/^[0-9a-fA-F]{24}$/)){
//        console.log('err ID');
//        return;
//    }
//    Category.findById(id, function(err,category){
//
//    })
//}

exports.new = function(req,res){

    res.render('category_admin',{
        title:'分类录入页',
        category:{}
    })
}


exports.update = function(req,res){
    var id = req.params.id
    if(id)
        Category.findById(id,function(err,category){
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

    if (id != 'undefined' && id != ''){
        Category.findById(id, function(err,category){
            if(err)
                console.log('err1:'+err);
            _category = _.extend(category,categoryObj)
            _category.save(function(err,category){
                if(err)
                    console.log('err2:'+err);
                res.redirect('/category/list')
            })
        })
    }
    else{
        categoryObj.movies=[]
        _category = new Category({
            name: categoryObj.name
        })
        _category.save(function(err,category){
            if(err)
                console.log('err3:'+err);
            res.redirect('/category/list')
        })
    }
}


exports.list = function(req,res){
    Category.fetch(function (err,categories){
        if(err)
            console.log(err);
        res.render('categories_list',{
            title: '分类列表',
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