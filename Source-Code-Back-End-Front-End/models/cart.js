module.exports                      = function Cart(oldCart) {
  this.items                        = oldCart.items || {};
  this.totalQuntity                 = oldCart.totalQuntity || 0;
  this.totalPrice                   = oldCart.totalPrice || 0;

  /*
    this funtion do add new item into cart.
  * */
  this. add = (item, id) => {
      //
      var storedItem = this.items[id];
      // check product already existing. if not create new one
      if(!storedItem){
          storedItem = this.items[id] = {item: item, qty: 0, price: 0};
      }
      storedItem.qty++;
      storedItem.price = storedItem.item.price * storedItem.qty;
      this.totalQuntity++;
      this.totalPrice += storedItem.item.price;
  };

 // this is a function which remove item from cart
  this.removiItem = function(id)  {
      this.items[id].qty--;
      this.items[id].price -= this.items[id].item.price;
      this.totalQuntity--;
      this.totalPrice -= this.items[id].item.price;

      if(this.items[id].qty <= 0){
          delete this.items[id];
      }
  };

  this.generateArray = () => {
      var arr = [];
      for(var id in this.items){
          arr.push(this.items[id]);
      }
      return arr;
  };

};