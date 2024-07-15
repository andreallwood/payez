window.jsPDF = window.jspdf.jsPDF;

var combinedData = [];
var filteredData = [];

var newRowID = 0;
var copiedItem = {};
var showEditor = false;
var Company_data = [];
var Employees_data = [];
var Titles_data = [];
var Locations_data = [];
var PayFrequency_data = [];
var Departments_data = [];
var PayClass_data = [];
var Jobs_data = [];
var Bank_data = [];
var AccountType_data = [];
var Payslip_data = [];
var taxConfig_data = [];
var taxCategory_data = [];

const Frequency1 = 'Pending';

/*--S01 mapping variable--*/
var recordsVariable = "";
var s01Month = "0";
var s01Year = "0000";
var s01item0 = "$0.00";
var s01item10 = 0;
var s01item11 = 0;
var s01item12 = 0;

var s01item13 = "$0.00";
var s01item14 = "$0.00";
var s01item15 = "$0.00";
var s01item16 = "$0.00";
var s01item17 = "$0.00";
var s01item18 = "$0.00";
var s01item19 = "$0.00";

var payCount = 0;
var addPensionIO = 0;
var treshold = 0;

let filterDate;

var payPeriod = 25;




function loadDataOnFocus() {
    $(function () {
        loadData('employees.json', 'Employee', Employees_data, function () {
            loadData('payslips.json', 'Payslips', Payslip_data, function () {
                loadData('payClass.json', 'PayClass', PayClass_data, function () {
                    loadData('payFrequency.json', 'Frequencies', PayFrequency_data, function () {
                        loadData('locations.json', 'Locations', Locations_data, function () {
                            loadData('company.json', 'Company', Company_data, function () {
                                loadData('taxConfig.json', 'TaxConfig', taxConfig_data, function () {
                                    loadData('taxCategory.json', 'TaxCategories', taxCategory_data, function () {
                                        initializeDataGrid();
    
                                        // Calculate YTD pay after loading Payslip_data
                                        var ytdPayByUserId = calculateYTD(Payslip_data);
                                        //console.log('YTD database:', ytdPayByUserId);
    
                                        combinedData = Employees_data.concat(Bank_data, AccountType_data, Jobs_data, PayFrequency_data, Departments_data, Titles_data, Company_data, PayClass_data);
                                        filteredData = filterData(combinedData, ['IDnum', 'FirstName', 'LastName']);
                                        updateDataGrid(filteredData);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}


function loadData(url, dataSourceName, targetArray, callback) {
    $.getJSON('../database/' + url)
        .done(function (pointer) {
            if (pointer) {
                if (pointer.data && Array.isArray(pointer.data)) {
                    targetArray.length = 0;
                    Array.prototype.push.apply(targetArray, pointer.data);
                    //console.log('Payslip_data:', Payslip_data);
                    //console.log(dataSourceName + ' data:', pointer);
                } else {
                    targetArray.length = 0;
                    Array.prototype.push.apply(targetArray, pointer);
                    DevExpress.ui.notify('Invalid ' + dataSourceName.toLowerCase() + ' data structure detected. Performing data structure bypass.', 'error', 100);
                }
            }
            callback();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            DevExpress.ui.notify(dataSourceName + ' prefetch error.', 'error', 5000);
            callback();
        });
}
/*--------------*/
function initializeDataGrid() {
    //var selectedItem;
    $(() => {
        $('#tabPanel').dxTabPanel({
            deferRendering: false,
            dataSource: [
                /*---*/
                {
                    title: Frequency1,
                    template() {
                        return $("<div id='Frequency1DataGrid'>").dxDataGrid({
                            dataSource: Payslip_data,
                            cache: "no-cache",
                            filterRow: {
                                visible: false,
                                applyFilter: 'auto'
                            },
                            headerFilter: {
                                visible: true,
                            },
                            filterValue: [['periodstatus', '=', 'Open']],
                            width: '100%',
                            height: '100dvh',
                            showBorders: true,
                            rowAlternationEnabled: true,
                            adaptColumnWidthByRatio: true,
                            allowColumnReordering: true,
                            columnAutoWidth: true,
                            showRowLines: true,
                            hoverStateEnabled: true,
                            searchEnabled: true,
                            allowColumnResizing: true,
                            columnHidingEnabled: true,
                            customizeColumns(columns) {
                                columns[1].width = 70;
                            },
                            scrolling: {
                                rowRenderingMode: 'virtual',
                            },
                            paging: {
                                pageSize: 30,
                            },
                            pager: {
                                visible: true,
                                allowedPageSizes: [30, 'all'],
                                showPageSizeSelector: true,
                                showInfo: true,
                                showNavigationButtons: true,
                            },
                            selection: {
                                mode: 'single',
                                deferred: false,
                                allowSelectAll: false,
                                maxSelectionCount: 1,
                                onSelectionChanged: function (e) {

                                }
                            },
                            searchPanel: {
                                visible: true,
                                highlightCaseSensitive: true,
                                width: 200,
                                placeholder: 'Quick search...',
                                searchVisibleColumnsOnly: true,
                                highlightSearchText: true,
                                text: '',
                                searchExpr: null,
                                searchMode: 'contains'
                            },
                            editing: {
                                mode: "popup",
                                allowAdding: false,
                                allowUpdating: true,
                                allowDeleting: true,
                                popup: {
                                    title: "Create Payroll",
                                    showTitle: true,
                                    height: 'auto',
                                    minWidth: 200,
                                    maxWidth: 800,
                                    position: {
                                        my: "center",
                                        at: "center",
                                        of: window
                                    },
                                },
                                form: {
                                    items: [
                                        {
                                            itemType: 'group',
                                            colCount: 2,
                                            colSpan: 3,
                                            caption: '',
                                            items: [
                                                {
                                                    dataField: 'IDnum',
                                                    editorType: 'dxSelectBox',
                                                    editorOptions: {
                                                        items: Employees_data || [],
                                                        displayExpr: 'IDnum',
                                                        valueExpr: 'IDnum',
                                                        //height: 32,
                                                        scrollingMode: 'contained',
                                                        virtualizingMode: 'continuous'
                                                    },
                                                    label: {
                                                        text: 'Employee ID#',
                                                    },
                                                },
                                                {
                                                    dataField: 'rundate',
                                                    dataType: 'date',
                                                    label: {
                                                        text: 'Set payroll date',
                                                    },
                                                },

                                                {
                                                    dataField: 'taxType',
                                                    editorType: 'dxSelectBox',
                                                    editorOptions: {
                                                        items: taxCategory_data || [],
                                                        displayExpr: 'taxType',
                                                        valueExpr: 'taxType',
                                                    },
                                                    label: {
                                                        text: 'Tax Category',
                                                    },
                                                },
                                                {
                                                    dataField: 'TaxProfile',
                                                    editorType: 'dxSelectBox',
                                                    editorOptions: {
                                                        items: taxConfig_data || [],
                                                        displayExpr: 'description',
                                                        valueExpr: 'ID',
                                                    },
                                                    label: {
                                                        text: 'Tax Profile',
                                                    },
                                                },
                                                {
                                                    dataField: 'OT_Rate',
                                                    editorType: 'dxSelectBox',
                                                    editorOptions: {
                                                        items: PayClass_data || [],
                                                        displayExpr: 'name',
                                                        valueExpr: 'rate',
                                                    },
                                                    label: {
                                                        text: 'Overtime payclass',
                                                    },
                                                },
                                                {
                                                    dataField: 'H_Rate',
                                                    editorType: 'dxSelectBox',
                                                    editorOptions: {
                                                        items: PayClass_data || [],
                                                        displayExpr: 'name',
                                                        valueExpr: 'rate',
                                                    },
                                                    label: {
                                                        text: 'Holiday payclass',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            itemType: 'group',
                                            colCount: 2,
                                            colSpan: 2,
                                            caption: '',
                                            items: [
                                                {
                                                    dataField: 'override',
                                                    editorType: 'dxSelectBox',
                                                    editorOptions: {
                                                        items: PayFrequency_data || [],
                                                        displayExpr: 'Name',
                                                        valueExpr: 'Name',
                                                    },
                                                    label: {
                                                        text: 'Frequency OverRide',
                                                    },
                                                },
                                                {
                                                    dataField: 'ManualHours',
                                                    label: {
                                                        text: 'Manual Hours',
                                                    },
                                                },
                                                {
                                                    dataField: 'OT_Hours',
                                                    label: {
                                                        text: 'Overtime hours worked',
                                                    },
                                                },
                                                {
                                                    dataField: 'H_Hours',
                                                    label: {
                                                        text: 'Holiday hours worked',
                                                    },
                                                },
                                                {
                                                    dataField: 'Incentive',
                                                    label: {
                                                        text: 'Incentive',
                                                    },
                                                },
                                                {
                                                    dataField: 'Travel',
                                                    label: {
                                                        text: 'Travel',
                                                    },
                                                },
                                                {
                                                    dataField: 'Allowance',
                                                    label: {
                                                        text: 'Allowance',
                                                    },
                                                },
                                            ],
                                        },
                                   ],
                                },
                            },
                            columns: [
                                {
                                    dataField: 'periodstatus',
                                    caption: '* Status *',
                                    width: 120,
                                    dataType: 'number',
                                    alignment: 'center',
                                    calculateCellValue: function (data) {
                                        const currentDate = new Date();
                                        const currentMonth = currentDate.getMonth() + 1;

                                        const rundateDate = new Date(data.rundate);
                                        const rundateMonth = rundateDate.getMonth() + 1;

                                        if (rundateMonth < currentMonth) {
                                            return "Closed";
                                        } else {
                                            return "Open";
                                        }
                                    }
                                },
                                {
                                    dataField: 'IDnum',
                                    caption: 'ID#',
                                    editorType: 'dxTextBox',
                                    //width: 1200,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? selectedItem.IDnum : null;
                                    }
                                },
                                {
                                    dataField: 'FirstName',
                                    caption: 'First Name',
                                    editorType: 'dxReadOnlyTextBox',
                                    width: 120,
                                    //visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? selectedItem.FirstName : "Not found";
                                    }
                                },
                                {
                                    dataField: 'Initial',
                                    caption: 'Initial',
                                    editorType: 'dxReadOnlyTextBox',
                                    //width: 80,
                                    visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? selectedItem.Initial : null;
                                    }
                                },
                                {
                                    dataField: 'LastName',
                                    caption: 'Last Name',
                                    editorType: 'dxReadOnlyTextBox',
                                    //width: 120,
                                    //visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? selectedItem.LastName : null;
                                    }
                                },
                                {
                                    dataField: 'Gender',
                                    caption: 'Gender',
                                    editorType: 'dxReadOnlyTextBox',
                                    //width: 120,
                                    visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? selectedItem.Gender : null;
                                    }
                                },
                                {
                                    dataField: 'DOB',
                                    caption: 'Age',
                                    editorType: 'dxReadOnlyTextBox',
                                    alignment: 'left',
                                    //width: 80,
                                    visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        if (selectedItem && selectedItem.DOB) {
                                            // Calculate age by subtracting the DOB from the current date
                                            var dob = new Date(selectedItem.DOB);
                                            var currentDate = new Date();
                                            var age = currentDate.getFullYear() - dob.getFullYear();
                                            // Adjust age based on the birthdate and current date
                                            if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
                                                age--;
                                            }
                                            return age;
                                        }
                                        return null;
                                    }
                                },
                                {
                                    dataField: 'NIS',
                                    caption: 'NIS',
                                    editorType: 'dxReadOnlyTextBox',
                                    alignment: 'left',
                                    //width: 80,
                                    //visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? selectedItem.NIS.toUpperCase() : null;
                                    }
                                },
                                {
                                    dataField: 'TRN',
                                    caption: 'TRN',
                                    editorType: 'dxReadOnlyTextBox',
                                    alignment: 'left',
                                    //width: 100,
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? insertHyphens(selectedItem.TRN, 3) : null;
                                    },
                                },

                                {
                                    dataField: 'override',
                                    caption: 'OverRide',
                                    dataType: 'text',
                                    visible: false
                                },
                                {
                                    dataField: 'Frequency',
                                    caption: 'Frequency',
                                    dataType: 'text',
                                    alignment: 'left',
                                    width: 120,
                                    calculateCellValue: function (data) {
                                        return setFrequencyFromOverride(data);
                                    }
                                },
                             /*   {
                                    dataField: 'Frequency',
                                    caption: 'Frequency reference',
                                    dataType: 'text',
                                    visible: false
                                },*/

                                {
                                    dataField: 'rundate',
                                    caption: 'Run Date',
                                    dataType: 'date',
                                    alignment: 'left',
                                    editorType: 'dxDateBox',
                                    editorOptions: {
                                        width: '100%',
                                        displayFormat: 'dd/MM/yyyy',
                                    },
                                    template: (data, container) => {
                                        const rundateColumn = data.column;
                                        const currentRundate = data.formData.rundate; // Access 'rundate' from formData
                                        container.append(`Current Run Date: ${currentRundate}`); // Display the value
                                        return container;
                                    }

                                },

                                {
                                    dataField: 'PayRate',
                                    caption: 'Rate',
                                    editorType: 'dxReadOnlyTextBox',
                                    dataType: 'number',
                                    alignment: 'left',
                                    width: 90,
                                    //visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        var payrate = selectedItem ? selectedItem.PayRate : null;
                                        if (payrate !== null) {
                                            return '$' + payrate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        }
                                        return null;
                                    },
                                },
                                {
                                    dataField: 'ManualHours',
                                    caption: 'Manual Hours',
                                    dataType: 'number',
                                    visible: false
                                },
                                {
                                    dataField: 'Hours',
                                    caption: 'Hours',
                                    dataType: 'number',
                                    alignment: 'left',
                                    width: 90,
                                    calculateCellValue: function (data) {
                                        const overrideFrequency = data.override ? setFrequencyFromOverride(data) : null;
                                        const frequency = overrideFrequency || data.Frequency;
                                        let hours;
                                        if (frequency) {
                                            switch (frequency) {
                                                case 'Monthly':
                                                    hours = 160;
                                                    break;
                                                case 'Bi-Weekly':
                                                    hours = 80;
                                                    break;
                                                case 'Weekly':
                                                    hours = 40;
                                                    break;
                                                case 'Daily':
                                                    hours = 7;
                                                    break;
                                                default:
                                                    hours = 0;
                                            }
                                        }
                                        hours = Math.max(hours, data.ManualHours || 0);
                                        var Hours = hours;
                                        data.Hours = Hours;
                                        return hours;
                                    }
                                },

                                {
                                    dataField: 'calculatedRegular',
                                    caption: 'Regular Pay',
                                    dataType: 'number',
                                    alignment: 'left',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        var payRate = selectedItem ? selectedItem.PayRate : 0;
                                        var hours = data.Hours || 0;
                                        var calculatedRegular = hours * payRate;
                                        data.calculatedRegular = calculatedRegular;
                                        return "$" + calculatedRegular.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    },
                                },
                              /*  {
                                    dataField: 'calculatedRegular',
                                    caption: 'Regular pay reference',
                                    dataType: 'number',
                                    visible: false
                                },*/

                                {
                                    dataField: 'Travel',
                                    caption: 'Traveling',
                                    dataType: 'number',
                                    alignment: 'left',
                                    //width: 100,
                                    calculateCellValue: function (data) {
                                        if (data.Travel === undefined || data.Travel === null) {
                                            data.Travel = 0;
                                        }
                                        var calculateTravel = data.Travel;
                                        return calculateTravel;
                                    },
                                    format: {
                                        type: 'currency',
                                        precision: 2,
                                        currency: 'USD'
                                    }
                                },

                                {
                                    dataField: 'Incentive',
                                    caption: 'Incentive',
                                    dataType: 'number',
                                    alignment: 'left',
                                    calculateCellValue: function (data) {
                                        if (data.Incentive === undefined || data.Incentive === null) {
                                            data.Incentive = 0;
                                        }
                                        var calculateIncentive = data.Incentive;
                                        return calculateIncentive;
                                    },
                                    format: {
                                        type: 'currency',
                                        precision: 2,
                                        currency: 'USD'
                                    }
                                },

                                {
                                    dataField: 'Allowance',
                                    caption: 'Allowance',
                                    dataType: 'number',
                                    alignment: 'left',
                                    width: 120,
                                    calculateCellValue: function (data) {
                                        if (data.Allowance === undefined || data.Allowance === null) {
                                            data.Allowance = 0;
                                        }
                                        var calculateAllowance = data.Allowance;
                                        return calculateAllowance;
                                    },
                                    format: {
                                        type: 'currency',
                                        precision: 2,
                                        currency: 'USD'
                                    }
                                },

                                {
                                    dataField: 'OT_Rate',
                                    caption: 'OT_Rate',
                                    dataType: 'number',
                                    alignment: 'center',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        var payrate = selectedItem ? selectedItem.PayRate : null;

                                        if (data.OT_Rate === undefined || data.OT_Rate === null) {
                                            data.OT_Rate = 0;
                                        }
                                        var setOTRate = data.OT_Rate * payrate;
                                        return "$" + setOTRate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    },
                                },
                                {
                                    dataField: 'OT_Hours',
                                    caption: 'OT_Hours',
                                    dataType: 'number',
                                    alignment: 'center',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        if (data.OT_Hours === undefined || data.OT_Hours === null) {
                                            data.OT_Hours = 0;
                                        }
                                        return data.OT_Hours;
                                    },
                                },
                                {
                                    dataField: 'calculatedOverTime',
                                    caption: 'OverTime',
                                    dataType: 'number',
                                    alignment: 'left',
                                    width: 110,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        var payrate = selectedItem ? selectedItem.PayRate : null;

                                        var ot_rate = data.OT_Rate || 0;
                                        var ot_hours = data.OT_Hours || 0;
                                        var calculatedOverTime = (ot_rate * ot_hours) * payrate;
                                        data.calculatedOverTime = calculatedOverTime;
                                        return "$" + calculatedOverTime.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    },
                                },
                                /*{
                                    dataField: 'calculatedOverTime',
                                    caption: 'Overtime reference',
                                    dataType: 'number',
                                    visible: false
                                },*/

                                {
                                    dataField: 'H_Rate',
                                    caption: 'H_Rate',
                                    dataType: 'number',
                                    // visible: false,
                                    alignment: 'center',
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        var payrate = selectedItem ? selectedItem.PayRate : null;

                                        if (data.H_Rate === undefined || data.H_Rate === null) {
                                            data.H_Rate = 0;
                                        }
                                        var setHRate = data.H_Rate * payrate;
                                        return "$" + setHRate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    },
                                },
                                {
                                    dataField: 'H_Hours',
                                    caption: 'H_Hours',
                                    dataType: 'number',
                                    //visible: false,
                                    calculateCellValue: function (data) {
                                        if (data.H_Hours === undefined || data.H_Hours === null) {
                                            data.H_Hours = 0;
                                        }
                                        return data.H_Hours;
                                    },
                                },
                                {
                                    dataField: 'calculatedHoliday',
                                    caption: 'Holiday',
                                    dataType: 'number',
                                    alignment: 'left',
                                    width: 100,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        var payrate = selectedItem ? selectedItem.PayRate : null;

                                        var H_Rate = data.H_Rate || 0;
                                        var H_Hours = data.H_Hours || 0;
                                        var calculatedHoliday = (H_Rate * H_Hours) * payrate;
                                        data.calculatedHoliday = calculatedHoliday;
                                        return "$" + calculatedHoliday.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    },
                                },
                               /* {
                                    dataField: 'calculatedHoliday',
                                    dataType: 'number',
                                    visible: false
                                },*/

                                {
                                    dataField: 'calculatedGrossPay',
                                    caption: 'Gross Pay',
                                    dataType: 'number',
                                    alignment: 'left',
                                    calculateCellValue: function (data) {
                                        var calculatedRegular = data.calculatedRegular || 0;
                                        var calculatedOverTime = data.calculatedOverTime || 0;
                                        var calculatedHoliday = data.calculatedHoliday || 0;
                                        var calculateTravel = data.Travel || 0;
                                        var calculateIncentive = data.Incentive || 0;
                                        var calculateAllowance = data.Allowance || 0;
                                        var calculatedGrossPay = calculatedRegular + calculatedOverTime + calculatedHoliday + calculateTravel + calculateIncentive + calculateAllowance;
                                        data.calculatedGrossPay = calculatedGrossPay;
                                        return '$' + calculatedGrossPay.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    },
                                },
                              /*  {
                                    dataField: 'calculatedGrossPay',
                                    dataType: 'number',
                                    visible: false
                                },*/

                                {
                                    dataField: 'taxTypeNHT',
                                    caption: 'Employee NHT %',
                                    editorType: 'dxTextBox',
                                    alignment: 'center',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.taxTypeNHT;
                                        var selectedItem = taxCategory_data.find(item => item.taxTypeNHT === selectedId);
                                        return selectedItem ? selectedItem.NHT + '%' : '0%';
                                    }
                                },
                                {
                                    dataField: 'calculatedNHT',
                                    caption: 'Total NHT',
                                    dataType: 'number',
                                    alignment: 'left',
                                    //visible: false,
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedNHT === undefined || data.calculatedNHT === null) {
                                            data.calculatedNHT = 0;
                                        } else {
                                            var selectedId = data.taxTypeNHT;
                                            var selectedItem = taxCategory_data.find(item => item.taxTypeNHT === selectedId);
                                            var nht_rate = selectedItem ? selectedItem.NHT : 0;

                                            var calculatedNHT = (nht_rate / 100) * (calculatedGrossPay - calculateTravel);

                                            data.calculatedNHT = calculatedNHT;
                                            return '$' + calculatedNHT.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        }
                                    }
                                },
                              /*{
                                    dataField: 'calculatedNHT',
                                    dataType: 'number',
                                    visible: false
                                },*/
                                {
                                    dataField: 'taxTypeNHT2',
                                    caption: 'Employer NHT %',
                                    editorType: 'dxTextBox',
                                    alignment: 'center',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.taxTypeNHT2;
                                        var selectedItem = taxCategory_data.find(item => item.ID === 2);
                                        return selectedItem ? selectedItem.NHT + '%' : '0%';
                                    }
                                },
                                {
                                    dataField: 'calculatedNHT2',
                                    caption: 'Employer NHT',
                                    dataType: 'number',
                                    alignment: 'left',
                                    //visible: false,
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedNHT2 === undefined || data.calculatedNHT2 === null) {
                                            data.calculatedNHT2 = 0;
                                        } else {
                                            var selectedId = data.taxTypeNHT2;
                                            var selectedItem = taxCategory_data.find(item => item.ID === 2);
                                            var nht_rate = selectedItem ? selectedItem.NHT : 0;

                                            var calculatedNHT2 = (nht_rate / 100) * (calculatedGrossPay - calculateTravel);

                                            data.calculatedNHT2 = calculatedNHT2;
                                            return '$' + calculatedNHT2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        }
                                    }
                                },


                                {
                                    dataField: 'taxTypeNIS',
                                    caption: 'Employee NIS %',
                                    editorType: 'dxTextBox',
                                    alignment: 'center',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.taxTypeNIS;
                                        var selectedItem = taxCategory_data.find(item => item.taxTypeNIS === selectedId);
                                        return selectedItem ? selectedItem.NIS + '%' : '0%';
                                    }
                                },
                                {
                                    dataField: 'calculatedNIS',
                                    caption: 'Total NIS',
                                    dataType: 'number',
                                    alignment: 'left',
                                    //  visible: false,
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedNIS === undefined || data.calculatedNIS === null) {
                                            data.calculatedNIS = 0;
                                        } else {
                                            var selectedId = data.taxTypeNIS;
                                            var selectedItem = taxCategory_data.find(item => item.taxTypeNIS === selectedId);
                                            var nis_rate = selectedItem ? selectedItem.NIS : 0;
                                        }
                                        if (calculatedGrossPay > 416666.67) {
                                            var calculatedNIS = (nis_rate / 100) * 416666.67;
                                            data.calculatedNIS = calculatedNIS;
                                            return '$' + calculatedNIS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        } else {
                                            var calculatedNIS = (nis_rate / 100) * (calculatedGrossPay - calculateTravel);
                                            data.calculatedNIS = calculatedNIS;
                                            return '$' + calculatedNIS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        }
                                    }
                                },
                              /*  {
                                    dataField: 'calculatedNIS',
                                    dataType: 'number',
                                    visible: false,
                                },*/
                                {
                                    dataField: 'taxTypeNIS2',
                                    caption: 'Employer NIS %',
                                    editorType: 'dxTextBox',
                                    alignment: 'center',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.taxTypeNIS2;
                                        var selectedItem = taxCategory_data.find(item => item.ID === 2);
                                        return selectedItem ? selectedItem.NIS + '%' : '0%';
                                    }
                                },
                                {
                                    dataField: 'calculatedNIS2',
                                    caption: 'Employer NIS',
                                    dataType: 'number',
                                    alignment: 'left',
                                    //  visible: false,
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedNIS2 === undefined || data.calculatedNIS2 === null) {
                                            data.calculatedNIS2 = 0;
                                        } else {
                                            var selectedId = data.taxTypeNIS2;
                                            var selectedItem = taxCategory_data.find(item => item.ID === 2);
                                            var nis_rate = selectedItem ? selectedItem.NIS : 0;
                                        }
                                        if (calculatedGrossPay > 416666.67) {
                                            var calculatedNIS = (nis_rate / 100) * 416666.67;
                                            data.calculatedNIS2 = calculatedNIS2;
                                            return '$' + calculatedNIS2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        } else {
                                            var calculatedNIS2 = (nis_rate / 100) * (calculatedGrossPay - calculateTravel);
                                            data.calculatedNIS2 = calculatedNIS2;
                                            return '$' + calculatedNIS2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        }
                                    }
                                },



                                {
                                    dataField: 'taxTypeEdTax',
                                    caption: 'EdTax %',
                                    editorType: 'dxTextBox',
                                    alignment: 'center',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.taxTypeEdTax;
                                        var selectedItem = taxCategory_data.find(item => item.taxTypeEdTax === selectedId);
                                        return selectedItem ? selectedItem.ETAX + '%' : '0%';
                                    }
                                },
                                {
                                    dataField: 'calculatedEdTax',
                                    caption: 'Total EdTax',
                                    dataType: 'number',
                                    alignment: 'left',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculatedNIS = data.calculatedNIS || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedEdTax === undefined || data.calculatedEdTax === null) {
                                            data.calculatedEdTax = 0;
                                        } else {
                                            var selectedId = data.taxTypeEdTax;
                                            var selectedItem = taxCategory_data.find(item => item.taxTypeEdTax === selectedId);
                                            var edtax_rate = selectedItem ? selectedItem.ETAX : 0;
                                            var calculatedEdTax = (edtax_rate / 100) * ((calculatedGrossPay - calculateTravel) - calculatedNIS);
                                            data.calculatedEdTax = calculatedEdTax;
                                            return '$' + calculatedEdTax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        }
                                    }
                                },
                                {
                                    dataField: 'taxTypeEdTax2',
                                    caption: 'Employer EdTax %',
                                    editorType: 'dxTextBox',
                                    alignment: 'center',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.taxTypeEdTax;
                                        var selectedItem = taxCategory_data.find(item => item.ID === 2);
                                        return selectedItem ? selectedItem.ETAX + '%' : '0%';
                                    }
                                },
                                {
                                    dataField: 'calculatedEdTax2',
                                    caption: 'Total employer EdTax',
                                    dataType: 'number',
                                    alignment: 'left',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculatedNIS = data.calculatedNIS || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedEdTax2 === undefined || data.calculatedEdTax2 === null) {
                                            data.calculatedEdTax2 = 0;
                                        } else {
                                            var selectedId = data.taxTypeEdTax2;
                                            var selectedItem = taxCategory_data.find(item => item.ID === 2);
                                            var edtax_rate = selectedItem ? selectedItem.ETAX : 0;
                                            var calculatedEdTax2 = (edtax_rate / 100) * ((calculatedGrossPay - calculateTravel) - calculatedNIS);
                                            data.calculatedEdTax2 = calculatedEdTax2;
                                            return '$' + calculatedEdTax2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        }
                                    }
                                },
                              /*  {
                                    dataField: 'calculatedEdTax',
                                    dataType: 'number',
                                    visible: false,
                                },*/

                                {
                                    dataField: 'TaxProfile',
                                    caption: 'PAYE Threshold',
                                    dataType: 'number',
                                    alignment: 'left',
                                    //visible: false,
                                },

                                {
                                    dataField: 'calculatedPAYE',
                                    caption: 'PAYE',
                                    dataType: 'number',
                                    alignment: 'right',
                                    // visible: false,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.TaxProfile;
                                        var selectedItem = taxConfig_data.find(item => item.ID === selectedId);

                                        var id = selectedItem ? selectedItem.ID : null;
                                        var description = selectedItem ? selectedItem.description : null;
                                        var taxFreeThreshold = selectedItem ? selectedItem.taxFreeThreshold : null;
                                        var taxMaxThreshold = selectedItem ? selectedItem.taxMaxThreshold : null;
                                        var regularTaxRate = selectedItem ? selectedItem.minTaxRate : null;
                                        var maxTaxRate = selectedItem ? selectedItem.maxTaxRate : null;

                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculatedNIS = data.calculatedNIS || 0;
                                        var calculatePension = data.calculatePension || 0;
                                        var calculateTravel = data.Travel;

                                        var chargeable_income = (calculatedGrossPay - (calculatedNIS + calculatePension)) - calculateTravel;

                                        if (chargeable_income < (taxFreeThreshold / 12)) {
                                            var calculatedPAYE = 0;
                                            data.calculatedPAYE = calculatedPAYE;
                                            return '$' + calculatedPAYE;
                                        } else {
                                            if (chargeable_income > (taxFreeThreshold / 12) && chargeable_income < (taxMaxThreshold / 12)) {
                                                var calculatedPAYE = (chargeable_income - (taxFreeThreshold / 12)) * regularTaxRate / 100;
                                                data.calculatedPAYE = calculatedPAYE;
                                                return '$' + calculatedPAYE.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' at (' + regularTaxRate + '%)';
                                            } else {
                                                if (chargeable_income > (taxMaxThreshold / 12)) {
                                                    var set_paye1 = ((chargeable_income - (taxMaxThreshold / 12)) * (maxTaxRate / 100));
                                                    var set_paye2 = (((taxMaxThreshold / 12) - (taxFreeThreshold / 12)) * (regularTaxRate / 100));
                                                    var calculatedPAYE = (set_paye1 + set_paye2);
                                                    data.calculatedPAYE = calculatedPAYE;
                                                    return '$' + calculatedPAYE.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' at (' + maxTaxRate + '%)';
                                                }
                                            }
                                        }
                                    }
                                },
                             /*   {
                                    dataField: 'calculatedPAYE',
                                    dataType: 'number',
                                    visible: false,
                                },*/

                                {
                                    dataField: 'calculatedDeductions',
                                    caption: 'Total Deduction',
                                    dataType: 'number',
                                    alignment: 'left',
                                    calculateCellValue: function (data) {
                                        var calculatedPAYE = data.calculatedPAYE || 0;
                                        var calculatePension = data.calculatePension || 0;
                                        var calculatedEdTax = data.calculatedEdTax || 0;
                                        var calculatedNIS = data.calculatedNIS || 0;
                                        var calculatedNHT = data.calculatedNHT || 0;

                                        var calculatedDeductions = (calculatedPAYE + calculatePension + calculatedEdTax + calculatedNIS + calculatedNHT);
                                        data.calculatedDeductions = calculatedDeductions;
                                        return '$' + calculatedDeductions.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    }
                                },
                               /* {
                                    dataField: 'calculatedDeductions',
                                    dataType: 'number',
                                    visible: false,
                                },*/

                                {
                                    dataField: 'calculatedNetPay',
                                    caption: 'Net Pay',
                                    dataType: 'number',
                                    alignment: 'left',
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculatedDeductions = data.calculatedDeductions || 0;

                                        var calculatedNetPay = calculatedGrossPay - calculatedDeductions;
                                        data.calculatedNetPay = calculatedNetPay;
                                        return '$' + calculatedNetPay.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    }
                                },
                               /* {
                                    dataField: 'calculatedNetPay',
                                    dataType: 'number',
                                    visible: false,
                                },*/

                                {
                                    dataField: 'ytdNIS',
                                    caption: 'YTD NIS',
                                    dataType: 'number',
                                    // visible: false,
                                    calculateCellValue: function (rowData) {
                                        var id = rowData.IDnum;
                                        var date = rowData.rundate;
                                        var ytdNIS = 0;
                                        var calculatedNIS = rowData.calculatedNIS || 0;
                                        Payslip_data.forEach(function (record) {
                                            if (record.IDnum === id && new Date(record.rundate) <= new Date(date)) {
                                                ytdNIS += record.calculatedNIS;
                                            }
                                        });
                                        rowData.ytdNIS = ytdNIS;
                                        return '$' + rowData.ytdNIS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    }
                                },
                              /*  {
                                    dataField: 'ytdNIS',
                                    dataType: 'number',
                                    visible: false
                                },*/

                                {
                                    dataField: 'ytdNHT',
                                    caption: 'YTD NHT',
                                    dataType: 'number',
                                    //visible: false,
                                    calculateCellValue: function (rowData) {
                                        var id = rowData.IDnum;
                                        var date = rowData.rundate;
                                        var ytdNHT = 0;
                                        var calculatedNHT = rowData.calculatedNHT || 0;
                                        Payslip_data.forEach(function (record) {
                                            if (record.IDnum === id && new Date(record.rundate) <= new Date(date)) {
                                                ytdNHT += record.calculatedNHT;
                                            }
                                        });
                                        rowData.ytdNHT = ytdNHT;
                                        return '$' + rowData.ytdNHT.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    }
                                },
                              /*  {
                                    dataField: 'ytdNHT',
                                    dataType: 'number',
                                    visible: false
                                },*/

                                {
                                    dataField: 'ytdEDTAX',
                                    caption: 'YTD EdTax',
                                    dataType: 'number',
                                    //visible: false,
                                    calculateCellValue: function (rowData) {
                                        var id = rowData.IDnum;
                                        var date = rowData.rundate;
                                        var ytdETAX = 0;
                                        var calculatedEdTax = rowData.calculatedEdTax || 0;
                                        Payslip_data.forEach(function (record) {
                                            if (record.IDnum === id && new Date(record.rundate) <= new Date(date)) {
                                                ytdETAX += record.calculatedEdTax;
                                            }
                                        });
                                        rowData.ytdETAX = ytdETAX;
                                        return '$' + rowData.ytdETAX.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    }
                                },
                             /*   {
                                    dataField: 'ytdEDTAX',
                                    dataType: 'number',
                                    visible: false
                                },*/

                                {
                                    dataField: 'ytdPAYE',
                                    caption: 'YTD PAYE',
                                    dataType: 'number',
                                    //visible: false,
                                    calculateCellValue: function (rowData) {
                                        var id = rowData.IDnum;
                                        var date = rowData.rundate;
                                        var ytdPAYE = 0;
                                        var calculatedPAYE = rowData.calculatedPAYE || 0;
                                        Payslip_data.forEach(function (record) {
                                            if (record.IDnum === id && new Date(record.rundate) <= new Date(date)) {
                                                ytdPAYE += record.calculatedPAYE;
                                            }
                                        });
                                        rowData.ytdPAYE = ytdPAYE;
                                        return '$' + rowData.ytdPAYE.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    }
                                },
                               /* {
                                    dataField: 'ytdPAYE',
                                    dataType: 'number',
                                    visible: false
                                },*/
                            ],
                            summary: {
                                totalItems: [
                                    {
                                        column: 'IDnum',
                                        summaryType: 'count',
                                        displayFormat: "Total Created: {0}",
                                    },
                                   /* {
                                        column: 'Hours',
                                        valueFormat: '#0.00',
                                        summaryType: 'sum',
                                        displayFormat: "Hours: {0}",
                                    },*/
                                ]
                            },
                            /*-------*/
                            onToolbarPreparing: function (e) {
                                e.toolbarOptions.items.unshift({
                                    location: 'before',
                                    widget: 'dxButton',
                                    options: {
                                        icon: 'find',
                                        text: 'View',
                                        onClick: function () {
                                            const dataGrid = $('#Frequency1DataGrid').dxDataGrid('instance');
                                            const selectedRowsData = dataGrid.getSelectedRowsData();
                                            if (selectedRowsData.length > 0) {
                                                generatePayslip(selectedRowsData[0]);
                                            } else {
                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'No Preview',
                                                    text: "Select a record and then press Preview.",
                                                    timer: 3000,
                                                    showConfirmButton: false,
                                                });
                                            }
                                        },
                                        hint: 'Preview selected Payslip',
                                    },
                                });
                            },
                            onEditingStart: function (e) {
                                var selectedId = e.data.IDnum;
                                var selectedItem = Payslip_data.find(item => item.IDnum === selectedId);
                                if (selectedItem) {
                                    e.data.FirstName = selectedItem.FirstName;
                                    e.data.LastName = selectedItem.LastName;
                                }
                            },
                            onRowUpdated: function (data) {
                                var dataGrid = $("#Frequency1DataGrid").dxDataGrid("instance");
                                var dataSource = dataGrid.option("dataSource");

                                $.ajax({
                                    url: "./database/savePayroll2.php",
                                    method: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify(dataSource),
                                });
                                initializeDataGrid();
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Update',
                                    text: (employeeName + " update successful."),
                                    showConfirmButton: false,
                                    timer: 2000,
                                });
                            },
                            onRowInserted: function (data) {
                                var dataGrid = $("#Frequency1DataGrid").dxDataGrid("instance");
                                var dataSource = dataGrid.option("dataSource");
                                $.ajax({
                                    url: "./database/savePayroll2.php",
                                    method: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify(dataSource),
                                });
                                initializeDataGrid();
                                var employeeName = data.data.FirstName + ' ' + data.data.LastName;
                                DevExpress.ui.notify(employeeName + "Done", "success", 500);
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Added',
                                    text: (employeeName + " added successful."),
                                    showConfirmButton: false,
                                    timer: 2000,
                                });

                            },
                            onRowRemoved: function (data) {
                                var dataGrid = $("#Frequency1DataGrid").dxDataGrid("instance");
                                var dataSource = dataGrid.option("dataSource");
                                $.ajax({
                                    url: "./database/savePayroll2.php",
                                    method: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify(dataSource),
                                });
                                initializeDataGrid();
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Removed',
                                    text: ("Deleted successful."),
                                    showConfirmButton: false,
                                    timer: 2000,
                                });
                            },
                        });
                    },
                },
            ],
        });
    });
}


