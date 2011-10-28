(function () {

    var xtype = 'datetimepicker';

    Ext.define('Ext.ux.menu.DateTimePicker', {

        extend: 'Ext.menu.DatePicker',

        alias: 'widget.datetimemenu',

        requires: [
            'Ext.ux.picker.DateTime'
        ],

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
        }

    });

})();