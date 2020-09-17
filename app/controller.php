<?php

namespace App;

class Controller
{
    public function dispatch()
    {
        $action = 'index';
        if (isset($_GET['action'])) {
            if (method_exists($this, $_GET['action'])) {
                $action = $_GET['action'];
            }
        }

        $this->$action();
    }

    protected function index()
    {
        include_once('view.html');
    }

    protected function calculate()
    {
        $car = !empty($_POST['car']) ? (float)$_POST['car'] : 0;
        $userTax = !empty($_POST['tax']) ? (float)$_POST['tax'] : 0;
        $instalments = !empty($_POST['instalments']) ? (int)$_POST['instalments'] : 1;

        $userTimeZone = timezone_name_from_abbr("", $_GET['timezone_offset'] * -60, false);
        date_default_timezone_set($userTimeZone);

        $percent = (date('N') == 5 && date('G') < 20 && date('G') >= 15) ? 13 : 11;
        $basePremium = $car * $percent / 100;
        $commission = round($basePremium * 0.17, 2);
        $tax = round($basePremium * $userTax / 100, 2);
        $basePremium = round($basePremium, 2);
        $total = $basePremium + $commission + $tax;

        $parts = [];
        if ($instalments > 1) {
            $partBase = round($basePremium / $instalments, 2);
            $partComission = round($commission / $instalments, 2);
            $partTax = round($tax / $instalments, 2);

            $balanceBase = $basePremium - ($partBase * $instalments);
            $balanceComission = $commission - ($partComission * $instalments);
            $balanceTax = $tax - ($partTax * $instalments);

            for ($i = 1; $i <= $instalments; $i++) {
                $part = [
                    'basePremium' => $partBase,
                    'commission' => $partComission,
                    'tax' => $partTax,
                ];

                //for last part added possible errors after rounding
                if ($i == $instalments) {
                    $part['basePremium'] += $balanceBase;
                    $part['commission'] += $balanceComission;
                    $part['tax'] += $balanceTax;
                }

                $part['total'] = $part['basePremium'] + $part['commission'] + $part['tax'];

                $parts[] = $part;
            }
        }


        $result = [
            'car' => $car,
            'total' => $total,
            'percent' => $percent,
            'basePremium' => $basePremium,
            'commission' => $commission,
            'userTax' => $userTax,
            'tax' => $tax,
            'parts' => $parts,
        ];

        echo json_encode($result);
        exit;
    }
}
