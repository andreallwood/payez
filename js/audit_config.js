window.jsPDF = window.jspdf.jsPDF;

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
var selectedTheme=0;
var themeCode=0;

const Frequency0 = 'Payroll Audit';

var payCount = 0;
var addPensionIO = 0;
var treshold = 0;



function loadDataOnFocus() {
    $(function () {
        loadData('employees.json', 'Employee', Employees_data, function () {
            loadData('payslips.json', 'Payslips', Payslip_data, function () {
                loadData('payClass.json', 'PayClass', PayClass_data, function () {
                    loadData('payFrequency.json', 'Frequencies', PayFrequency_data, function () {
                        loadData('locations.json', 'Locations', Locations_data, function () {
                            loadData('company.json', 'Company', Company_data, function () {
                                loadData('taxConfig.json', 'TaxConfig', taxConfig_data, function () {
                                        loadData('taxCategory.json', 'TaxCategories', selectedTheme, function () {
                                           initializeDataGrid();
                                           var ytdPayByUserId = calculateYTD(Payslip_data);
                                        combinedData = Employees_data.concat(Bank_data, AccountType_data, Jobs_data, PayFrequency_data, Departments_data, Titles_data, Company_data, PayClass_data);
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

function initializeDataGrid() {
    $(() => {
        $('#tabPanel').dxTabPanel({
            deferRendering: false,
            dataSource: [
                {
                    title: Frequency0,
                    template() {
                        return $("<div id='Frequency0DataGrid'>").dxDataGrid({
                            dataSource: Payslip_data,
                            cache: "no-cache",
                            width: '100%',
                            height: '100vh',
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
                                mode: 'multiple',
                                deferred: false,
                                allowSelectAll: true
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
                            columns: [
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
                                        const currentRundate = data.formData.rundate; 
                                        container.append(`Current Run Date: ${currentRundate}`);
                                        return container;
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
                                    dataField: 'Initial',
                                    caption: 'MI',
                                    editorType: 'dxReadOnlyTextBox',
                                    width: 70,
                                    //visible: true,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? selectedItem.Initial : null;
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
                                    dataField: 'TRN',
                                    caption: 'Employee TRN',
                                    editorType: 'dxReadOnlyTextBox',
                                    alignment: 'left',
                                    //width: 100,
                                   visible: true,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? insertHyphens(selectedItem.TRN, 3) : null;
                                    },
                                },
                                {
                                    dataField: 'NIS',
                                    caption: 'Employee NIS',
                                    editorType: 'dxReadOnlyTextBox',
                                    alignment: 'left',
                                    width: 80,
                                    visible: true,
                                    calculateCellValue: function (data) {
                                        var selectedId = data.IDnum;
                                        var selectedItem = Employees_data.find(item => item.IDnum === selectedId);
                                        return selectedItem ? selectedItem.NIS.toUpperCase() : null;
                                    }
                                },
                        
                                {
                                    dataField: 'calculatedGrossPay',
                                    caption: 'Gross Emoluments',
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
                                        return calculatedGrossPay.toFixed(2);
                                    },
                                },
                

                                {
                                    dataField: 'calculatedNHT',
                                    caption: 'Total NHT',
                                    dataType: 'number',
                                    alignment: 'left',
                                     //visible: false,
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculatedNHT2 = data.calculatedNHT2 || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedNHT === undefined || data.calculatedNHT === null) {
                                            data.calculatedNHT = 0;
                                        } else {
                                            var selectedId = data.taxTypeNHT;
                                            var selectedItem = taxCategory_data.find(item => item.taxTypeNHT === selectedId);
                                            var nht_rate = selectedItem ? selectedItem.NHT : 0;

                                            var calculatedNHT = ((nht_rate / 100) * (calculatedGrossPay - calculateTravel)+calculatedNHT2);

                                            data.calculatedNHT = (calculatedNHT2);
                                            return calculatedNHT.toFixed(2);
                                        }
                                    }
                                },
                                                                           
                                {
                                    dataField: 'calculatedNIS',
                                    caption: 'Total NIS',
                                    dataType: 'number',
                                    alignment: 'left',
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculatedNIS2 = data.calculatedNIS2 || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedNIS === undefined || data.calculatedNIS === null) {
                                            data.calculatedNIS = 0;
                                        } else {
                                            var selectedId = data.taxTypeNIS;
                                            var selectedItem = taxCategory_data.find(item => item.taxTypeNIS === selectedId);
                                            var nis_rate = selectedItem ? selectedItem.NIS : 0;
                                        }
                                        if (calculatedGrossPay > 416666.67) {
                                            var calculatedNIS = ((nis_rate / 100) * 416666.67+calculatedNIS2);
                                            data.calculatedNIS = calculatedNIS;
                                            return (calculatedNIS +calculatedNIS2).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        } else {
                                            var calculatedNIS = ((nis_rate / 100) * (calculatedGrossPay - calculateTravel)+calculatedNIS2);
                                            data.calculatedNIS = calculatedNIS;
                                            return (calculatedNIS+calculatedNIS2).toFixed(2);
                                        }
                                    }
                                },
    
                                {
                                    dataField: 'calculatedEdTax',
                                    caption: 'Total EdTax',
                                    dataType: 'number',
                                    alignment: 'left',
                                     visible: true,
                                    calculateCellValue: function (data) {
                                        var calculatedGrossPay = data.calculatedGrossPay || 0;
                                        var calculatedEdTax2 = data.calculatedEdTax2 || 0;
                                        var calculatedNIS = data.calculatedNIS || 0;
                                        var calculateTravel = data.Travel;
                                        if (data.calculatedEdTax === undefined || data.calculatedEdTax === null) {
                                            data.calculatedEdTax = 0;
                                        } else {
                                            var selectedId = data.taxTypeEdTax;
                                            var selectedItem = taxCategory_data.find(item => item.taxTypeEdTax === selectedId);
                                            var edtax_rate = selectedItem ? selectedItem.ETAX : 0;
                                            var calculatedEdTax = ((edtax_rate / 100) * ((calculatedGrossPay - calculateTravel) - calculatedNIS)+calculatedEdTax2);
                                            data.calculatedEdTax = calculatedEdTax;
                                            return (calculatedEdTax + calculatedEdTax2).toFixed(2);
                                        }
                                    }
                                },
                  

                                {
                                    dataField: 'calculatedPAYE',
                                    caption: 'PAYE Income Tax',
                                    dataType: 'number',
                                    alignment: 'left',
                                    visible: true,
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
                                            return calculatedPAYE;
                                        } else {
                                            if (chargeable_income > (taxFreeThreshold / 12) && chargeable_income < (taxMaxThreshold / 12)) {
                                                var calculatedPAYE = (chargeable_income - (taxFreeThreshold / 12)) * regularTaxRate / 100;
                                                data.calculatedPAYE = calculatedPAYE;
                                                return calculatedPAYE.toFixed(2);
                                            } else {
                                                if (chargeable_income > (taxMaxThreshold / 12)) {
                                                    var set_paye1 = ((chargeable_income - (taxMaxThreshold / 12)) * (maxTaxRate / 100));
                                                    var set_paye2 = (((taxMaxThreshold / 12) - (taxFreeThreshold / 12)) * (regularTaxRate / 100));
                                                    var calculatedPAYE = (set_paye1 + set_paye2);
                                                    data.calculatedPAYE = calculatedPAYE;
                                                    return calculatedPAYE.toFixed(2);
                                                }
                                            }
                                        }
                                    }
                                }
                            ],
                            summary: {
                                totalItems: [
                                    {
                                        column: 'IDnum',
                                        summaryType: 'count',
                                        displayFormat: " ",
                                    },
                                    {
                                        column: 'FirstName',
                                        summaryType: 'count',
                                        displayFormat: " ",
                                    },
                                    {
                                        column: 'Initial',
                                        summaryType: 'count',
                                        displayFormat: " ",
                                    },
                                    {
                                        column: 'LastName',
                                        summaryType: 'count',
                                        displayFormat: " ",
                                    },
                                    {
                                        column: 'NIS',
                                        summaryType: 'count',
                                        displayFormat: " ",
                                    },
                                    {
                                        column: 'TRN',
                                        summaryType: 'count',
                                        displayFormat: " ",
                                    },
                                    {
                                        column: 'rundate',
                                        summaryType: 'count',
                                        displayFormat: "Total records: {0}",
                                    },
                                    {
                                        column: 'calculatedGrossPay',
                                        dataType: 'number',
                                        valueFormat: '#,##0.00',
                                        summaryType: 'sum',
                                        displayFormat: "Total Gross ${0}",
                                    },
                                    
                                    {
                                        column: 'calculatedNHT',
                                        dataType: 'number',
                                        valueFormat: '#,##0.00',
                                        summaryType: 'sum',
                                        displayFormat: "Total NHT ${0}",
                                    },
                                    {
                                        column: 'calculatedNIS',
                                        dataType: 'number',
                                        valueFormat: '#,##0.00',
                                        summaryType: 'sum',
                                        displayFormat: "Total NIS ${0}",
                                    },
                                
                                    {
                                        column: 'calculatedEdTax',
                                        dataType: 'number',
                                        valueFormat: '#,##0.00',
                                        summaryType: 'sum',
                                        displayFormat: "Total EdTAX ${0}",
                                    },
                                    {
                                        column: 'calculatedPAYE',
                                        dataType: 'number',
                                        valueFormat: '#,##0.00',
                                        summaryType: 'sum',
                                        displayFormat: "Total Income Tax ${0}",
                                     
                                    },
                                ]
                            },
                            headerFilter: {
                                visible: true,
                            },
                            /*-------*/
                            onExporting(e) {
                                const workbook = new ExcelJS.Workbook();
                                const worksheet = workbook.addWorksheet('PaySlip');
                                DevExpress.excelExporter.exportDataGrid({
                                    component: e.component,
                                    worksheet,
                                    autoFilterEnabled: true,
                                }).then(() => {
                                    workbook.xlsx.writeBuffer().then((buffer) => {
                                        saveAs(new Blob([buffer], {
                                            type: 'application/octet-stream'
                                        }), 'PaySlip.xlsx');
                                    });
                                });
                            },
                            onToolbarPreparing: function (e) {
                                e.toolbarOptions.items.unshift({
                                    location: 'after',
                                    widget: 'dxDateBox',
                                    options: {
                                        type: 'date',
                                        placeholder: 'Select run date.',
                                        onValueChanged: function (data) {
                                            var selectedDate = data.value;
                                            selectedMonth = selectedDate.getMonth() + 1;
                                            selectedYear = selectedDate.getFullYear();
                                            //console.log("Selected Date:", selectedMonth, selectedYear);
                                            var selectedDateInISO8601 = selectedDate.toISOString();
                                            filterDate = selectedDateInISO8601;
                                        }
                                    }
                                });
                                     
                                e.toolbarOptions.items.unshift({
                                    location: 'before',
                                    widget: 'dxButton',
                                    options: {
                                        icon: 'export',
                                        text: 'Export',
                                        elementAttr: {
                                            class: 'tax-button-class', 
                                        },
                                        onClick: function () {
                                            const workbook = new ExcelJS.Workbook();
                                            const worksheet = workbook.addWorksheet('Employees');
                                            const selectedRows = e.component.getSelectedRowsData();
                                            if (selectedRows.length > 0) {
                                                DevExpress.excelExporter.exportDataGrid({
                                                    component: e.component,
                                                    worksheet,
                                                    autoFilterEnabled: true,
                                                    selectedRowsOnly: true,
                                                }).then(() => {
                                                    workbook.xlsx.writeBuffer().then((buffer) => {
                                                        saveAs(new Blob([buffer], {
                                                            type: 'application/octet-stream'
                                                        }), 'Employees Report.xlsx');
                                                    });
                                                });
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Export',
                                                    text: "Export successful.",
                                                    showConfirmButton: false,
                                                    timer: 1000,
                                                });
                                            } else {
                                                Swal.fire({
                                                    icon: 'info',
                                                    title: 'Export',
                                                    text: "Select the employee's data to export.",
                                                    showConfirmButton: false,
                                                    timer: 2000,
                                                });
                                            }
                                        },
                                        hint: 'Export to Excel',
                                    }
                                });                                                     
                                e.toolbarOptions.items.unshift({
                                    location: 'before',
                                    widget: 'dxButton',
                                    options: {
                                        icon: 'find',
                                        text: 'SOA',
                                        elementAttr: {
                                            class: 'tax-button-class', 
                                        },
                                        onClick: function () {
                                            const dataGrid = $('#Frequency0DataGrid').dxDataGrid('instance');
                                            const selectedRowsData = dataGrid.getSelectedRowsData();
                                            if (selectedRowsData.length > 0) {
                                                generatePayslip(selectedRowsData[0]);
                                            } else {
                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'No Preview',
                                                    text: "Select the payslip and then press Preview.",
                                                    timer: 1200,
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
                        });
                    },
                } 
          ],
        });
    });
}

window.onload = function () {
    loadDataOnFocus();
};

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
function setAlternatingRowsBackground(dataGrid, gridCell, pdfCell) {
    if (gridCell.rowType === 'data') {
        const rowIndex = dataGrid.getRowIndexByKey(gridCell.data.Product_ID);
        if (rowIndex % 2 === 0) {
            pdfCell.backgroundColor = '#efefef';
        }
    }
}
function generatePayslipTemplate(matchingRecord, EmployeeRecord) {
    const payslipTemplate = `
           <div class="payslipContent" style="width: 1350px; padding: 0px 0; display: flex; flex-direction: column; position: relative; text-align: left;">
             <!-- Additional Table -->
            <div style="margin-top: 0px;">
            <table border="2" style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr style="text-align:center;font-weight: 800; line-height: 1.5; padding:10px 5px; margin-top:0; font-size:13px; background-color:#FFFF99;">
                 <td style="width: 105px; text-align:center;">Last name</td>
                 <td style="width: 120px; text-align:center;">First name </td>
                 <td style="width: 50px; text-align:center;">Middle Initial</td>
                 <td style="width: 80px;">Employee TRN</td>
                 <td style="width: 80px;">Employee NIS</td>
                 <td style="width: 150px;">Gross Emoluments Received in Cash</td>
                 <td style="width: 150px;">Gross Emoluments Received in Kind</td>
                 <td style="width: 150px;  padding:10px 0px;">Superannuation / Pension, Agreed Expenses, Employees Share Ownership Plan</td>
                 <td style="width: 150px;  padding:10px 5px;">Number of weekly NIS and NHT Contributions for the month</td>
                 <td style="width: 150px;  padding:10px 5px;">Total NIS</td>
                 <td style="width: 150px;  padding:10px 5px;">Total NHT</td>
                 <td style="width: 160px;  padding:10px 5px;">Total Education Tax</td>
                 <td style="width: 160px;  padding:10px 5px;">Total PAYE Income Tax</td>
                 </tr>

                <tr style="font-size: 14px; border-bottom:1px solid #eee; line-height:1.2;">
                <td style="text-align: left; font-weight: 400;background-color:white; padding-left: 5px;">${EmployeeRecord.LastName}</td>
                <td style="text-align: left; background-color:white; padding-left:5px;"> ${EmployeeRecord.FirstName}</td>
                <td style="padding-left: 3px;"> ${EmployeeRecord.Initial}</td>
                <td style="padding-left: 3px;"> ${EmployeeRecord.TRN}</td>
                <td style="padding-left: 3px;"> ${EmployeeRecord.NIS}</td>
                <td style="padding-left: 3px;"> $${matchingRecord.calculatedRegular.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                <td style="padding-left: 3px;"> $0.00</td>
                <td style="padding-left: 3px;"> $${matchingRecord.calculatedNIS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                <td style="padding-left: 3px;"> $0.00</td>
                <td style="padding-left: 3px;"> $${matchingRecord.calculatedNIS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                 <td style="padding-left: 3px;"> $${matchingRecord.calculatedNHT.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                 <td style="padding-left: 3px;"> $${matchingRecord.calculatedEdTax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                  <td style="padding-left: 3px;"> $${matchingRecord.calculatedPAYE.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
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
        title: 'SOA Preview',
        messageHtml: payslipTemplate,
        buttons: [{
            text: "Close",
            icon: "close",
            onClick: function () {
                return true;
            }
        }]
    }).show();

}
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




let payrollData = [];
let companyData = {};
let selectedMonth = null;
let selectedYear = null;

function fetchAndMergeData() {
    return Promise.all([
        fetch('../database/employees.json').then(response => response.json()),
        fetch('../database/payslips.json').then(response => response.json()),
        fetch('../database/company.json').then(response => response.json())
    ])
    .then(([employeesData, payslipsData, companyJson]) => {
        payrollData = payslipsData.map(payslip => {
            const matchingEmployee = employeesData.find(employee => employee.IDnum === payslip.IDnum);
            return {
                ...payslip,
                fullName: matchingEmployee ? matchingEmployee.fullName : 'Unknown',
                Department: matchingEmployee ? matchingEmployee.Department : 'Unknown'
            };
        });
        companyData = companyJson.data[0]; // Access the first (and only) company in the array
        console.log('Merged payroll data:', payrollData);
        console.log('Company data:', companyData);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
}

function calculateTotals(data) {
    return data.reduce((acc, curr) => {
        acc.gross += curr.calculatedGrossPay || 0;
        acc.nis += curr.calculatedNIS || 0;
        acc.taxable += (curr.calculatedGrossPay - (curr.Travel + curr.Allowance)) || 0;
        acc.incomeTax += curr.calculatedPAYE || 0;
        acc.nht += curr.calculatedNHT || 0;
        acc.edTax += curr.calculatedEdTax || 0;
        acc.netPay += curr.calculatedNetPay || 0;
        return acc;
    }, {
        gross: 0, nis: 0, taxable: 0, incomeTax: 0, nht: 0, edTax: 0, netPay: 0
    });
}

function calculateTotals2(data) {
    return data.reduce((acc, curr, index) => {
        const grossPay = parseFloat(curr.calculatedGrossPay);
        if (isNaN(grossPay)) {
            console.error(`Invalid grossPay for employee at index ${index}:`, curr);
            return acc; // Skip this employee
        }

        const heartContribution = grossPay * 0.03; // 3% of gross pay

        acc.grossPay += grossPay;
        acc.employeeNIS += parseFloat(curr.calculatedNIS) || 0;
        acc.employerNIS += parseFloat(curr.calculatedNIS2) || 0;
        acc.totalNIS += (parseFloat(curr.calculatedNIS) || 0) + (parseFloat(curr.calculatedNIS2) || 0);
        acc.heart += heartContribution;
        acc.employeeNHT += parseFloat(curr.calculatedNHT) || 0;
        acc.employerNHT += parseFloat(curr.calculatedNHT2) || 0;
        acc.totalNHT += (parseFloat(curr.calculatedNHT) || 0) + (parseFloat(curr.calculatedNHT2) || 0);
        acc.employeeEdTax += parseFloat(curr.calculatedEdTax) || 0;
        acc.employerEdTax += parseFloat(curr.calculatedEdTax2) || 0;
        acc.totalEdTax += (parseFloat(curr.calculatedEdTax) || 0) + (parseFloat(curr.calculatedEdTax2) || 0);
        return acc;
    }, {
        grossPay: 0,
        employeeNIS: 0,
        employerNIS: 0,
        totalNIS: 0,
        heart: 0,
        employeeNHT: 0,
        employerNHT: 0,
        totalNHT: 0,
        employeeEdTax: 0,
        employerEdTax: 0,
        totalEdTax: 0
    });
}

function generatePayrollTemplate(date, company, address, data) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    const totals = calculateTotals(data);

    const payrollRows = data.map(employee => `
        <tr>
            <td class="left-align">${employee.fullName}</td>
            <td>${employee.Department}</td>
            <td>${formatCurrency(employee.calculatedGrossPay)}</td>
            <td>${formatCurrency(employee.calculatedNIS)}</td>
            <td>${formatCurrency(employee.calculatedGrossPay - (employee.Travel + employee.Allowance))}</td>
            <td>${formatCurrency(employee.calculatedPAYE)}</td>
            <td>${formatCurrency(employee.calculatedNHT)}</td>
            <td>${formatCurrency(employee.calculatedEdTax)}</td>
            <td>${formatCurrency(employee.calculatedNetPay)}</td>
        </tr>
    `).join('');

    const totalsRow = `
        <tr>
            <th class="left-align">Total</th>
            <td></td>
            ${Object.values(totals).map(value => `<td style="font-weight:800">${formatCurrency(value)}</td>`).join('')}
        </tr>
    `;

    return `
        <div>
            <table id="payrollTable">
                <tbody>
                    <tr class="full-width-row">
                        <td colspan="9" class="header-row">
                            <!--<span class="date">Run Date: ${formattedDate}</span>-->
                            <h2 style="font-size:18px; font-weight:800;">${company}</h2>
                            <p>${address}</p>
                        </td>
                    </tr>
                    <tr class="monthly-payroll-row">
                        <td colspan="9" class="header-row">
                            <h4 style="font-size:14px; font-weight:800;">Monthly Payroll</h4>
                        </td>
                    </tr>
                    <tr class="full-width-row calculation-summary-row">
                        <td colspan="9" class="header-row">
                            <h4 style="font-size:14px; font-weight:800;">CALCULATION SUMMARY</h4>
                        </td>
                    </tr>
                    <tr>
                        <th class="left-align">Employee</th>
                        <th>Department</th>
                        <th>Gross</th>
                        <th>NIS</th>
                        <th>Taxable</th>
                        <th>Income Tax</th>
                        <th>NHT</th>
                        <th>Ed. Tax</th>
                        <th>Net Pay</th>
                    </tr>
                    ${payrollRows}
                    ${totalsRow}
                </tbody>
            </table>
        </div>
    `;
}

function generatePayrollTemplate2(date, company, address, data) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long'
    });
    const totals = calculateTotals2(data);

    const payrollRows = data.map((employee, index) => {
        const grossPay = parseFloat(employee.calculatedGrossPay);
        if (isNaN(grossPay)) {
            console.error(`Invalid grossPay for employee at index ${index}:`, employee);
            return ''; // Skip this employee in the output
        }

        const heartContribution = grossPay * 0.03; // 3% of gross pay

        return `
        <tr>
            <td class="left-align">${employee.fullName}</td>
            <td>${formatCurrency(grossPay)}</td>
            <td>${formatCurrency(parseFloat(employee.calculatedNIS) || 0)}</td>
            <td>${formatCurrency(parseFloat(employee.calculatedNIS2) || 0)}</td>
            <td>${formatCurrency((parseFloat(employee.calculatedNIS) || 0) + (parseFloat(employee.calculatedNIS2) || 0))}</td>
            <td>${formatCurrency(heartContribution)}</td>
            <td>${formatCurrency(parseFloat(employee.calculatedNHT) || 0)}</td>
            <td>${formatCurrency(parseFloat(employee.calculatedNHT2) || 0)}</td>
            <td>${formatCurrency((parseFloat(employee.calculatedNHT) || 0) + (parseFloat(employee.calculatedNHT2) || 0))}</td>
            <td>${formatCurrency(parseFloat(employee.calculatedEdTax) || 0)}</td>
            <td>${formatCurrency(parseFloat(employee.calculatedEdTax2) || 0)}</td>
            <td>${formatCurrency((parseFloat(employee.calculatedEdTax) || 0) + (parseFloat(employee.calculatedEdTax2) || 0))}</td>
        </tr>
    `;
    }).join('');

    const totalsRow = `
        <tr>
            <th class="left-align">Total</th>
            <td style="font-weight:800">${formatCurrency(totals.grossPay)}</td>
            <td style="font-weight:800">${formatCurrency(totals.employeeNIS)}</td>
            <td style="font-weight:800">${formatCurrency(totals.employerNIS)}</td>
            <td style="font-weight:800">${formatCurrency(totals.totalNIS)}</td>
            <td style="font-weight:800">${formatCurrency(totals.heart)}</td>
            <td style="font-weight:800">${formatCurrency(totals.employeeNHT)}</td>
            <td style="font-weight:800">${formatCurrency(totals.employerNHT)}</td>
            <td style="font-weight:800">${formatCurrency(totals.totalNHT)}</td>
            <td style="font-weight:800">${formatCurrency(totals.employeeEdTax)}</td>
            <td style="font-weight:800">${formatCurrency(totals.employerEdTax)}</td>
            <td style="font-weight:800">${formatCurrency(totals.totalEdTax)}</td>
        </tr>
    `;

    return `
        <div>
            <table>
                <tbody>
                    <tr>
                        <td colspan="14" class="header-row">
                            <h2 style="font-size:18px; font-weight:800;">${company}</h2>
                            <p>${address}</p>
                        </td>
                    </tr>
                    <tr class="full-width-row calculation-summary-row calculation-summary-row-note" style="border-bottom:1px solid lightgrey;">
                        <td colspan="14" class="header-row"><br>
                            <h4 style="font-size:14px; font-weight:800;">MONTHLY STATUTORY DEDUCTIONS FOR ${formattedDate}</h4>
                        </td>
                    </tr>
                    <tr class="full-width-row calculation-summary-row">
                        <td colspan="2" class="header-row" style="text-align:left;"></td>
                        <td colspan="3" class="header-row" style="text-align:center; border-bottom:2px solid grey;"><br>
                            <h4 style="font-size:14px; font-weight:800;">NATIONAL INSURANCE</h4>
                        </td>
                        <td colspan="1" class="header-row" style="text-align:left;"></td>
                        <td colspan="3" class="header-row" style="text-align:center; border-bottom:2px solid grey;"><br>
                            <h4 style="font-size:14px; font-weight:800;">NATIONAL HOUSING TRUST</h4>
                        </td>
                        <td colspan="3" class="header-row" style="text-align:center; border-bottom:2px solid grey;"><br>
                            <h4 style="font-size:14px; font-weight:800;">EDUCATION TAX</h4>
                        </td>
                    </tr>
                    <tr>
                        <th class="left-align">Name</th>
                        <th>Gross Pay</th>
                        <th>Employee NIS</th>
                        <th>Employer NIS</th>
                        <th>Total</th>
                        <th>Heart</th>
                        <th>Employee NHT</th>
                        <th>Employer NHT</th>
                        <th>Total</th>
                        <th>Employee EdTax</th>
                        <th>Employer EdTax</th>
                        <th>Total</th>
                    </tr>
                    ${payrollRows}
                    ${totalsRow}
                </tbody>
            </table>
        </div>
    `;
}

function filterAndShowData() {
    if (!selectedMonth || !selectedYear) {
        alert('Please select a valid date.');
        return;
    }

    const filteredData = payrollData.filter(payslip => {
        const payslipDate = new Date(payslip.rundate);
        return payslipDate.getMonth() === selectedMonth - 1 && payslipDate.getFullYear() === selectedYear;
    });

    if (filteredData.length === 0) {
        alert(`No payroll data available for ${selectedMonth}/${selectedYear}.`);
        return;
    }

    const payrollTemplate = generatePayrollTemplate(
        `${selectedYear}-${selectedMonth}-01`,
        companyData.Company,
        `${companyData.Address}, ${companyData.Parish}`,
        filteredData
    );

    showPayrollPopup(payrollTemplate, 'payrollPopup');
}



function showPayrollPopup2() {
    if (!selectedMonth || !selectedYear) {
        DevExpress.ui.notify('Please select a valid date.', 'error', 3000);
        return;
    }

    const filteredData = payrollData.filter(payslip => {
        const payslipDate = new Date(payslip.rundate);
        return payslipDate.getMonth() === selectedMonth - 1 && payslipDate.getFullYear() === selectedYear;
    });

    if (filteredData.length === 0) {
        DevExpress.ui.notify(`No payroll data available for ${selectedMonth}/${selectedYear}.`, 'warning', 3000);
        return;
    }

    const payrollTemplate = generatePayrollTemplate2(
        `${selectedYear}-${selectedMonth}-01`,
        companyData.Company,
        `${companyData.Address}, ${companyData.Parish}`,
        filteredData
    );

    const popup = $('<div>').appendTo(document.body);

    popup.dxPopup({
        contentTemplate: () => $('<div>').append(payrollTemplate),
        width: '1080px',
        height: '60%',
        showTitle: true,
        title: `Statutory Deductions for ${selectedMonth}/${selectedYear}`,
        visible: true,
        dragEnabled: false,
        closeOnOutsideClick: true,
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Print',
                onClick: () => {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);

                    iframe.contentDocument.write(`
                         <html>
                            <head>
                                <title>.</title>
                                <style>
                                    body { 
                                        font-family: Arial, sans-serif; 
                                        margin: 0;
                                        padding: 0;
                                    }
                                    .content-wrapper {
                                        width: 100%;
                                        display: flex;
                                        justify-content: flex-end;
                                    }
                                    .content {
                                        padding:0px;
                                        margin:0px;
                                        width: 100%;
                                        min-width: 80%;
                                        max-width: 100%;
                                    }
                                    table { 
                                        border-collapse: collapse; 
                                        width: 100%; 
                                    }
                                    th, td { 
                                        border: 1px solid #eee; 
                                        padding: 5px; 
                                        text-align: center; 
                                    }
                                    th { background-color: #f2f2f2; }
                                    .company-info { margin-bottom: 0px; }
                                    .header-row { margin-top: 0px; margin-bottom: 5px; }
                                    .header-row h4 {
                                        margin: 0;
                                        padding: 5px 0;
                                    }
                                    .subheader-row {
                                        margin-top: 0;
                                        margin-bottom: 0;
                                    }
                                    .subheader-row h4 {
                                        margin: 0;
                                        padding: 2px 0;
                                    }
                                    @media print {
                                        body { -webkit-print-color-adjust: exact; }
                                        table { page-break-inside: auto; }
                                        tr { page-break-inside: avoid; page-break-after: auto; }
                                        thead { display: table-header-group; }
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="content-wrapper">
                                    <div class="content">
                                        ${payrollTemplate}
                                    </div>
                                </div>
                            </body>
                        </html>
                    `);
                    iframe.contentDocument.close();

                    const removePrintFrame = () => {
                        document.body.removeChild(iframe);
                    };

                    iframe.onload = () => {
                        iframe.contentWindow.onafterprint = removePrintFrame;
                        iframe.contentWindow.print();
                    };
                }
            }
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Close',
                onClick: () => {
                    popup.dxPopup('instance').hide();
                }
            }
        }]
    });
}

function showPayrollPopup(template, popupId) {
    $(`#${popupId}`).dxPopup({
        contentTemplate: () => $('<div>').append(template),
        width: 1080,
        height: 600,
        showTitle: true,
        visible: true,
        dragEnabled: true,
         title: `Calculation Summary for ${selectedMonth}/${selectedYear}`,
        closeOnOutsideClick: true,
        toolbarItems: [{
            widget: "dxButton",
            location: "after",
            toolbar: "bottom",
            options: {
                text: "Print",
                onClick: () => {
                    const printableArea = document.getElementById(`printableArea${popupId === 'payrollPopup2' ? '2' : ''}`);
                    printableArea.innerHTML = template;
                    printableArea.style.display = 'block';
                    window.print();
                    printableArea.style.display = 'none';
                }
            }
        }, {
            widget: "dxButton",
            location: "after",
            toolbar: "bottom",
            options: {
                text: "Close",
                onClick: () => $(`#${popupId}`).dxPopup("instance").hide()
            }
        }]
    }).dxPopup("instance").show();
}

$(function() {
    $("#dateBox").dxDateBox({
        type: 'date',
        placeholder: 'Select run date.',
        onValueChanged: function (data) {
            const selectedDate = new Date(data.value);
            selectedMonth = selectedDate.getMonth() + 1;
            selectedYear = selectedDate.getFullYear();
            console.log("Selected Date:", selectedMonth, selectedYear);
        }
    });

    $("#showPayrollBtn").dxButton({
        text: "Show Payroll",
        onClick: filterAndShowData
    });

    $("#showPayrollBtn2").dxButton({
        text: "Show Statutory Deductions",
        onClick: showPayrollPopup2
    });

    fetchAndMergeData();
});