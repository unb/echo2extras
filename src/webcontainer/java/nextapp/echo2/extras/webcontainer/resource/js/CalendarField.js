ExtrasCalendarField = function(elementId, containerElementId, year, month, selectedDay) {
    this.elementId = elementId;
    this.containerElementId = containerElementId;

    this.firstDayOfMonth = 4;
    this.daysInPreviousMonth = 29;
    this.daysInMonth = 31;
    this.month = month;
    this.selectedDay = selectedDay;
    this.year = year;
    
    this.foreground = ExtrasCalendarField.DEFAULT_FOREGROUND;
    this.background = ExtrasCalendarField.DEFAULT_BACKGROUND;
    this.border = ExtrasCalendarField.DEFAULT_BORDER;
    
    this.dayOfWeekNameAbbreviationLength = 1;
    this.dayOfWeekNames = ExtrasCalendarField.DEFAULT_DAY_OF_WEEK_NAMES;
    this.monthNames = ExtrasCalendarField.DEFAULT_MONTH_NAMES;
    this.firstDayOfWeek = ExtrasCalendarField.DEFAULT_FIRST_DAY_OF_WEEK;
    this.previousMonthDayStyle = ExtrasCalendarField.DEFAULT_PREVIOUS_MONTH_DAY_STYLE;
    this.nextMonthDayStyle = ExtrasCalendarField.DEFAULT_NEXT_MONTH_DAY_STYLE;
    this.currentMonthDayStyle = ExtrasCalendarField.DEFAULT_CURRENT_MONTH_DAY_STYLE;
    this.baseDayStyle = ExtrasCalendarField.DEFAULT_BASE_DAY_STYLE;
    this.selectedDayStyle = ExtrasCalendarField.DEFAULT_SELECTED_DAY_STYLE;
    this.yearFieldStyle = ExtrasCalendarField.DEFAULT_YEAR_FIELD_STYLE;
    this.monthSelectStyle = ExtrasCalendarField.DEFAULT_MONTH_SELECT_STYLE;
    this.dayTableStyle = ExtrasCalendarField.DEFAULT_DAY_TABLE_STYLE;
    
    this.yearIncrementImageSrc = null;
    this.yearDecrementImageSrc = null;
};

ExtrasCalendarField.DEFAULT_FOREGROUND = "#000000";
ExtrasCalendarField.DEFAULT_BACKGROUND = "#ffffff";
ExtrasCalendarField.DEFAULT_BORDER = "#5f5faf 2px groove";

ExtrasCalendarField.DEFAULT_DAY_OF_WEEK_NAMES = 
        new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
