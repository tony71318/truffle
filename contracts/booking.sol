pragma solidity ^0.4.11;

contract owned {
    address public owner;
    address public owner_2;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner && msg.sender != owner_2)
            throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
    
    function addOwnership(address newOwner) onlyOwner {
        owner_2 = newOwner;
    }
}

contract booking is owned{
    
    function booking(){ //創始contract時執行
        rooms[1].id = 1;
        rooms[1].total_room = 1;
        
        rooms[2].id = 2;
        rooms[2].total_room = 3;    
    }
    
    bytes[] key_table;
    
    struct Room{
        uint id;    //房型代號
        uint total_room;    //房間數
    }
    
    struct Order{
        bytes key;   //order_id + '_' + date (當作 mapping 的 key
        bytes order_id; //訂單編號 ((同一個訂單編號，住一天以上，拆成一天一個訂單記錄
        bytes user_id;  //使用者ＩＤ
        uint room_type; //房型
        bytes date; //入住日期  EX.5/2~5/4，兩晚分成5/2、5/3，兩個訂單記錄
    }
    
    mapping (bytes => Order) orders;    //bytes為key 對應到相對的 Struct Order
    mapping (uint => Room) public rooms;   
    
    event new_order_event ( //紀錄new_order是否成功
        bytes key,
        bytes order_id,
        bool check
    );
    
    function edit_room( //新增、編輯房型
        uint room_type,
        uint total_room
        ) onlyOwner {
        rooms[room_type].id = room_type;
        rooms[room_type].total_room = total_room;
    }
    
    function delete_room( //刪除房型
        uint room_type
        ) onlyOwner {
        delete rooms[room_type];
    }
    
    function new_order( //新增訂單
        bytes key,
        bytes order_id,
        bytes user_id,
        uint room_type,
        bytes date
        ) onlyOwner{
            
        if(!check(room_type,date)){
            new_order_event(key,order_id,false);
            return;
        }
            
        
        key_table.push(key);
        
        orders[key].key = key;
        orders[key].order_id = order_id;
        orders[key].user_id = user_id;
        orders[key].room_type = room_type;
        orders[key].date = date;
        
        new_order_event(key,order_id,true);
    }
        
    function update_order(  //更新訂單
        bytes old_key,
        bytes new_key,
        bytes order_id,
        bytes user_id,
        uint room_type,
        bytes date
        ) onlyOwner returns(bool){
                
        // must ensure delete_order after new_order        
        new_order(new_key,order_id,user_id,room_type,date);
        delete_order(old_key);
    }
    
    function delete_order( //刪除訂單
        bytes key
        ) onlyOwner {
            
        for(uint i = 0; i<key_table.length;i++){
            if(sha3(key_table[i]) == sha3(key))
                delete key_table[i];
        }    
            
        delete orders[key];
    }
    
    function check( //檢查能不能預定
        uint room_type,
        bytes date
        ) constant onlyOwner returns(bool) {
            
        uint size = key_table.length;
        
        uint ordered_rooms = 0;
        for(uint i=0;i<size;i++){
            if(orders[key_table[i]].room_type == room_type)
                if(sha3(orders[key_table[i]].date) == sha3(date))   //bytes轉為sha3才能比較
                    ordered_rooms++;
        }
        
        if(ordered_rooms >= rooms[room_type].total_room)
            return false;
        else
            return true;
    }
    
    function order_detail( //回傳訂單資訊
        bytes key
        ) onlyOwner returns(bytes,bytes,uint,bytes){
            return(
                orders[key].order_id,
                orders[key].user_id,
                orders[key].room_type,
                orders[key].date
            );
        }
}