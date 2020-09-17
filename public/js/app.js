window.App = new function () {
    let XMLHttpResource;
    let sendingNow = false;
    let requestCallback;
    let appElement;
    let resultElement;
    let formElement;
    let init = function () {
        appElement = document.querySelector('.application');
        if (appElement) {
            resultElement = appElement.querySelector('.result');
            formElement = appElement.querySelector('.form');
            let button = appElement.querySelector('.button');
            button.addEventListener('click', clickHandler);
        }
    };

    let clickHandler = function () {
        getRequest("POST", '/calculate&timezone_offset=' + new Date().getTimezoneOffset(), new FormData(formElement), updateResults);
    };

    let getRequest = function (method, url, data, callback) {
        if (sendingNow) {
            return;
        }
        sendingNow = true;
        requestCallback = callback;
        XMLHttpResource = new XMLHttpRequest();
        XMLHttpResource.open(method, url, true);
        XMLHttpResource.onreadystatechange = catchRequestAnswer;
        XMLHttpResource.send(data);
    };

    let catchRequestAnswer = function () {
        if (XMLHttpResource.readyState === XMLHttpRequest.DONE) {
            sendingNow = false;
            if (XMLHttpResource.status === 0 || (200 >= XMLHttpResource.status && XMLHttpResource.status < 400)) {
                requestCallback(XMLHttpResource.responseText);
            }
        }
    };

    let updateResults = function (json) {
        while (resultElement.firstChild) {
            resultElement.removeChild(resultElement.firstChild);
        }
        let data = JSON.parse(json);
        if (data) {
            let headerRow = elementCreate('tr', resultElement);
            elementCreate('th', headerRow, '', '');
            let header = elementCreate('th', headerRow, '', 'Policy');
            let valueRow = elementCreate('tr', resultElement);
            elementCreate('td', valueRow, '', 'Value');
            elementCreate('td', valueRow, '', data['car'].toFixed(2), {align: 'right'});
            let baseRow = elementCreate('tr', resultElement);
            elementCreate('td', baseRow, '', 'Base premium (' + data['percent'] + '%)');
            elementCreate('td', baseRow, '', data['basePremium'].toFixed(2), {align: 'right'});
            let commissionRow = elementCreate('tr', resultElement);
            elementCreate('td', commissionRow, '', 'Commission (17%)');
            elementCreate('td', commissionRow, '', data['commission'].toFixed(2), {align: 'right'});
            let taxRow = elementCreate('tr', resultElement);
            elementCreate('td', taxRow, '', 'Tax (' + data['userTax'] + '%)');
            elementCreate('td', taxRow, '', data['tax'].toFixed(2), {align: 'right'});
            let totalRow = elementCreate('tr', resultElement);
            elementCreate('td', totalRow, '', 'Total cost');
            elementCreate('td', totalRow, '', data['total'].toFixed(2), {align: 'right'});

            if (data['parts'].length) {
                for (let i = 1; i <= data['parts'].length; i++) {
                    let currentPart = data['parts'][i - 1];
                    elementCreate('th', headerRow, '', i + ' ins.');
                    elementCreate('td', valueRow);
                    elementCreate('td', baseRow, '', currentPart['basePremium'].toFixed(2));
                    elementCreate('td', commissionRow, '', currentPart['commission'].toFixed(2));
                    elementCreate('td', taxRow, '', currentPart['tax'].toFixed(2));
                    elementCreate('td', totalRow, '', currentPart['total'].toFixed(2));
                }
            }


        }
    };

    let elementCreate = function (tag, parentElement, className, innerHtml, otherParameters) {
        let newElement = document.createElement(tag);
        if (parentElement) {
            parentElement.appendChild(newElement);
        }
        if (className) {
            newElement.className = className;
        }
        if (innerHtml && innerHtml !== '0') {
            newElement.innerHTML = innerHtml;
        }
        if (otherParameters) {
            for (let i in otherParameters) {
                newElement.setAttribute(i, otherParameters[i]);
            }
        }

        return newElement;
    };

    window.addEventListener('DOMContentLoaded', init);
};
