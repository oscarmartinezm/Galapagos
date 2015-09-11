(function() {
  var IMAGE_SIZE, LINE_WIDTH, drawPath, setColoring,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  IMAGE_SIZE = 300;

  LINE_WIDTH = .1 * IMAGE_SIZE;

  window.ShapeDrawer = (function() {
    function ShapeDrawer(shapes) {
      this.shapes = shapes;
    }

    ShapeDrawer.prototype.setTransparency = function(ctx, color) {
      return ctx.globalAlpha = color.length > 3 ? color[3] / 255 : 1;
    };

    ShapeDrawer.prototype.drawShape = function(ctx, color, shapeName, thickness) {
      if (thickness == null) {
        thickness = 1;
      }
      ctx.translate(.5, -.5);
      ctx.scale(-1 / IMAGE_SIZE, 1 / IMAGE_SIZE);
      this.setTransparency(ctx, color);
      this.drawRawShape(ctx, color, shapeName, thickness);
    };

    ShapeDrawer.prototype.drawRawShape = function(ctx, color, shapeName, thickness) {
      var elem, shape, _i, _len, _ref;
      if (thickness == null) {
        thickness = 1;
      }
      ctx.lineWidth = LINE_WIDTH * thickness;
      shape = this.shapes[shapeName] || defaultShape;
      _ref = shape.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        draw[elem.type](ctx, color, elem);
      }
    };

    return ShapeDrawer;

  })();

  window.CachingShapeDrawer = (function(_super) {
    __extends(CachingShapeDrawer, _super);

    function CachingShapeDrawer(shapes) {
      CachingShapeDrawer.__super__.constructor.call(this, shapes);
      this.shapeCache = {};
    }

    CachingShapeDrawer.prototype.drawShape = function(ctx, color, shapeName) {
      var shapeCanvas, shapeCtx, shapeKey;
      shapeName = shapeName.toLowerCase();
      shapeKey = this.shapeKey(shapeName, color);
      shapeCanvas = this.shapeCache[shapeKey];
      if (shapeCanvas == null) {
        shapeCanvas = document.createElement('canvas');
        shapeCanvas.width = shapeCanvas.height = IMAGE_SIZE;
        shapeCtx = shapeCanvas.getContext('2d');
        this.drawRawShape(shapeCtx, color, shapeName);
        this.shapeCache[shapeKey] = shapeCanvas;
      }
      ctx.translate(.5, -.5);
      ctx.scale(-1 / IMAGE_SIZE, 1 / IMAGE_SIZE);
      this.setTransparency(ctx, color);
      ctx.drawImage(shapeCanvas, 0, 0);
    };

    CachingShapeDrawer.prototype.shapeKey = function(shapeName, color) {
      return [shapeName, netlogoColorToOpaqueCSS(color)];
    };

    return CachingShapeDrawer;

  })(ShapeDrawer);

  setColoring = function(ctx, color, element) {
    color = netlogoColorToOpaqueCSS(color);
    if (element.filled) {
      if (element.marked) {
        ctx.fillStyle = color;
      } else {
        ctx.fillStyle = element.color;
      }
    } else {
      if (element.marked) {
        ctx.strokeStyle = color;
      } else {
        ctx.strokeStyle = element.color;
      }
    }
  };

  drawPath = function(ctx, color, element) {
    setColoring(ctx, color, element);
    if (element.filled) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  window.draw = {
    circle: function(ctx, color, circle) {
      var r;
      r = circle.diam / 2;
      ctx.beginPath();
      ctx.arc(circle.x + r, circle.y + r, r, 0, 2 * Math.PI, false);
      ctx.closePath();
      drawPath(ctx, color, circle);
    },
    polygon: function(ctx, color, polygon) {
      var i, x, xcors, y, ycors, _i, _len, _ref;
      xcors = polygon.xcors;
      ycors = polygon.ycors;
      ctx.beginPath();
      ctx.moveTo(xcors[0], ycors[0]);
      _ref = xcors.slice(1);
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        x = _ref[i];
        y = ycors[i + 1];
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      drawPath(ctx, color, polygon);
    },
    rectangle: function(ctx, color, rectangle) {
      var h, w, x, y;
      x = rectangle.xmin;
      y = rectangle.ymin;
      w = rectangle.xmax - x;
      h = rectangle.ymax - y;
      setColoring(ctx, color, rectangle);
      if (rectangle.filled) {
        ctx.fillRect(x, y, w, h);
      } else {
        ctx.strokeRect(x, y, w, h);
      }
    },
    line: function(ctx, color, line) {
      var h, w, x, y;
      x = line.x1;
      y = line.y1;
      w = line.x2 - line.x1;
      h = line.y2 - line.y1;
      setColoring(ctx, color, line);
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    }
  };

  window.defaultShape = {
    rotate: true,
    elements: [
      {
        type: 'polygon',
        color: 'grey',
        filled: 'true',
        marked: 'true',
        xcors: [150, 40, 150, 260],
        ycors: [5, 250, 205, 250]
      }
    ]
  };

}).call(this);

//# sourceMappingURL=drawshape.js.map