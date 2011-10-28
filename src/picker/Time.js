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

});