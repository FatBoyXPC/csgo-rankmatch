$(function() {
  $('.input-group-addon').click(function(e) {
    var $input = $(this).siblings('input');
    var qty = $input.val();

    qty = parseInt(qty) || 0;

    // qty < 9 because we obviously don't need to calculate 10 of the same rank
    if ($(this).hasClass('has-success') && qty < 9) {
      qty++;
    }

    // qty > 0 because we don't want negative numbers, but want to allow 0
    if ($(this).hasClass('has-error') && qty > 0) {
      qty--;
    }

    $input.val(qty);
  });

  $('form').submit(function(e) {
    e.preventDefault();
    $('.results').html('');

    var csgoRankMatch = $(this).csgoRankMatch();
    var $errorDiv = $('.alert-danger');

    $errorDiv.addClass('sr-only');

    if (csgoRankMatch.error) {
      $errorDiv.removeClass('sr-only').text(csgoRankMatch.error);
      return;
    }

    var teams = csgoRankMatch.finishedSet;
    var resultsTemplate = $('.result-template');
    var rows;

    if (teams.length >= 5) {
      rows = 5;
    } else {
      rows = teams.length;
    }

    var row;
    var template;
    
    for (var i = 0; i < rows; i++) {
      row = teams[i];
      template = resultsTemplate.clone();

      $('.delta', template).text(row.delta);

      $.each(row.setA, function(key, value) {
        $('.team-a .images', template).append('<img src="images/' + value + '.png">');
      });

      $.each(row.setB, function(key, value) {
        $('.team-b .images', template).append('<img src="images/' + value + '.png">');
      });

      $('.results').append(template);
    }
  });
});