/*---Year to date--------------*/
function calculateYTD(Payslip_data) {
    var ytdPayByUserId = {};
    Payslip_data.sort(function (a, b) {
        return new Date(a.rundate) - new Date(b.rundate);
    });
    Payslip_data.forEach(function (record) {
        var id = record.IDnum;
        var date = record.rundate;
        var nis = record.calculatedNIS;
        var nht = record.calculatedNHT;
        var etax = record.calculatedEdTax;
        var paye = record.calculatedPAYE;

        if (!ytdPayByUserId[id]) {
            ytdPayByUserId[id] = {};
        }
        if (!ytdPayByUserId[id][date]) {
            ytdPayByUserId[id][date] = 0;
        }
        ytdPayByUserId[id][date] += nis;
        ytdPayByUserId[id][date] += nht;
        ytdPayByUserId[id][date] += etax;
        ytdPayByUserId[id][date] += paye;
    });
    return ytdPayByUserId;
}
var ytdPayByUserId = calculateYTD(Payslip_data);

/*----Preselect so1 date---*/
window.onload = function () {
    loadDataOnFocus();
    getCurrentMonthAndYear();
    //getS01FormData();
    //generateSO1();
    //getS02FormData();
    //generateSO2();
};


/*---PDF Export for all payslips-----*/
function setAlternatingRowsBackground(dataGrid, gridCell, pdfCell) {
    if (gridCell.rowType === 'data') {
        const rowIndex = dataGrid.getRowIndexByKey(gridCell.data.Product_ID);
        if (rowIndex % 2 === 0) {
            pdfCell.backgroundColor = '#efefef';
        }
    }
}

