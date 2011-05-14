User extensions for date & time picking
=======================================

Supported ExtJS versions: 3.3.1

Supported browsers: Firefox 3.6, Chrome 8, Opera 11, IE 7, IE 8

INSTALLATION
------------

1. Open the [`build`](https://github.com/apleshkov/DateTimePicker/tree/master/build) directory
2. Download files from that directory
3. Include `date-time-ux.js` and `date-time-ux.css` in your project

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

**How to use my own time picker?**

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