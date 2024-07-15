document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('emailForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var formData = new FormData(form);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'send_email.php', true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            } else {
                alert('Email sending failed.');
            }
        };
        xhr.onerror = function () {
            alert('Email sending failed.');
        };
        xhr.send(formData);
    });
});