/*---Single payslip---------------*/
function generatePayslipTemplate(matchingRecord, EmployeeRecord) {

    const payslipTemplate = `
    <div class="payslipContent" style="width: 920px; padding: 0px 0; display: flex; flex-direction: column; position: relative; text-align: left;">

     <!-- Business Table -->
       <div style="margin: 0px 0px 0px 0px;">
         <table border="2" style="width: 100%; border-collapse: collapse; font-size: 14px;">
           <tr style="background-color: white; line-height: 2.5;">
             <td style="text-align: left; padding:0px 5px; width: 105px; font-weight: 600;">Payslip</td>
             <td style="text-align: center; padding:0px 5px; font-weight: 800; font-size:16px;">${Company_data[0].Company}</td>
           </tr>
         <tr style="width: 100%; border-collapse: collapse; font-size:15px; line-height: 2.2;">
             <td style="text-align: left;"></td>                  
             <td style="text-align: center; font-size:13px; font-weight: 500;">*** Pay Advice for (${new Date(matchingRecord.rundate).toLocaleDateString('en-US', 
             { year: 'numeric',month: 'short',day: 'numeric'})}) ***</td>
             </tr>
         </table>
     </div>

      <!-- Additional Table -->
     <div style="margin-top: 0px;">
     <table border="2" style="width: 100%; border-collapse: collapse; font-size: 14px;">
         <tr style="text-align:center;font-weight: 800; line-height: 2.2; padding:0px 5px; font-size:13px; background-color:lightgrey;">
          <td style="width: 105px; text-align:left; padding-left: 5px;padding-left: 5px;">EMPLOYEE #</td>
          <td style="width: 120px; text-align:left; padding-left: 5px;">${matchingRecord.IDnum} </td>
          <td style="width: 90px; text-align:left; padding-left: 5px;padding-left: 5px;">EARNINGS</td>
          <td style="">HOURS</td>
          <td style="">RATE</td>
          <td style="">AMOUNT</td>
          <td style="width: 80px;">TAXES</td>
          <td style="">AMOUNT</td>
          <td style="width: 80px;">YTD</td>
          <td style="">AMOUNT</td>
          </tr>

         <tr style="font-size: 14px; border-bottom:1px solid #eee; line-height:1.2;">
         <td style="text-align: left; font-weight: 800;background-color:white; padding-left: 5px;">DEPARTMENT</td>
         <td style="text-align: left; background-color:white; padding-left:5px;"> ${EmployeeRecord.Department}</td>
         <td style="padding-left: 3px;">Salary</td>
         <td style="padding-left: 3px;"> ${matchingRecord.Hours}</td>
         <td style="padding-left: 3px;"> $${EmployeeRecord.PayRate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;"> $${matchingRecord.calculatedRegular.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;"> NIS</td>
         <td style="padding-left: 3px;"> $${matchingRecord.calculatedNIS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;">NIS</td>
         <td style="padding-left: 3px;"> $${matchingRecord.ytdNIS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         </tr>

         <tr style="font-size: 13px; line-height:2.2; border-bottom:1px solid #eee;">
         <td style="text-align: left; font-weight: 600;"></td>
         <td>:</td>
         <td style="padding-left: 3px;">Traveling</td>
         <td style="padding-left: 3px;">-</td>
         <td style="padding-left: 3px;">-</td>
         <td style="padding-left: 3px;"> $${matchingRecord.Travel.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;">NHT</td>
         <td style="padding-left: 3px;"> $${matchingRecord.calculatedNHT.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;">NHT</td>
         <td style="padding-left: 3px;"> $${matchingRecord.ytdNHT.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         </tr>

         <tr style="font-size: 13px; line-height:2.2; padding-left: 5px; border-bottom:1px solid #eee;">
         <td style="text-align: left; font-weight: 600; padding-left: 5px;">FIRST NAME</td>
         <td style="font-weight: 800; padding-left: 5px;"> ${EmployeeRecord.FirstName}</td>
         <td style="padding-left: 3px;">Incentive</td>
         <td style="padding-left: 3px;">-</td>
         <td style="padding-left: 3px;">-</td>
         <td style="padding-left: 3px;"> $${matchingRecord.Incentive.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;">ETAX</td>
         <td style="padding-left: 3px;"> $${matchingRecord.calculatedEdTax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;">ETAX</td>
         <td style="padding-left: 3px;"> $${matchingRecord.ytdETAX.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         </tr>

         <tr style="font-size: 13px; line-height:2.2; border-bottom:1px solid #eee;">
         <td style="text-align: left; font-weight: 600; padding-left: 5px;">LAST NAME</td>
         <td style="font-weight: 800; padding-left: 5px;"> ${EmployeeRecord.LastName}</td>
         <td style="padding-left: 3px;">Allowance</td>
         <td style="padding-left: 3px;">-</td>
         <td style="padding-left: 3px;">-</td>
         <td style="padding-left: 3px;"> $${matchingRecord.Allowance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;">PAYE</td>
         <td style="padding-left: 3px;"> $${matchingRecord.calculatedPAYE.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;">PAYE</td>
         <td style="padding-left: 3px;"> $${matchingRecord.ytdPAYE.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         </tr>

         <tr style="font-size: 13px; line-height:2.2; border-bottom:1px solid #eee;">
         <td style="text-align: left; font-weight: 600; padding-left: 5px;">JOB TITLE</td>
         <td style="text-align: left; padding-left: 3px;"> ${EmployeeRecord.Position}</td>
         <td style="padding-left: 3px;">Over Time</td>
         <td style="padding-left: 3px;"> ${matchingRecord.OT_Hours}</td>
         <td style="padding-left: 3px;"> ${matchingRecord.OT_Rate}x</td>
         <td style="padding-left: 3px;"> $${matchingRecord.calculatedOverTime.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="padding-left: 3px;"></td>
         <td style="padding-left: 3px;"></td>
         <td style="padding-left: 3px;"></td>
         <td></td>
         </tr>

         <tr style="font-size: 13px; line-height:2.2; border-bottom:1px solid #eee;">
         <td style="text-align: left; font-weight: 600; padding-left: 5px;">TAX REF #</td>
         <td style="text-align: left; padding-left: 5px;"> ${EmployeeRecord.TRN}</td>
         <td style="padding-left: 3px;">Holiday</td>
         <td style="padding-left: 3px;"> ${matchingRecord.H_Hours}</td>
         <td style="padding-left: 3px;"> ${matchingRecord.H_Rate}x</td>
         <td style="padding-left: 3px;"> $${matchingRecord.calculatedHoliday.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         </tr>

         <tr style="font-size: 13px; line-height:2.2;">
         <td style="text-align: left; font-weight: 600; padding-left: 5px;">NIS REF #</td>
         <td style="text-align: left; padding-left: 5px;"> ${EmployeeRecord.NIS}</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         </tr>

         <tr style="font-size: 13px; line-height:2.2;">
         <td></td>
         <td></td>
         <td style="text-align: center; font-weight: 600;">**GrossPay**</td>
         <td></td>
         <td></td>
         <td style="background-color:#eeeeee; padding-left: 3px;"> $${matchingRecord.calculatedGrossPay.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="text-align: center; font-weight: 600;">**Taxes**</td>
         <td style="background-color:#eeeeee; padding-left: 3px;"> $${matchingRecord.calculatedDeductions.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         <td style="text-align: center; font-weight: 600;">**NetPay**</td>
         <td style="background-color:#eeeeee; padding-left: 3px;"> $${matchingRecord.calculatedNetPay.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
         </tr>

         </table>
         </div>          

     </div>
 </div>
`;
    return payslipTemplate;
}

