(function ($) {
  'use strict';
  $.fn.stackedGantt = function (options) {
    var $this = $(this);

    var stackedGantt = new StackedGantt($this);
    $this.stackedGantt = stackedGantt;

    stackedGantt.clearOptions();
    stackedGantt.clearGraphicElements();

    stackedGantt.config(options);
    stackedGantt.build();

    $this.update = function () {
      stackedGantt.update();
    };
    $this.destroy = function () {
      stackedGantt.destroy();
    };
    $this.getData = function () {
      return stackedGantt.data;
    };

    return $this;
  };
})(jQuery);
class StackedGantt {
  constructor($this) {
    const defaults = {
      description_container_width: 150,
      date_width: 30,
      task: { color: '#7fad7f', height: 30 },
      row_height: '30px',
      months: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      no_data: 'No data!',
    };

    const countOccurrences = (arr, val) =>
      arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    const $container = $('<div>', { class: 'sg_container' });
    const $valuesContainer = $('<div>', { class: 'sg_val_container' });
    var $headerContainer;
    var $descriptionsContainer;
    const $monthHeaderContainer = $('<div>', {
      class: 'sg_month_header_container',
    });
    const $dateHeaderContainer = $('<div>', {
      class: 'sg_date_header_container',
    });

    var limits;
    var data;
    var descWidth;
    var dateWidth;
    var dates;
    var days;
    var style = [];
    var taskStyle;
    var monthHeaderFormat;
    var noDataText;
    var monthHeaders;
    var defaultBeginDate;
    var defaultEndDate;
    var beginDate;
    var endDate;
    var rowValueContainerWidth;

    //events
    var defaultOnActivityClick;

    this.update = function () {
      this.clearGraphicElements().build();
    };

    this.clearOptions = function () {
      limits = null;
      data = null;
      descWidth = null;
      dateWidth = null;
      dates = null;
      days = null;
      style = null;
      taskStyle = null;
      defaultOnActivityClick = null;
      monthHeaderFormat = null;
      monthHeaders = null;
      defaultBeginDate = null;
      defaultEndDate = null;
      beginDate = null;
      endDate = null;
      rowValueContainerWidth = null;
    };

    this.clearGraphicElements = function () {
      $this.empty();
    };

    this.config = function (options) {
      var events = options.events;
      data = sanitizeDataDates(options.data);
      style = options.style;

      monthHeaderFormat = style.monthHeaderFormat
        ? style.monthHeaderFormat
        : formatMonth;
      noDataText = style.noDataText ? style.noDataText : defaults.no_data;
      dateWidth = style.dateWidth ? style.dateWidth : defaults.date_width;
      taskStyle = style.taskStyle ? style.taskStyle : {};
      descWidth = style.descWidth
        ? style.descWidth
        : defaults.description_container_width;
      defaultBeginDate = style.defaultBeginDate
        ? style.defaultBeginDate
        : new Date(new Date().setDate(1));
      defaultEndDate = style.defaultEndDate
        ? style.defaultEndDate
        : new Date(new Date().setDate(31));
      beginDate = style.beginDate;
      endDate = style.endDate;
      if (style.formatDate) formatDate = style.formatDate;
      if (events) {
        defaultOnActivityClick = events.onActivityClick;
      }
    };

    this.destroy = function () {
      this.clearGraphicElements();
      delete $this.update;
      delete $this.destroy;
      delete $this.stackedGantt;
    };

    function sanitizeDataDates(data) {
      data.forEach((row) => {
        row.tasks.forEach((task) => {
          task.begin = sanitizeDate(task.begin);
          task.end = sanitizeDate(task.end);
        });
      });
      return data;
    }

    function sanitizeDate(date) {
      if (Object.prototype.toString.call(date) === '[object Date]') {
        return date;
      }

      if (!isNaN(date)) {
        return new Date(date);
      }

      throw new Error('Invalid Date: ' + date);
    }

    this.build = function () {
      if (!data || !data.length) {
        $this.append($('<div>', { class: 'sg_no_data', html: noDataText }));
      } else {
        createContainers();
        defineLimits();
        createHeader();
        createRows();
        listenToWindowResize();
      }
    };

    function createContainers() {
      let $wrapContainer = $('<div>', { class: 'sg_container_wrapper' });
      $wrapContainer.append($container);
      $this.append($wrapContainer);

      $headerContainer = $('<div>', {
        class: 'sg_header_container',
        css: { marginLeft: descWidth + 1 + 'px' },
      });

      $descriptionsContainer = _createColumn(1, "Nhân Viên");

      $container.append(
        $descriptionsContainer,
        $headerContainer,
        $valuesContainer
      );
      addHorizontalScroll($valuesContainer);
      addValuesContainerScrollWatch();
    }

    function _createColumn(id, name) {
      let $column = $('<div>', {
        id: 'sg_col-' + id,
        class: 'sg_desc_container',
        css: { width: descWidth + 'px' },
      });

      let $columnHeader = $('<div>', {
        class: 'sg_desc_container_header',
        css: {
          height: '60px',
          lineHeight: '60px',
          width: descWidth,
        },
        html: name,
      });
      $column.append($columnHeader);
      $column.scroll(function () {
        $valuesContainer.scrollTop($column.scrollTop());
      });
      return $column;
    }

    function addValuesContainerScrollWatch() {
      $valuesContainer.scroll(function () {
        $headerContainer.scrollLeft($valuesContainer.scrollLeft());
      });
    }

    function defineLimits() {
      var rowsLimits = data.map(function (row) {
        return {
          begin: getRowBegin(row),
          end: getRowEnd(row),
        };
      });

      var begin;
      var begins = rowsLimits
        .map(function (rowLimit) {
          return rowLimit.begin;
        })
        .filter(function (begin) {
          return begin;
        });

      if (beginDate) begins.push(beginDate);

      if (begins.length) {
        begin = new Date(
          begins.reduce(function (lowestBegin, currentBegin) {
            return currentBegin < lowestBegin ? currentBegin : lowestBegin;
          })
        );
      } else {
        begin = new Date(defaultBeginDate);
      }

      if (!beginDate) begin.setDate(begin.getDate() - 1);

      var end;
      var ends = rowsLimits
        .map(function (rowLimit) {
          return rowLimit.end;
        })
        .filter(function (end) {
          return end;
        });

      if (endDate) ends.push(endDate);

      if (ends.length) {
        end = new Date(
          ends.reduce(function (highestEnd, currentEnd) {
            return currentEnd > highestEnd ? currentEnd : highestEnd;
          })
        );
      } else {
        end = new Date(defaultEndDate);
      }

      if (!endDate) end.setDate(end.getDate());

      limits = {
        begin: begin,
        end: end,
      };
    }

    function getRowBegin(row) {
      var begins = [];

      if (row.tasks) {
        begins = begins.concat(
          row.tasks.map(function (task) {
            return task.begin;
          })
        );
      }

      if (!begins.length) return;

      var lowestBegin = begins.reduce(function (lowestBegin, currentBegin) {
        return currentBegin < lowestBegin ? currentBegin : lowestBegin;
      });

      return lowestBegin;
    }

    function getRowEnd(row) {
      var ends = [];

      if (row.tasks) {
        ends = ends.concat(
          row.tasks.map(function (task) {
            return task.end;
          })
        );
      }

      if (endDate) ends.push(endDate);

      if (!ends.length) return;

      var highestEnd = ends.reduce(function (highestEnd, currentEnd) {
        return currentEnd > highestEnd ? currentEnd : highestEnd;
      });

      return highestEnd;
    }

    function createHeader() {
      monthHeaders = [];
      $headerContainer.append($monthHeaderContainer, $dateHeaderContainer);
      days = getDateRange();
      dates = days.length;
      let months = getMonthRange();
      let monthOfDate = [];
      let daysInMonth = 1;

      days.forEach((date) => {
        createDateHeader(date);
        monthOfDate.push(date.getMonth());
      });
      months.forEach((month) => {
        daysInMonth = countOccurrences(monthOfDate, month.getMonth());
        monthHeaders.push(createMonthHeader(month, daysInMonth));
      });
    }

    function createMonthHeader(date, days, scrollLeft) {
      var width = days ? dateWidth * days : scrollLeft;
      var css = {
        width: width + 'px',
      };
      var $headerItem = $('<div>', { class: 'sg_month_header_item', css: css });
      $monthHeaderContainer.append($headerItem);
      $headerItem.html(monthHeaderFormat(date));
      return $headerItem;
    }

    function createDateHeader(date) {
      var $headerItem = $('<div>', {
        class: 'sg_date_header_item',
        css: { width: dateWidth + 'px' },
      });
      $dateHeaderContainer.append($headerItem);
      $headerItem.html(formatDate(date));
      $headerItem.attr('title', formatDate(date) + '/' + formatMonth(date));
    }

    function getDateRange() {
      let dates = [];

      for (
        var date = new Date(limits.begin);
        date <= limits.end;
        date.setDate(date.getDate() + 1)
      ) {
        dates.push(new Date(date));
      }
      return dates;
    }
    function getMonthRange() {
      let months = [];
      let month = new Date(limits.begin);
      let lastMonth = limits.end.getMonth();
      for (
        month;
        month.getMonth() <= lastMonth;
        month.setMonth(month.getMonth() + 1)
      ) {
        months.push(new Date(month));
      }
      return months;
    }

    function createRows() {
      rowValueContainerWidth = Math.max(dates * dateWidth);

      data.forEach((row, rowIndex) => {
        var even = rowIndex % 2 === 0;
        createRowDescription(row, even);
        createRowTimeline(row, even);
      });
    }

    function createRowDescription(row, even) {
      var height = getRowHeight();

      var css = {
        height: height,
        lineHeight: height,
      };

      var evenOdd = even ? 'even' : 'odd';

      var $rowDescriptionContainer = $('<div>', {
        class: 'sg_row_desc_container ' + evenOdd,
        css: css,
      });
      $rowDescriptionContainer.html(row.user);
      $descriptionsContainer.append($rowDescriptionContainer);
    }

    function createRowTimeline(row, even) {
      var height = getRowHeight();

      var css = {
        height: height,
        lineHeight: height,
        width: rowValueContainerWidth,
      };

      var evenOdd = even ? 'even' : 'odd';

      var $rowValueContainer = $('<div>', {
        class: 'sg_row_val_container ' + evenOdd,
        css: css,
      });
      $valuesContainer.append($rowValueContainer);

      row.tasks.forEach((task) => {
        createActivity(task, $rowValueContainer, row);
      });
    }

    function createActivity(task, $rowValueContainer, row) {
      let css = {
        width: calculateDatesDifferenceInPx(task.begin, task.end),
        left: calculateDatesDifferenceInPx(task.begin, limits.begin),
        backgroundColor: getTaskColor(task),
        height: getTaskHeight(task) + 'px',
      };

      var $task = $('<div>', { class: 'sg_activity', css: css });
      $rowValueContainer.append($task);

      if (getTaskClick(task)) {
        $task.click(function () {
          taskClick(task, row, data);
        });
        $task.css('cursor', 'pointer');
      }

      createActivityTooltip(task, $task, row);
    }

    function createActivityTooltip(task, $task, row) {
      let info = {
        color: getTaskColor(task),
        url: row.url
      };
      info.fontColor = defineFontColor(info.color);
      createTooltip(task, $task, info);
    }

    function calculateDatesDifferenceInPx(date1, date2) {
      var timezoneOffsetDiff =
        Math.abs(date1.getTimezoneOffset() - date2.getTimezoneOffset()) *
        60 *
        1000;
      var diff = (Math.abs(date1 - date2) - timezoneOffsetDiff) / 3600000;
      var width = (diff * dateWidth) / 24;
      return width + 'px';
    }

    function getRowHeight() {
      if (style && style.rowHeight) {
        return style.rowHeight;
      } else {
        return defaults.row_height;
      }
    }

    function getTaskColor(task) {
      if (task.color) return task.color;

      var style = taskStyle[task.code];

      if (style && style.color) {
        return style.color;
      }

      return defaults.task.color;
    }

    function getTaskHeight(task) {
      if (task.height) return task.height;

      var style = taskStyle[task.code];

      if (style && style.height) {
        return style.height;
      }

      return defaults.task.height;
    }

    function getTaskClick(task) {
      if (task.onClick !== undefined) return task.onClick;
      return defaultOnActivityClick;
    }

    function createTooltip(task, $task, info) {
      var handleMouseOver = ev => {
        $task.addClass('hover');

        var $tooltip = $('<div>', { class: 'sg_tooltip' });
        var css = getTooltipPosition(ev, $tooltip);
        css.position = 'absolute';
        css.borderColor = info.color;
        $tooltip.css(css);

        appendTooltipContent(task, $tooltip, info);

        $tooltip.mouseover(keepTooltip($tooltip));
        $tooltip.mouseout(initTooltipRemoval($task, $tooltip, handleMouseOver));

        $task.unbind('mouseover mouseout');
        $task.mouseover(keepTooltip($tooltip));
        $task.mouseout(initTooltipRemoval($task, $tooltip, handleMouseOver));

        getBody().append($tooltip);
      };

      $task.mouseover(handleMouseOver);
    }

    function getTooltipPosition(ev, $tooltip) {
      var $w = $(window);
      var left = ev.pageX + 5;
      var top = ev.pageY + 5;

      var tooltipRight = left + getDimensions($tooltip).width;
      var windowRightVisible = $w.scrollLeft() + $w.width();

      if (tooltipRight >= windowRightVisible - 50) {
        left -= tooltipRight - windowRightVisible + 50;
      }
      var tooltipBottom = top + getDimensions($tooltip).height;
      var windowBottomVisible = $w.scrollTop() + $w.height();

      if (tooltipBottom >= windowBottomVisible - 75) {
        top -= tooltipBottom - windowBottomVisible + 75;
      }

      return {
        left: left,
        top: top,
      };
    }

    function appendTooltipContent(task, $tooltip, info) {
      console.log(task, info);

      $tooltip.append($('<span>', { class: 'sg_tooltip_title', html: 'Hiệu suất:' }));
      $tooltip.append($('<span>', { class: 'sg_tooltip_value', html: task.progress }));
      $tooltip.append($('<span>', { class: 'sg_tooltip_title', html: 'Đánh giá:' }));
      $tooltip.append($('<span>', { class: 'sg_tooltip_value', html: task.rating }));
      $tooltip.append($('<span>', { class: 'sg_tooltip_title', html: 'Công việc:' }));
      $tooltip.append($('<span>', { class: 'sg_tooltip_value', html: task.status }));

      if (task.url) {
        $tooltip.append($('<a>', {
          href: task.url,
          class: 'sg_tooltip_subtitle',
          html: 'Xem chi tiết'
        }));
      }

    }

    function initTooltipRemoval($element, $tooltip, handleMouseOver) {
      return function () {
        $tooltip.shallRemove = true;
        setTimeout(function () {
          if ($tooltip.shallRemove) {
            $tooltip.remove();
            $element
              .unbind('mouseover mouseout')
              .removeClass('hover')
              .mouseover(handleMouseOver);
          }
        }, 50);
      };
    }
    function keepTooltip($tooltip) {
      return function () {
        $tooltip.shallRemove = false;
      };
    }
    function listenToWindowResize() {
      defineContainerDisplayType();
      $(window).on('resize', defineContainerDisplayType);
    }
    function defineContainerDisplayType() {
      setContainersDisplay('inline-block', 'inline-block');

      if ($container.outerWidth() >= $this.width()) {
        setContainersDisplay('block', 'grid');
      }
    }
    function setContainersDisplay(container, valuesContainer) {
      $container.css('display', '');
      $valuesContainer.css('display', '');
      $container.css('display', container);
      $valuesContainer.css('display', valuesContainer);
    }
    var formatDate = function (date) {
      return ('0' + date.getDate()).slice(-2);
    };
    var formatMonth = function (date) {
      return defaults.months[date.getMonth()] + '/' + date.getFullYear();
    };
    function getDimensions($element) {
      var $clone = $element.clone().show().css('visibility', 'hidden');
      getBody().append($clone);
      var result = {
        width: $clone.width(),
        height: $clone.height(),
      };

      $clone.remove();
      return result;
    }
    function getBody() {
      var body = $container.parentsUntil('body').last().parent();
      return $(body);
    }
    function defineFontColor(backgroundColor) {
      if (backgroundColor[0] === '#')
        backgroundColor = hexToRgb(backgroundColor);
      var luma =
        0.2126 * backgroundColor.r +
        0.7152 * backgroundColor.g +
        0.0722 * backgroundColor.b;
      return luma < 170 ? '#fff' : '#585050';
    }
    function hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
        : null;
    }
    function getCssRgb(rgb, alpha) {
      return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
    }
    function addHorizontalScroll($element) {
      var scrollHorizontally = function (e) {
        e = window.event || e;
        if (!e.wheelDelta && !e.detail) e = e.originalEvent;
        var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
        $element.scrollLeft($element.scrollLeft() - delta * 40);
        e.preventDefault();
      };
      $element.bind('mousewheel DOMMouseScroll', scrollHorizontally);
    }
  }
}
