$(document).ready(function () {
    let Company_data = [];
    let user_data = [];
    var selectedTheme=0;
    var themeCode=0;
    let autoSaveInterval;

    function reloadUserData() {
        $.getJSON('../database/company.json')
            .done(function (data) {
                if (data && data.data && Array.isArray(data.data)) {
                    Company_data = data.data;
                    DevExpress.ui.notify("Company data reloaded successfully.", "success", 1000);
                    initializeTabPanel(Company_data[0] || getDefaultCompanyData(), user_data);
                } else {
                    DevExpress.ui.notify("Invalid company data structure detected.", "error", 1000);
                    initializeTabPanel(getDefaultCompanyData(), user_data);
                }
            })
            .fail(function () {
                DevExpress.ui.notify("Error loading company data.", "error", 5000);
                initializeTabPanel(getDefaultCompanyData(), user_data);
            });

        $.getJSON('../database/access.json')
            .done(function (data) {
                if (data && data.data && Array.isArray(data.data)) {
                    user_data = data.data;
                    DevExpress.ui.notify("User data reloaded successfully.", "success", 1000);
                    initializeTabPanel(Company_data[0] || getDefaultCompanyData(), user_data);
                } else {
                    DevExpress.ui.notify("Invalid user data structure detected.", "error", 1000);
                    initializeTabPanel(Company_data[0] || getDefaultCompanyData(), []);
                }
            })
            .fail(function () {
                DevExpress.ui.notify("Error loading user data.", "error", 5000);
                initializeTabPanel(Company_data[0] || getDefaultCompanyData(), []);
            });
    }

    function initializeTabPanel(companyData, usersData) {
        if (!companyData.Users || companyData.Users.length === 0) {
            companyData.Users = [{
                name: companyData.Owner || 'Default Owner',
                role: 'Administrator'
            }];
        }

        if (usersData.length === 0) {
            usersData = [{
                name: companyData.Owner || 'Default Owner',
                role: 'Administrator',
                username: 'admin',
                password: 'admin'
            }];
        }

        $("#tabPanelContainer").dxTabPanel({
            items: [
                {
                    title: "7. User Access",
                    template: function () {
                        return $("<div>").addClass("tab-content-padding").append(
                            $("<div>").dxForm({
                                items: [
                                    {
                                        itemType: 'button',
                                        buttonOptions: {
                                            icon: 'add',
                                            text: 'Add New',
                                            horizontalAlignment: 'left',
                                            onClick: function () {
                                                usersData.push({
                                                    name: '',
                                                    role: '',
                                                    username: '',
                                                    password: ''
                                                });
                                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                                            },
                                            elementAttr: {
                                                style: 'background-color: #4CAF50; color: white;'
                                            }
                                        }
                                    },
                                    {
                                        itemType: 'group',
                                        colCount: 4,
                                        items: getUsersOptions(usersData)
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

        if (autoSaveInterval) clearInterval(autoSaveInterval);
        autoSaveInterval = setInterval(function () {
            saveUsers(usersData);
        }, 15000);
    }

    function getUsersOptions(users) {
        const options = [];
        for (let i = 0; i < users.length; i++) {
            options.push({
            itemType: 'group',
                colCount: 1,
                items: [
                    {
                        dataField: `Users[${i}].name`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'Name'
                        },
                        editorOptions: {
                            value: users[i].name,
                            onValueChanged: function (e) {
                                users[i].name = e.value;
                            }
                        }
                    },
                    {
                        dataField: `Users[${i}].role`,
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            items: ['Supervisor', 'Manager', 'Administrator'],
                            searchEnabled: true,
                            value: users[i].role,
                            onValueChanged: function (e) {
                                users[i].role = e.value;
                            }
                        },
                        label: {
                            text: 'Role'
                        }
                    },
                    {
                        dataField: `Users[${i}].username`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'Username'
                        },
                        editorOptions: {
                            value: users[i].username,
                            onValueChanged: function (e) {
                                users[i].username = e.value;
                            }
                        },
                        validationRules: [{
                            type: 'required',
                            message: 'Username is required'
                        }]
                    },
                    {
                        dataField: `Users[${i}].password`,
                        editorType: 'dxTextBox',
                        label: {
                            text: 'Password'
                        },
                        editorOptions: {
                            mode: 'password',
                            value: users[i].password,
                            onValueChanged: function (e) {
                                users[i].password = e.value;
                            }
                        },
                        validationRules: [{
                            type: 'required',
                            message: 'Password is required'
                        }]
                    },
                    {
                        itemType: 'button',
                        buttonOptions: {
                            icon: 'trash',
                            text: 'Delete',
                            stylingMode: 'text',
                            onClick: function () {
                                users.splice(i, 1);
                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                            }
                        }
                    }
                ]
            });
        }
        return options;
    }

    function saveUsers(data) {
        $.ajax({
            url: '../database/saveAccess.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                data: data
            }),
            success: function (response) {
                DevExpress.ui.notify("User data saved successfully.", "success", 1000);
            },
            error: function () {
                DevExpress.ui.notify("Updating...", "info", 500);
            }
        });
    }

    reloadUserData();

});


