function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Mobile Google Form');
}

function getFormDefinition(formUrl) {
  if (!formUrl) {
    throw new Error('Form URL is required.');
  }
  var form = FormApp.openByUrl(formUrl);
  var items = form.getItems();
  var resultItems = items.map(function (item) {
    var base = {
      id: item.getId(),
      title: item.getTitle(),
      helpText: item.getHelpText(),
      required: item.isRequired(),
      type: item.getType().toString()
    };

    if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
      var mc = item.asMultipleChoiceItem();
      base.options = mc.getChoices().map(function (choice) {
        return {
          value: choice.getValue()
        };
      });
    }

    if (item.getType() === FormApp.ItemType.CHECKBOX) {
      var cb = item.asCheckboxItem();
      base.options = cb.getChoices().map(function (choice) {
        return {
          value: choice.getValue()
        };
      });
    }

    if (item.getType() === FormApp.ItemType.SCALE) {
      var scale = item.asScaleItem();
      base.scale = {
        lower: scale.getLowerBound(),
        upper: scale.getUpperBound(),
        leftLabel: scale.getLeftLabel(),
        rightLabel: scale.getRightLabel()
      };
    }

    if (item.getType() === FormApp.ItemType.TEXT || item.getType() === FormApp.ItemType.PARAGRAPH_TEXT) {
      base.options = [];
    }

    return base;
  });

  var publishedUrl = form.getPublishedUrl();
  var actionUrl = publishedUrl.replace(/viewform(\?.*)?$/, 'formResponse');

  return {
    title: form.getTitle(),
    description: form.getDescription(),
    actionUrl: actionUrl,
    items: resultItems
  };
}

function submitResponse(formUrl, responses) {
  if (!formUrl) {
    throw new Error('Form URL is required.');
  }
  var form = FormApp.openByUrl(formUrl);
  var publishedUrl = form.getPublishedUrl();
  var actionUrl = publishedUrl.replace(/viewform(\?.*)?$/, 'formResponse');

  var payload = buildQuery(responses || {});
  var response = UrlFetchApp.fetch(actionUrl, {
    method: 'post',
    payload: payload,
    contentType: 'application/x-www-form-urlencoded',
    followRedirects: true,
    muteHttpExceptions: true
  });

  return {
    status: response.getResponseCode(),
    body: response.getContentText().slice(0, 200)
  };
}

function buildQuery(params) {
  var parts = [];
  Object.keys(params).forEach(function (key) {
    var value = params[key];
    if (Array.isArray(value)) {
      value.forEach(function (item) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(item));
      });
      return;
    }
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });
  return parts.join('&');
}
