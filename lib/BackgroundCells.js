'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _dates = require('./utils/dates');

var _dates2 = _interopRequireDefault(_dates);

var _eventLevels = require('./utils/eventLevels');

var _helpers = require('./utils/helpers');

var _propTypes = require('./utils/propTypes');

var _selection = require('./utils/selection');

var _Selection = require('./Selection');

var _Selection2 = _interopRequireDefault(_Selection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BackgroundCells = function (_React$Component) {
  _inherits(BackgroundCells, _React$Component);

  function BackgroundCells(props, context) {
    _classCallCheck(this, BackgroundCells);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.state = {
      selecting: false
    };
    return _this;
  }

  BackgroundCells.prototype.componentDidMount = function componentDidMount() {
    this.props.selectable && this._selectable();
  };

  BackgroundCells.prototype.componentWillUnmount = function componentWillUnmount() {
    this._teardownSelectable();
  };

  BackgroundCells.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.selectable && !this.props.selectable) this._selectable();

    if (!nextProps.selectable && this.props.selectable) this._teardownSelectable();
  };

  BackgroundCells.prototype.render = function render() {
    var _props = this.props,
        range = _props.range,
        Wrapper = _props.cellWrapperComponent;
    var _state = this.state,
        selecting = _state.selecting,
        startIdx = _state.startIdx,
        endIdx = _state.endIdx;



    return _react2.default.createElement(
      'div',
      { className: 'rbc-row-bg' },
      range.map(function (date, index) {
        var selected = _state.selected && index == _state.selectedIndex;
        if (_state.selectedIndex >= 0 && _props.selectedDate && range.slice(_state.selectedIndex, _state.selectedIndex + 1)) {
          selected = selected && (_props.selectedDate.toString() == range.slice(_state.selectedIndex, _state.selectedIndex + 1));
        }
        return _react2.default.createElement(
          Wrapper,
          { key: index, value: date },
          _react2.default.createElement('div', {
            style: (0, _eventLevels.segStyle)(1, range.length),
            className: (0, _classnames2.default)('rbc-day-bg', selected && 'rbc-selected-cell', _dates2.default.isToday(date) && 'rbc-today')
          })
        );
      })
    );
  };

  BackgroundCells.prototype.resetSelection = function resetSelection() {
    this.setState({
      selected: false,
      selectedIndex: -1
    });
  }

  BackgroundCells.prototype._selectable = function _selectable() {
    var _this2 = this;

    var node = (0, _reactDom.findDOMNode)(this);
    var selector = this._selector = new _Selection2.default(this.props.container);

    selector.on('selecting', function (box) {
      // var _props2 = _this2.props,
      //     range = _props2.range,
      //     rtl = _props2.rtl;
      //
      //
      // var startIdx = -1;
      // var endIdx = -1;
      //
      // if (!_this2.state.selecting) {
      //   (0, _helpers.notify)(_this2.props.onSelectStart, [box]);
      //   _this2._initial = { x: box.x, y: box.y };
      // }
      // if (selector.isSelected(node)) {
      //   var nodeBox = (0, _Selection.getBoundsForNode)(node);
      //
      //   var _dateCellSelection = (0, _selection.dateCellSelection)(_this2._initial, nodeBox, box, range.length, rtl);
      //
      //   startIdx = _dateCellSelection.startIdx;
      //   endIdx = _dateCellSelection.endIdx;
      // }
      //
      // _this2.setState({
      //   selecting: true,
      //   startIdx: startIdx, endIdx: endIdx
      // });
    });

    selector.on('mousedown', function (box) {
      if (_this2.props.selectable !== 'ignoreEvents') return;

      return !(0, _Selection.isEvent)((0, _reactDom.findDOMNode)(_this2), box);
    });

    selector.on('click', function (point) {

      if (!(0, _Selection.isEvent)((0, _reactDom.findDOMNode)(_this2), point)) {
        var rowBox = (0, _Selection.getBoundsForNode)(node);
        var _props3 = _this2.props,
            range = _props3.range,
            rtl = _props3.rtl;


        if ((0, _selection.pointInBox)(rowBox, point)) {
          var width = (0, _selection.slotWidth)((0, _Selection.getBoundsForNode)(node), range.length);
          var currentCell = (0, _selection.getCellAtX)(rowBox, point.x, width, rtl, range.length);
          console.log('click ' + currentCell);
          _this2._selectSlot({
            startIdx: currentCell,
            endIdx: currentCell
          });
        }
      }

      _this2._initial = {};
      _this2.setState({ selecting: false });
    });

    selector.on('select', function () {
      // _this2._selectSlot(_this2.state);
      // _this2._initial = {};
      // _this2.setState({ selecting: false });
      // (0, _helpers.notify)(_this2.props.onSelectEnd, [_this2.state]);
    });
  };

  BackgroundCells.prototype._teardownSelectable = function _teardownSelectable() {
    if (!this._selector) return;
    this._selector.teardown();
    this._selector = null;
  };

  BackgroundCells.prototype._selectSlot = function _selectSlot(_ref) {
    var endIdx = _ref.endIdx,
        startIdx = _ref.startIdx;
    var selectedDate = this.props.range.slice(startIdx, startIdx + 1);

    this.setState({
      selected: (!this.state.selected || this.state.selectedIndex != startIdx),
      selectedIndex: startIdx
    });

    if (this.state.selected && endIdx !== -1 && startIdx !== -1) this.props.onSelectSlot && this.props.onSelectSlot({
      start: startIdx, end: endIdx
    });
  };

  return BackgroundCells;
}(_react2.default.Component);

BackgroundCells.propTypes = {
  cellWrapperComponent: _propTypes.elementType,
  container: _react2.default.PropTypes.func,
  selectable: _react2.default.PropTypes.oneOf([true, false, 'ignoreEvents']),

  onSelectSlot: _react2.default.PropTypes.func.isRequired,
  onSelectEnd: _react2.default.PropTypes.func,
  onSelectStart: _react2.default.PropTypes.func,

  range: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.instanceOf(Date)),
  rtl: _react2.default.PropTypes.bool,
  type: _react2.default.PropTypes.string
};
exports.default = BackgroundCells;
module.exports = exports['default'];
