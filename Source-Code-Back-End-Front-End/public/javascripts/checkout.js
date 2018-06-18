// create connection with stripe API
Stripe.setPublishableKey('pk_test_RjkiKbzUSjOKAhsx3usPrCHL');

var $form = $('#checkout');

// get form value using jquery form submit
$form.submit(function (event) {

    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#cardnumber').val(),
        cvc: $('#cvc').val(),
        exp_month: $('#month').val(),
        exp_year: $('#year').val(),
        name: $('#name').val()
    } , stripeResponseHandler);
    return false;
});

// call stipe API
function stripeResponseHandler(status, response) {
    // check if error can occur
    if(response.error){

        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false);
    }
    else{
        // get token for our response
        var token = response.id;


        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));

        $form.get(0).submit();
    }
}