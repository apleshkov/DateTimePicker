(function () {

    var F = Ext.ux.form;

    var STRICT = Ext.isIE7 && Ext.isStrict;

    var Menu = Ext.extend(Ext.menu.Menu, {

        enableScrolling : false,

        plain: true,

        showSeparator: false,

        hideOnClick : true,

        pickerId : null,

        cls : 'x-date-menu x-date-time-menu',

        constructor: function (picker, config) {
            Menu.superclass.constructor.call(this, Ext.applyIf({
                items: picker
            }, config || {}));

            this.primaryPicker = picker;

            picker.parentMenu = this;

            this.on('beforeshow', this.onBeforeShow, this);

            this.strict = STRICT;

            if (this.strict) {
                this.on('show', this.onShow, this, { single: true, delay: 20 });
            }

            // black magic
            this.picker = picker.datePicker;

            this.relayEvents(picker, ['select']);
            this.on('show', picker.focus, picker);
            this.on('select', this.menuHide, this);

            if (this.handler) {
                this.on('select', this.handler, this.scope || this);
            }
        },

        menuHide : function () {
            if (this.hideOnClick) {
                this.hide(true);
            }
        },

        onBeforeShow : function () {
            if (this.picker) {
                this.picker.hideMonthPicker(true);
            }
        },

        onShow : function () {
            var el = this.picker.getEl();
            el.setWidth(el.getWidth()); // nasty hack for IE7 strict mode
        },

        destroy: function () {
            this.primaryPicker = null;
            this.picker = null;

            Menu.superclass.destroy.call(this);
        }

    });

    //

    F.DateTimeField = Ext.extend(Ext.form.DateField, {

        timeFormat: 'g:i A',

        defaultAutoCreate : {
            tag: 'input',
            type: 'text',
            size: '22',
            autocomplete: 'off'
        },

        initComponent: function () {
            F.DateTimeField.superclass.initComponent.call(this);

            this.dateFormat = this.dateFormat || this.format;

            var picker = this._createPicker();

            this.format = this.dateFormat + ' ' + this.timeFormat;

            this.menu = new Menu(picker, {
                hideOnClick: false
            });
        },

        _createPicker: function () {
            var config = this.initialConfig.picker || {};

            Ext.apply(config, {
                ctCls: 'x-menu-date-item',
                internalRender: STRICT || !Ext.isIE
            });

            Ext.applyIf(config, {
                dateFormat: this.dateFormat,
                timeFormat: this.timeFormat
            });

            return Ext.create(config, 'datetimepicker');
        },

        onTriggerClick: function () {
            F.DateTimeField.superclass.onTriggerClick.apply(this, arguments);

            this.menu.primaryPicker.setValue(this.getValue() || new Date());
        }

    });

    Ext.reg('datetimefield', F.DateTimeField);

})();