<?php
ini_set('display_errors', 'On');
error_reporting('E_ALL');
//Если поле скрытое поле "name" заполнено - то это СПАМ
if (isset($_REQUEST['name']) && strlen($_REQUEST['name']) > 0) {
    print "!S P A M!";
} else {

    /* Здесь проверяется существование переменных */
    if (isset($_POST['phone'])) {
        $phone = $_POST['phone'];
    }

    if ($phone > 0) {

        /* Сюда впишите свою эл. почту */
        $address = "nebykoff@gmail.com";

        /* А здесь прописывается текст сообщения, \n - перенос строки */
        $mes = "Тема письма: Ответ на квиз \nТелефон: $phone\n";

        if (strlen($address) > 0)
            $mes .= "Адрес: $address\n";

        $mes .= "\nОтветы на вопросы:\n\n" . getAnsvers($_REQUEST, "step");
        /* А эта функция как раз занимается отправкой письма на указанный вами email */
        $sub = 'Заказ c сайта'; //сабж
        $email = 'Заказ <landing>'; // от кого

        // print $mes;

        $send = mail($address, $sub, $mes, "Content-type:text/plain; charset = utf-8\r\nFrom:$email");
        print $send;
    }
}

/**
 * Ищет в массиве вопросы и ответы по имени
 */
function getAnsvers($request, $keysName)
{
    $result = '';
    foreach ($request as $key => $value) {
        if (strpos($key, $keysName) === 0) {
            $result .= $value . "\n\n";
        }
    }
    return $result;
}
