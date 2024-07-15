$(document).ready(function () {
    let Tax_config_data = [];
    let Tax_category_data = [];
    var selectedTheme=0;
    var themeCode=0;

     initializeTabPanelWithData();
     reloadTaxConfigData();

     function initializeTabPanel(initialData) {
        $("#tabPanelContainer").dxTabPanel({
            items: [
                {
                    title: "3. Tax Class",
                    template: function () {
                        return $("<div>").addClass("tab-content-padding").append(
                            $("<div>").dxForm({
                                formData: initialData,
                                items: [
                                    {
                                        itemType: 'group',
                                        colCount: 1,
                                        items: [
                                            {
                                                itemType: 'group',
                                                template: function(data, itemElement) {
                                                    const buttonContainer = $("<div>").addClass("button-container");
                                                    buttonContainer.append(
                                                        $("<div>").dxButton({
                                                            icon: 'add',
                                                            text: 'Add New',
                                                            stylingMode: 'contained',
                                                            onClick: function () {
                                                                addNewTaxClass();
                                                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                                                            },
                                                            elementAttr: {
                                                                class: 'tax-button-class'
                                                            }
                                                        })
                                                    );
                                                    buttonContainer.append(
                                                        $("<div>").dxButton({
                                                            icon: 'save',
                                                            text: 'Save',
                                                            stylingMode: 'contained',
                                                            onClick: function () {
                                                                saveTaxConfigData(Tax_config_data);
                                                            },
                                                            elementAttr: {
                                                                class: 'tax-button-class'
                                                            }
                                                        })
                                                    );
                                                    itemElement.append(buttonContainer);
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        itemType: 'group',
                                        colCount: 2,
                                        items: getTaxConfigOptions(Tax_config_data || getDefaultTaxConfigData())
                                    }
                                ] 
                            })
                        );
                    }
                },
                {
                    title: "4. Tax Categories",
                    template: function () {
                        return $("<div>").addClass("tab-content-padding").append(
                            $("<div>").dxForm({
                                formData: initialData,
                                items: [
                                    {
                                        itemType: 'group',
                                        colCount: 1,
                                        items: [
                                            {
                                                itemType: 'button',
                                                buttonOptions: {
                                                    icon: 'save',
                                                    text: 'Save',
                                                    stylingMode: 'contained',
                                                    onClick: function () {
                                                        saveTaxCategoryData(Tax_category_data);
                                                    },
                                                    elementAttr: {
                                                        class: 'tax-button-class'
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        itemType: 'group',
                                        colCount: 2,
                                        items: getTaxCategoryOptions(Tax_category_data || getDefaultTaxCategoryData())
                                    }
                                ]
                            })
                        );
                    }
                }
            ],
            selectedIndex: 0,
            animationEnabled: true,
            swipeEnabled: true,
        });

       // Add CSS for button alignment
       $("<style>")
       .prop("type", "text/css")
       .html(`
           .button-container {
               display: flex;
               justify-content: flex-end;
               gap: 10px;
               margin-bottom: 15px;
           }
           .tax-button-class {
               flex: 0 0 auto;
           }
       `)
       .appendTo("head");
}

    function initializeTabPanelWithData() {
    initializeTabPanel();
}
    function reloadTaxConfigData() {
    $.getJSON('../database/taxConfig.json')
        .done(function (data) {
            if (data && data.data && Array.isArray(data.data)) {
                Tax_config_data = data.data;
            } else {
                DevExpress.ui.notify("Invalid tax config data structure detected.", "error", 5000);
                Tax_config_data = getDefaultTaxConfigData();
            }
            initializeTabPanelWithData();
        })
        .fail(function () {
            DevExpress.ui.notify("Error loading tax config data.", "error", 5000);
            Tax_config_data = getDefaultTaxConfigData();
            initializeTabPanelWithData();
        });
        $.getJSON('../database/taxCategory.json')
        .done(function (data) {
            if (data && data.data && Array.isArray(data.data)) {
                Tax_category_data = data.data;
            } else {
                DevExpress.ui.notify("Invalid tax category data structure detected.", "error", 5000);
                Tax_category_data = getDefaultTaxCategoryData();
            }
            initializeTabPanelWithData();
        })
        .fail(function () {
            DevExpress.ui.notify("Error loading tax category data.", "error", 5000);
            Tax_category_data = getDefaultTaxCategoryData();
            initializeTabPanelWithData();
        });
}
    function getDefaultTaxConfigData() {
        return [
            {
                ID: 1,
                description: "",
                taxFreeThreshold: 0,
                taxMaxThreshold: 0,
                minTaxRate: 0,
                maxTaxRate: 0,
                pension: 0,
                heart: 0
            }
        ];
    }
    function getDefaultTaxCategoryData() {
        return [
            {
                ID: 1,
                taxType: "",
                NIS: 0,
                NHT: 0,
                ETAX: 0
            }
        ];
    }
    function getTaxConfigOptions(taxConfigData) {
        const options = [];
        for (let i = 0; i < taxConfigData.length; i++) {
            options.push({
                itemType: 'group',
                colCount: 1,
                items: [
                    {
                        dataField: `ID_${i}`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'ID'
                        },
                        editorOptions: {
                            value: taxConfigData[i].ID,
                            readOnly: true
                        }
                    },
                    {
                        dataField: `description_${i}`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'Description'
                        },
                        editorOptions: {
                            value: taxConfigData[i].description,
                            onValueChanged: function (e) {
                                taxConfigData[i].description = e.value;
                            }
                        }
                    },
                    {
                        dataField: `taxFreeThreshold_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'Tax Free Threshold'
                        },
                        editorOptions: {
                            value: taxConfigData[i].taxFreeThreshold,
                            onValueChanged: function (e) {
                                taxConfigData[i].taxFreeThreshold = e.value;
                            }
                        }
                    },
                    {
                        dataField: `taxMaxThreshold_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'Tax Max Threshold'
                        },
                        editorOptions: {
                            value: taxConfigData[i].taxMaxThreshold,
                            onValueChanged: function (e) {
                                taxConfigData[i].taxMaxThreshold = e.value;
                            }
                        }
                    },
                    {
                        dataField: `minTaxRate_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'Min Tax Rate'
                        },
                        editorOptions: {
                            value: taxConfigData[i].minTaxRate,
                            onValueChanged: function (e) {
                                taxConfigData[i].minTaxRate = e.value;
                            }
                        }
                    },
                    {
                        dataField: `maxTaxRate_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'Max Tax Rate'
                        },
                        editorOptions: {
                            value: taxConfigData[i].maxTaxRate,
                            onValueChanged: function (e) {
                                taxConfigData[i].maxTaxRate = e.value;
                            }
                        }
                    },
                    {
                        dataField: `pension_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'Pension'
                        },
                        editorOptions: {
                            value: taxConfigData[i].pension,
                            onValueChanged: function (e) {
                                taxConfigData[i].pension = e.value;
                            }
                        }
                    },
                    {
                        dataField: `heart_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'Heart'
                        },
                        editorOptions: {
                            value: taxConfigData[i].heart,
                            onValueChanged: function (e) {
                                taxConfigData[i].heart = e.value;
                            }
                        }
                    }
                ]
                
            });
            // Add a spacer after each set of fields
       
        }
        return options;
    }
    function getTaxCategoryOptions(taxCategoryData) {
        const options = [];
        for (let i = 0; i < taxCategoryData.length; i++) {
            options.push({
                itemType: 'group',
                colCount: 1,
                items: [
                    {
                        dataField: `ID_${i}`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'ID'
                        },
                        editorOptions: {
                            value: taxCategoryData[i].ID,
                            readOnly: true
                        }
                    },
                    {
                        dataField: `taxType_${i}`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'Tax Type'
                        },
                        editorOptions: {
                            value: taxCategoryData[i].taxType,
                            onValueChanged: function (e) {
                                taxCategoryData[i].taxType = e.value;
                            }
                        }
                    },
                    {
                        dataField: `NIS_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'NIS'
                        },
                        editorOptions: {
                            value: taxCategoryData[i].NIS,
                            onValueChanged: function (e) {
                                taxCategoryData[i].NIS = e.value;
                            }
                        }
                    },
                    {
                        dataField: `NHT_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'NHT'
                        },
                        editorOptions: {
                            value: taxCategoryData[i].NHT,
                            onValueChanged: function (e) {
                                taxCategoryData[i].NHT = e.value;
                            }
                        }
                    },
                    {
                        dataField: `ETAX_${i}`,
                        editorType: 'dxNumberBox',
                        label: {
                            text: 'ETAX'
                        },
                        editorOptions: {
                            value: taxCategoryData[i].ETAX,
                            onValueChanged: function (e) {
                                taxCategoryData[i].ETAX = e.value;
                            }
                        }
                    }
                ]
            });
        }
        return options;
    }
    function addNewTaxClass() {
        const newID = Tax_config_data.length > 0 ? Math.max(...Tax_config_data.map(d => d.ID)) + 1 : 1;
        Tax_config_data.push({
            ID: newID,
            description: "",
            taxFreeThreshold: 0,
            taxMaxThreshold: 0,
            minTaxRate: 0,
            maxTaxRate: 0,
            pension: 0,
            heart: 0
        });
    }
    function addNewTaxCategory() {
        const newID = Tax_category_data.length > 0 ? Math.max(...Tax_category_data.map(d => d.ID)) + 1 : 1;
        Tax_category_data.push({
            ID: newID,
            taxType: "",
            NIS: 0,
            NHT: 0,
            ETAX: 0
        });
    }
    function saveTaxConfigData(data) {
        $.ajax({
            type: 'POST',
            url: '../database/saveTaxConfig.php',
            data: JSON.stringify({
                data: data
            }),
            contentType: 'application/json',
            success: function () {
                DevExpress.ui.notify("Tax config data saved successfully.", "success", 500);
            },
            error: function () {
                DevExpress.ui.notify("Error saving tax config data.", "error", 5000);
            }
        });
    }
    function saveTaxCategoryData(data) {
        $.ajax({
            type: 'POST',
            url: '../database/saveTaxCategory.php',
            data: JSON.stringify({
                data: data
            }),
            contentType: 'application/json',
            success: function () {
                DevExpress.ui.notify("Tax category data saved successfully.", "success", 500);
            },
            error: function () {
                DevExpress.ui.notify("Error saving tax category data.", "error", 5000);
            }
        });
    }
 
});
