(function ($) {
    $.fn.simpleMoneyFormat = function () {
        this.each(function (index, el) {
            var elType = null; // input or other
            var value = null;
            // get value
            if ($(el).is('input') || $(el).is('textarea')) {
                value = $(el).val().replace(/,/g, '');
                elType = 'input';
            } else {
                value = $(el).text().replace(/,/g, '');
                elType = 'other';
            }
            // if value changes
            $(el).on('paste keyup', function () {
                value = $(el).val().replace(/,/g, '');
                formatElement(el, elType, value); // format element
            });
            formatElement(el, elType, value); // format element
        });

        function formatElement(el, elType, value) {
            try {
                //Get current cursor position
                var start = el.selectionStart;
                var end = el.selectionEnd;

                var dotIndex = value.indexOf('.');
                var isNegative = value.indexOf('-') == 0;
                if (isNegative)
                    value = value.replace('-', '');
                var dotSplitArray = value.split('.');
                var result = '';
                //for (var k = 0; k < dotSplitArray.length; k++) {
                var valueArray = dotSplitArray[0].split('');
                var resultArray = [];
                var counter = 0;
                var temp = '';
                for (var i = valueArray.length - 1; i >= 0; i--) {
                    temp += valueArray[i];
                    //if (isInteger(valueArray[i]))
                    counter++
                    if (counter == 3) {
                        resultArray.push(temp);
                        counter = 0;
                        temp = '';
                    }
                };
                if (counter > 0) {
                    resultArray.push(temp);
                }
                for (var i = resultArray.length - 1; i >= 0; i--) {
                    var resTemp = resultArray[i].split('');
                    for (var j = resTemp.length - 1; j >= 0; j--) {
                        result += resTemp[j];
                    };
                    if (i > 0) {
                        result += ','
                    }
                };
                //}

                if (isNegative) {
                    result = '-' + result;
                }
                if (dotIndex > 0) {
                    result += '.' + dotSplitArray[1];
                }
                if (elType == 'input') {
                    $(el).val(result);
                } else {
                    $(el).empty().text(result);
                }

                if (dotSplitArray[0].length > 3 && (dotSplitArray[0].length - 1) % 3 == 0) {
                    start += 1;
                    end += 1;
                }
                //Set to previous cursor
                el.setSelectionRange(start, end);
            } catch (e) {
                console.log(e);
            }
        };
    };
}(jQuery));