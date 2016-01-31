'use strict';

var xhr = require('client/xhr');
var notification = require('client/notification');

function init() {

  initShouldNotifyMaterials();

  initTeacherForm();
}


function initTeacherForm() {
  var form = document.querySelector('[data-teacher-form]');
  if (!form) return;

  form.addEventListener('change', function() {
    let materialFields = form.querySelectorAll('[name="materials"]');

    // shows "delete" button on non-empty fields
    for (var i = 0; i < materialFields.length; i++) {
      var field = materialFields[i];
      if (field.value) {
        field.parentElement.classList.remove('courses-materials-add__line_empty');
      }
    }

    // adds an one more empty field if all full
    if (form.querySelector('.courses-materials-add__line_empty') == null) {
      form.querySelector('[data-materials-fields]').insertAdjacentHTML('beforeEnd',
        `<div class="courses-materials-add__line courses-materials-add__line_empty">
          <input type="button" value="x" data-materials-remove class="courses-materials-add__remove"><input name="materials" type="file" multiple>
        </div>`
      );
    }

  });

  form.addEventListener('click', function(event) {
    if (event.target.hasAttribute('data-materials-remove')) {
      event.target.parentElement.remove();
    }
  });
}


function initShouldNotifyMaterials() {

  var checkbox = document.querySelector('[data-should-notify-materials]');
  if (!checkbox) return; // teacher
  var form = checkbox.closest('form');

  checkbox.onchange = function() {

    var request = xhr({
      method: 'PATCH',
      url:    form.action,
      body:   {
        id: form.elements.id.value,
        shouldNotifyMaterials: form.elements.shouldNotifyMaterials.checked
      }
    });

    request.addEventListener('success', function(event) {
      new notification.Success("Настройка сохранена.");
    });
  };

}

init();
