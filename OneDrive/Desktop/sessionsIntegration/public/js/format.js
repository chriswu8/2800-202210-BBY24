/**
   * Performs the phone number format. 
   * I found this code on stackoverflow.com.
   *
   * @author contribute@stackoverflow.com 
   * @see https://stackoverflow.com/questions/9973955/formatting-the-phone-number
   */
$("input[name='number']").keyup(function () {
    $(this).val($(this).val().replace(/^(\d{3})(\d{3})(\d+)$/, "($1)$2-$3"));
});

$("td[name='number']").keyup(function () {
    $(this).val($(this).val().replace(/^(\d{3})(\d{3})(\d+)$/, "($1)$2-$3"));
});