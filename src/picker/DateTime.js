(function () {

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


})();