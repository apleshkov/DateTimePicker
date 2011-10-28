/*!
 * Copyright (c) 2011 Andrew Pleshkov andrew.pleshkov@gmail.com
 * 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
Ext.define('Ext.ux.picker.Time', {

    extend: 'Ext.form.Panel',

    alias: 'widget.uxtimepicker',

    format: Ext.picker.Time.prototype.format,

    nowText: 'Now',

    doneText: 'Done',

    hoursLabel: 'Hours',

    hoursIncrement: 1,

    minsLabel: 'Minutes',

    minsIncrement: 1,

    showSeconds: false,

    secsLabel: 'Seconds',

    secsIncrement: 1,

    width: 210,

    bodyPadding: 10,

    layout: 'anchor',

    defaults: {
        anchor: '100%'
    },

    initComponent: function () {
        this.bbar = [
            {
                text: this.nowText,
                handler: function () {
                    this.setCurrentTime(true);
                },
                scope: this
            },
            '->',
            {
                text: this.doneText,
                handler: this.onDone,
                scope: this
            }
        ];

        this.callParent();

        this._initSliders(this);

        this.addEvents('select');

        if (this.value) {
            this.setValue(this.value, false);
        } else {
            this.setCurrentTime(false);
        }
    },

    _initSliders: function (items) {
        this._createSlider('hours', {
            minValue: 0,
            maxValue: 23
        }, items);

        this._createSlider('mins', {
            minValue: 0,
            maxValue: 59
        }, items);

        if (this.showSeconds) {
            this._createSlider('secs', {
                minValue: 0,
                maxValue: 59
            }, items);
        }

        return items;
    },

    _createSlider: function (name, defaults, items) {
        var sliderField = name + 'Slider';
        var config = this[sliderField] || {};
        delete this[sliderField];
        delete this.initialConfig[sliderField];

        var c = Ext.apply({
            increment: this[name + 'Increment'],
            fieldLabel: this[name + 'Label'],
            labelAlign: 'top',
            clickToChange: false
        }, config, defaults);

        var slider = this[sliderField] = Ext.ComponentManager.create(c, 'slider');
        slider.on('change', this._updateTimeValue, this);

        if (Ext.isArray(items)) {
            items.push(slider);
        } else if (items instanceof Ext.util.MixedCollection) {
            items.add(slider);
        } else if (items.isContainer) {
            items.add(slider);
        }

        return slider;
    },

    setCurrentTime: function (animate) {
        this.setValue(new Date(), !!animate);
    },

    onDone: function () {
        this.fireEvent('select', this, this.getValue());
        this.hide();
    },

    setValue: function (value, animate) {
        this.hoursSlider.setValue(value.getHours(), animate);
        this.minsSlider.setValue(value.getMinutes(), animate);
        if (this.showSeconds) {
            this.secsSlider.setValue(value.getSeconds(), animate);
        }
        this._updateTimeValue();
    },

    getValue: function () {
        var v = new Date();
        v.setHours(this.hoursSlider.getValue());
        v.setMinutes(this.minsSlider.getValue());
        if (this.showSeconds) {
            v.setSeconds(this.secsSlider.getValue());
        }
        return v;
    },

    _updateTimeValue: function () {
        var v = Ext.Date.format(this.getValue(), this.format);
        if (this.rendered) {
            this.setTitle(v);
        }
    },

    afterRender: function () {
        this.callParent();
        this._updateTimeValue();
    },

    afterShow: function () {
        this.callParent(arguments);

        // If slider's hidden it doesn't move its thumb correctly
        // on Slider.setValue(), so let's hack:
        var currentValue = this.getValue();
        var canHack = false;
        this.items.each(function (item) {
            if (item.isXType('slider')) {
                var thumb = item.thumbs[0];
                if (!canHack) {
                    canHack = thumb.el.getLeft(true) < 0;
                }
                if (canHack) {
                    thumb.value = -1;
                }
            }
        });
        if (canHack) {
            this.setValue(currentValue, false);
        }
    },

    beforeDestroy: function () {
        this.hoursSlider = null;
        this.minsSlider = null;
        this.secsSlider = null;

        this.callParent();
    }

});(function () {

    var BASE_CLS = 'ux-datetimepicker';

    // ----------------------------------------------------------------------------------------------------------------

    var MyDatePicker = new Ext.Class({

        extend: 'Ext.picker.Date',

        _renderBottomButtons: function (showToday) {
            this.doneBtn = Ext.widget('button', {
                renderTo: this.footerEl.createChild({ cls: BASE_CLS + '-donebtn-wrap' }),
                text: this.doneText,
                handler: this.onDone
            });

            if (!showToday) {
                this.todayBtn.hide();
            } else {
                this.todayBtn.getEl().wrap({ cls: BASE_CLS + '-todaybtn-wrap' });
            }

            this.footerEl.createChild({ cls: 'x-clear' });
        },

        onRender: function (container, position) {
            var showToday = this.showToday;
            this.showToday = true; // or we'll miss the footer at all

            this.callParent([container, position]);

            this._renderBottomButtons(showToday);

            this.showToday = showToday;
        },

        beforeDestroy: function () {
            Ext.destroy(this.doneBtn);
            this.doneBtn = null;

            this.onDone = this.initialConfig.onDone = null;

            this.callParent();
        }

    });

    // ----------------------------------------------------------------------------------------------------------------

    Ext.define('Ext.ux.picker.DateTime', {

        extend: 'Ext.Component',

        alias: 'widget.datetimepicker',

        baseCls: BASE_CLS,

        timeLabel: 'Time',

        doneText: 'Done',

        setTimeText: 'Change...',

        dateFormat: MyDatePicker.prototype.format,

        timeFormat: Ext.picker.Time.prototype.format,

        width: MyDatePicker.prototype.width,

        initComponent: function () {
            this.callParent();

            this.addEvents('select');

            this._initDatePicker(this.datePicker);
            this._initTimePicker(this.timePicker);

            if (this.value) {
                this.setValue(this.value);
                delete this.value;
            }
        },

        _initDatePicker: function (datePicker) {
            var dp = datePicker || {};
            var initial = dp.isComponent ? dp.initialConfig : dp;

            var onDone = function () {
                this.fireEvent('select', this, this.getValue());
            };

            var config = Ext.applyIf({
                format: this.dateFormat,
                doneText: this.doneText,
                onDone: Ext.Function.bind(onDone, this)
            }, initial || {});

            this.datePicker = new MyDatePicker(config);
        },

        _initTimePicker: function (timePicker) {
            if (timePicker && timePicker.isComponent) {
                this.timePicker = timePicker;
            } else {
                var config = Ext.apply({
                    floating: true,
                    format: this.timeFormat
                }, timePicker);
                this.timePicker = Ext.ComponentManager.create(config, 'uxtimepicker');
            }
            this._assertTimePicker(this.timePicker);
            this.timePicker.on('select', this.onTimeSelect, this);
        },

        _assertTimePicker: function (picker) {
            var ok = picker.isComponent && picker.isFloating() && picker.events.select;
            if (!ok) {
                Ext.Error.raise('Invalid time picker');
            }
        },

        _renderTimeEl: function (container, baseCls) {
            var timeTpl = new Ext.XTemplate(
                    '<tpl if="label">',
                    '<span class="{baseCls}-timelabel">{label}:</span>&nbsp;',
                    '</tpl>',
                    '<span id="{id}-timevalue" class="{baseCls}-timevalue">{value}</span>'
            );

            var btnCellId = this.getId() + '-timebtn-cell';

            var el = container.insertFirst({
                cls: [baseCls + '-timecontainer', Ext.picker.Date.prototype.baseCls + '-footer'].join(' '),
                children: [
                    {
                        tag: 'table',
                        cls: baseCls + '-timecontainer-inner',
                        children: [
                            {
                                tag: 'tr',
                                children: [
                                    {
                                        tag: 'td',
                                        cls: baseCls + '-time',
                                        html: timeTpl.apply({
                                            id: this.getId(),
                                            baseCls: baseCls,
                                            label: this.timeLabel,
                                            value: this._getFormattedTimeValue(this.timePicker.getValue())
                                        })
                                    },
                                    {
                                        tag: 'td',
                                        id: btnCellId
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            this.timePickerButton = Ext.widget('button', {
                renderTo: el.down('#' + btnCellId),
                text: this.setTimeText,
                handler: this._toggleTimePicker,
                scope: this
            });

            this.timeValueEl = el.down('#' + this.getId() + '-timevalue');
        },

        onRender: function (container, position) {
            this.el = container.createChild({
                tag: 'div',
                role: 'presentation'
            }, this.getInsertPosition(position));

            this.callParent([container, position]);

            this.datePicker.render(this.el);

            this._renderTimeEl(this.datePicker.getEl(), this.baseCls);

            this.el.on('click', this._collapseTimePickerIf, this);
        },

        _collapseTimePickerIf: function (e) {
            var picker = this.timePicker;
            if (picker.rendered && picker.isVisible()
                    && !e.within(this.timePickerButton.getEl())) {
                picker.hide();
            }
        },

        _toggleTimePicker: function (btn) {
            var picker = this.timePicker;
            if (!picker.isVisible() || !picker.rendered) {
                picker.show();
                picker.alignTo(btn);
            } else {
                picker.hide();
            }
        },

        _getFormattedTimeValue: function (date) {
            return Ext.Date.format(date, this.timePicker.format);
        },

        _updateTimeValue: function (date) {
            if (this.timeValueEl != null) {
                this.timeValueEl.update(this._getFormattedTimeValue(date));
            }
        },

        setValue: function (value) {
            this._updateTimeValue(value);
            this.timePicker.setValue(value);
            this.datePicker.setValue(value);
        },

        getValue: function () {
            var date = this.datePicker.getValue();
            var time = this.timePicker.getValue();
            var cleared = Ext.Date.clearTime(time, true);
            time = Ext.Date.getElapsed(time, cleared);
            return new Date(date.getTime() + time);
        },

        onTimeSelect: function (picker, value) {
            this._updateTimeValue(value);
        },

        onDateSelect: function (ignored, date) {
            this.fireEvent('select', this, date);
        },

        afterHide: function (cb, scope) {
            this.timePicker.hide();
            this.callParent([cb, scope]);
        },

        beforeDestroy: function () {
            Ext.destroy(this.datePicker);
            this.datePicker = null;

            Ext.destroy(this.timePicker);
            this.timePicker = null;

            Ext.destroy(this.timePickerButton);
            this.timePickerButton = null;

            if (this.timeValueEl) {
                this.timeValueEl.remove();
                this.timeValueEl = null;
            }

            this.callParent();
        }

    });


})();(function () {

    var xtype = 'datetimepicker';

    Ext.define('Ext.ux.menu.DateTimePicker', {

        extend: 'Ext.menu.DatePicker',

        alias: 'widget.datetimemenu',

        requires: [
            'Ext.ux.picker.DateTime'
        ],

        initComponent: function () {
            this.callParent();

            this.on('beforehide', function () {
                var timePicker = this.picker.timePicker;
                if (!this.__byManager) {
                    return !(timePicker.rendered && timePicker.isVisible());
                } else {
                    timePicker.hide();
                }
            }, this);
        },

        initItems: function () {
            this.items.xtype = xtype;

            this.callParent();
        },

        down: function (selector) {
            if ('datepicker' === selector) {
                return this.callParent([xtype]);
            } else {
                return this.callParent([selector]);
            }
        },

        hide: function () {
            this.__byManager = true;
            this.callParent(arguments);
            this.__byManager = false;
            return this;
        }

    });

})();(function () {

    var dtpProto = Ext.ux.picker.DateTime.prototype;

    Ext.define('Ext.ux.form.field.DateTime', {

        extend: 'Ext.form.field.Date',

        alias: 'widget.datetimefield',

        timeLabel: dtpProto.timeLabel,

        doneText: dtpProto.doneText,

        setTimeText: dtpProto.setTimeText,

        dateFormat: dtpProto.dateFormat,

        datePicker: null,

        timePicker: null,

        timeFormat: dtpProto.timeFormat,

        pickerConfig: null,

        initComponent: function () {
            this.callParent();
            this.format = this.dateFormat + ' ' + this.timeFormat;
        },

        createPicker: function() {
            var me = this;
            var format = Ext.String.format;

            var config = Ext.apply(this.pickerConfig || {}, {
                // default settings from Date.js
                ownerCt: this.ownerCt,
                renderTo: document.body,
                floating: true,
                hidden: true,
                focusOnShow: true,
                minDate: me.minValue,
                maxDate: me.maxValue,
                disabledDatesRE: me.disabledDatesRE,
                disabledDatesText: me.disabledDatesText,
                disabledDays: me.disabledDays,
                disabledDaysText: me.disabledDaysText,
                //format: me.format,
                showToday: me.showToday,
                startDay: me.startDay,
                minText: format(me.minText, me.formatDate(me.minValue)),
                maxText: format(me.maxText, me.formatDate(me.maxValue)),
                listeners: {
                    scope: me,
                    select: me.onSelect
                },
                keyNavConfig: {
                    esc: function() {
                        me.collapse();
                    }
                },
                // new settings
                timeLabel: me.timeLabel,
                doneText: me.doneText,
                setTimeText: me.setTimeText,
                dateFormat: me.dateFormat,
                datePicker: me.datePicker,
                timeFormat: me.timeFormat,
                timePicker: me.timePicker
            });

            return Ext.ComponentManager.create(config, 'datetimepicker');
        },

        collapseIf: function (e) {
            if (!this.isDestroyed && !e.within(this.picker.timePicker.getEl())) {
                this.callParent([e]);
            }
        }

    });

})();