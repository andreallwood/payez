let Dashboard = (() => {
    let global = {
        tooltipOptions: {
            placement: "right"
        },
        menuClass: ".c-menu"
    };

    let menuChangeActive = el => {
        let hasSubmenu = $(el).hasClass("has-submenu");
        let isSubmenuItem = $(el).closest(".c-menu__submenu").length > 0;

        if (!isSubmenuItem) {
            if (!$(el).hasClass('is-active')) {
                $(global.menuClass + " .c-menu__submenu").slideUp();
                $(global.menuClass + " .is-active").removeClass("is-active");
                $(el).addClass("is-active");
                if (hasSubmenu) {
                    $(el).find("ul").slideDown();
                }
            } else {
                $(el).removeClass("is-active");
                if (hasSubmenu) {
                    $(el).find("ul").slideUp();
                }
            }
        }
    };

    let submenuChangeActive = el => {
        $(global.menuClass + " .c-menu__submenu .is-active").removeClass("is-active");
        $(el).addClass("is-active");
        $(el).closest(".has-submenu").addClass("is-active");
    };

    let sidebarChangeWidth = () => {
        let $menuItemsTitle = $("li .menu-item__title");

        $("body").toggleClass("sidebar-is-reduced sidebar-is-expanded");
        $(".hamburger-toggle").toggleClass("is-opened");

        if ($("body").hasClass("sidebar-is-expanded")) {
            $("#sidebar-logo").text("BSL365");
            $('[data-toggle="tooltip"]').tooltip("destroy");
        } else {
            $("#sidebar-logo").text("BSL");
            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
        }
    };

    let hideAllContent = () => {
        $(".option1_content").hide();
        $(".option2_content").hide();
        $(".option3_content").hide();
        $(".option4_content").hide();
        $(".option5_content").hide();
        $(".option6_content").hide();
        $(".option7_content").hide();
        $(".option8_content").hide();
        $(".option9_content").hide();
        $(".option10_content").hide();
        $(".option11_content").hide();
        $(".option12_content").hide();
        $(".option13_content").hide();
        $(".option14_content").hide();
        $(".option15_content").hide();
    };

    let showContent = (optionClass) => {
        hideAllContent();
        $(optionClass).show();
    };

    return {
        init: () => {
            $(".js-hamburger").on("click", sidebarChangeWidth);

            $(".js-menu li").on("click", e => {
                e.stopPropagation();
                menuChangeActive(e.currentTarget);
            });

            $(".js-menu .c-menu__submenu li").on("click", e => {
                e.stopPropagation();
                submenuChangeActive(e.currentTarget);
            });

            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);

            $(".divOption1").on("click", () => showContent(".option1_content"));
            $(".divOption2").on("click", () => showContent(".option2_content"));
            $(".divOption3").on("click", () => showContent(".option3_content"));
            $(".divOption4").on("click", () => showContent(".option4_content"));
            $(".divOption5").on("click", () => showContent(".option5_content"));
            $(".divOption6").on("click", () => showContent(".option6_content"));
            $(".divOption7").on("click", () => showContent(".option7_content"));
            $(".divOption8").on("click", () => showContent(".option8_content"));
            $(".divOption9").on("click", () => showContent(".option9_content"));
            $(".divOption10").on("click", () => showContent(".option10_content"));
            $(".divOption11").on("click", () => showContent(".option11_content"));
            $(".divOption12").on("click", () => showContent(".option12_content"));
            $(".divOption13").on("click", () => showContent(".option13_content"));
            $(".divOption14").on("click", () => showContent(".option14_content"));
            $(".divOption15").on("click", () => showContent(".option15_content"));

            // Event handlers for theme selector
            $(".basket").click(function(){
                $("#themeSelector").fadeIn(200);
            });
            
            $("#cancelTheme").click(function(){
                $("#themeSelector").fadeOut(200);
            });
            
            var change_theme = 1; // Default theme
    
            function updateTheme() {
                var selectedTheme = $("input[name='theme']:checked").val();
                switch (selectedTheme) {
                    case "theme1":
                        change_theme = 1;
                        break;
                    case "theme2":
                        change_theme = 2;
                        break;
                    case "theme3":
                        change_theme = 3;
                        break;
                    case "theme4":
                        change_theme = 4;
                        break;
                    case "theme5":
                        change_theme = 5;
                        break;
                        case "theme6":
                            change_theme = 6;
                            break;
                        case "theme7":
                            change_theme = 7;
                            break;
                        case "theme8":
                            change_theme = 8;
                            break;
                        case "theme9":
                            change_theme = 9;
                            break;
                        case "theme10":
                            change_theme = 10;
                            break;
                }
            }
            
            $("#applyTheme").click(function(){
                updateTheme();
                $.ajax({
                    type: "POST",
                    url: "./save_theme.php",
                    data: { theme: change_theme },
                    success: function(response) {
                        console.log("Theme saved successfully: " + response);
                    },
                    error: function() {
                        console.error("Error saving theme");
                    }
                });
                $("#themeSelector").fadeOut(200);
            });
        }
    };
})();

$(document).ready(() => {
    Dashboard.init();
});


