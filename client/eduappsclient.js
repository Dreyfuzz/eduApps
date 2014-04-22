Apps = new Meteor.Collection("apps");

Meteor.subscribe('apps');

Template.apps.apps = function() {
  return Apps.find({},{sort:{'submittedOn':-1}});
};

Template.apps.events({
  'submit #new_app': function(event) {
    event.preventDefault();
    var appName = document.getElementById("new_app_name").value;
    var appUrl = document.getElementById("new_app_url").value;

    appUrl.search(/https:\/\/itunes.apple.com\/us\/app/);

    console.log('Checking App');

    Meteor.call("exists",appUrl, function(_, itExists) {
      if(!itExists) {
        Meteor.call("addApp",appName,appUrl);
        document.getElementById("new_app_name").value ="";
        document.getElementById("new_app_url").value ="";
      }
      else {
        $('.alert').remove();
        $('.control-group').append('<p class="alert alert-danger" id="repeat">This app has already been submitted.</p>').delay(2000).queue(function(next){
          $('.alert').fadeOut('slow');
        });
      }
    });
  },

  'click .remove':function(event) {
    event.preventDefault();
    Meteor.call("removeApp",this._id);
  },

  'click .approve':function(event) {
    event.preventDefault();
    Meteor.call("approveApp",this._id);
  },

  'click .reject':function(event) {
    event.preventDefault();
    Meteor.call("rejectApp",this._id);
  }
});

// Template.apps.helpers({
//   submitter : function(app){
//     submitter = Meteor.user.findOne({"_id" : app.submittedBy});
//     return submitter.name;
//   }
// });
