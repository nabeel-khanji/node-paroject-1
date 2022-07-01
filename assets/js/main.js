$(document).ready(function () {
  $("#datatable").DataTable(
    {  ajax: {
  url: 'http://localhost:7007/users',
  dataSrc: ''
},
    
      columns: [
  { data: 'id' ,title : "User ID"},
  { data: 'name', title :"Name" },
  { data: 'emailAddress',title :"Email Address" },
  { action: 'actions' }
]
    }
  );


  
});