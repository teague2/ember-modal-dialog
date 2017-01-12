define("ember-modal-dialog/components/modal-dialog", ["exports", "ember", "ember-modal-dialog/templates/components/modal-dialog"], function (exports, _ember, _emberModalDialogTemplatesComponentsModalDialog) {
  "use strict";

  var computed = _ember["default"].computed;
  var computedJoin = function computedJoin(prop) {
    return computed(prop, function () {
      return this.get(prop).join(" ");
    });
  };

  exports["default"] = _ember["default"].Component.extend({
    tagName: "", // modal-dialog is itself tagless. positioned-container provides
    // the container div
    layout: _emberModalDialogTemplatesComponentsModalDialog["default"],

    "container-class": null, // set this from templates
    containerClassNames: ["ember-modal-dialog"], // set this in a subclass definition
    containerClassNamesString: computedJoin("containerClassNames"),

    "overlay-class": null, // set this from templates
    overlayClassNames: ["ember-modal-overlay"], // set this in a subclass definition
    overlayClassNamesString: computedJoin("overlayClassNames"),

    concatenatedProperties: ["containerClassNames", "overlayClassNames"],

    destinationElementId: null, // injected
    alignmentTarget: null, // view instance, passed in
    alignment: "center", // passed in
    isPositioned: computed.notEmpty("alignmentTarget"),
    hasOverlay: true,
    translucentOverlay: false,

    actions: {
      close: function close() {
        this.sendAction("close");
      }
    }
  });
});
define("ember-modal-dialog/components/positioned-container", ["exports", "ember"], function (exports, _ember) {
  "use strict";

  var computed = _ember["default"].computed;
  var observer = _ember["default"].observer;
  var on = _ember["default"].on;

  exports["default"] = _ember["default"].Component.extend({

    alignmentTarget: null, // element selector, element, or Ember View passed in
    alignment: null, // passed in; valid values are:
    // left, right, top, bottom (relative to alignmentTarget)
    // center (relative to container)
    isPositioned: computed("alignment", "alignmentTarget", function () {
      if (this.get("alignmentTarget") && this.get("alignment")) {
        return true;
      }
      return this.get("alignment") === "center";
    }),

    didGetPositioned: observer("isPositioned", on("didInsertElement", function () {
      if (this._state !== "inDOM") {
        return;
      }

      if (this.get("isPositioned")) {
        this.updateAlignment();
      } else {
        this.$().css("left", "").css("top", "");
      }
    })),

    //TODO: Add resize and scroll handlers
    updateAlignment: function updateAlignment() {
      var alignmentTarget = this.get("alignmentTarget");
      if (_ember["default"].typeOf(alignmentTarget) === "string") {
        alignmentTarget = _ember["default"].$(alignmentTarget)[0];
      } else if (_ember["default"].View.detectInstance(alignmentTarget)) {
        alignmentTarget = alignmentTarget.element;
      }
      var $alignmentTarget = _ember["default"].$(alignmentTarget);
      var originOffset = alignmentTarget && $alignmentTarget.offset();
      var alignment = this.get("alignment");

      var originOffsetTop;
      if (originOffset) {
        originOffsetTop = originOffset.top - _ember["default"].$(window).scrollTop();
      }
      var elementWidth, elementHeight, targetWidth, targetHeight;
      elementWidth = this.$().outerWidth();
      switch (alignment) {
        case "left":
          this.$().css("left", originOffset.left - elementWidth).css("top", originOffsetTop);
          break;
        case "right":
          targetWidth = $alignmentTarget.outerWidth();
          this.$().css("left", originOffset.left + targetWidth).css("top", originOffsetTop);
          break;
        case "bottom":
          targetWidth = $alignmentTarget.outerWidth();
          targetHeight = $alignmentTarget.outerHeight();
          this.$().css("left", originOffset.left + targetWidth / 2 - elementWidth / 2).css("top", originOffsetTop + targetHeight);
          break;
        case "top":
          targetWidth = $alignmentTarget.outerWidth();
          elementHeight = this.$().outerHeight();
          this.$().css("left", originOffset.left + targetWidth / 2 - elementWidth / 2).css("top", originOffsetTop - elementHeight);
          break;
        case "center":
          elementWidth = this.$().outerWidth();
          elementHeight = this.$().outerHeight();
          this.$().css("left", "50%").css("top", "50%").css("margin-left", elementWidth * -0.5).css("margin-top", elementHeight * -0.5);
          break;
      }
    }
  });
});
define("ember-modal-dialog/initializers/add-modals-container", ["exports"], function (exports) {
                     /*globals document*/
                     "use strict";

                     exports["default"] = function (container, application) {
                                          var rootEl = document.querySelector(application.rootElement);
                                          var modalContainerEl = document.createElement("div");
                                          var emberModalDialog = application.emberModalDialog || {};
                                          var modalContainerElId = emberModalDialog.modalRootElementId || "modal-overlays";
                                          modalContainerEl.id = modalContainerElId;
                                          rootEl.appendChild(modalContainerEl);

                                          application.register("config:modals-container-id", modalContainerElId, { instantiate: false });
                                          application.inject("component:modal-dialog", "destinationElementId", "config:modals-container-id");
                     };

                     ;
});
define("ember-modal-dialog/templates/components/modal-dialog", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@1.13.13",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 4,
                "column": 2
              }
            },
            "moduleName": "modules/ember-modal-dialog/templates/components/modal-dialog.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element0, 'class');
            morphs[1] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [["attribute", "class", ["concat", [["subexpr", "-bind-attr-class", [["get", "overlayClassNamesString", []], "overlay-class-names-string"], [], []], " ", ["subexpr", "if", [["get", "translucentOverlay", []], "translucent", ""], [], []], " ", ["subexpr", "-bind-attr-class", [["get", "overlay-class", []], "overlay-class"], [], []]]]], ["element", "action", ["close"], [], ["loc", [null, [3, 100], [3, 118]]]]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@1.13.13",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 2
              },
              "end": {
                "line": 9,
                "column": 2
              }
            },
            "moduleName": "modules/ember-modal-dialog/templates/components/modal-dialog.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["content", "yield", ["loc", [null, [8, 4], [8, 13]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@1.13.13",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 10,
              "column": 0
            }
          },
          "moduleName": "modules/ember-modal-dialog/templates/components/modal-dialog.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "hasOverlay", ["loc", [null, [2, 8], [2, 18]]]]], [], 0, null, ["loc", [null, [2, 2], [4, 9]]]], ["block", "ember-modal-dialog-positioned-container", [], ["alignment", ["subexpr", "@mut", [["get", "alignment", ["loc", [null, [6, 42], [6, 51]]]]], [], []], "alignmentTarget", ["subexpr", "@mut", [["get", "alignmentTarget", ["loc", [null, [7, 48], [7, 63]]]]], [], []], "class", ["subexpr", "concat", [["subexpr", "if", [["get", "containerClassNamesString", []], ["subexpr", "-normalize-class", ["containerClassNamesString", ["get", "containerClassNamesString", []]], [], []]], [], []], " ", ["subexpr", "if", [["get", "container-class", []], ["subexpr", "-normalize-class", ["container-class", ["get", "container-class", []]], [], []]], [], []], " "], [], []]], 1, null, ["loc", [null, [5, 2], [9, 46]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.13",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "modules/ember-modal-dialog/templates/components/modal-dialog.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "ember-wormhole", [], ["to", ["subexpr", "@mut", [["get", "destinationElementId", ["loc", [null, [1, 21], [1, 41]]]]], [], []]], 0, null, ["loc", [null, [1, 0], [10, 19]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('ember-modal-dialog', ['ember-modal-dialog/index', 'ember', 'exports'], function(__index__, __Ember__, __exports__) {
  'use strict';
  var keys = Object.keys || __Ember__['default'].keys;
  var forEach = Array.prototype.forEach && function(array, cb) {
    array.forEach(cb);
  } || __Ember__['default'].EnumerableUtils.forEach;

  forEach(keys(__index__), (function(key) {
    __exports__[key] = __index__[key];
  }));
});

