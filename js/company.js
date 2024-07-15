$(document).ready(function () {
    let Company_data = [];
    //let locations_data = [];
    let parish_data = [];

    // Load Parish Data
    $(function () {
        loadData('parishes.json', 'Parish:', parish_data, function () {});
    });

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

    function reloadCompanyData() {
        $.getJSON('../database/company.json')
            .done(function (data) {
                if (data && data.data && Array.isArray(data.data)) {
                    Company_data = data.data;
                    DevExpress.ui.notify("Company data reloaded successfully.", "success", 1000);
                    initializeTabPanel(Company_data[0] || getDefaultCompanyData());
                } else {
                    DevExpress.ui.notify("Invalid company data structure detected.", "error", 1000);
                    initializeTabPanel(getDefaultCompanyData());
                }
            })
            .fail(function () {
                DevExpress.ui.notify("Error loading company data.", "error", 5000);
                initializeTabPanel(getDefaultCompanyData());
            });
    }


    /* Auto run when page is loading */
    reloadCompanyData();
 
    let isRunning = false;
   setInterval(function() {
    //setTimeout(function() {
        if (!isRunning) {
            isRunning = true;
            uploadFile().then(() => {
                setTimeout(() => {
                    isRunning = false;
                }, 5000);
            });
            console.log("uploadFile() called");
        }
    }, 5000);




    function initializeTabPanel(initialData) {
        if (!initialData.Users || initialData.Users.length === 0) {
            initialData.Users = [{
                name: initialData.Owner || 'Default Owner',
                role: 'Administrator'
            }];
        }

        $("#tabPanelContainer").dxTabPanel({
            items: [
                {
                    title: "1. Setup",
                    template: function () {
                        return $("<div>").addClass("tab-content-padding").append(
                            $("<div>").dxForm({
                                colCount: 1,
                                formData: initialData,
                                items: [
                                    {
                                        itemType: 'group',
                                        cssClass: 'form-group',
                                        colCount: 4,
                                        items: [
                                            {
                                                template: "<div class='form-avatar' style='width: 300px; height: 300px; background-color: #ddd; border: 0px solid #ddd; position: relative; margin-left:0px;'><img id='avatar-preview' src='' style='max-width: 100%; max-height: 100%; object-fit: contain; position: absolute; top:0; bottom:0; left:0; right:0; margin: auto;'><br><input id='fileupload' type='file' name='fileupload' accept='image/*' style='left:5px; top:310px; position: absolute;'></div>"
                                            },
                                            {
                                                itemType: 'group',
                                                colSpan: 3,
                                                items: [
                                                    {
                                                        dataField: 'Owner',
                                                        editorType: 'dxTextBox',
                                                        label: {
                                                            text: 'Owner'
                                                        }
                                                    },
                                                    {
                                                        dataField: 'Contact',
                                                        editorOptions: {
                                                          mask: '+1 (876) 000-0000',
                                                          maskRules: { X: /[02-9]/ },
                                                        },
                                                
                                                      }, 

                                                    {
                                                        dataField: 'Date',
                                                        editorType: 'dxDateBox',
                                                        editorOptions: {
                                                            width: '100%',
                                                        },
                                                        label: {
                                                            text: 'Date'
                                                        }
                                                    },
                                                    {
                                                        dataField: 'OwnerEmail',
                                                        editorOptions: {
                                                            width: '100%',
                                                        },
                                                        label: {
                                                            text: 'Email'
                                                        }
                                                    }

                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        itemType: 'group',
                                        colCount: 4,
                                        template: function (data, $itemElement) {
                                            $itemElement.css('min-height', '50px');
                                        }
                                    },
                                    {
                                        itemType: 'group',
                                        colCount: 2,
                                        caption: 'Company info',
                                        items: [
                                            'Company', 'CompanyID', 'NIS', 'TRN', 'Address',
                                            {
                                                dataField: 'Parish',
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    items: parish_data || [],
                                                    displayExpr: 'Name',
                                                    valueExpr: 'Name',
                                                    //height: 32,
                                                    scrollingMode: 'contained',
                                                    virtualizingMode: 'continuous'
                                                },
                                                label: {
                                                    text: 'Parish',
                                                },
                                            }, {
                                                dataField: 'Email',
                                                editorOptions: {
                                                    width: '100%',
                                                },
                                                label: {
                                                    text: 'Company email'
                                                }
                                            }, {
                                                dataField: 'Frequency',
                                                editorType: 'dxTagBox',
                                                editorOptions: {
                                                    items: ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly'],
                                                    value: initialData.Frequency || [],
                                                    showSelectionControls: true,
                                                    searchEnabled: true
                                                },
                                                label: {
                                                    text: 'Pay Frequencies'
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        itemType: 'button',
                                        buttonOptions: {
                                            icon: 'save',
                                            text: 'Save Changes',
                                            onClick: function () {
                                                uploadFile();
                                                saveCompanyData(initialData);
                                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                                            },
                                            elementAttr: {
                                                style: 'background-color: #4CAF50; color: white;'
                                            }
                                        }
                                    },
                                ]
                            })
                        );
                    }
                },
                {
                    title: "2. Branch",
                    template: function () {
                        return $("<div>").addClass("tab-content-padding").append(
                            $("<div>").dxForm({
                                items: [
                                    {
                                        itemType: 'button',
                                        horizontalAlignment: 'right',
                                        cssClass: 'add-branch-phone-button',
                                        buttonOptions: {
                                            icon: 'add',
                                            text: 'Add New',
                                            onClick: function () {
                                                initialData.Branches.push('Enter new address'); // Add null value to Branches array
                                                initialData.Phones.push('(876)000-0000'); // Add null value to Phones array
                                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                                            },
                                            elementAttr: {
                                                style: 'background-color: #4CAF50; color: white;'
                                            }
                                        }
                                    },
                                    {
                                        itemType: 'group',
                                        caption: 'All Branches',
                                        name: 'branches-phones-container',
                                        colCount: 4,
                                        items: getBranchesPhonesOptions(initialData.Branches || [], initialData.Phones || [])
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

        
        // Handle file input change event to update the preview image
        $('#tabPanelContainer').on('change', 'input[type="file"]', function () {
            var file = this.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#avatar-preview').attr('src', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

     // Define the setProfileImage() function
    function setProfileImage() {
    const extensions = ['png', 'jpg', 'jpeg'];
    const basePath = '../profile/profile_pic.';
    const avatarPreview = document.getElementById('avatar-preview');

    if (avatarPreview) {
        let imageSet = false;

        // Function to check if image exists
        const checkImage = (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            });
        };

        // Iterate over extensions and check if image exists
        extensions.forEach(async (ext) => {
            if (!imageSet) {
                const imagePath = basePath + ext;
                const exists = await checkImage(imagePath);

                if (exists) {
                    avatarPreview.src = imagePath;
                    console.log(`Default image set successfully with extension: ${ext}`);
                    imageSet = true;
                }
            }
        });

    } else {
        console.error("Element with ID 'avatar-preview' not found.");
    }
    }

    // Call setProfileImage() when the document is fully loaded
    document.addEventListener("DOMContentLoaded", function() {
        setProfileImage();
    });



    // Call updatePreviewImage() when the file input changes
    document.getElementById('fileupload').addEventListener('change', function() {
    updatePreviewImage(this); // Pass the file input element to the function
    });

    async function uploadFile() {
        let formData = new FormData();
        formData.append("file", document.getElementById('fileupload').files[0]);
        await fetch('../database/upload_profile.php', {
            method: "POST",
            body: formData
        });
        setProfileImage();
    }


  



    function getDefaultCompanyData() {
        return {
            Owner: '',
            Company: '',
            CompanyID: '',
            Email: '',
            NIS: '',
            TRN: '',
            Address: '',
            Frequency: [],
            Parish: [],
            Branches: [],
            Phones: [],
            Users: []
        };
    }

    function getBranchesPhonesOptions(branches, phones) {
        const options = [];
        for (let i = 0; i < branches.length; i++) {
            options.push({
                itemType: 'group',
                colCount: 1,
                items: [
                    {
                        dataField: `Branches[${i}]`,
                        editorType: 'dxTextBox',
                        label: {
                            text: `Branch ${i + 1}`
                        },
                        editorOptions: {
                            value: branches[i], // Bind value to branches[i]
                            onValueChanged: function (e) {
                                branches[i] = e.value; // Update branches array when value changes
                            }
                        }
                    },
                    {
                        dataField: `Phones[${i}]`,
                        editorType: 'dxTextBox',
                        label: {
                            text: `Phone ${i + 1}`
                        },
                        editorOptions: {
                            value: phones[i], // Bind value to phones[i],
                            mask: '+1 (X00) 000-0000', // Add mask to format phone number
                            maskRules: {
                                X: /[01-9]/
                            },
                            onValueChanged: function (e) {
                                phones[i] = e.value; // Update phones array when value changes
                            }
                        }
                    },
                    {
                        itemType: 'button',
                        horizontalAlignment: 'left',
                        cssClass: 'delete-branch-phone-button',
                        buttonOptions: {
                            icon: 'trash',
                            text: "Delete",
                            stylingMode: 'text',
                            onClick: function () {
                                branches.splice(i, 1);
                                phones.splice(i, 1);
                                $("#tabPanelContainer").dxTabPanel("instance").repaint();
                            }
                        }
                    }
                ]
            });
        }
        return options;
    }

    function saveCompanyData(initialData) {
        let requestData = {
            data: [{
                Owner: initialData.Owner,
                Company: initialData.Company,
                CompanyID: initialData.CompanyID,
                Email: initialData.Email,
                NIS: initialData.NIS,
                TRN: initialData.TRN,
                Date: initialData.Date,
                Address: initialData.Address,
                Parish: initialData.Parish,
                Branches: initialData.Branches,
                Phones: initialData.Phones,
                Contact: initialData.Contact,
                Frequency: initialData.Frequency,
                Users: initialData.Users,
                OwnerEmail: initialData.OwnerEmail
            }]
        };

        // Convert the image file to FormData
        var formData = new FormData();
        var fileInput = $('#avatar-preview').siblings('input[type="file"]')[0];
        if (fileInput && fileInput.files.length > 0) {
            formData.append('avatar', fileInput.files[0]);
        }

        // Save company data
        $.ajax({
            url: '../database/saveCompany.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                if (response.status === 'success') {
                    DevExpress.ui.notify("Changes saved successfully.", "success", 1000);
                } else {
                    DevExpress.ui.notify("Database Override.", "info", 1000);
                }
            },
            error: function () {
                DevExpress.ui.notify("Sorry, I can't save to the database. I'm not connected to a server.", "error", 5000);
            }
        });

        // Save image
        $.ajax({
            url: '../database/saveImage.php',
            method: 'POST',
            processData: true,
            contentType: false,
            data: formData,
            success: function (response) {
                // Handle response from saveImage.php
                console.log(response);
                // You can handle success or failure accordingly
            },
            error: function () {
                // Handle error
                console.error("Error uploading image.");
                // You can display an error message or perform other actions here
            }
        });
    }

});


var selectedTheme=0;
var themeCode=0;
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

setInterval(checkTheme, 50);