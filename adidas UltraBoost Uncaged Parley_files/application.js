(function() {
  var CC,
    slice = [].slice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window) {
    var _visibility;
    _visibility = function(el) {
      var bottom, ot, top, vbottom, vtop;
      vtop = $(window).scrollTop();
      vbottom = vtop + $(window).height();
      bottom = (ot = el.offset().top) + el.outerHeight();
      top = ot;
      if (top >= vbottom || bottom <= vtop) {
        return 0;
      }
      if (top >= vtop && bottom <= vbottom) {
        return 1;
      }
      if (top < vtop) {
        return (bottom - vtop) / $(window).height();
      }
      if (bottom > vbottom) {
        return (vbottom - top) / $(window).height();
      }
    };
    return $.fn.extend({
      visibility: function() {
        var args, option;
        option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (this.length > 1) {
          return this.map(function() {
            return _visibility($(this));
          });
        } else {
          return _visibility(this);
        }
      }
    });
  })(window.jQuery, window);

  window.Backdrop = (function() {
    Backdrop.prototype.defaults = {
      parent: "body",
      id: "",
      "class": "",
      zIndex: 100,
      hideOnClick: true,
      hideOnScroll: false,
      hideOnEsc: true,
      hideCallback: null,
      disableBodyScroll: false
    };

    function Backdrop(options) {
      this.hide = bind(this.hide, this);
      this.show = bind(this.show, this);
      this.keyDown = bind(this.keyDown, this);
      this.options = $.extend({}, this.defaults, options);
      this.$parent = $(this.options.parent);
      this.$el = $("<div id='" + this.options.id + "' class='backdrop " + this.options["class"] + "'></div>").css({
        opacity: 0.01
      });
      this.$parent.append(this.$el);
      if (this.options.hideOnClick) {
        this.$el.on("click touchstart", this.hide);
      }
      if (this.options.hideOnScroll) {
        $(window).on("scroll", this.hide);
      }
      if (this.options.hideOnEsc) {
        $("body").on("keydown", this.keyDown);
      }
      this.$el.on("touchmove", (function(_this) {
        return function(e) {
          return false;
        };
      })(this));
      if (this.options.disableBodyScroll) {
        $("body").css({
          overflow: "hidden"
        });
      }
      this.show();
      this.$el.data("backdrop", this);
    }

    Backdrop.prototype.keyDown = function(ev) {
      if (ev.keyCode === 27) {
        return this.hide();
      }
    };

    Backdrop.prototype.show = function() {
      return new Transition(this.$el, {
        opacity: 0.8
      }, 300);
    };

    Backdrop.prototype.hide = function(e) {
      if (e) {
        e.target = e.target || e.srcElement;
      }
      if (e && e.target && e.target !== this.$el.get(0) && e.type !== "scroll") {
        return false;
      }
      $(window).off("scroll", this.hide);
      this.$el.off("click touchstart", this.hide);
      $("body").off("keydown", this.keyDown);
      $("body").css({
        "overflow": "auto"
      });
      $("body").css({
        "position": ""
      });
      if (this.options.hideCallback) {
        this.options.hideCallback(this);
      }
      return new Transition(this.$el, {
        opacity: 0
      }, 300, (function(_this) {
        return function() {
          _this.$el.hide();
          return _this.remove();
        };
      })(this));
    };

    Backdrop.prototype.remove = function() {
      return this.$el.remove();
    };

    return Backdrop;

  })();

  window.Modal = (function() {
    Modal.prototype.defaults = {
      showOnInit: true,
      content: "(modal content)",
      backdrop: true,
      showCloseButton: true,
      backdropOptions: {}
    };

    function Modal(options1) {
      this.options = options1;
      this.show = bind(this.show, this);
      this.$el = $("<div class='modal'><a href='#' class='close'><img src='" + (assetPath('images/close.png')) + "', width='16', height='16', alt='close'></a><div class='inner'></div></div>").hide();
      this.options = $.extend(true, {}, this.defaults, this.options);
      this.$content = this.$el.find(".inner");
      this.$closeButton = this.$el.find(".close");
      if (!this.options.showCloseButton) {
        this.$closeButton.hide();
      }
      this.backdrop = null;
      this.resizeInterval = null;
      this.loadContent(this.options.content);
      this.$closeButton.on("click touchstart", (function(_this) {
        return function(e) {
          _this.hide(true);
          return e.preventDefault();
        };
      })(this));
      this.appendElement();
      this.setWidth(this.options.width);
      this.setHeight(this.options.height);
      this.bindToElement();
    }

    Modal.prototype.showBackdrop = function() {
      var o;
      o = {
        disableBodyScroll: true,
        hideCallback: (function(_this) {
          return function(backdrop) {
            _this.backdrop = null;
            if (!_this.$el.hasClass("destroyed")) {
              return _this.hide(true);
            }
          };
        })(this)
      };
      o = $.extend(true, {}, o, this.options.backdropOptions);
      return this.backdrop = new Backdrop(o);
    };

    Modal.prototype.appendElement = function() {
      return $("body").append(this.$el);
    };

    Modal.prototype.loadContent = function(data) {
      var url;
      if (data == null) {
        data = "";
      }
      if (data.match(/^\.|\#/)) {
        this.setContent($(data).html());
        if (this.options.showOnInit) {
          return this.show();
        }
      } else if (data.match(/^\//)) {
        if (data.match(/^\/\//)) {
          url = document.location.protocol + data;
        } else {
          url = document.location.pathname;
          url += data.replace(/^\/?/, "");
        }
        return $.get(url + "?" + (new Date()).getTime(), (function(_this) {
          return function(res) {
            _this.setContent(res);
            if (_this.options.showOnInit) {
              _this.show();
            }
            return _this.setSize();
          };
        })(this));
      } else {
        this.setContent(data);
        if (this.options.showOnInit) {
          return this.show();
        }
      }
    };

    Modal.prototype.setContent = function(content) {
      return this.$content.html(content);
    };

    Modal.prototype.setHeight = function(height) {
      if (height == null) {
        height = null;
      }
      height = height != null ? height : this.$content.height() + 1;
      height = $(window).height() < height ? $(window).height() - 50 : height;
      if (height > 0) {
        return this.$el.css({
          "height": height,
          "margin-top": (height / 2) * -1
        });
      }
    };

    Modal.prototype.setWidth = function(width) {
      if (width == null) {
        width = null;
      }
      width = width != null ? width : this.$content.width();
      if (width > 0) {
        return this.$el.css({
          "width": width,
          "margin-left": (width / 2) * -1
        });
      }
    };

    Modal.prototype.setSize = function(width, height) {
      if (width == null) {
        width = null;
      }
      if (height == null) {
        height = null;
      }
      this.setWidth(width);
      return this.setHeight(height);
    };

    Modal.prototype.bindToElement = function() {
      return this.$el.data("modal", this);
    };

    Modal.prototype.hide = function(remove) {
      if (remove == null) {
        remove = false;
      }
      if (this.options.beforeHide) {
        this.options.beforeHide.apply(this);
      }
      this.$el.addClass("destroyed");
      if (this.backdrop) {
        this.backdrop.hide();
      }
      new Transition(this.$el, {
        top: "100%",
        opacity: 0
      }, 300, (function(_this) {
        return function() {
          _this.$el.hide();
          return setTimeout(function() {
            return _this.$el.remove();
          }, 100);
        };
      })(this));
      if (this.options.afterHide) {
        return this.options.afterHide.apply(this);
      }
    };

    Modal.prototype.show = function() {
      if (this.options.beforeShow) {
        this.options.beforeShow.apply(this);
      }
      if (this.options.backdrop) {
        this.showBackdrop();
      }
      this.$el.show();
      this.$el.css({
        top: "0%",
        opacity: 0
      });
      return setTimeout((function(_this) {
        return function() {
          return new Transition(_this.$el, {
            top: "50%",
            opacity: 1
          }, 300, function() {
            if (_this.options.afterShow) {
              _this.options.afterShow.apply(_this);
            }
            if (_this.$el.find('[data-modal-callback]').length) {
              return window[_this.$el.find('[data-modal-callback]').attr('id')].call();
            }
          });
        };
      })(this), 10);
    };

    return Modal;

  })();

  $(function() {
    return $("body").on("click", "[data-modal]", function(e) {
      var $opener, windowWidth;
      $opener = $(this);
      $(".modal").each(function() {
        return $(this).data("modal").hide(true);
      });
      windowWidth = $(window).width() <= 320 ? 320 : $(window).width() - 30;
      new Modal({
        content: $opener.data("modal"),
        width: $opener.data("width") > windowWidth || !$opener.data("width") ? windowWidth : $opener.data("width"),
        height: $opener.data("height"),
        showOnInit: {
          "true": true,
          "false": false
        }[$opener.data("show-on-init")],
        beforeShow: function() {
          var $iframe;
          if (this.$content.find("iframe").length) {
            $iframe = this.$content.find("iframe");
            $iframe.prop('width', windowWidth + 'px').prop('height', '100%');
            return $iframe.prop("src", $iframe.data("src"));
          }
        },
        afterShow: function() {
          var el;
          el = this.$content;
          return setTimeout(function() {
            return el.css('height', '100%');
          }, 500);
        }
      });
      return e.preventDefault();
    });
  });

  (function($, window) {
    return $.fn.extend({
      transition: function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return this.each(function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Transition, [this].concat(slice.call(args)), function(){});
        });
      }
    });
  })(window.jQuery, window);

  window.Transition = (function() {
    function Transition(el, options, duration, callback) {
      if (options == null) {
        options = {};
      }
      if (duration == null) {
        duration = 500;
      }
      if (callback == null) {
        callback = function() {};
      }
      this._callback = bind(this._callback, this);
      this.animationOff = bind(this.animationOff, this);
      this.$el = $(el);
      if (Modernizr.csstransitions) {
        if (duration > 0) {
          this.animationOnOnce(duration / 1000, callback);
          setTimeout((function(_this) {
            return function() {
              return _this.$el.css(options, 1);
            };
          })(this));
        } else {
          this.$el.css(options);
          callback();
        }
      } else {
        this.$el.stop().animate(options, duration, callback);
      }
    }

    Transition.prototype.animationOn = function(seconds) {
      if (seconds == null) {
        seconds = .5;
      }
      return this.$el.css({
        "transition": "all " + seconds + "s ease-in-out",
        "-webkit-transition": "all " + seconds + "s ease-in-out",
        "-moz-transition": "all " + seconds + "s ease-in-out"
      });
    };

    Transition.prototype.animationOff = function() {
      return this.$el.css({
        "transition": "none",
        "-webkit-transition": "none",
        "-moz-transition": "none"
      });
    };

    Transition.prototype.animationOnOnce = function(seconds, callback) {
      if (callback == null) {
        callback = function() {};
      }
      this.$el.data("callback", callback);
      this.animationOn(seconds);
      return this.$el.on("oTransitionEnd transitionend", this._callback);
    };

    Transition.prototype._callback = function(e) {
      if ((e.srcElement || e.target) !== this.$el.get(0)) {
        return false;
      }
      if (typeof (this.$el.data("callback")) === "function") {
        this.$el.data("callback").apply(this.$el, e);
      }
      this.$el.off("oTransitionEnd transitionend", this._callback);
      return this.animationOff();
    };

    return Transition;

  })();

  CC = [
    {
      name: 'Afghanistan',
      code: 'AF'
    }, {
      name: 'Åland Islands',
      code: 'AX'
    }, {
      name: 'Albania',
      code: 'AL'
    }, {
      name: 'Algeria',
      code: 'DZ'
    }, {
      name: 'American Samoa',
      code: 'AS'
    }, {
      name: 'AndorrA',
      code: 'AD'
    }, {
      name: 'Angola',
      code: 'AO'
    }, {
      name: 'Anguilla',
      code: 'AI'
    }, {
      name: 'Antarctica',
      code: 'AQ'
    }, {
      name: 'Antigua and Barbuda',
      code: 'AG'
    }, {
      name: 'Argentina',
      code: 'AR'
    }, {
      name: 'Armenia',
      code: 'AM'
    }, {
      name: 'Aruba',
      code: 'AW'
    }, {
      name: 'Australia',
      code: 'AU'
    }, {
      name: 'Austria',
      code: 'AT'
    }, {
      name: 'Azerbaijan',
      code: 'AZ'
    }, {
      name: 'Bahamas',
      code: 'BS'
    }, {
      name: 'Bahrain',
      code: 'BH'
    }, {
      name: 'Bangladesh',
      code: 'BD'
    }, {
      name: 'Barbados',
      code: 'BB'
    }, {
      name: 'Belarus',
      code: 'BY'
    }, {
      name: 'Belgium',
      code: 'BE'
    }, {
      name: 'Belize',
      code: 'BZ'
    }, {
      name: 'Benin',
      code: 'BJ'
    }, {
      name: 'Bermuda',
      code: 'BM'
    }, {
      name: 'Bhutan',
      code: 'BT'
    }, {
      name: 'Bolivia',
      code: 'BO'
    }, {
      name: 'Bosnia and Herzegovina',
      code: 'BA'
    }, {
      name: 'Botswana',
      code: 'BW'
    }, {
      name: 'Bouvet Island',
      code: 'BV'
    }, {
      name: 'Brazil',
      code: 'BR'
    }, {
      name: 'British Indian Ocean Territory',
      code: 'IO'
    }, {
      name: 'Brunei Darussalam',
      code: 'BN'
    }, {
      name: 'Bulgaria',
      code: 'BG'
    }, {
      name: 'Burkina Faso',
      code: 'BF'
    }, {
      name: 'Burundi',
      code: 'BI'
    }, {
      name: 'Cambodia',
      code: 'KH'
    }, {
      name: 'Cameroon',
      code: 'CM'
    }, {
      name: 'Canada',
      code: 'CA'
    }, {
      name: 'Cape Verde',
      code: 'CV'
    }, {
      name: 'Cayman Islands',
      code: 'KY'
    }, {
      name: 'Central African Republic',
      code: 'CF'
    }, {
      name: 'Chad',
      code: 'TD'
    }, {
      name: 'Chile',
      code: 'CL'
    }, {
      name: 'China',
      code: 'CN'
    }, {
      name: 'Christmas Island',
      code: 'CX'
    }, {
      name: 'Cocos (Keeling) Islands',
      code: 'CC'
    }, {
      name: 'Colombia',
      code: 'CO'
    }, {
      name: 'Comoros',
      code: 'KM'
    }, {
      name: 'Congo',
      code: 'CG'
    }, {
      name: 'Congo, The Democratic Republic of the',
      code: 'CD'
    }, {
      name: 'Cook Islands',
      code: 'CK'
    }, {
      name: 'Costa Rica',
      code: 'CR'
    }, {
      name: 'Cote D\'Ivoire',
      code: 'CI'
    }, {
      name: 'Croatia',
      code: 'HR'
    }, {
      name: 'Cuba',
      code: 'CU'
    }, {
      name: 'Cyprus',
      code: 'CY'
    }, {
      name: 'Czech Republic',
      code: 'CZ'
    }, {
      name: 'Denmark',
      code: 'DK'
    }, {
      name: 'Djibouti',
      code: 'DJ'
    }, {
      name: 'Dominica',
      code: 'DM'
    }, {
      name: 'Dominican Republic',
      code: 'DO'
    }, {
      name: 'Ecuador',
      code: 'EC'
    }, {
      name: 'Egypt',
      code: 'EG'
    }, {
      name: 'El Salvador',
      code: 'SV'
    }, {
      name: 'Equatorial Guinea',
      code: 'GQ'
    }, {
      name: 'Eritrea',
      code: 'ER'
    }, {
      name: 'Estonia',
      code: 'EE'
    }, {
      name: 'Ethiopia',
      code: 'ET'
    }, {
      name: 'Falkland Islands (Malvinas)',
      code: 'FK'
    }, {
      name: 'Faroe Islands',
      code: 'FO'
    }, {
      name: 'Fiji',
      code: 'FJ'
    }, {
      name: 'Finland',
      code: 'FI'
    }, {
      name: 'France',
      code: 'FR'
    }, {
      name: 'French Guiana',
      code: 'GF'
    }, {
      name: 'French Polynesia',
      code: 'PF'
    }, {
      name: 'French Southern Territories',
      code: 'TF'
    }, {
      name: 'Gabon',
      code: 'GA'
    }, {
      name: 'Gambia',
      code: 'GM'
    }, {
      name: 'Georgia',
      code: 'GE'
    }, {
      name: 'Germany',
      code: 'DE'
    }, {
      name: 'Ghana',
      code: 'GH'
    }, {
      name: 'Gibraltar',
      code: 'GI'
    }, {
      name: 'Greece',
      code: 'GR'
    }, {
      name: 'Greenland',
      code: 'GL'
    }, {
      name: 'Grenada',
      code: 'GD'
    }, {
      name: 'Guadeloupe',
      code: 'GP'
    }, {
      name: 'Guam',
      code: 'GU'
    }, {
      name: 'Guatemala',
      code: 'GT'
    }, {
      name: 'Guernsey',
      code: 'GG'
    }, {
      name: 'Guinea',
      code: 'GN'
    }, {
      name: 'Guinea-Bissau',
      code: 'GW'
    }, {
      name: 'Guyana',
      code: 'GY'
    }, {
      name: 'Haiti',
      code: 'HT'
    }, {
      name: 'Heard Island and Mcdonald Islands',
      code: 'HM'
    }, {
      name: 'Holy See (Vatican City State)',
      code: 'VA'
    }, {
      name: 'Honduras',
      code: 'HN'
    }, {
      name: 'Hong Kong',
      code: 'HK'
    }, {
      name: 'Hungary',
      code: 'HU'
    }, {
      name: 'Iceland',
      code: 'IS'
    }, {
      name: 'India',
      code: 'IN'
    }, {
      name: 'Indonesia',
      code: 'ID'
    }, {
      name: 'Iran, Islamic Republic Of',
      code: 'IR'
    }, {
      name: 'Iraq',
      code: 'IQ'
    }, {
      name: 'Ireland',
      code: 'IE'
    }, {
      name: 'Isle of Man',
      code: 'IM'
    }, {
      name: 'Israel',
      code: 'IL'
    }, {
      name: 'Italy',
      code: 'IT'
    }, {
      name: 'Jamaica',
      code: 'JM'
    }, {
      name: 'Japan',
      code: 'JP'
    }, {
      name: 'Jersey',
      code: 'JE'
    }, {
      name: 'Jordan',
      code: 'JO'
    }, {
      name: 'Kazakhstan',
      code: 'KZ'
    }, {
      name: 'Kenya',
      code: 'KE'
    }, {
      name: 'Kiribati',
      code: 'KI'
    }, {
      name: 'Korea, Democratic People\'S Republic of',
      code: 'KP'
    }, {
      name: 'Korea, Republic of',
      code: 'KR'
    }, {
      name: 'Kuwait',
      code: 'KW'
    }, {
      name: 'Kyrgyzstan',
      code: 'KG'
    }, {
      name: 'Lao People\'S Democratic Republic',
      code: 'LA'
    }, {
      name: 'Latvia',
      code: 'LV'
    }, {
      name: 'Lebanon',
      code: 'LB'
    }, {
      name: 'Lesotho',
      code: 'LS'
    }, {
      name: 'Liberia',
      code: 'LR'
    }, {
      name: 'Libyan Arab Jamahiriya',
      code: 'LY'
    }, {
      name: 'Liechtenstein',
      code: 'LI'
    }, {
      name: 'Lithuania',
      code: 'LT'
    }, {
      name: 'Luxembourg',
      code: 'LU'
    }, {
      name: 'Macao',
      code: 'MO'
    }, {
      name: 'Macedonia, The Former Yugoslav Republic of',
      code: 'MK'
    }, {
      name: 'Madagascar',
      code: 'MG'
    }, {
      name: 'Malawi',
      code: 'MW'
    }, {
      name: 'Malaysia',
      code: 'MY'
    }, {
      name: 'Maldives',
      code: 'MV'
    }, {
      name: 'Mali',
      code: 'ML'
    }, {
      name: 'Malta',
      code: 'MT'
    }, {
      name: 'Marshall Islands',
      code: 'MH'
    }, {
      name: 'Martinique',
      code: 'MQ'
    }, {
      name: 'Mauritania',
      code: 'MR'
    }, {
      name: 'Mauritius',
      code: 'MU'
    }, {
      name: 'Mayotte',
      code: 'YT'
    }, {
      name: 'Mexico',
      code: 'MX'
    }, {
      name: 'Micronesia, Federated States of',
      code: 'FM'
    }, {
      name: 'Moldova, Republic of',
      code: 'MD'
    }, {
      name: 'Monaco',
      code: 'MC'
    }, {
      name: 'Mongolia',
      code: 'MN'
    }, {
      name: 'Montserrat',
      code: 'MS'
    }, {
      name: 'Morocco',
      code: 'MA'
    }, {
      name: 'Mozambique',
      code: 'MZ'
    }, {
      name: 'Myanmar',
      code: 'MM'
    }, {
      name: 'Namibia',
      code: 'NA'
    }, {
      name: 'Nauru',
      code: 'NR'
    }, {
      name: 'Nepal',
      code: 'NP'
    }, {
      name: 'Netherlands',
      code: 'NL'
    }, {
      name: 'Netherlands Antilles',
      code: 'AN'
    }, {
      name: 'New Caledonia',
      code: 'NC'
    }, {
      name: 'New Zealand',
      code: 'NZ'
    }, {
      name: 'Nicaragua',
      code: 'NI'
    }, {
      name: 'Niger',
      code: 'NE'
    }, {
      name: 'Nigeria',
      code: 'NG'
    }, {
      name: 'Niue',
      code: 'NU'
    }, {
      name: 'Norfolk Island',
      code: 'NF'
    }, {
      name: 'Northern Mariana Islands',
      code: 'MP'
    }, {
      name: 'Norway',
      code: 'NO'
    }, {
      name: 'Oman',
      code: 'OM'
    }, {
      name: 'Pakistan',
      code: 'PK'
    }, {
      name: 'Palau',
      code: 'PW'
    }, {
      name: 'Palestinian Territory, Occupied',
      code: 'PS'
    }, {
      name: 'Panama',
      code: 'PA'
    }, {
      name: 'Papua New Guinea',
      code: 'PG'
    }, {
      name: 'Paraguay',
      code: 'PY'
    }, {
      name: 'Peru',
      code: 'PE'
    }, {
      name: 'Philippines',
      code: 'PH'
    }, {
      name: 'Pitcairn',
      code: 'PN'
    }, {
      name: 'Poland',
      code: 'PL'
    }, {
      name: 'Portugal',
      code: 'PT'
    }, {
      name: 'Puerto Rico',
      code: 'PR'
    }, {
      name: 'Qatar',
      code: 'QA'
    }, {
      name: 'Reunion',
      code: 'RE'
    }, {
      name: 'Romania',
      code: 'RO'
    }, {
      name: 'Russian Federation',
      code: 'RU'
    }, {
      name: 'RWANDA',
      code: 'RW'
    }, {
      name: 'Saint Helena',
      code: 'SH'
    }, {
      name: 'Saint Kitts and Nevis',
      code: 'KN'
    }, {
      name: 'Saint Lucia',
      code: 'LC'
    }, {
      name: 'Saint Pierre and Miquelon',
      code: 'PM'
    }, {
      name: 'Saint Vincent and the Grenadines',
      code: 'VC'
    }, {
      name: 'Samoa',
      code: 'WS'
    }, {
      name: 'San Marino',
      code: 'SM'
    }, {
      name: 'Sao Tome and Principe',
      code: 'ST'
    }, {
      name: 'Saudi Arabia',
      code: 'SA'
    }, {
      name: 'Senegal',
      code: 'SN'
    }, {
      name: 'Serbia and Montenegro',
      code: 'CS'
    }, {
      name: 'Seychelles',
      code: 'SC'
    }, {
      name: 'Sierra Leone',
      code: 'SL'
    }, {
      name: 'Singapore',
      code: 'SG'
    }, {
      name: 'Slovakia',
      code: 'SK'
    }, {
      name: 'Slovenia',
      code: 'SI'
    }, {
      name: 'Solomon Islands',
      code: 'SB'
    }, {
      name: 'Somalia',
      code: 'SO'
    }, {
      name: 'South Africa',
      code: 'ZA'
    }, {
      name: 'South Georgia and the South Sandwich Islands',
      code: 'GS'
    }, {
      name: 'Spain',
      code: 'ES'
    }, {
      name: 'Sri Lanka',
      code: 'LK'
    }, {
      name: 'Sudan',
      code: 'SD'
    }, {
      name: 'Suriname',
      code: 'SR'
    }, {
      name: 'Svalbard and Jan Mayen',
      code: 'SJ'
    }, {
      name: 'Swaziland',
      code: 'SZ'
    }, {
      name: 'Sweden',
      code: 'SE'
    }, {
      name: 'Switzerland',
      code: 'CH'
    }, {
      name: 'Syrian Arab Republic',
      code: 'SY'
    }, {
      name: 'Taiwan, Province of China',
      code: 'TW'
    }, {
      name: 'Tajikistan',
      code: 'TJ'
    }, {
      name: 'Tanzania, United Republic of',
      code: 'TZ'
    }, {
      name: 'Thailand',
      code: 'TH'
    }, {
      name: 'Timor-Leste',
      code: 'TL'
    }, {
      name: 'Togo',
      code: 'TG'
    }, {
      name: 'Tokelau',
      code: 'TK'
    }, {
      name: 'Tonga',
      code: 'TO'
    }, {
      name: 'Trinidad and Tobago',
      code: 'TT'
    }, {
      name: 'Tunisia',
      code: 'TN'
    }, {
      name: 'Turkey',
      code: 'TR'
    }, {
      name: 'Turkmenistan',
      code: 'TM'
    }, {
      name: 'Turks and Caicos Islands',
      code: 'TC'
    }, {
      name: 'Tuvalu',
      code: 'TV'
    }, {
      name: 'Uganda',
      code: 'UG'
    }, {
      name: 'Ukraine',
      code: 'UA'
    }, {
      name: 'United Arab Emirates',
      code: 'AE'
    }, {
      name: 'United Kingdom',
      code: 'GB'
    }, {
      name: 'United States',
      code: 'US'
    }, {
      name: 'United States Minor Outlying Islands',
      code: 'UM'
    }, {
      name: 'Uruguay',
      code: 'UY'
    }, {
      name: 'Uzbekistan',
      code: 'UZ'
    }, {
      name: 'Vanuatu',
      code: 'VU'
    }, {
      name: 'Venezuela',
      code: 'VE'
    }, {
      name: 'Viet Nam',
      code: 'VN'
    }, {
      name: 'Virgin Islands, British',
      code: 'VG'
    }, {
      name: 'Virgin Islands, U.S.',
      code: 'VI'
    }, {
      name: 'Wallis and Futuna',
      code: 'WF'
    }, {
      name: 'Western Sahara',
      code: 'EH'
    }, {
      name: 'Yemen',
      code: 'YE'
    }, {
      name: 'Zambia',
      code: 'ZM'
    }, {
      name: 'Zimbabwe',
      code: 'ZW'
    }
  ];

  window.geoLocationByBrowser = function(callback) {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(function(position) {
        return callback(position);
      });
    }
  };

  window.countryByCode = function(code) {
    var cc, i, len;
    for (i = 0, len = CC.length; i < len; i++) {
      cc = CC[i];
      if (cc.code === code) {
        return cc.name;
      }
    }
  };

  window.AdidasShopAPI = (function() {
    function AdidasShopAPI() {}

    AdidasShopAPI.host = "placesws.adidas-group.com";

    AdidasShopAPI.endpoint = "/API/search";

    AdidasShopAPI.defaultParams = {
      method: "get",
      geoengine: "google",
      brand: "adidas",
      category: "store",
      tagging: "kanye",
      latlng: "48.856614,2.352222,50000"
    };

    AdidasShopAPI.get = function(params, callback) {
      if (callback == null) {
        callback = function() {};
      }
      params = $.extend(true, {}, this.defaultParams, params);
      return $.getJSON("https://" + this.host + this.endpoint + "?" + ($.param(params)) + "&format=json", callback);
    };

    return AdidasShopAPI;

  })();

  $(function() {
    var lastCountry, storesLoaded;
    window.w = window;
    w.tm = null;
    w.resultTemplate = $(".resultTemplate");
    $("body").on("click", "a[data-address]", function(e) {
      e.preventDefault();
      return $("input[name='city_zip_code']").val($(this).data("address")).trigger("keydown");
    });
    $("div.results").addClass('loading').html("<img src='" + (assetPath('images/ajax-loader.gif')) + "' alt='loading' /> Loading stores");
    lastCountry = null;
    storesLoaded = false;
    return $('body').on("click", ".store-finder", function(e) {
      if (!storesLoaded) {
        return AdidasShopAPI.get({}, function(results) {
          var html, i, j, len, len1, result;
          storesLoaded = true;
          $("div.results").removeClass('loading').html("");
          results = results.wsResponse.result;
          for (i = 0, len = results.length; i < len; i++) {
            result = results[i];
            result.countryName = countryByCode(result.country);
          }
          results = results.sort(sort_by({
            name: 'countryName',
            primer: function(a) {
              return a.toUpperCase();
            }
          }, {
            name: 'city',
            primer: function(a) {
              return a.toUpperCase();
            }
          }, {
            name: 'name',
            primer: function(a) {
              return a.toUpperCase();
            }
          }));
          for (j = 0, len1 = results.length; j < len1; j++) {
            result = results[j];
            if (lastCountry !== result.country) {
              $("div.results").append("<h3>" + result.countryName + "</h3>");
            }
            html = w.resultTemplate.html();
            html = html.replace("##name##", result.name);
            html = html.replace("##street##", "" + result.street1);
            html = html.replace("##city##", "<br/>" + result.city);
            if (result.url1) {
              html = html.replace("##website##", "<br><a target='_blank' href='http://" + result.url1 + "'>" + result.url1 + "</a>");
            }
            if (typeof result.yeezy_confimed_app !== 'undefined' && result.yeezy_confimed_app !== null) {
              html = html.replace("##logo##", "<img src='" + (assetPath('images/adidas-confirmed-logo-dark.png')) + "' width='40' height='41' alt='adidas CONFIRMED' />");
              html = html.replace("##copy##", "<a href='' target='_blank'>" + result.yeezy_confimed_app + "</a>");
            }
            $("div.results").append(html.replace("undefined ", "").replace(/##[^#]+##/gm, ""));
            lastCountry = result.country;
          }
          $('.modal .inner').css('height', 'auto');
          $('.modal').data('modal').setSize();
          return $('.modal .inner').css('height', '100%');
        });
      }
    });
  });

  window.Tracking = {
    tag: function() {
      var args, method, ref;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ref = args, method = ref[0], args = 2 <= ref.length ? slice.call(ref, 1) : [];
      if ((typeof utag !== "undefined" && utag !== null ? utag[method] : void 0) != null) {
        return utag[method].apply(utag, args);
      } else {
        if (console && console.log) {
          console.log(method);
          return console.log(args);
        }
      }
    }
  };

  $(function() {
    var $body, torclick;
    $body = $("body");
    torclick = DEVICE === "mobile" ? "touchstart" : "click";
    $body.on(torclick, "a[data-track-view]", function() {
      var error, trackingData, value;
      value = $(this).data("track-view");
      try {
        trackingData = JSON.parse(value);
      } catch (error) {
        trackingData = {
          page_name: value
        };
      }
      return Tracking.tag("view", trackingData);
    });
    return $body.on(torclick, "a[data-track-link]", function() {
      var value;
      value = $(this).data("track-link");
      if ($("body").data("currentSection") && value && (value.event_name === "TWITTER" || value.event_name === "FACEBOOK" || value.event_name === "GPLUS")) {
        value.page_name = $("body").data("currentSection");
      }
      return Tracking.tag("link", value);
    });
  });

  window.loadVideo = function(element, autoplay) {
    var $parent, $this, player, ref, ref1;
    if (autoplay == null) {
      autoplay = 0;
    }
    $this = $(element);
    $parent = $this.parent();
    $parent.attr("data-youtube-wrapper", $this.data("youtube-id"));
    player = new YT.Player($this.get(0), {
      height: (ref = $this.data("height")) != null ? ref : '100%',
      width: (ref1 = $this.data("width")) != null ? ref1 : '100%',
      videoId: $this.data("youtube-id"),
      playerVars: {
        rel: 0,
        controls: 1,
        autoplay: autoplay,
        showinfo: 0,
        modestbranding: 1,
        color: 'white'
      },
      events: {
        onStateChange: function(event) {
          var trackingData;
          if (Number(event.data) === -1 || Number(event.data) === 3 || Number(event.data) === 5) {
            return;
          }
          event.data = event.target.getCurrentTime() > 0 && event.data === 1 ? "-1" : event.data;
          trackingData = {
            video_category: "ORIGINALS",
            video_position: event.target.getCurrentTime(),
            video_length: event.target.getDuration(),
            video_name: event.target.getVideoData().title,
            video_player: "Youtube",
            video_event: {
              "1": "video_start",
              "2": "video_stop",
              "0": "video_complete",
              "-1": "video_play"
            }[event.data]
          };
          return Tracking.tag("link", trackingData);
        }
      }
    });
    return $parent.data("player", player);
  };

  window.videoResize = function(player) {
    var columnWidth, playerInitHeight, playerInitWidth, playerNewHeight, playerRatio;
    player = player != null ? player : $('#video iframe');
    playerInitHeight = 180;
    playerInitWidth = 320;
    playerRatio = playerInitHeight / playerInitWidth;
    columnWidth = player.parent().width();
    playerNewHeight = columnWidth * playerRatio;
    playerNewHeight = playerNewHeight >= 600 ? 600 : playerNewHeight;
    return player.attr('width', columnWidth + 'px').attr('height', playerNewHeight + 'px');
  };

  $(function() {
    var $videos;
    $videos = $("#videos");
    setTimeout(function() {
      var firstScriptTag, tag;
      window.onYouTubeIframeAPIReady = function() {
        return $("[data-youtube-id]").each(function() {
          $(this).prev().hide();
          loadVideo($(this), 0);
          return videoResize();
        });
      };
      tag = document.createElement('script');
      tag.src = "https://www.youtube.com/player_api";
      firstScriptTag = document.getElementsByTagName('script')[0];
      return firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }, 500);
    return $(window).resize(function() {
      return videoResize();
    });
  });

  window.assetPath = function(file) {
    return window.ASSET_PATH.replace("_FILE_", file);
  };

  window.popup = function(url) {
    var height, width;
    width = 500;
    height = 500;
    return window.open(url, "_blank", "width=" + width + ", height=" + height + ", left=" + ((screen.width / 2) - (width / 2)) + ", top=300");
  };

  window.captchaResponse = function(response) {
    $('#captcha').addClass('checked');
    $('#flashproductform').append('<input class="captcha-duplicate" type="hidden" name="x-PrdRt" value="' + response + '">');
    return addToBagCheck();
  };

  window.captchaExpired = function(response) {
    $('#flashproductform').find('.captcha-duplicate').remove();
    return $('#shoe .add-to-bag').attr('disabled', true);
  };

  $(function() {
    var addToCartUrl, afterImageSwipe, content, getUpdatesUrl;
    $('body').addClass('adi-yeezy-site');
    $('body').addClass('adi-market-' + MARKET);
    if (!MobileEsp.DetectTierIphone()) {
      $('body').removeClass('mobile').addClass('desktop');
      $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      addToCartUrl = $('#flashproductform').data('desktop');
      $('#flashproductform').attr('action', addToCartUrl);
      $('.btn.get-updates').attr('href', '#').attr('data-modal', '#getupdatesModal');
      getUpdatesUrl = $('#getupdates iframe').data('desktop');
      $('#getupdates iframe').attr('data-src', getUpdatesUrl);
    }
    if (!((bowser.ios && bowser.version >= 6) || (bowser.android && bowser.version >= 38) || (bowser.msie && bowser.version >= 9) || (bowser.chrome && bowser.version >= 35) || (bowser.safari && bowser.version >= 6) || (bowser.firefox && bowser.version >= 30))) {
      content = $('#badBrowserModal');
      $('body').prepend(content);
    }
    if (ENV !== 'LOCAL' && window.history && window.history.pushState) {
      /**content = $('#badBrowserModal');
      $('body').prepend(content);**/
    }
    afterImageSwipe = function() {
      var currentSlide;
      currentSlide = this.owl.currentItem + 1;
      return Tracking.tag('link', {
        event_category: 'KANYEDROP7|IMAGES',
        event_name: 'SWIPE LOOK ' + currentSlide
      });
    };
    $(".shoe-gallery").owlCarousel({
      navigation: true,
      slideSpeed: 300,
      paginationSpeed: 400,
      singleItem: true,
      pagination: true,
      lazyLoad: true,
      afterMove: afterImageSwipe
    });
    if ($('#shoe').find('.buy').length > 0) {
      inventoryCheck();
    }
    return $(window).on("scroll", function() {
      if ($("#gallery").visibility() >= 0.56 && $("body").attr("data-currentSection") !== "SHOE SHOTS") {
        $("body").attr("data-currentSection", "SHOE SHOTS");
        if (DEVICE === 'mobile') {
          Tracking.tag('link', {
            event_category: 'SECTION',
            event_name: 'SHOE SHOTS'
          });
        } else {
          Tracking.tag('view', {
            page_name: 'SHOE SHOTS'
          });
        }
      }
      if ($(window).scrollTop() + $(window).height() === $(document).height() && $("body").attr("data-currentSection") !== "BOTTOM") {
        $("body").attr("data-currentSection", "BOTTOM");
        return Tracking.tag('link', {
          event_category: 'KANYEDROP7',
          event_name: 'EXPERIENCE END'
        });
      }
    });
  });

}).call(this);