ExtrasCalendarField.DEFAULT_MONTH_NAMES = new Array(
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December");
ExtrasCalendarField.DEFAULT_FIRST_DAY_OF_WEEK = 0;

ExtrasCalendarField.MINIMUM_YEAR = 1582;
ExtrasCalendarField.MAXIMUM_YEAR = 9999;

ExtrasCalendarField.DEFAULT_PREVIOUS_MONTH_DAY_STYLE = "color: #af9f9f;";
ExtrasCalendarField.DEFAULT_NEXT_MONTH_DAY_STYLE = "color: #9f9faf;";
ExtrasCalendarField.DEFAULT_CURRENT_MONTH_DAY_STYLE = "color: #000000;";

ExtrasCalendarField.DEFAULT_BASE_DAY_STYLE 
        = "cursor: pointer; text-align: right; border-width: 0px; "
        + "padding: 0px 5px;";
ExtrasCalendarField.DEFAULT_SELECTED_DAY_STYLE 
        = "cursor: default; text-align: right; border-width: 0px; "
        + "border-collapse: collapse; padding: 0px 5px; color: #ffffaf; background-color: #3f3f4f";
ExtrasCalendarField.DEFAULT_YEAR_FIELD_STYLE 
        = "text-align:center; background-color: #ffffcf; border-width: 1px; border-style: inset;";
ExtrasCalendarField.DEFAULT_MONTH_SELECT_STYLE 
        = "text-align:left; background-color: #ffffcf; border-width: 1px; border-style: inset;";

ExtrasCalendarField.prototype.calculateCalendarInformation = function() {
    var firstDate = new Date(this.year, this.month, 1);
    this.firstDayOfMonth = firstDate.getDay();
    
    this.daysInMonth = ExtrasCalendarField.getDaysInMonth(this.year, this.month);
    if (this.month == 0) {
        this.daysInPreviousMonth = ExtrasCalendarField.getDaysInMonth(this.year - 1, 11);
    } else {
        this.daysInPreviousMonth = ExtrasCalendarField.getDaysInMonth(this.year, this.month - 1);
    }
};

/**
 * Renders the ExtrasCalendarField into the DOM.
 */
ExtrasCalendarField.prototype.create = function() {
    var i, j;
    var calendarDivElement = document.createElement("div");
    calendarDivElement.id = this.elementId;
    
    var monthSelect = document.createElement("select");
    monthSelect.id = this.elementId + "_month";
    EchoDomUtil.setCssText(monthSelect, this.monthSelectStyle);
    for (i = 0; i < 12; ++i) {
        var optionElement = document.createElement("option");
        optionElement.appendChild(document.createTextNode(this.monthNames[i]));
        monthSelect.appendChild(optionElement);
    }
    calendarDivElement.appendChild(monthSelect);
    
    var yearDecrementSpanElement = document.createElement("span");
    yearDecrementSpanElement.id = this.elementId + "_yeardecrement";
    yearDecrementSpanElement.style.cursor = "pointer";
    yearDecrementSpanElement.appendChild(document.createTextNode("<"));
    calendarDivElement.appendChild(yearDecrementSpanElement);
    
    var yearField = document.createElement("input");
    yearField.id = this.elementId + "_year";
    yearField.setAttribute("type", "text");
    yearField.setAttribute("maxlength", "4");
    yearField.setAttribute("size", "5");
    EchoDomUtil.setCssText(yearField, this.yearFieldStyle);
    calendarDivElement.appendChild(yearField);
    
    var yearIncrementSpanElement = document.createElement("span");
    yearIncrementSpanElement.id = this.elementId + "_yearincrement";
    yearIncrementSpanElement.style.cursor = "pointer";
    yearIncrementSpanElement.appendChild(document.createTextNode(">"));
    calendarDivElement.appendChild(yearIncrementSpanElement);

    var tableElement = document.createElement("table");
    tableElement.id = this.elementId + "_table";
    
    var dayTableStyle = "border: " + this.border + "; margin: 1px; border-collapse: collapse;"
    EchoDomUtil.setCssText(tableElement, dayTableStyle);
    
    var tbodyElement = document.createElement("tbody");
    
    var trElement = document.createElement("tr");
    for (j = 0; j < 7; ++j) {
        var tdElement = document.createElement("td");
        tdElement.id = this.elementId + "_dayofweek_" + i;
        EchoDomUtil.setCssText(tdElement, this.baseDayStyle);
        var dayOfWeekName = this.dayOfWeekNames[(this.firstDayOfWeek + j) % 7];
        if (this.dayOfWeekNameAbbreviationLength > 0) {
            dayOfWeekName = dayOfWeekName.substring(0, this.dayOfWeekNameAbbreviationLength);
        }
        tdElement.appendChild(document.createTextNode(dayOfWeekName));
        trElement.appendChild(tdElement);
    }
    tbodyElement.appendChild(trElement);

    for (i = 0; i < 6; ++i) {
        trElement = document.createElement("tr");
        for (j = 0; j < 7; ++j) {
            tdElement = document.createElement("td");
            EchoDomUtil.setCssText(tdElement, this.baseDayStyle);
            tdElement.id = this.elementId + "_" + i + "_" + j;
            trElement.appendChild(tdElement);
        }
        tbodyElement.appendChild(trElement);
    }
    tableElement.appendChild(tbodyElement);
    
    calendarDivElement.appendChild(tableElement);
    
    var containerElement = document.getElementById(this.containerElementId);
    containerElement.appendChild(calendarDivElement);
    
    EchoEventProcessor.addHandler(this.elementId + "_table", "click", "ExtrasCalendarField.processDaySelect");
    EchoEventProcessor.addHandler(this.elementId + "_month", "change", "ExtrasCalendarField.processMonthSelect");
    EchoEventProcessor.addHandler(this.elementId + "_year", "change", "ExtrasCalendarField.processYearEntry");
    EchoEventProcessor.addHandler(this.elementId + "_yearincrement", "click", "ExtrasCalendarField.processYearIncrement");
    EchoEventProcessor.addHandler(this.elementId + "_yeardecrement", "click", "ExtrasCalendarField.processYearDecrement");
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "calendar", this);

    this.setDate(this.year, this.month, this.selectedDay, false);
};

/**
 * Removes the ExtrasCalendarField from the DOM and disposes of any allocated
 * resources.
 */
ExtrasCalendarField.prototype.dispose = function() {
    // Remove event listeners.
    EchoEventProcessor.removeHandler(this.elementId + "_table", "click");
    EchoEventProcessor.removeHandler(this.elementId + "_month", "change");
    EchoEventProcessor.removeHandler(this.elementId + "_year", "change");
    EchoEventProcessor.removeHandler(this.elementId + "_yearincrement", "click");
    EchoEventProcessor.removeHandler(this.elementId + "_yeardecrement", "click");
    
    // Remove calendar.
    var calendarElement = document.getElementById(this.elementId);
    calendarElement.parentNode.removeChild(calendarElement);
};

