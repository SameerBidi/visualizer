function doAjaxPost(to, data, successCallback, errorCallback) {
    return $.ajax({
        type: "POST",
        contentType: "application/json",
        url: to,
        data: data,
        dataType: "json",
        cache: false,
        timeout: 60000,
        success: successCallback,
        error: errorCallback
    });
}

function doAjaxPostWithFileUpload(to, data, successCallback, errorCallback) {
    return $.ajax({
        type: "POST",
        url: to,
        data: data,
        dataType: "json",
        processData: false,
        contentType: false,
        cache: false,
        timeout: 60000,
        success: successCallback,
        error: errorCallback
    });
}

function doAjaxGet(to, data, successCallback, errorCallback) {
    return $.ajax({
        type: "GET",
        url: to,
        data: data,
        dataType: "json",
        cache: false,
        timeout: 60000,
        success: successCallback,
        error: errorCallback
    });
}

function getPartialViewAjax(to, data, successCallback, errorCallback) {
    return $.ajax({
        type: "GET",
        url: to,
        data: data,
        dataType: "html",
        cache: false,
        timeout: 60000,
        success: successCallback,
        error: errorCallback
    });
}