function generatePayslip(selectedEmployee, companyName) {

    const matchingEmployee = Employees_data.find(record => record.IDnum === selectedEmployee.IDnum);
    const matchingPayslip = Payslip_data.find(record => record.IDnum === selectedEmployee.IDnum && record.__KEY__ === selectedEmployee.__KEY__);

    if (!matchingEmployee) {
        console.error("Matching record not found in Employees_data.");
        return;
    }
    if (!matchingPayslip) {
        console.error("Matching record not found in Payslip_data.");
        return;
    }

    const payslipTemplate = generatePayslipTemplate(selectedEmployee, matchingEmployee, matchingPayslip);

    DevExpress.ui.dialog.custom({
        title: 'Single Payslip Preview',
        messageHtml: payslipTemplate,
        buttons: [{
            text: "Print",
            icon: "print",
            onClick: function () {
                printPayslips(document.querySelectorAll('.payslipContent'));
                return false;
            }
        }, {
            text: "Download",
            icon: "download",
            onClick: function () {
                downloadPDF2(document.querySelectorAll('.payslipContent'), 'payslips.pdf');
                Swal.fire({
                    icon: 'success',
                    title: 'Downloading successful',
                    text: 'Your Payslip is now ready ^_^',
                    timer: 4000,
                    showConfirmButton: false, // Hide the "OK" button
                    position: 'center', // Adjust the position of the alert
                    toast: true, // Display as a toast notification
                    timerProgressBar: true, // Show a progress bar for the timer
                    onOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                    onClose: () => {
                        // Code to execute when the alert is closed
                    },
                }).then((result) => {
                    // Code to execute after the alert is closed (if needed)
                });
                return false;
            }
        }, {
            text: "Close",
            icon: "close",
            onClick: function () {
                return true;
            }
        }]
    }).show();

}

