var jpdbBaseURL     = "http://api.login2explore.com:5577";
var jpdbIML         = "/api/iml";
var jpdbIRL         = "/api/irl";
var shipmentDBName  = "DELIVERY-DB";
var shipmentRelName = "SHIPMENT-TABLE";
var connToken       = "90935201|-31949241946131683|90958787";

function getShipmentNoAsJsonObj() {
    var shipNo = $('#shipmentNo').val().trim();
    return JSON.stringify({ "Shipment-No": shipNo });
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('shipment_recno', lvData.rec_no);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#description' ).val(record["Description"]            || "");
    $('#source'      ).val(record["Source"]                 || "");
    $('#destination' ).val(record["Destination"]            || "");
    $('#shippingDate').val(record["Shipping-Date"]          || "");
    $('#deliveryDate').val(record["Expected-Delivery-Date"] || "");
}

function resetForm() {
    $('#shipmentNo').val('').prop('disabled', false);
    $('#description').val('').prop('disabled', true);
    $('#source').val('').prop('disabled', true);
    $('#destination').val('').prop('disabled', true);
    $('#shippingDate').val('').prop('disabled', true);
    $('#deliveryDate').val('').prop('disabled', true);

    $('#save').prop('disabled', true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', false); 

    $('#shipmentNo').focus();
}

function validateData() {
    var shipNo   = $('#shipmentNo'  ).val().trim();
    var desc     = $('#description' ).val().trim();
    var src      = $('#source'      ).val().trim();
    var dest     = $('#destination' ).val().trim();
    var shipDate = $('#shippingDate').val().trim();
    var delDate  = $('#deliveryDate').val().trim();

    if (!shipNo)   { alert("Shipment No. is required");           $('#shipmentNo'  ).focus(); return ""; }
    if (!desc)     { alert("Description is required");            $('#description' ).focus(); return ""; }
    if (!src)      { alert("Source is required");                 $('#source'      ).focus(); return ""; }
    if (!dest)     { alert("Destination is required");            $('#destination' ).focus(); return ""; }
    if (!shipDate) { alert("Shipping Date is required");          $('#shippingDate').focus(); return ""; }
    if (!delDate)  { alert("Expected Delivery Date is required"); $('#deliveryDate').focus(); return ""; }

    if (new Date(delDate) < new Date(shipDate)) {
        alert("Expected Delivery Date cannot be before Shipping Date");
        $('#deliveryDate').focus();
        return "";
    }

    return JSON.stringify({
        "Shipment-No"            : shipNo,
        "Description"            : desc,
        "Source"                 : src,
        "Destination"            : dest,
        "Shipping-Date"          : shipDate,
        "Expected-Delivery-Date" : delDate
    });
}

function getShipment() {
    var shipNo = $('#shipmentNo').val().trim();
    if (shipNo === "") return;

    var getRequest = createGET_BY_KEYRequest(
        connToken, shipmentDBName, shipmentRelName, getShipmentNoAsJsonObj()
    );

    jQuery.ajaxSetup({ async: false });
   
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL); 
    jQuery.ajaxSetup({ async: true });

    
    var responseData = resJsonObj.JsonObj ? resJsonObj.JsonObj : resJsonObj;

    if (responseData.status === 400) {
       
        $('#description').prop('disabled', false);
        $('#source').prop('disabled', false);
        $('#destination').prop('disabled', false);
        $('#shippingDate').prop('disabled', false);
        $('#deliveryDate').prop('disabled', false);

        $('#save').prop('disabled', false);
        $('#change').prop('disabled', true);
        $('#reset').prop('disabled', false);

        $('#description').focus();

    } else if (responseData.status === 200) {
        $('#shipmentNo').prop('disabled', true);

        $('#description').prop('disabled', false);
        $('#source').prop('disabled', false);
        $('#destination').prop('disabled', false);
        $('#shippingDate').prop('disabled', false);
        $('#deliveryDate').prop('disabled', false);

        fillData(responseData);

        $('#save').prop('disabled', true);
        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);

        $('#description').focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;

    var putRequest = createPUTRequest(connToken, jsonStrObj, shipmentDBName, shipmentRelName);

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    var responseData = resJsonObj.JsonObj ? resJsonObj.JsonObj : resJsonObj;

    if (responseData.status === 200) {
        alert("Shipment saved successfully!");
    } else {
        alert("Error saving record: " + responseData.message);
    }

    resetForm();
}

function changeData() {
    $('#change').prop('disabled', true);

    var jsonChg = validateData();
    if (jsonChg === "") {
        $('#change').prop('disabled', false);
        return;
    }

    var recNo = localStorage.getItem('shipment_recno');
  
    var updateRequest = createUPDATERecordRequest(
        connToken, jsonChg, shipmentDBName, shipmentRelName, recNo
    );

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    var responseData = resJsonObj.JsonObj ? resJsonObj.JsonObj : resJsonObj;

    if (responseData.status === 200) {
        alert("Shipment updated successfully!");
    } else {
        alert("Error updating record: " + responseData.message);
        $('#change').prop('disabled', false);
        return;
    }

    resetForm();
}

$(document).ready(function () {
    resetForm();
});