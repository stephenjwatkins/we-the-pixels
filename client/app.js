Session.setDefault('flash', false);
Session.setDefault('disableBg', false);
Session.setDefault('appCanvas', null);
Session.setDefault('appCanvasId', null);

RouteHistory = [];

Template.bg.disableBg = function() { return Session.get('disableBg'); };

Template.page.pageIndex = function () { return Session.equals('page', 'index'); };
Template.page.pageCanvas = function () { return Session.equals('page', 'canvas'); };
Template.page.pageGallery = function () { return Session.equals('page', 'gallery'); };

/**
 * Routing for the account system. Lot of routes to
 * 'account' for here.
 */
var AccountRouter = Backbone.Router.extend({
  routes: {
    'account/login': 'login',
    'account/logout': 'logout',
    'account/register': 'register',
    'account/forgot': 'forgot',
    'account/verify/:token': 'verify',
    'account/reset/:token': 'reset'
  },
  initialize: function() {
    this.bind('all', function(route) {
      Session.set('noBgCanvas', false);
      RouteHistory.push({
        route: route.split(':')[1],
        fragment: Backbone.history.fragment
      });
    });
  },
  login: function() {
    Routers.App._loadHome();
    Util.title('Login');
    Util.description('Login at We the Pixels.');
    Session.set('indexSection', 'account/login');
  },
  logout: function() {
    Meteor.logout();
    Session.set('flash', 'Logged out successfully.');
    Backbone.history.navigate('/', true);
  },
  register: function() {
    Routers.App._loadHome();
    Util.title('Register');
    Util.description('Create an account on We the Pixels.');
    Session.set('indexSection', 'account/register');
  },
  verify: function(token) {
    Accounts.verifyEmail(token, function(err) {
      if (err) {
        alert(err.reason);
        return;
      }

      // Add user to Mail Chimp Sync list
      Meteor.call('subscribeUserToNews', Meteor.user());

      Session.set('flash', 'Email verified. Welcome to We the Pixels!');
      Backbone.history.navigate('/', true);
    });
  },
  forgot: function() {
    Routers.App._loadHome();
    Util.title('Reset Password');
    Session.set('indexSection', 'account/forgot');
  },
  reset: function(token) {
    Routers.App._loadHome();
    Util.title('Reset Password');
    Session.set('resetToken', token);
    Session.set('indexSection', 'account/reset');
  }
});

/**
 * Router for application wide events.
 */
var AppRouter = Backbone.Router.extend({
  routes: {
    "canvas/:id": "canvas",
    "new": "new",
    "gallery": "gallery",
    "*path": "home" // Catch all
  },
  initialize: function() {
    this.bind('all', function(route) {
      Session.set('noBgCanvas', false);
      RouteHistory.push({
        route: route.split(':')[1],
        fragment: Backbone.history.fragment
      });
    });
  },
  home: function() {
    this._loadHome();
    Util.title('');
    Util.description('Real-time, collaborative pixel art.');
    Session.set('indexSection', 'home');
  },
  'new': function() {
    if (!Meteor.user()) {
      Session.set('flash', 'Sorry, creating a canvas can only be done by users. <a href="/account/register">Create an account!</a>');
      Backbone.history.navigate('/', true);
      return;
    }
    this._loadHome();
    Util.title('New Canvas');
    Util.description('Create a new canvas on We the Pixels.');
    Session.set('indexSection', 'new');
  },
  gallery: function() {
    Util.title('Gallery');
    Util.description('Explore the Gallery at We the Pixels.');
    Session.set('disableBg', false);
    Session.set('page', 'gallery');
  },
  canvas: function(id) {
    // TITLE and SOCIAL is set in the main canvas.js file
    Session.set('disableBg', true);
    Session.set('page', 'canvas');
    Session.set('appCanvasId', id);
  },
  _loadHome: function() {
    Session.set('disableBg', false);
    Session.set('page', 'index');
  }
});

/** 
 * This is where we put the coal in the engine.
 */
Meteor.startup(function() {

  // Store a unique session Id for this user
  if (!store.get('sessionId')) {
    store.set('sessionId', Random.id());
  }

  Routers = {
    App: new AppRouter(),
    Account: new AccountRouter()
  };
  //TODO: Move into its own file once becomes unorderly
  Util = {
    title: function(title) {
      if (typeof title !== 'undefined') {
        document.title = (title ? title + ' - ' : 'Real-time, collaborative pixel art - ') + 'We the Pixels';
        $('meta[name="title"]').attr('content', (title ? title + ' - ' : '') + 'We the Pixels');
        $('meta[property="og:title"]').attr('content', (title ? title + ' - ' : '') + 'We the Pixels');
      }
      return document.title;
    },
    description: function(description) {
      if (typeof description !== 'undefined') {
        $('meta[name="description"]').attr('content', description);
        $('meta[property="og:description"]').attr('content', description);
      }
      return $('meta[name="description"]').attr('content');
    }
  };
  // Subscribe to userData first, so we don't have any flicker
  // for things that depend on user
  Meteor.subscribe('userData', function() {
    Backbone.history.start({ pushState: true });
  });
});