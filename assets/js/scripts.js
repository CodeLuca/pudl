      ;(function(window, document, undefined) {
        'use strict';

        window.app = {};

        app.auth = {
          init: function() {
            this.events();
          },

          elems: {
            $username: $('#username'),
            $password: $('#password')
          },

          events: function() {
            var self = this;

            self.elems.$username.blur(function() {
              self.checkUser();
            });

            $('#login').submit(function(e) {
              e.preventDefault();

              self.validate();
            });
          },

          login: function() {
            $.post('/login', {
              'username': this.elems.$username.val(),
              'password': this.elems.$password.val()
            })
            .done(function(data) {
              console.log(data);
            })
            .fail(function() {
              console.log('err');
            });
          },

          register: function() {},

          validate: function() {
            var username_input_length = this.elems.$username.val().length;
            var password_input_length = this.elems.$password.val().length;

            if (username_input_length < 1) {
              console.log('Check username val');
            }

            if (password_input_length < 1) {
              console.log('Check password val');
            }

            if (username_input_length > 0 && password_input_length > 0) {
              this.login();
            }
          },

          checkUser: function() {
            $.post('/checkExists', {
              'username': this.elems.$username.val()
            })
            .done(function(data) {
              console.log(data);
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

            this.elems.$skip.click(function() {
              this.skip();
              return false;
            }.bind(this));

            this.elems.$next.click(function() {
              this.next();
            }.bind(this));
          },

          next: function() {
            if (this.current < this.elems.$slide.length - 1) {
              this.navigate(this.current + 1);
            } else {
              console.log('Last slide');
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
          },

          reflow: function() {
            this.elems.$slide[0].style.marginLeft = ($(window).width() * this.current * -1) + 'px';
          },
        };

        app.init = function() {
          this.auth.init();
          this.carousel.init();

          setTimeout(function() {
            $('#splash').fadeOut();
          }, 2500);
        };

        app.init();

      })(window, window.document);