define('ember-wormhole/components/ember-wormhole', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var computed = _ember['default'].computed;
  var observer = _ember['default'].observer;
  var run = _ember['default'].run;

  exports['default'] = _ember['default'].Component.extend({
    to: computed.alias('destinationElementId'),
    destinationElementId: null,
    destinationElement: computed('destinationElementId', function () {
      return document.getElementById(this.get('destinationElementId'));
    }),

    didInsertElement: function didInsertElement() {
      this._firstNode = this.element.firstChild;
      this._lastNode = this.element.lastChild;
      this.appendToDestination();
    },

    willDestroyElement: function willDestroyElement() {
      var _this = this;

      var firstNode = this._firstNode;
      var lastNode = this._lastNode;
      run.schedule('render', function () {
        _this.removeRange(firstNode, lastNode);
      });
    },

    destinationDidChange: observer('destinationElement', function () {
      var destinationElement = this.get('destinationElement');
      if (destinationElement !== this._firstNode.parentNode) {
        run.schedule('render', this, 'appendToDestination');
      }
    }),

    appendToDestination: function appendToDestination() {
      var destinationElement = this.get('destinationElement');
      if (!destinationElement) {
        var destinationElementId = this.get('destinationElementId');
        if (destinationElementId) {
          throw new Error('ember-wormhole failed to render into \'#' + this.get('destinationElementId') + '\' because the element is not in the DOM');
        }
        throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
      }
      this.appendRange(destinationElement, this._firstNode, this._lastNode);
    },

    appendRange: function appendRange(destinationElement, firstNode, lastNode) {
      while (firstNode) {
        destinationElement.insertBefore(firstNode, null);
        firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
      }
    },

    removeRange: function removeRange(firstNode, lastNode) {
      var node = lastNode;
      do {
        var next = node.previousSibling;
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
        node = next;
      } while (node !== firstNode);
    }

  });
});
define('ember-wormhole', ['ember-wormhole/index', 'ember', 'exports'], function(__index__, __Ember__, __exports__) {
  'use strict';
  var keys = Object.keys || __Ember__['default'].keys;
  var forEach = Array.prototype.forEach && function(array, cb) {
    array.forEach(cb);
  } || __Ember__['default'].EnumerableUtils.forEach;

  forEach(keys(__index__), (function(key) {
    __exports__[key] = __index__[key];
  }));
});

