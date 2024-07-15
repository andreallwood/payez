var newRowID = 0;
var copiedItem = {};
var showEditor = false;
var Employees_data = [];
var Titles_data = [];
var EmpTypes_data = [];
var PayFrequency_data = [];
var Parishes_data = [];
var Locations_data = [];
var Departments_data = [];
var Jobs_data = [];
var Bank_data = [];
var AccountType_data = [];
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
                                        var ytdPayByUserId = calculateYTD(Payslip_data);
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
    fetch('../database/' + url)
        .then(response => response.json())
        .then(pointer => {
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
        .catch(error => {
            DevExpress.ui.notify(dataSourceName + ' prefetch error.', 'error', 5000);
            callback();
        });
}
document.addEventListener('DOMContentLoaded', function () {
    var placeholderImage = '../resources/profile1.jpg';
    var dataGrid = new DevExpress.ui.dxDataGrid(document.getElementById("data-grid-container"), {
        dataSource: Employees_data,
        scrolling: {
            rowRenderingMode: 'none',
        },
        height: '98dvh',
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
        columnChooser: {
            enabled: false,
            mode: "select"
        },
        headerFilter: {
            visible: true,
        },
        loadPanel: {
            enabled: true,
            text: 'Loading...',
            showIndicator: true,
            showPane: false,
        },
        groupPanel: {
            visible: false
        },
        grouping: {
            autoExpandAll: false
        },
        searchPanel: {
            visible: true,
            highlightCaseSensitive: true,
            width: 240,
            placeholder: 'Quick search...',
            searchVisibleColumnsOnly: false,
            highlightSearchText: true,
            text: '',
            searchExpr: null,
            searchMode: 'contains'
        },
        selection: {
            mode: 'multiple',
        },
        scrolling: {
            rowRenderingMode: 'virtual',
        },
        paging: {
            pageSize: 14,
        },
        pager: {
            visible: true,
            allowedPageSizes: [14, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        columns: [
            {
                dataField: 'image',
                caption: ' ',
                width: 45,
                cellTemplate: function (container, options) {
                    var img = document.createElement('img');
                    img.src = options.data.path || placeholderImage;
                    img.style.width = '30px';
                    img.style.height = '30px';
                    img.style.objectFit = 'cover';
                    img.style.cursor = 'pointer';
                    img.style.borderRadius = '15%';
                    img.onclick = function () {
                        showImagePopup(options.data.path || placeholderImage);
                    };
                    container.appendChild(img);
                },
                editCellTemplate: function (cellElement, cellInfo) {
                    var container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.flexDirection = 'column';
                    container.style.alignItems = 'center';

                    var imgPreview = document.createElement('img');
                    imgPreview.style.width = '270px';
                    imgPreview.style.height = '270px';
                    imgPreview.style.objectFit = 'cover';
                    imgPreview.style.cursor = 'pointer';
                    imgPreview.src = cellInfo.value || placeholderImage;

                    imgPreview.onclick = function () {
                        fileInput.click();
                    };

                    var fileInput = document.createElement('input');
                    fileInput.setAttribute('type', 'file');
                    fileInput.setAttribute('accept', 'image/*');
                    fileInput.style.display = 'none';

                    fileInput.onchange = function (event) {
                        var file = fileInput.files[0];
                        var formData = new FormData();
                        formData.append('file', file);

                        $.ajax({
                            url: "../database/uploadImage.php",
                            method: "POST",
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                if (response.success) {
                                    var fullPath = '../employees/' + response.filename;
                                    cellInfo.setValue(fullPath);
                                    cellInfo.row.data.path = fullPath;
                                    imgPreview.src = fullPath;
                                    dataGrid.cellValue(cellInfo.row.rowIndex, 'path', fullPath);
                                    dataGrid.refresh();
                                    
                                                 // Refresh the grid with cache-busting parameters
                let gridInstance = $("#data-grid-container").dxDataGrid("instance");
                gridInstance.option("dataSource", gridInstance.option("dataSource") + "?_=" + new Date().getTime());
                gridInstance.refresh();
                                    
                                } else {
                                    DevExpress.ui.notify('Error uploading image: ' + response.error, 'error', 2000);
                                }
                            },
                            error: function (error) {
                                DevExpress.ui.notify('Error uploading image.', 'error', 2000);
                                console.error('Upload error:', error);
                            }
                        });
                    };

                    container.appendChild(imgPreview);
                    container.appendChild(fileInput);
                    cellElement.appendChild(container);
                }
            },
            {
                dataField: 'path',
                caption: 'Path',
                visible: false,
                cellTemplate: function (container, options) {
                    container.innerText = options.data.path || '';
                },
                allowEditing: false
            },
            {
                dataField: 'Status',
                caption: 'Status',
                alignment: 'left',
                width: 90,
                validationRules: [{
                    type: 'required'
                }],
            },
            {
                dataField: 'IDnum',
                caption: 'IDnum',
                dataType: 'text',
                alignment: 'left',
                width: 90,
                visible: true,
                validationRules: [{
                    type: 'required'
                }],

            },
            {
                dataField: 'Title',
                caption: 'Title',
                alignment: 'left',
                width: 80,
                visible: true,
                lookup: {
                    dataSource: Titles_data,
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
                validationRules: [{
                    type: 'required'
                }],
            },
            {
                dataField: 'FirstName',
                caption: 'FirstName',
                dataType: 'text',
                alignment: 'left',
                visible: true,
                validationRules: [{
                    type: 'required'
                }],
                editorOptions: {
                    placeholder: '',
                },
            },
            {
                dataField: 'MI',
                caption: 'MI',
                dataType: 'text',
                alignment: 'left',
                visible: true,
                width: 80,
            },
            {
                dataField: 'LastName',
                caption: 'LastName',
                dataType: 'text',
                alignment: 'left',
                visible: true,
                validationRules: [{
                    type: 'required'
                }],
                editorOptions: {
                    placeholder: '',
                },
            },
            {
                dataField: 'fullName',
                caption: 'fullName',
                alignment: 'left',
                visible: false,
                calculateCellValue: function (data) {
                    let fullName = data.IDnum + ' - ' + data.Title + ' ' + data.FirstName;
                    if (data.Initial) {
                        fullName += ' ' + data.Initial + '.';
                    }
                    fullName += ' ' + data.LastName;
                    return fullName;
                },
            },
            {
                dataField: 'Gender',
                caption: 'Gender',
                alignment: 'left',
                visible: true,
                width: 90,
            },
            {
                dataField: 'Phone',
                caption: 'Phone',
                alignment: 'left',
                visible: true,
                width: 120,
                editorOptions: {
                    mask: '+1 (X00) 000-0000',
                    maskRules: {
                        X: /[01-9]/
                    },
                },

            },
            {
                dataField: 'Email1',
                caption: 'Email1',
                dataType: 'email',
                alignment: 'left',
                visible: true,
                editorOptions: {
                    placeholder: '',
                },
                width: 220,
            },
            {
                dataField: 'NIS',
                caption: 'NIS',
                dataType: 'text',
                alignment: 'left',
                editorOptions: {
                    placeholder: '',
                },
                width: 100,
            },
            {
                dataField: 'TRN',
                caption: 'TRN',
                dataType: 'text',
                alignment: 'left',
                editorOptions: {
                    placeholder: '',
                },
                width: 120,
                format: (value) => {
                    if (value && value.length === 9) {
                        return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
                    }
                    return value;
                },
            },
            {
                dataField: 'Bank',
                caption: 'Bank',
                alignment: 'left',
                visible: true,
                editorOptions: {
                    placeholder: '',
                },
                lookup: {
                    dataSource: Bank_data,
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Branch',
                caption: 'Branch',
                alignment: 'left',
                visible: true,
                dataType: 'text',
                width: 130,
            },
            {
                dataField: 'Account',
                caption: 'Account',
                alignment: 'left',
                visible: true,
                dataType: 'text',
            },
            {
                dataField: 'AccType',
                caption: 'AccType',
                alignment: 'left',
                visible: true,
                width: 220,
                lookup: {
                    dataSource: AccountType_data,
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Address',
                caption: 'Address',
                alignment: 'left',
                visible: true,
                width: 220,
            },
            {
                dataField: 'Parish',
                caption: 'Parish',
                alignment: 'left',
                visible: true,
                width: 220,
                lookup: {
                    dataSource: Parishes_data,
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Position',
                caption: 'Position',
                alignment: 'left',
                width: 140,
                lookup: {
                    dataSource: Jobs_data,
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Department',
                caption: 'Department',
                alignment: 'left',
                //width: 150,
                lookup: {
                    dataSource: Departments_data,
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Location',
                caption: 'Location',
                alignment: 'left',
                //width: 120,
                lookup: {
                    dataSource: Locations_data,
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Frequency',
                caption: 'Frequency',
                alignment: 'left',
                validationRules: [{
                    type: 'required'
                }],
                width: 120,
                lookup: {
                    dataSource: PayFrequency_data,
                    displayExpr: 'Frequency',
                    valueExpr: 'Frequency',
                },
            },
            {
                dataField: 'PayRate',
                caption: 'PayRate',
                validationRules: [{
                    type: 'required'
                }],
                format: {
                    type: 'currency',
                    precision: 2,
                },
                alignment: 'left',
                width: 90,
                editorOptions: {
                    step: 0.01,
                },
                dataType: 'number',
                editorOptions: {
                    placeholder: '',
                },
            },
            {
                dataField: 'Email2',
                caption: 'Email2',
                dataType: 'text',
                alignment: 'left',
                visible: true,
                editorOptions: {
                    placeholder: '',
                },
                width: 100,
                //visible: false,
            },
            {
                dataField: 'DOB',
                caption: 'DOB',
                dataType: 'date',
                alignment: 'left',
                visible: true,
                width: 100,
            },
            {
                dataField: 'HireDate',
                caption: 'HireDate',
                dataType: 'date',
                alignment: 'left',
                visible: true,
                width: 100,
            },
            {
                dataField: 'EmpType',
                caption: 'EmpType',
                alignment: 'left',
                editorOptions: {
                    placeholder: '',
                },
                validationRules: [{
                    type: 'required'
                }],
                width: 100,
                lookup: {
                    dataSource: EmpTypes_data,
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Notes',
                caption: 'Notes',
                alignment: 'left',
                visible: true,
                editorOptions: {
                    placeholder: 'Enter any additional information for the employee.',
                },
                dataType: 'text',
            },

            {
                type: 'buttons',
                buttons: [
                    {
                        name: 'edit',
                        icon: 'edit'
                    },
                    {
                        name: 'delete',
                        icon: 'trash'
                    }
                ]
            }
        ],
        editing: {
            mode: 'popup',
            allowAdding: false,
            allowUpdating: true,
            allowDeleting: true,
            popup: {
                title: "Enroll an employee",
                showTitle: true,
                height: 620,
                minWidth: 200,
                maxWidth: 720,
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
                        caption: 'Profile Image',
                        colCount: 2,
                        colSpan: 1,
                        items: [
                            {
                                dataField: 'image',
                                editorType: 'dxFileUploader',
                                editorOptions: {
                                    accept: 'image/*',
                                    onValueChanged: function (e) {
                                        var reader = new FileReader();
                                        reader.onload = function (ev) {
                                            var file = e.value[0];
                                            if (file) {
                                                console.log('Selected file name:', file.name); 
                                                var newImageSrc = ev.target.result;
                                                dataGrid.cellValue(e.component.option('editing').editRowKey, 'image', newImageSrc);
                                                var fullPath = '../employees/' + file.name;
                                                dataGrid.cellValue(e.component.option('editing').editRowKey, 'path', file.name);
                                                dataGrid.refresh();
                                                document.getElementById('imagePreview').src = newImageSrc;
                                            }
                                        };
                                        reader.readAsDataURL(e.value[0]);
                                    }
                                }
                            },
                            {
                                dataField: 'path',
                                visible: false,
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                      ],
                    },
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        caption: 'Personal information ',
                        items: ['Title', 'FirstName', 'MI', 'LastName'],
                    },
                    {
                        itemType: 'group',
                        caption: ' ',
                        colCount: 2,
                        colSpan: 2,
                        //caption: 'Employee Details',
                        items: [{
                            dataField: 'Gender',
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                items: ['Male', 'Female'],
                                value: ''
                            },
                            }, 'DOB', 'Address', 'Parish'],
                    },
                    {
                        itemType: 'group',
                        caption: 'Office Details',
                        colCount: 2,
                        colSpan: 2,
                        items: ['NIS', 'TRN', 'Phone', 'Email1', 'Bank', 'Branch', 'Account', 'AccType'],
                    },
                    {
                        itemType: 'group',
                        colCount: 2,
                        colSpan: 2,
                        caption: 'Payroll Details',
                        items: ['IDnum', 'HireDate', 'EmpType', 'Frequency', 'PayRate', 'Email2', 'Location', 'Position', 'Department',
                            {
                                dataField: 'Status',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    items: ['Active', 'Inactive'],
                                    value: ''
                                },
                                label: {
                                    text: 'Status'
                                }
                            }
                        ],
                    },
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        items: [
                            {
                                dataField: 'Notes',
                                editorType: 'dxTextArea',
                                editorOptions: {
                                    height: 80,
                                },
                        },
                      ],
                    }
                ]
            }
        },
        onRowInserted: function (e) {
            saveData();
        },
        onRowUpdated: function (e) {
            saveData();
        },
        onRowRemoved: function (e) {
            saveData();
        }
    });
    window.onload = function () {
        reloadData();
    };
    dataGrid.option('onToolbarPreparing', function (e) {
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
                    DevExpress.excelExporter.exportDataGrid({
                        component: e.component,
                        worksheet: worksheet,
                        autoFilterEnabled: true,
                    }).then(() => {
                        workbook.xlsx.writeBuffer().then((buffer) => {
                            saveAs(new Blob([buffer], {
                                type: 'application/octet-stream'
                            }), 'Employees Report.xlsx');
                        });
                    });
                    DevExpress.ui.notify("Data exported to Excel.", "success", 2000);
                },
                hint: 'Export to Excel',
            },
        });
        e.toolbarOptions.items.unshift({
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'upload',
                text: 'Upload',
                elementAttr: {
                    class: 'tax-button-class',
                },
                onClick: function () {
                    var fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = '.xlsx, .xls';
                    fileInput.addEventListener('change', function (event) {
                        var file = event.target.files[0];
                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                try {
                                    var workbook = XLSX.read(event.target.result, {
                                        type: 'binary'
                                    });
                                    var sheetName = workbook.SheetNames[0];
                                    var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                                    Employees_data = Employees_data.concat(jsonData);
                                    dataGrid.option('dataSource', Employees_data);
                                    saveData();
                                    DevExpress.ui.notify("Data imported successfully.", "success", 2000);
                                    reloadData();
                                } catch (error) {
                                    DevExpress.ui.notify("Error importing Excel file: " + error.message, "error", 5000);
                                }
                            };
                            reader.readAsBinaryString(file);
                        }
                    });
                    fileInput.click();
                },
                hint: 'Import Excel',
            },
        });
        e.toolbarOptions.items.unshift({
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'refresh',
                text: 'Refresh',
                onClick: function () {
                    reloadData();
                },
                hint: 'Refresh Data',
            }
        });
        e.toolbarOptions.items.unshift({
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'save',
                text: 'Save',
                elementAttr: {
                    class: 'tax-button-class',
                },
                onClick: function () {
                    saveData();
                },
                hint: 'Save data',
            }
        });
        e.toolbarOptions.items.unshift({
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'trash',
                text: 'Delete',
                elementAttr: {
                    class: 'tax-button-class',
                },
                onClick: function () {
                    var dataGrid = e.component;
                    var selectedRows = dataGrid.getSelectedRowsData();
                    if (selectedRows.length > 0) {
                        deleteSelectedRows(selectedRows, dataGrid);
                           saveData();
                    } else {
                        DevExpress.ui.notify("No rows selected. Please select rows to delete.", "info", 2000);
                    }
                },
                hint: 'Delete selected rows',
            }
        });
        e.toolbarOptions.items.unshift({
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'add',
                text: 'Enroll',
                elementAttr: {
                    class: 'tax-button-class',
                },
                onClick: function () {
                    console.log('Enroll button clicked');
                    dataGrid.addRow();
                    saveData();
                },
                hint: 'Add New Row',
            }
        });
    });
    function deleteSelectedRows(selectedRows, grid) {
        DevExpress.ui.dialog.confirm("Are you sure you want to delete the selected rows?", "Confirm Delete").done(function (result) {
            if (result) {
                for (var i = 0; i < selectedRows.length; i++) {
                    var rowIndex = Employees_data.indexOf(selectedRows[i]);
                    if (rowIndex !== -1) {
                        Employees_data.splice(rowIndex, 1);
                    }
                }
                grid.refresh();
                selectedRows.forEach(function (row) {
                    var employeeName = row.FirstName + ' ' + row.LastName;
                    DevExpress.ui.notify(employeeName + " was deleted successfully.", "success", 1000);
                });
            }
        });
    };
    function showImagePopup(imageUrl) {
        var popupElement = document.createElement('div');
        document.body.appendChild(popupElement);
        var popup = new DevExpress.ui.dxPopup(popupElement, {
            contentTemplate: function (contentElement) {
                contentElement.innerHTML = `<img src="${imageUrl}" style="width: 100%; height: 100%; padding:0px; border-radius:10px; object-fit: contain;" />`;
            },
            width: 420,
            height: 420,
            showTitle: true,
            title: "Profile Image",
            visible: true,
            dragEnabled: true,
            closeOnOutsideClick: true,
            onHiding: function () {
                popupElement.remove();
            }
        });
        popup.show();
    }
    function reloadData() {
        fetch('../database/employees.json')
            .then(response => response.json())
            .then(data => {
                Employees_data = data;
                dataGrid.option('dataSource', Employees_data);
            })
            .catch(error => console.error('Error fetching employees data:', error));
        fetch('../database/titles.json')
            .then(response => response.json())
            .then(data => {
                Titles_data = data.data;
                dataGrid.columnOption('Title', 'lookup.dataSource', Titles_data);
            })
            .catch(error => console.error('Error fetching titles data:', error));
        fetch('../database/empTypes.json')
            .then(response => response.json())
            .then(data => {
                EmpTypes_data = data.data;
                dataGrid.columnOption('EmpType', 'lookup.dataSource', EmpTypes_data);
            })
            .catch(error => console.error('Error fetching employment types data:', error));
        fetch('../database/bankName.json')
            .then(response => response.json())
            .then(data => {
                Bank_data = data.data;
                dataGrid.columnOption('Bank', 'lookup.dataSource', Bank_data);
            })
            .catch(error => console.error('Error fetching bank data:', error));
        fetch('../database/accountType.json')
            .then(response => response.json())
            .then(data => {
                AccountType_data = data.data;
                dataGrid.columnOption('AccType', 'lookup.dataSource', AccountType_data);
            })
            .catch(error => console.error('Error fetching account types data:', error));
        fetch('../database/payFrequency.json')
            .then(response => response.json())
            .then(data => {
                PayFrequency_data = data.data;
                dataGrid.columnOption('Frequency', 'lookup.dataSource', PayFrequency_data);
            })
            .catch(error => console.error('Error fetching pay frequency data:', error));
        fetch('../database/parishes.json')
            .then(response => response.json())
            .then(data => {
                Parishes_data = data.data;
                dataGrid.columnOption('Parish', 'lookup.dataSource', Parishes_data);
            })
            .catch(error => console.error('Error fetching parishes data:', error));
        fetch('../database/locations.json')
            .then(response => response.json())
            .then(data => {
                Locations_data = data.data;
                dataGrid.columnOption('Location', 'lookup.dataSource', Locations_data);
            })
            .catch(error => console.error('Error fetching locations data:', error));
        fetch('../database/departments.json')
            .then(response => response.json())
            .then(data => {
                Departments_data = data.data;
                dataGrid.columnOption('Department', 'lookup.dataSource', Departments_data);
            })
            .catch(error => console.error('Error fetching departments data:', error));
        fetch('../database/jobs.json')
            .then(response => response.json())
            .then(data => {
                Jobs_data = data.data;
                dataGrid.columnOption('Position', 'lookup.dataSource', Jobs_data);
            })
            .catch(error => console.error('Error fetching jobs data:', error));
    }
    function saveData() {
        var dataSource = dataGrid.option('dataSource');
        var data = dataSource.map(function (item) {
            return {
                path: item.path,
                Status: item.Status,
                IDnum: item.IDnum,
                Title: item.Title,
                FirstName: item.FirstName,
                MI: item.MI,
                LastName: item.LastName,
                fullName: item.fullName,
                Gender: item.Gender,
                DOB: item.DOB,
                Address: item.Address,
                Phone: item.Phone,
                Email1: item.Email1,
                Email2: item.Email2,
                Branch: item.Branch,
                Account: item.Account,
                Notes: item.Notes,
                NIS: item.NIS,
                TRN: item.TRN,
                Bank: item.Bank,
                AccType: item.AccType,
                Parish: item.Parish,
                Position: item.Position,
                Department: item.Department,
                Location: item.Location,
                Frequency: item.Frequency,
                PayRate: item.PayRate,
                HireDate: item.HireDate,
                EmpType: item.EmpType
            };
        });
        $.ajax({
            url: "../database/saveEmployee.php",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                DevExpress.ui.notify('Data saved successfully.', 'success', 2000);
                let gridInstance = $("#Frequency1DataGrid").dxDataGrid("instance");
                gridInstance.option("dataSource", gridInstance.option("dataSource") + "?_=" + new Date().getTime());
                gridInstance.refresh();
                refreshIframe();
            },
            error: function (error) {
                DevExpress.ui.notify('Error saving data.', 'error', 2000);
            }
        });
    }
    function refreshIframe() {
    setTimeout(function() {
        location.reload();
    }, 50);
}

      
    // Add event listener for visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            console.log('Page is in focus and visible');
             refreshIframe()
        } else {
            console.table('Page is not in focus');
             refreshIframe()
             //saveData();
        }
    });

    // Add event listeners for focus and blur
    window.addEventListener('focus', function() {
        console.table('Page is in focus');
        //saveData();
         //refreshIframe()
    });

    window.addEventListener('blur', function() {
        console.table('Page is out of focus');
        saveData();
         //refreshIframe()
    });



});



