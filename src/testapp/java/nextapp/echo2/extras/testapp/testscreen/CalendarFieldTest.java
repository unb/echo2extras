/* 
 * This file is part of the Echo Web Application Framework (hereinafter "Echo").
 * Copyright (C) 2002-2005 NextApp, Inc.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 */

package nextapp.echo2.extras.testapp.testscreen;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Color;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.SplitPane;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.extras.app.CalendarField;
import nextapp.echo2.extras.testapp.ButtonColumn;
import nextapp.echo2.extras.testapp.InteractiveApp;
import nextapp.echo2.extras.testapp.StyleUtil;

/**
 * Interactive test module for <code>CalendarField</code>s.
 */
public class CalendarFieldTest extends SplitPane {

    public CalendarFieldTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");
        
        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);
        
        final CalendarField calendarField = new CalendarField();
        add(calendarField);
        
        controlsColumn.addButton("Set Foreground", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Color color = StyleUtil.randomColor();
                calendarField.setForeground(color);
            }
        });
        
        controlsColumn.addButton("Set Background", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Color color = StyleUtil.randomColor();
                calendarField.setBackground(color);
            }
        });

        controlsColumn.addButton("Remove Calendar", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                remove(calendarField);
            }
        });

        controlsColumn.addButton("Set Border (All Attributes)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                calendarField.setBorder(StyleUtil.randomBorder());
            }
        });
        controlsColumn.addButton("Set Border Color", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Border border = calendarField.getBorder();
                if (border == null) {
                    border = new Border(new Extent(1), Color.BLUE, Border.STYLE_SOLID);
                }
                calendarField.setBorder(new Border(border.getSize(), StyleUtil.randomColor(), border.getStyle()));
            }
        });
        controlsColumn.addButton("Set Border Size", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                calendarField.setBorder(StyleUtil.nextBorderSize(calendarField.getBorder()));
            }
        });
        controlsColumn.addButton("Set Border Style", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                calendarField.setBorder(StyleUtil.nextBorderStyle(calendarField.getBorder()));
            }
        });
        controlsColumn.addButton("Remove Border", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                calendarField.setBorder(null);
            }
        });
        controlsColumn.addButton("Query Date", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Date date = calendarField.getDate();
                InteractiveApp.getApp().consoleWrite(date == null ? "No Date" : date.toString());
            }
        });
        controlsColumn.addButton("Set Date", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Calendar calendar = new GregorianCalendar();
                calendar.add(Calendar.DAY_OF_MONTH, ((int) (Math.random() * 10000)) - 5000);
                calendarField.setDate(calendar.getTime());
            }
        });
    }
}
