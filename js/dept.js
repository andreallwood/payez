$(document).ready(function () {
    let dept_data = [];
    let job_data = [];
    var selectedTheme=0;
var themeCode=0;

    let autoSaveDeptInterval;
    let autoSaveJobInterval;

    function reloadData(file, successCallback, errorCallback) {
        $.getJSON(file)
            .done(function (data) {
                if (data && data.data && Array.isArray(data.data)) {
                    successCallback(data.data);
                } else {
                    errorCallback();
                }
            })
            .fail(function () {
                errorCallback();
            });
    }

    function saveData(file, data) {
        $.ajax({
            url: file,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: data }),
            success: function (response) {
                DevExpress.ui.notify("Data saved successfully.", "success", 1000);
            },
            error: function () {
                DevExpress.ui.notify("Error saving data.", "info", 5000);
            }
        });
    }

    function saveDept(data) {
        $.ajax({
            url: '../database/saveDepartments.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: data }),
            success: function (response) {
                DevExpress.ui.notify("Department data saved successfully.", "success", 1000);
            },
            error: function () {
                DevExpress.ui.notify("Error saving department data.", "info", 5000);
            }
        });
    }

    function saveJobs(data) {
        $.ajax({
            url: '../database/saveJobs.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: data }),
            success: function (response) {
                DevExpress.ui.notify("Job roles data saved successfully.", "success", 1000);
            },
            error: function () {
                DevExpress.ui.notify("Error saving job roles data.", "info", 5000);
            }
        });
    }

    function initializeTabPanel(departments, jobs) {
        $("#tabPanelContainer").dxTabPanel({
            items: [
                {
                    title: "5. Departments",
                    template: function () {
                        return $("<div>").addClass("tab-content-padding").append(
                            $("<div>").dxForm({
                                items: [
                                    {
                                        itemType: 'button',
                                        buttonOptions: {
                                            icon: 'add',
                                            text: 'Add New Department',
                                            horizontalAlignment: 'left',
                                            onClick: function () {
                                                departments.push({
                                                    name: ''
                                                });
                                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                                            },
                                            elementAttr: {
                                                class: 'tax-button-class', 
                                                //style: 'background-color: #4CAF50; color: white;'
                                            }
                                        }
                                    },
                                    {
                                        itemType: 'group',
                                        colCount: 4,
                                        items: getDeptItemsOptions(departments)
                                    }
                                ]
                            })
                        );
                    }
                },
                {
                    title: "6. Job Roles",
                    template: function () {
                        return $("<div>").addClass("tab-content-padding").append(
                            $("<div>").dxForm({
                                items: [
                                    {
                                        itemType: 'button',
                                        buttonOptions: {
                                            icon: 'add',
                                            text: 'Add New Job Role',
                                            horizontalAlignment: 'left',
                                            onClick: function () {
                                                jobs.push({
                                                    name: ''
                                                });
                                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                                            },
                                            elementAttr: {
                                                class: 'tax-button-class', 
                                                //style: 'background-color: #4CAF50; color: white;'
                                            }
                                        }
                                    },
                                    {
                                        itemType: 'group',
                                        colCount: 4,
                                        items: getJobItemsOptions(jobs)
                                    }
                                ]
                            })
                        );
                    }
                }
            ],
            selectedIndex: 0,
            animationEnabled: true,
            swipeEnabled: true
        });

        if (autoSaveDeptInterval) clearInterval(autoSaveDeptInterval);
        autoSaveDeptInterval = setInterval(function () {
            saveDept(dept_data);
        }, 500);

        if (autoSaveJobInterval) clearInterval(autoSaveJobInterval);
        autoSaveJobInterval = setInterval(function () {
            saveJobs(job_data);
        }, 500);
    }

    function getDeptItemsOptions(departments) {
        const options = [];
        for (let i = 0; i < departments.length; i++) {
            options.push({
                itemType: 'group',
                colCount: 1,
                items: [
                    {
                        dataField: `Departments[${i}].Name`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'Name'
                        },
                        editorOptions: {
                            value: departments[i].Name,
                            onValueChanged: function (e) {
                                departments[i].Name = e.value;
                            }
                        }
                    },
                    {
                        itemType: 'button',
                        buttonOptions: {
                            icon: 'trash',
                            text: 'Delete',
                            stylingMode: 'text',
                            onClick: function () {
                                departments.splice(i, 1);
                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                            }
                        }
                    }
                ]
            });
        }
        return options;
    }

    function getJobItemsOptions(jobs) {
        const options = [];
        for (let i = 0; i < jobs.length; i++) {
            options.push({
                itemType: 'group',
                colCount: 1,
                items: [
                    {
                        dataField: `Jobs[${i}].Name`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'Name'
                        },
                        editorOptions: {
                            value: jobs[i].Name,
                            onValueChanged: function (e) {
                                jobs[i].Name = e.value;
                            }
                        }
                    },
                    {
                        itemType: 'button',
                        buttonOptions: {
                            icon: 'trash',
                            text: 'Delete',
                            stylingMode: 'text',
                            onClick: function () {
                                jobs.splice(i, 1);
                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                            }
                        }
                    }
                ]
            });
        }
        return options;
    }

    reloadData('../database/departments.json', function (data) {
        dept_data = data;
        reloadData('../database/jobs.json', function (data) {
            job_data = data;
            initializeTabPanel(dept_data, job_data);
        }, function () {
           // DevExpress.ui.notify("Error loading job roles data.", "error", 100);
            initializeTabPanel(dept_data, []);
        });
    }, function () {
       // DevExpress.ui.notify("Error loading departments data.", "error", 100);
        reloadData('../database/jobs.json', function (data) {
            job_data = data;
            initializeTabPanel([], job_data);
        }, function () {
           // DevExpress.ui.notify("Error loading job roles data.", "error", 100);
            initializeTabPanel ([], []);
});
});


