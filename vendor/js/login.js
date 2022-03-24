/* eslint-disable strict */
/* eslint-disable no-undef */

$('#login').submit(e=>{
  e.preventDefault();
  var user = {
    email: window.document.login.email.value,
    password: window.document.login.password.value,
  };

  $.post('/api/login', user, function(result) {
    if (result.token) {
      localStorage.setItem('token', result.token);
      window.location.href = '/dashboard?token=' + result.token;
    }
  }).fail(function(result) {
    $('#error').html(result.responseJSON.message);
    setTimeout(()=>{
      $('#error').html('');
    }, 2000);
  });
});
