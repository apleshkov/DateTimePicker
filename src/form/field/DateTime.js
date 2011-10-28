(function () {

    var dtpProto = Ext.ux.picker.DateTime.prototype;

    Ext.define('Ext.ux.form.field.DateTime', {

        extend: 'Ext.form.field.Date',

        alias: 'widget.datetimefield',

        requires: [
            'Ext.ux.picker.DateTime'
        ],

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