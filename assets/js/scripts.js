;(function(window, document, undefined) {
  'use strict';

  window.app = {};

  app.demo = {
    init: function() {
      this.events();
    },

    elems: {
      $goto_area: $('#location a'),
      $goto_goal: $('#area a'),
      $goto_dash: $('#goal a')
    },

    events: function() {
      var self = this;

      self.elems.$goto_area.click(function() {
        app.views.update('area');
      });

      self.elems.$goto_goal.click(function() {
        app.views.update('goal');
      });

      self.elems.$goto_dash.click(function() {
        app.views.update('dashboard');
      });
    }
  }

  app.views = {
    init: function() {
      this.events();
    },

    elems: {
      $views: $('#main > .view')
    },

    events: function() {
      $(window).resize(function() {
        this.reflow();
      }.bind(this));
    },

    update: function(id) {
      console.log('View update');

      var self = this;

      page('/'+id, function() {
        self.elems.$views[0].style.marginLeft = ($(window).width() * ($('#main > #' + id).index()-1) * -1) + 'px';
      });
    },

    reflow: function() {
      console.log('reflow');
      this.elems.$views[0].style.marginLeft = ($(window).width() * this.current * -1) + 'px';
    }
  };

  app.auth = {
    init: function() {
      this.events();
    },

    elems: {
      $form: $('form#auth'),
      $username: $('#username'),
      $password: $('#password'),
      $submit: $('#login-container .submit'),
      $anchor: $('#login-container a')
    },

    events: function() {
      var self = this;

      self.elems.$username.blur(function() {
        if (self.elems.$username.val().length > 0) {
          console.log('Blurred');
          self.checkUser();
        }
      });

      self.elems.$form.submit(function(e) {
        console.log('Form submit');
        e.preventDefault();

        self.validate(self.elems.$form.attr('data-action'));
      });

      self.elems.$anchor.click(function() {
        console.log('click');
        app.views.update('location');
      })
    },

    login: function() {
      var self = this;

      $.post('/login', {
        'username': self.elems.$username.val(),
        'password': self.elems.$password.val()
      })
      .done(function(data) {
        if (typeof data === 'object') {
          console.log('data');
          self.elems.$anchor.trigger('click');
        } else {
          console.log('Check criteria');
        }
      })
      .fail(function() {
        console.log('Login failed');
      });
    },

    register: function() {
      $.post('/register', {
        'username': this.elems.$username.val(),
        'password': this.elems.$password.val()
      })
      .done(function(data) {
        console.log(data);
      })
      .fail(function() {
        console.log('Registration failed');
      })
    },

    validate: function(action) {
      var username_input_length = this.elems.$username.val().length;
      var password_input_length = this.elems.$password.val().length;

      if (username_input_length < 1) {
        console.log('Check username val');
      }

      if (password_input_length < 1) {
        console.log('Check password val');
      }

      if (username_input_length > 0 && password_input_length > 0) {
        console.log(action)
        if (action.toLowerCase() === 'login') {
          console.log('Login');
          this.login();
        } else if (action.toLowerCase() === 'register') {
          console.log('Register');
          this.register();
        } else {
          console.log('Else');
          return;
        }
      }
    },

    checkUser: function() {
      var self = this;

      $.post('/checkExists', {
        'username': self.elems.$username.val()
      })
      .done(function(data) {
        if (data === false) {
          self.elems.$form.attr('data-action', 'Register');
          self.elems.$submit.attr('value', 'Register');
        } else {
          self.elems.$form.attr('data-action', 'Login');
          self.elems.$submit.attr('value', 'Login');
        }
      })
      .fail(function() {
        console.log('Fail');
      });
    }
  };

  app.carousel = {
    init: function() {
      console.log('Carousel init');

      this.current = 0;
      this.events();
    },

    elems: {
      $slide: $('.carousel div[data-slide]'),
      $bullet_container: $('.bullet-container'),
      $bullet: $('.bullet-container li'),
      $skip: $('.skip-container a'),
      $next: $('.next-container a')
    },

    events: function() {
      var self = this;

      $(window).resize(function() {
        this.reflow();
      }.bind(this));

      this.elems.$bullet.click(function() {
        self.elems.$bullet.find('i').removeClass('fa-circle').addClass('fa-circle-o');
        $(this).find('i').addClass('fa-circle');
        self.navigate($(this).index());
        return false;
      });

      this.elems.$skip.click(function(e) {
        this.skip();
      }.bind(this));

      this.elems.$next.click(function(e) {
        this.next();

        if (this.current < this.elems.$slide.length - 1) {
          console.log('Thing');
          e.preventDefault();
        }
      }.bind(this));
    },

    next: function() {
      if (this.current < this.elems.$slide.length - 1) {
        this.navigate(this.current + 1);
      } else {
        this.elems.$next.attr('href', '/login');
        app.views.update('login');
      }
    },

    navigate: function(slide) {
      this.elems.$bullet.find('i').removeClass('fa-circle').addClass('fa-circle-o');
      this.elems.$bullet.find('i').eq(slide).addClass('fa-circle');
      this.elems.$slide[0].style.marginLeft = ($(window).width() * slide * -1) + 'px';
      this.current = slide;
    },

    skip: function() {
      console.log('Carousel skip');

      app.views.update('login');
    },

    reflow: function() {
      this.elems.$slide[0].style.marginLeft = ($(window).width() * this.current * -1) + 'px';
    },
  };

  app.init = function() {

    this.demo.init();
    
    this.auth.init();
    this.carousel.init();
    this.views.init();
    page();

    setTimeout(function() {
      $('#splash').fadeOut();
    }, 2500);
  };

  app.init();

})(window, window.document);
