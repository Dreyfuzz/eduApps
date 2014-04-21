Apps = new Meteor.Collection('apps');

Meteor.startup(function () {
	Accounts.config({ restrictCreationByEmailDomain: 'ctkschool.org' });
});

Meteor.methods({
	addApp : function(appName,appUrl){
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
	}
});