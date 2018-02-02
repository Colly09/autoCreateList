<?php

if($_GET['act'] == 'ajax'){
    $action = $_POST['act'];
    $data = json_decode($_POST['data'], ture);

    echo json_encode([
        'code'=>1000,
        'msg'=>'操作成功',
        'data' => $data
    ]);
}else if($_GET['act'] == 'list'){
    $data = json_decode($_POST['data'], ture);
    //print_r($data['order']);
    
    $num = 201;
    $allData = [];
    for($i = 1; $i< $num; $i++){
        $info = [
            'id' => $i,
            'rsId' => $i.$i,
            'name' => 'test'.$i,
            'type' => "测试".$i,
            'link' => 'http://demo.com'.$i,
            'time' => date('Y-m-d H:i:s'),
            'status' => ($i%2 == 0) ? '显示': '隐藏' ,
            'admin' => 'admin'.$i
        ];
        array_push($allData, $info);
    }
    echo json_encode([
        'code'=>1000,
        'msg'=>'操作成功',
        'data' => [
            'list' => array_slice($allData, $data['nowPage'] * $data['pageSize'], $data['pageSize']),
            'page' => [
                'total' => count($allData),
                'pageSize' => $data['pageSize'],
                'nowPage' => $data['nowPage'],
            ]
        ]
    ]);
}else if($_GET['act'] == 'getNameList'){
    $num = 10;
    $allData = [];
    for($i = 1; $i< $num; $i++){
        $info = [
            'value'=> $i,
            'label'=> '名称'.$i,
        ];
        array_push($allData, $info);
    }
    echo json_encode([
        'code'=>1000,
        'msg'=>'操作成功',
        'data' => $allData,
    ]);
}else if($_GET['act'] == 'relation' || $_GET['act'] == 'relation2' ){
    $pid = $_GET['pid'];

    $num = 10;
    $allData = [];
    for($i = 1; $i< $num; $i++){
        $info = [
            'value'=> $i,
            'label'=> '父级'.$pid.'名称'.$i,
        ];
        array_push($allData, $info);
    }
    echo json_encode([
        'code'=>1000,
        'msg'=>'操作成功',
        'data' => $allData,
    ]);

}else{
    print_r($_GET);
}