define('twiddle/components/ember-modal-dialog-positioned-container', ['exports', 'ember-modal-dialog/components/positioned-container'], function (exports, _emberModalDialogComponentsPositionedContainer) {
  exports['default'] = _emberModalDialogComponentsPositionedContainer['default'];
});
define('twiddle/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormholeComponentsEmberWormhole) {
  exports['default'] = _emberWormholeComponentsEmberWormhole['default'];
});
define('twiddle/components/modal-dialog', ['exports', 'ember-modal-dialog/components/modal-dialog'], function (exports, _emberModalDialogComponentsModalDialog) {
  exports['default'] = _emberModalDialogComponentsModalDialog['default'];
});
define('twiddle/initializers/add-modals-container', ['exports', 'ember-modal-dialog/initializers/add-modals-container'], function (exports, _emberModalDialogInitializersAddModalsContainer) {
  exports['default'] = {
    name: 'add-modals-container',
    initialize: _emberModalDialogInitializersAddModalsContainer['default']
  };
});
define('twiddle/templates/components/modal-dialog', ['exports', 'ember-modal-dialog/templates/components/modal-dialog'], function (exports, _emberModalDialogTemplatesComponentsModalDialog) {
  exports['default'] = _emberModalDialogTemplatesComponentsModalDialog['default'];
});