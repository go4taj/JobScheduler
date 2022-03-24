/* eslint-disable strict */
/* eslint-disable no-undef */
$(document).ready(function() {
  $('#example').DataTable({
    'scrollY': '400px',
    'scrollCollapse': true,
    'paging': false,
  });
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}
