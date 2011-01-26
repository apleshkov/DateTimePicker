Ext.ux.DateTimePicker & Ext.ux.form.DateTimeField
=================================================

**Ext.ux.DateTimePicker**

This component is like `Ext.DatePicker`, but gives you an ability to set date & time values.
It can be used as an item of any `Ext.Container` (e.g. `Ext.Panel`).

**Ext.ux.form.DateTimeField**

This component is like `Ext.DateField`, but uses `Ext.ux.DateTimePicker`.

Supported ExtJS versions: 3.3.1

Supported browsers: Firefox 3.6, Chrome 8, Opera 11, IE 7, IE 8

INSTALLATION
------------

1. Install git
2. Clone this repository into a new directory
3. Include `date-time-field.js` and `ux-date-time-field.css` in your project

USAGE
-----

**Picker**

xtype: `datetimepicker`

    var picker = new Ext.ux.DateTimePicker({
        // timeFormat: ...
        // timeLabel: ...
        // changeTimeText: ...
        // doneText: ...
        timeMenu: { // optional; xtype is supported
            // time menu conf
        },
        timePicker: { // optional; xtype is supported
            // time picker conf
        }
    });

**How to use my own picker?**

    var myPicker = Ext.extend(..., {

        // my code

    });

    var picker = new Ext.ux.DateTimePicker({
        // ...
        timePicker: new myPicker(...)
    });

    // using xtype

    Ext.reg('mytimepicker', myPicker);

    var picker = new Ext.ux.DateTimePicker({
        // ...
        timePicker: {
            xtype: 'mytimepicker'
            // ...
        }
    });

You can use the same technique for `timeMenu` too.

**Field**

xtype: `datetimefield`

    var field = new Ext.ux.form.DateTimeField({
        // timeFormat: ...
        // dateFormat: ...
        picker: { // optional; xtype is supported
            // picker conf (see above example)
        }
    });

LICENSE
-------

This project is distributed under the MIT license. Please keep the exisisting headers.