function checkTheme() {
    $.ajax({
        url: '../theme.json',
        dataType: 'json',
        success: function(data) {
            if (data.theme !== themeCode) {
                themeCode = data.theme;
                console.log("Theme updated to: " + themeCode);
                // Here you can add any additional actions you want to perform when the theme changes
                switchTheme(themeCode);
            }
        },
        error: function() {
            console.error("Error loading theme.json");
        }
    });
}

function switchTheme(theme) {
    switch (theme) {
        case 1:
            $('#themeStylesheet').attr('href', '../theme/dx.material.theme_blue.css');
            break;
        case 2:
            $('#themeStylesheet').attr('href', '../theme/dx.material.theme_orange.css');
            break;
        case 3:
            $('#themeStylesheet').attr('href', '../theme/dx.material.theme_lime.css');
            break;
        case 4:
            $('#themeStylesheet').attr('href', '../theme/dx.material.theme_purple.css');
            break;
        case 5:
            $('#themeStylesheet').attr('href', '../theme/dx.material.theme_teal.css');
            break;

            case 6:
                $('#themeStylesheet').attr('href', '../theme/dx.material.theme_dark_blue.css');
                break;
            case 7:
                $('#themeStylesheet').attr('href', '../theme/dx.material.theme_dark_orange.css');
                break;
            case 8:
                $('#themeStylesheet').attr('href', '../theme/dx.material.theme_dark_lime.css');
                break;
            case 9:
                $('#themeStylesheet').attr('href', '../theme/dx.material.theme_dark_purple.css');
                break;
            case 10:
                $('#themeStylesheet').attr('href', '../theme/dx.material.theme_dark_teal.css');
                break;
        // Add more cases for additional themes if needed
        default:
            $('#themeStylesheet').attr('href', '../theme/dx.material.teal.light.compact.css'); // Default theme
            break;
    }
}


// Periodically check the theme every 0.5 seconds
setInterval(checkTheme, 50);

});
