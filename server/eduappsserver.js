Apps = new Meteor.Collection('apps');

Meteor.startup(function () {
	Accounts.config({ restrictCreationByEmailDomain: 'ctkschool.org' });
	Meteor.call("createAdmin");
});

Meteor.publish('apps', function (){
	return Apps.find();
});

Meteor.methods({
	addApp : function(appName,appUrl){
		console.log('Checking App');
		console.log('Adding App');
		var appId = Apps.insert({
			'name': appName,
			'url': appUrl,
			'submittedOn': new Date(),
			'submittedBy': Meteor.userId(),
			'approval': 'pending'
		});
		return appId;
	},

	removeApp : function(appId){
		console.log('Removing App');
		Apps.remove(appId);
	},

	approveApp : function(appId){
		console.log('Approving App');
		Apps.update(appId, {$set: {approval: true}});
	},

	rejectApp : function(appId){
		console.log('Rejecting App');
		Apps.update(appId, {$set: {approval: false}});
	},

	createAdmin : function(){
		if(Meteor.users){
		   var admin = Meteor.users.findOne({"services.google.email": "mdreyfus@ctkschool.org"});
		   if (admin){
		   	console.log("Found admin");
		   	Meteor.users.update(admin._id, {$set: {roles:['admin']}});
		   	AuthManager.addUsersToRoles(admin._id,admin.roles);
		   }			
		}
	},

	exists : function(appUrl){
		console.log("Searching for " + appUrl)
		if(Apps.findOne({"url" : appUrl})){
			console.log('found it')
			return true;
		}
		else {
			console.log("didn't find it")
			return false;
		}
	}
});