/*-----Download payslips-------*/
function downloadPDF2(contentArray, fileName) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let y = 5;
    let payslipsAdded = 0;

    function addPayslipToPDF(canvas, payslipHeight) {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 5, y, 200, payslipHeight);
        y += payslipHeight + 0;
        payslipsAdded++;

        if (payslipsAdded === 4) {
            pdf.addPage();
            y = 5;
            payslipsAdded = 0;
        }
    }

    contentArray.forEach((payslipContainer, i) => {
        html2canvas(payslipContainer, {
            scale: 2,
            backgroundColor: false,
            logging: false
        }).then(canvas => {
            const payslipHeight = canvas.height * (190 / canvas.width);
            addPayslipToPDF(canvas, payslipHeight);

            if (i === contentArray.length - 1) {
                pdf.save(fileName);
            }
        });
    });
}

/*-----Print-------------*/
function printPayslips(contentArray) {
    contentArray.forEach((payslipContainer, i) => {
        html2canvas(payslipContainer, {
            scale: 2,
            width: payslipContainer.offsetWidth,
            height: payslipContainer.offsetHeight,
            backgroundColor: false,
            logging: false
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const windowContent = '<img src="' + imgData + '" style="width:100%;">';
            const printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.write('<html><head><title>Payslip</title></head><body>');
            printWindow.document.write(windowContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500); // Delay to ensure the image is loaded before printing
        });
    });
}

