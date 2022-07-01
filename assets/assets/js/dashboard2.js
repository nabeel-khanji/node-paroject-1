/* global Chart:false */

$(function () {
  'use strict'

  // This will get the first returned node in the jQuery collection.
  // eslint-disable-next-line no-unused-vars
  // var salesChart = new Chart(salesChartCanvas, {
  //   type: 'line',
  //   data: salesChartData,
  //   options: salesChartOptions
  // }
  // )

  //---------------------------
  // - END MONTHLY SALES CHART -
  //---------------------------

  //-------------
  // - PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
  var pieData = {
    labels: [
      'Guest',
      'Verified',
    ],
    datasets: [
      {
        data: [700, 500],
        backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de']
      }
    ]
  }
  // var pieOptions = {
  //   legend: {
  //     display: false
  //   }
  // }
  var pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
  }
  // Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  // eslint-disable-next-line no-unused-vars
  var pieChart = new Chart(pieChartCanvas, {
    type: 'pie',
    data: pieData,
    options: pieOptions
  })

  //-----------------
  // - END PIE CHART -
  //-----------------

  /* jVector Maps
   * ------------
   * Create a world map with markers
   */
  $('#world-map-markers').mapael({
    map: {
      name: 'usa_states',
      zoom: {
        enabled: true,
        maxLevel: 10
      }
    }
  })

})

// lgtm [js/unused-local-variable]