ExtrasCalendarField.prototype.processDaySelect = function(elementId) {
    if (elementId.indexOf("_dayofweek_") !== -1) {
        // Day of week clicked.
        return;
    }

    // Extract portion of id which describes cell number, e.g., if the clicked element
    var cellId = elementId.substring(this.elementId.length + 1);
    var row = cellId.charAt(0);
    var column = cellId.charAt(2);
    this.selectDayByCoordinate(column, row);
};

ExtrasCalendarField.prototype.processMonthSelect = function() {
    var monthSelect = document.getElementById(this.elementId + "_month");
    this.setDate(this.year, monthSelect.selectedIndex, this.selectedDay, true);
};

ExtrasCalendarField.prototype.processYearDecrement = function() {
    if (this.year <= ExtrasCalendarField.MINIMUM_YEAR) {
        return;
    }
    
    --this.year;
    this.setDate(this.year, this.month, this.selectedDay, true);
};

ExtrasCalendarField.prototype.processYearEntry = function() {
    var yearField = document.getElementById(this.elementId + "_year");
    if (isNaN(yearField.value)) {
        return;
    }
    this.setDate(yearField.value, this.month, this.selectedDay, true);
};

ExtrasCalendarField.prototype.processYearIncrement = function() {
    if (this.year >= ExtrasCalendarField.MAXIMUM_YEAR) {
        return;
    }
    
    ++this.year;
    this.setDate(this.year, this.month, this.selectedDay, true);
};

/**
 * Re-renders the display of the calendar to reflect the current month/year
 * and selected date.
 */
ExtrasCalendarField.prototype.renderUpdate = function() {
    var day = 1 - this.firstDayOfMonth;
    for (var i = 0; i < 6; ++i) {
        for (var j = 0; j < 7; ++j) {
            var tdElement = document.getElementById(this.elementId + "_" + i + "_" + j);
            
            while (tdElement.hasChildNodes()) {
                tdElement.removeChild(tdElement.firstChild);
            }
            
            var renderedText;
            var styleText;
            if (day < 1) {
                renderedText = this.daysInPreviousMonth + day;
                styleText = this.baseDayStyle + this.previousMonthDayStyle;
            } else if (day > this.daysInMonth) {
                renderedText = day - this.daysInMonth;
                styleText = this.baseDayStyle + this.nextMonthDayStyle;
            } else {
                renderedText = day;
                if (day == this.selectedDay) {
                    styleText = this.selectedDayStyle;
                } else {
                    styleText = this.baseDayStyle + this.currentMonthDayStyle;
                }
            }
            var textNode = document.createTextNode(renderedText);
            EchoDomUtil.setCssText(tdElement, styleText);
            tdElement.appendChild(textNode);
            ++day;
        }
    }
};

ExtrasCalendarField.prototype.selectDayByCoordinate = function(column, row) {
    var selectedDay, selectedMonth, selectedYear;
    var dayCellNumber = parseInt(column) + (row * 7);
    if (dayCellNumber < this.firstDayOfMonth) {
        if (this.month == 0) {
            selectedMonth = 11;
            selectedYear = this.year - 1;
        } else {
            selectedMonth = this.month - 1;
            selectedYear = this.year;
        }
        selectedDay = this.daysInPreviousMonth - this.firstDayOfMonth + dayCellNumber + 1;
    } else if (dayCellNumber >= (this.firstDayOfMonth + this.daysInMonth)) {
        if (this.month == 11) {
            selectedMonth = 0;
            selectedYear = this.year + 1;
        } else {
            selectedMonth = this.month + 1;
            selectedYear = this.year;
        }
        selectedDay = dayCellNumber - this.firstDayOfMonth - this.daysInMonth + 1;
    } else {
        selectedMonth = this.month;
        selectedYear = this.year;
        selectedDay = dayCellNumber - this.firstDayOfMonth + 1;
    }
    
    this.setDate(selectedYear, selectedMonth, selectedDay, true);
};

ExtrasCalendarField.prototype.setDate = function(year, month, day, update) {
    var yearField = document.getElementById(this.elementId + "_year");
    var monthSelect = document.getElementById(this.elementId + "_month");

    this.year = year;
    this.month = month;
    this.selectedDay = day;
    yearField.value = year;
    monthSelect.selectedIndex = month;
    this.calculateCalendarInformation();
    this.renderUpdate();
    
    if (update) {
        this.updateClientMessage();
    }
};

/**
 * Updates the component state in the outgoing <code>ClientMessage</code>.
 */
