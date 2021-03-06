'use strict';
/*
Author: Vinod Mohanan
Description: 
    Member Model.
*/

//require
var Q = require("q");
var mongoose = require('mongoose')

//Schema
var Schema = mongoose.Schema;
var memberSchema = new Schema({
    firstName: String,
    lastName: String,
    city: String,
    profileId:String  
});

//Model creation
var MemberModel = mongoose.model('Member', memberSchema);

//Model interaction methods 
//Get a new instance
MemberModel.getNewInstance = function () {
    return new MemberModel();
};

//Fetch all Members
MemberModel.fetchAllMembers = function () {
    var deferred = Q.defer();
    MemberModel.find(function (err, members) {
        if (!err)
            deferred.resolve(members);
        else
            deferred.reject("Members fetching failed");
    });
    return deferred.promise;
};

//Fetch an individual Member by ID
MemberModel.fetchMemberById = function (id) {
    var deferred = Q.defer();
    MemberModel.findById(id, function (err, member) {
        if (!err)
            deferred.resolve(member);
        else
            deferred.reject("Fetching member by ID failed");
    });
    return deferred.promise;
};

//Fetch an individual Member by profile ID
MemberModel.fetchMemberByProfileId = function (profileId) {
    var deferred = Q.defer();
    MemberModel.find({profileId:profileId}, function (err, member) {
        if (!err)
            deferred.resolve(member);
        else
            deferred.reject("Fetching member by profile ID failed:"+err);
    });
    return deferred.promise;
};

//Filter Members based on where clause
MemberModel.filterMembers = function (filterObject) {
    var deferred = Q.defer();
    MemberModel.find(filterObject, function (err, members) {
        if (!err)
            deferred.resolve(members);
        else
            deferred.reject("Fetching member by ID failed");
    });
    return deferred.promise;
};

//Add a member
MemberModel.add = function (req) {
    var deferred = Q.defer();
    var member = MemberModel.buildMemberFromReq(req);
    member.save(function (err, member) {
        if (!err)
            deferred.resolve(member);
        else
            deferred.reject("Adding member failed");
    });
    return deferred.promise;
};

//Update a member
MemberModel.updateByID = function (req) {
    var deferred = Q.defer();
    var id = req.body._id;
    var member = MemberModel.buildUpdateFromReq(req);
    MemberModel.findOneAndUpdate({ _id:id},
    { $set: member }, 
    { multi: true }, 
    function (err, member) {
        if (!err)
            deferred.resolve(member);
        else
            deferred.reject("updating member failed" + err);
    });
    return deferred.promise;
};

//Create a new User
MemberModel.createNewUser = function (profileId) {
    var deferred = Q.defer();
    var member = MemberModel.getNewInstance();
    member.profileId = profileId;
    member.save(function (err, member) {
        if (!err)
            deferred.resolve(member);
        else
            deferred.reject("Creating a new user failed");
    });
    return deferred.promise;
};

//Build a member object from request
MemberModel.buildMemberFromReq = function (req) {
    var Member = MemberModel.getNewInstance();
    Member.firstName = req.body.firstName;
    Member.lastName = req.body.lastName;
    Member.city = req.body.city;
    return Member;
};

MemberModel.buildUpdateFromReq = function (req) {
    var Obj = new Object();
    for (var property in req.body) {
        if (req.body.hasOwnProperty(property)) {
            Obj[property] = req.body[property];
        }
    }
    return Obj;
};
module.exports = MemberModel;