/*----Set Frequency-----*/
function setFrequencyFromOverride(data) {
    if (data.override === '' || data.override === null || typeof data.override === 'undefined') {
        var selectedId = data.IDnum;
        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
        var Frequency = selectedItem ? selectedItem.Frequency : null;
        data.Frequency = Frequency;
        return Frequency;
    } else {
        return data.override;
    }
}
// Define a function to fetch the updated data and set it as the data source
function reloadDataSource() {
    $.ajax({
        url: './database/payslips.json',
        dataType: 'json',
        success: function (data) {
            Payslip_data = data;
            var dataGrid = $('#Frequency1DataGrid').dxDataGrid('instance');
            DevExpress.ui.notify("Updated successfully", "success", 500);
            dataGrid.option('dataSource', Payslip_data);
        },
        error: function (error) {
            DevExpress.ui.notify("Error fetching Payslip data:", "error", 500);
        }
    });
}

/*---Date functions------*/
function getPayPeriod() {
    const currentDate = new Date();
    //const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 25);
    //return `${formatDate(firstDayOfMonth)} - ${formatDate(endOfMonth)}`;
    return `${formatDate(endOfMonth)}`;
}

function formatDate(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function formatMonth(date) {
    return (date.getMonth() + 1).toString().padStart(2, '0');
}

function formatYear(date) {
    return date.getFullYear();
}


function insertHyphens(str, interval) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        if (i > 0 && i % interval === 0) {
            result += '-';
        }
        result += str[i];
    }
    return result;
}