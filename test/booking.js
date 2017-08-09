var Booking = artifacts.require("./booking.sol");

/* Contract只會被部署一次！！！ */
contract('Booking', function(accounts) {
  it("should create two types of room", async function() {
    let booking = await Booking.deployed();
    let room_1 = await booking.rooms(1);
    let room_2 = await booking.rooms(2);
    /* check id */
    assert.equal(
      room_1[0].c[0], // id is in the position 0 
      1,
      "room_id 1 is not in the contract!"
    );
    assert.equal(
      room_2[0].c[0], 
      2,
      "room_id 2 is not in the contract!"
    );
    /* check total_room */
    assert.equal(
      room_1[1].c[0], 
      1,
      "room_id 1's total_room is wrong!"
    );
    assert.equal(
      room_2[1].c[0], 
      3,
      "room_id 2's total_room is wrong!"
    );
  });

  it("should add a new_order", async function() {
    let booking = await Booking.deployed();

    let key = '2017-08-01_18:30:25_tony_2017-08-15';
    let order_id = '2017-08-01_18:30:25_tony';
    let user_id = 'tony';
    let room_type = 1;
    let checkin_date = '2017-08-15';

    let new_order_event = booking.new_order_event();
    let result = await booking.new_order(key,order_id,user_id,room_type,checkin_date);
    /* 監看event是否有成功 */
    assert.equal(
      result.logs[0].args.check,
      true,
      'new_order is unavalible!'  
    );
  });

  it("should not be able to add a new_order", async function() {
    let booking = await Booking.deployed();

    let key = '2017-08-01_18:30:25_tony_2017-08-16';
    let order_id = '2017-08-01_18:30:25_tony';
    let user_id = 'tony';
    let room_type = 1;
    let checkin_date = '2017-08-16';

    let result_1 = await booking.new_order(key,order_id,user_id,room_type,checkin_date);
    let result_2 = await booking.new_order(key,order_id,user_id,room_type,checkin_date);
    /* 監看event是否有成功 */
    assert.equal(
      result_1.logs[0].args.check,
      true,
      'new_order is unavalible when it should be!'  
    );
    assert.equal(
      result_2.logs[0].args.check,
      false,
      'new_order is avalible when is should not!'  
    );
  });

  it("should update an order", async function() {
    let booking = await Booking.deployed();

    let old_key = '2017-08-01_18:30:25_tony_2017-08-16';
    let new_key = '2017-08-01_18:30:25_tony_2017-08-17';
    let order_id = '2017-08-01_18:30:25_tony';
    let user_id = 'tony';
    let room_type = 1;
    let checkin_date = '2017-08-17';

    let result = await booking.update_order(old_key,new_key,order_id,user_id,room_type,checkin_date);
    /* 監看event是否有成功 */
    assert.equal(
      result.logs[0].args.check,
      true,
      'update_order is unavalible when is should be!'  
    );
  });

  it("should not be able to update an order", async function() {
    let booking = await Booking.deployed();

    let old_key = '2017-08-01_18:30:25_tony_2017-08-15';
    let new_key = '2017-08-01_18:30:25_tony_2017-08-17';
    let order_id = '2017-08-01_18:30:25_tony';
    let user_id = 'tony';
    let room_type = 1;
    let checkin_date = '2017-08-17';

    let result = await booking.update_order(old_key,new_key,order_id,user_id,room_type,checkin_date);
    /* 監看event是否有成功 */
    assert.equal(
      result.logs[0].args.check,
      false,
      'update_order is unavalible when is should be!'  
    );
  });

});