ExtrasCalendarField.prototype.updateClientMessage = function() {
    var datePropertyElement = EchoClientMessage.createPropertyElement(this.elementId, "date");
    var calendarSelectionElement = datePropertyElement.firstChild;
    if (!calendarSelectionElement) {
        calendarSelectionElement = EchoClientMessage.messageDocument.createElement("calendar-selection");
        datePropertyElement.appendChild(calendarSelectionElement);
    }
    calendarSelectionElement.setAttribute("month", this.month);
    calendarSelectionElement.setAttribute("date", this.selectedDay);
    calendarSelectionElement.setAttribute("year", this.year);
    EchoDebugManager.updateClientMessage();
};

/**
 * Returns the ExtrasCalendarField instance relevant to the
 * specified root DOM element id.
 *
 * @param elementId the root DOM element id.
 * @return the ExtrasCalendarField instance
 */
ExtrasCalendarField.getComponent = function(elementId) {
    var componentId = EchoDomUtil.getComponentId(elementId);
    var calendar = EchoDomPropertyStore.getPropertyValue(componentId, "calendar");
    return calendar;
};

/**
 * Determines the number of days in a specific month.
 *
 * @param year the year of the month
 * @param month the month
 * @return the number of days in the month
 */
ExtrasCalendarField.getDaysInMonth = function(year, month) {
    switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
        return 31;
    case 3:
    case 5:
    case 8:
    case 10:
        return 30;
    case 1:
        if (year % 400 === 0) {
            return 29;
        } else if (year % 100 === 0) {
            return 28;
        } else if (year % 4 === 0) {
            return 29;
        } else {
            return 28;
        }
    default:
        throw "Invalid Month: " + month;
    }
};

ExtrasCalendarField.processDaySelect = function(echoEvent) {
    var elementId = echoEvent.target.id;
    var calendar = ExtrasCalendarField.getComponent(elementId);
    calendar.processDaySelect(elementId);
};

ExtrasCalendarField.processMonthSelect = function(echoEvent) {
    var elementId = echoEvent.registeredTarget.id;
    var calendar = ExtrasCalendarField.getComponent(elementId);
    calendar.processMonthSelect();
};

ExtrasCalendarField.processYearDecrement = function(echoEvent) {
    var elementId = echoEvent.registeredTarget.id;
    var calendar = ExtrasCalendarField.getComponent(elementId);
    calendar.processYearDecrement();
    EchoDomUtil.preventEventDefault(echoEvent);
};

ExtrasCalendarField.processYearEntry = function(echoEvent) {
    var elementId = echoEvent.registeredTarget.id;
    var calendar = ExtrasCalendarField.getComponent(elementId);
    calendar.processYearEntry();
};

ExtrasCalendarField.processYearIncrement = function(echoEvent) {
    var elementId = echoEvent.registeredTarget.id;
    var calendar = ExtrasCalendarField.getComponent(elementId);
    calendar.processYearIncrement();
    EchoDomUtil.preventEventDefault(echoEvent);
};

/**
 * Static object/namespace for CalendarField MessageProcessor 
 * implementation.
 */
ExtrasCalendarField.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasCalendarField.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "dispose":
                ExtrasCalendarField.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasCalendarField.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "set-date":
                ExtrasCalendarField.MessageProcessor.processSetDate(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * CalendarField component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasCalendarField.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
    var calendar = ExtrasCalendarField.getComponent(elementId);
    calendar.dispose();
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * CalendarField component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasCalendarField.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var year = parseInt(initMessageElement.getAttribute("year"));
    var month = parseInt(initMessageElement.getAttribute("month"));
    var date = parseInt(initMessageElement.getAttribute("date"));

    var calendar = new ExtrasCalendarField(elementId, containerElementId, year, month, date);

    if (initMessageElement.getAttribute("border")) {
	    calendar.border = initMessageElement.getAttribute("border");
    }
    if (initMessageElement.getAttribute("foreground")) {
	    calendar.foreground = initMessageElement.getAttribute("foreground");
    }
    if (initMessageElement.getAttribute("background")) {
	    calendar.background = initMessageElement.getAttribute("background");
    }

    calendar.create();
};

/**
 * Processes a <code>set-date</code> message to dispose the state of a 
 * CalendarField component that is being removed.
 *
 * @param setDateMessageElement the <code>set-date</code> element to process
 */
ExtrasCalendarField.MessageProcessor.processSetDate = function(setDateMessageElement) {
    var elementId = setDateMessageElement.getAttribute("eid");
    var year = parseInt(setDateMessageElement.getAttribute("year"));
    var month = parseInt(setDateMessageElement.getAttribute("month"));
    var date = parseInt(setDateMessageElement.getAttribute("date"));
    var calendar = ExtrasCalendarField.getComponent(elementId);
    calendar.setDate(year, month, date, false);
};

